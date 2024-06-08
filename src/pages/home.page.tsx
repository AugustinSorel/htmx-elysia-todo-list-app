import { Elysia } from "elysia";
import { Layout, Scripts } from "./layout";
import { ctx } from "../context/context";
import { Todo } from "../components/todo";

const scripts: Scripts = {
  htmx: true,
  "htmx-response-target": true,
};

export const homePage = new Elysia().use(ctx).get("/", () => {
  return (
    <Layout scripts={scripts}>
      <main
        class="mt-10 flex flex-col space-y-10 px-max-width"
        hx-ext="response-targets"
      >
        <Todo.Form>
          <Todo.FormTitleInput />
          <Todo.FormSubmitButton />
        </Todo.Form>

        <Todo.List
          hx-get="/api/todos"
          hx-swap="afterbegin"
          hx-trigger="load"
          hx-indicator=".todo-item-skeleton"
          hx-disinherit="hx-indicator"
        >
          {[...Array(10)].map(() => (
            <Todo.Skeleton />
          ))}
        </Todo.List>
      </main>
    </Layout>
  );
});

//TODO: routes error handling
//TODO: routes status
//TODO: todo error boundaries
//TODO: auth
//TODO: loader between routes
//TODO: dnd
