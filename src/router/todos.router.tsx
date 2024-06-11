import Elysia, { t } from "elysia";
import { ctx } from "../context/context";
import { Layout } from "../components/layout";
import { Head } from "../components/head";
import { Header } from "../components/header";
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

export const todosRouter = new Elysia({ prefix: "/todos" })
  .use(ctx)
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
        <Layout.Html>
          <Head.Item>
            <Head.Title>HTMX🤝Elysia</Head.Title>
            <Head.Style />
            <Head.Htmx />
            <Head.HtmxResponseTarget />
          </Head.Item>

          <Layout.Body>
            <Header user={user} />

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
          </Layout.Body>
        </Layout.Html>
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
    async ({ body, set, db }) => {
      const todos = await db.select().from(todoTable);

      if (!todos.length) {
        set.headers["HX-Reswap"] = "innerHTML";
      }

      const [newTodo] = await db
        .insert(todoTable)
        .values({
          title: body.title,
          done: false,
        })
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
    async ({ params, db }) => {
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
    async ({ params, db }) => {
      const todos = await db.transaction(async (tx) => {
        await tx.delete(todoTable).where(eq(todoTable.id, params.id));

        return await tx.select().from(todoTable);
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
