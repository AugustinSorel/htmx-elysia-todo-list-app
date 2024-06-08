import Elysia from "elysia";
import { Layout, Scripts } from "./layout";
import { AuthForm } from "../components/auth";

const scripts: Scripts = { htmx: true, "htmx-response-target": true };

export const signUpPage = new Elysia().get("/sign-up", () => {
  return (
    <Layout scripts={scripts}>
      <main
        class="mx-auto flex max-w-lg flex-col p-4"
        hx-ext="response-targets"
      >
        <h2 class="mt-20 text-center text-3xl font-semibold">sign up</h2>

        <AuthForm.SignUpForm>
          <AuthForm.EmailLabel />
          <AuthForm.EmailInput />

          <AuthForm.PasswordLabel />
          <AuthForm.PasswordInput />

          <AuthForm.ConfirmPasswordLabel />
          <AuthForm.ConfirmPasswordInput />

          <AuthForm.SubmitButton>sign up</AuthForm.SubmitButton>
          <AuthForm.SigInRedirect />
        </AuthForm.SignUpForm>
      </main>
    </Layout>
  );
});
