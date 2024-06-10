import Elysia from "elysia";
import { AuthForm } from "../components/auth";
import { Header } from "../components/header";
import { Head } from "../components/head";
import { Layout } from "../components/layout";
import { ctx } from "../context/context";

export const signInPage = new Elysia()
  .use(ctx)
  .get("/sign-in", ({ user, redirect, set }) => {
    if (user) {
      return redirect("/", 302);
    }

    set.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";

    return (
      <Layout.Html>
        <Head.Item>
          <Head.Title>Sign in</Head.Title>
          <Head.Style />
          <Head.Htmx />
          <Head.HtmxResponseTarget />
        </Head.Item>

        <Layout.Body>
          <Header.Item>
            <Header.Title />
          </Header.Item>

          <main
            class="mx-auto flex max-w-lg flex-col p-4"
            hx-ext="response-targets"
          >
            <h2 class="mt-20 text-center text-3xl font-semibold">sign in</h2>

            <AuthForm.SignInForm>
              <AuthForm.EmailLabel />
              <AuthForm.EmailInput />

              <AuthForm.PasswordLabel />
              <AuthForm.PasswordInput />

              <AuthForm.SubmitButton>sign in</AuthForm.SubmitButton>
              <AuthForm.SignUpRedirect />
            </AuthForm.SignInForm>
          </main>
        </Layout.Body>
      </Layout.Html>
    );
  });
