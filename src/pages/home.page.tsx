import { Elysia } from "elysia";
import { ctx } from "../context/context";
import { Todo } from "../components/todo";
import { Head } from "../components/head";
import { Header } from "../components/header";
import { Layout } from "../components/layout";

export const homePage = new Elysia()
  .use(ctx)
  .get("/", ({ user, redirect, set }) => {
    if (!user) {
      return redirect("/sign-up", 302);
    }

    set.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";

    return (
      <Layout.Html>
        <Head.Item>
          <Head.Title>HTMX🤝Elysia</Head.Title>
          <Head.Style />
          <Head.Htmx />
          <Head.HtmxResponseTarget />
        </Head.Item>

        <Layout.Body>
          <Header.Item>
            <Header.Title />
            <Header.SignOut />
          </Header.Item>

          <main
            class="mt-10 flex flex-col space-y-10 px-max-width"
            hx-ext="response-targets"
          >
            <Todo.Form>
              <Todo.FormTitleInput />
              <Todo.FormSubmitButton />
            </Todo.Form>

            <Todo.List>
              {[...Array(10)].map(() => (
                <Todo.Skeleton />
              ))}
            </Todo.List>
          </main>
        </Layout.Body>
      </Layout.Html>
    );
  });

//TODO: routes error handling
//TODO: routes status
//TODO: todo error boundaries
//TODO: auth
//TODO: loader between routes
//TODO: dnd
