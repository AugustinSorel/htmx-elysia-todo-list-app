import Elysia, { t } from "elysia";
import { ctx } from "../context/context";
import { Layout } from "../components/layout";
import {
  NewTodoForm,
  TodoItem,
  TodoList,
  TodoListEmptyMsg,
  TodoListRows,
  TodoSkeleton,
} from "../components/todo";
import { todoTable } from "../db/schema";
import { desc, eq, not } from "drizzle-orm";
import { TodoSchema, todoSchema } from "../schemas/todo.schemas";
import { ZodError } from "zod";
import { createHtmxToast } from "../components/ui/toast";

export const todosRouter = new Elysia({ prefix: "/todos" })
  .use(ctx)
  .onError(({ set, error }) => {
    set.headers["HX-Trigger"] = createHtmxToast({
      title: "something went wrong",
      description: error.message,
      type: "error",
    });

    return console.log("onError");
  })
  .get(
    "/",
    async ({ user, redirect, db, query }) => {
      if (!user) {
        return redirect("/sign-up", 302);
      }

      const todosPerPage = 50;

      const todos = await db
        .select()
        .from(todoTable)
        .where(eq(todoTable.userId, user.id))
        .orderBy(desc(todoTable.createdAt))
        //TODO: peek + 1 item to save up 1 api call
        .limit(todosPerPage)
        .offset((query.page - 1) * todosPerPage);

      if (query.page > 1) {
        return (
          <TodoListRows
            todos={todos}
            page={query.page}
            todosPerPage={todosPerPage}
          />
        );
      }

      return (
        <Layout title="HTMX🤝Elysia" user={user}>
          <main
            class="mt-10 flex flex-col space-y-10 px-max-width"
            hx-ext="response-targets"
          >
            <NewTodoForm />

            <TodoList>
              {!todos.length && <TodoListEmptyMsg />}

              <TodoListRows
                todos={todos}
                page={query.page}
                todosPerPage={todosPerPage}
              />

              {[...Array(10)].map(() => (
                <TodoSkeleton />
              ))}
            </TodoList>
          </main>
        </Layout>
      );
    },
    {
      query: t.Object({
        page: t.Numeric({ default: 1 }),
      }),
    },
  )
  .post(
    "/",
    async ({ body, set, db, user }) => {
      if (!user) {
        set.status = "Unauthorized";
        set.headers["HX-Redirect"] = "/sign-up";
        throw new Error("Unauthorized");
      }

      const todos = await db
        .select()
        .from(todoTable)
        .where(eq(todoTable.userId, user.id));

      if (!todos.length) {
        set.headers["HX-Reswap"] = "innerHTML";
      }

      const [newTodo] = await db
        .insert(todoTable)
        .values({ title: body.title, done: false, userId: user.id })
        .returning();

      return (
        <>
          <TodoItem todo={newTodo} />

          <NewTodoForm hx-swap-oob="outerHTML:form" />
        </>
      );
    },
    {
      body: t.Object({
        title: t.String(),
      }),
      transform: ({ body }) => {
        body = todoSchema.pick({ title: true }).parse(body);
      },
      error: ({ error, set, body }) => {
        if (error instanceof ZodError) {
          const errors = (error as ZodError<TodoSchema>).format();

          set.headers["Content-Type"] = "text/html";
          set.headers["HX-Reswap"] = "outerHTML";
          set.status = "Unprocessable Content";
          set.headers["HX-Trigger"] = createHtmxToast({
            title: "something went wrong",
            description: errors.title?._errors.at(0) ?? "invalid title",
            type: "error",
          });

          return (
            <NewTodoForm
              value={body.title}
              error={errors.title?._errors.at(0)}
            />
          );
        }
      },
    },
  )
  .patch(
    "/:id/toggle",
    async ({ params, db, user, set }) => {
      if (!user) {
        set.status = "Unauthorized";
        set.headers["HX-Redirect"] = "/sign-up";
        throw new Error("Unauthorized");
      }

      await db
        .update(todoTable)
        .set({ done: not(todoTable.done), updatedAt: new Date() })
        .where(eq(todoTable.id, params.id));
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    },
  )
  .delete(
    "/:id",
    async ({ params, db, user, set }) => {
      if (!user) {
        set.status = "Unauthorized";
        set.headers["HX-Redirect"] = "/sign-up";
        throw new Error("Unauthorized");
      }

      const todos = await db.transaction(async (tx) => {
        await tx.delete(todoTable).where(eq(todoTable.id, params.id));

        return await tx
          .select()
          .from(todoTable)
          .where(eq(todoTable.userId, user.id));
      });

      if (!todos.length) {
        return <TodoListEmptyMsg />;
      }

      return null;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    },
  );
