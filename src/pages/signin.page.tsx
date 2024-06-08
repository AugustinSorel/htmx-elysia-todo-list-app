import Elysia from "elysia";
import { Layout, Scripts } from "./layout";
import { AuthForm } from "../components/auth";

const scripts: Scripts = { htmx: true, "htmx-response-target": true };

export const signInPage = new Elysia().get("/sign-in", () => {
  return (
    <Layout scripts={scripts}>
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
    </Layout>
  );
});
