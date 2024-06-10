import { Elysia, t } from "elysia";
import { AuthForm } from "../components/auth";
import { ZodError } from "zod";
import { generateIdFromEntropySize } from "lucia";
import { ctx } from "../context/context";
import { userTable } from "../db/schema";
import { lucia } from "../lib/auth";
import { PostgresError } from "postgres";
import {
  SignInSchema,
  SignUpSchema,
  signInSchema,
  signUpSchema,
} from "../schemas/auth.schemas";
import { eq } from "drizzle-orm";

export const authApi = new Elysia({ prefix: "/auth" })
  .use(ctx)
  .post(
    "/sign-up",
    async ({ body, db, cookie, set }) => {
      const hash = await Bun.password.hash(body.password);
      const userId = generateIdFromEntropySize(10);

      await db.insert(userTable).values({
        id: userId,
        email: body.email,
        passwordHash: hash,
      });

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookie[sessionCookie.name].set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });

      set.headers["HX-Redirect"] = "/";
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        confirmPassword: t.String(),
      }),

      transform: ({ body }) => {
        body = signUpSchema.parse(body);
      },

      error: ({ error, body, set }) => {
        if (
          isPgError(error) &&
          error.code === "23505" &&
          error.constraint_name === "user_email_unique"
        ) {
          set.status = "Conflict";
          set.headers["Content-Type"] = "text/html";

          return (
            <AuthForm.SignUpForm>
              <AuthForm.EmailLabel />
              <AuthForm.EmailInput value={body.email} />
              <AuthForm.ErrorMsg>this email is already used</AuthForm.ErrorMsg>

              <AuthForm.PasswordLabel />
              <AuthForm.PasswordInput value={body.password} />

              <AuthForm.ConfirmPasswordLabel />
              <AuthForm.ConfirmPasswordInput value={body.confirmPassword} />

              <AuthForm.SubmitButton>sign up</AuthForm.SubmitButton>
              <AuthForm.SigInRedirect />
            </AuthForm.SignUpForm>
          );
        }

        if (error instanceof ZodError) {
          const errors = (error as ZodError<SignUpSchema>).format();

          set.status = "Unprocessable Content";
          set.headers["Content-Type"] = "text/html";

          return (
            <AuthForm.SignUpForm>
              <AuthForm.EmailLabel />
              <AuthForm.EmailInput value={body.email} />
              {errors.email?._errors.at(0) && (
                <AuthForm.ErrorMsg>
                  {errors.email._errors.at(0)}
                </AuthForm.ErrorMsg>
              )}

              <AuthForm.PasswordLabel />
              <AuthForm.PasswordInput value={body.password} />
              {errors.password?._errors.at(0) && (
                <AuthForm.ErrorMsg>
                  {errors.password._errors.at(0)}
                </AuthForm.ErrorMsg>
              )}

              <AuthForm.ConfirmPasswordLabel />
              <AuthForm.ConfirmPasswordInput value={body.confirmPassword} />
              {errors.confirmPassword?._errors.at(0) && (
                <AuthForm.ErrorMsg>
                  {errors.confirmPassword._errors.at(0)}
                </AuthForm.ErrorMsg>
              )}

              <AuthForm.SubmitButton>sign up</AuthForm.SubmitButton>
              <AuthForm.SigInRedirect />
            </AuthForm.SignUpForm>
          );
        }
      },
    },
  )
  .post(
    "/sign-in",
    async ({ body, db, cookie, set }) => {
      const [user] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, body.email));

      if (!user) {
        throw new Error("invalid credentials");
      }

      const validPassword = await Bun.password.verify(
        body.password,
        user.passwordHash,
      );

      if (!validPassword) {
        throw new Error("invalid credentials");
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookie[sessionCookie.name].set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });

      set.headers["HX-Redirect"] = "/";
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),

      transform: ({ body }) => {
        body = signInSchema.parse(body);
      },

      error: ({ error, body, set }) => {
        if (error.message === "invalid credentials") {
          set.status = "Unauthorized";
          set.headers["Content-Type"] = "text/html";

          return (
            <AuthForm.SignInForm>
              <AuthForm.EmailLabel />
              <AuthForm.EmailInput value={body.email} />

              <AuthForm.PasswordLabel />
              <AuthForm.PasswordInput value={body.password} />
              <AuthForm.ErrorMsg>
                incorrect username or password
              </AuthForm.ErrorMsg>

              <AuthForm.SubmitButton>sign in</AuthForm.SubmitButton>
              <AuthForm.SignUpRedirect />
            </AuthForm.SignInForm>
          );
        }

        if (error instanceof ZodError) {
          const errors = (error as ZodError<SignInSchema>).format();

          set.status = "Unprocessable Content";
          set.headers["Content-Type"] = "text/html";

          return (
            <AuthForm.SignInForm>
              <AuthForm.EmailLabel />
              <AuthForm.EmailInput value={body.email} />
              {errors.email?._errors.at(0) && (
                <AuthForm.ErrorMsg>
                  {errors.email._errors.at(0)}
                </AuthForm.ErrorMsg>
              )}

              <AuthForm.PasswordLabel />
              <AuthForm.PasswordInput value={body.password} />
              {errors.password?._errors.at(0) && (
                <AuthForm.ErrorMsg>
                  {errors.password._errors.at(0)}
                </AuthForm.ErrorMsg>
              )}

              <AuthForm.SubmitButton>sign in</AuthForm.SubmitButton>
              <AuthForm.SignUpRedirect />
            </AuthForm.SignInForm>
          );
        }
      },
    },
  )
  .post("/sign-out", async ({ session, cookie, set }) => {
    if (!session) {
      throw new Error("");
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookie[sessionCookie.name].set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });

    set.headers["HX-Redirect"] = "/sign-up";
  });

const isPgError = (error: Error): error is PostgresError => {
  return error.constructor.name === "PostgresError";
};
