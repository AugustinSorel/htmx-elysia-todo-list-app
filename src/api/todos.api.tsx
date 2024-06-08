import Elysia, { t } from "elysia";
import { ctx } from "../context/context";
import { todoTable } from "../db/schema";
import { desc, eq, not } from "drizzle-orm";
import { Todo } from "../components/todo";
import { TodoSchema, todoSchema } from "../schemas/todo.schemas";
import { ZodError } from "zod";

export const todoApi = new Elysia({
  prefix: "/todos",
})
  .use(ctx)
  .get(
    "/",
    async ({ query, db }) => {
      const todosPerPage = 50;

      const allTodos = await db
        .select()
        .from(todoTable)
        .orderBy(desc(todoTable.createdAt))
        .limit(todosPerPage)
        .offset((query.page - 1) * todosPerPage);

      if (!allTodos.length && query.page === 1) {
        return <Todo.EmptyText>all done 🎉</Todo.EmptyText>;
      }

      return (
        <>
          {allTodos.map((todo, i) => {
            if (i === allTodos.length - 1 && allTodos.length === todosPerPage) {
              return (
                <Todo.Item
                  hx-get={`/api/todos/?page=${query.page + 1}`}
                  hx-trigger="revealed"
                  hx-swap="afterend"
                  hx-indicator=".todo-item-skeleton"
                >
                  <Todo.Checkbox todoId={todo.id} checked={todo.done} />
                  <Todo.Label todoId={todo.id}>{todo.title}</Todo.Label>
                  <Todo.EditBtn todoId={todo.id} />
                  <Todo.DeleteBtn todoId={todo.id} />
                </Todo.Item>
              );
            }

            return (
              <Todo.Item>
                <Todo.Checkbox todoId={todo.id} checked={todo.done} />
                <Todo.Label todoId={todo.id}>{todo.title}</Todo.Label>
                <Todo.EditBtn todoId={todo.id} />
                <Todo.DeleteBtn todoId={todo.id} />
              </Todo.Item>
            );
          })}
        </>
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
      const allTodos = await db.select().from(todoTable);

      if (!allTodos.length) {
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
          <Todo.Item>
            <Todo.Checkbox todoId={newTodo.id} checked={newTodo.done} />
            <Todo.Label todoId={newTodo.id}>{newTodo.title}</Todo.Label>
            <Todo.EditBtn todoId={newTodo.id} />
            <Todo.DeleteBtn todoId={newTodo.id} />
          </Todo.Item>

          <Todo.Form hx-swap-oob="outerHTML:form">
            <Todo.FormTitleInput />
            <Todo.FormSubmitButton />
          </Todo.Form>
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
            <Todo.Form>
              <Todo.FormTitleInput value={body.title} />
              <Todo.FormSubmitButton />
              {errors.title?._errors.at(0) && (
                <Todo.FormErrorMsg>
                  {errors.title._errors.at(0)}
                </Todo.FormErrorMsg>
              )}
            </Todo.Form>
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
        .set({ done: not(todoTable.done) })
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
      const allTodos = await db.transaction(async (tx) => {
        await tx.delete(todoTable).where(eq(todoTable.id, params.id));

        return await tx.select().from(todoTable);
      });

      if (!allTodos.length) {
        return <Todo.EmptyText>all done 🎉</Todo.EmptyText>;
      }

      return null;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    },
  );
