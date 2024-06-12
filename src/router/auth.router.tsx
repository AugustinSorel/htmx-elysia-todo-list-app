import Elysia, { t } from "elysia";
import { ctx } from "../context/context";
import { Layout } from "../components/layout";
import { lucia } from "../lib/auth";
import {
  SignInSchema,
  SignUpSchema,
  signInSchema,
  signUpSchema,
} from "../schemas/auth.schemas";
import { ZodError } from "zod";
import { userTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { PostgresError } from "postgres";
import { SignInForm, SignUpForm } from "../components/auth";

export const authRouter = new Elysia()
  .use(ctx)
  .get("/sign-up", ({ redirect, user }) => {
    if (user) {
      return redirect("/", 302);
    }

    return (
      <Layout title="Sign up">
        <Main>
          <SubTitle>sign up</SubTitle>
          <SignUpForm />
        </Main>
      </Layout>
    );
  })
  .get("/sign-in", ({ user, redirect }) => {
    if (user) {
      return redirect("/", 302);
    }

    return (
      <Layout title="Sign in">
        <Main>
          <SubTitle>sign in</SubTitle>
          <SignInForm />
        </Main>
      </Layout>
    );
  })
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
            <SignUpForm errors={{ email: "this email is already used" }} />
          );
        }

        if (error instanceof ZodError) {
          const errors = (error as ZodError<SignUpSchema>).format();

          set.status = "Unprocessable Content";
          set.headers["Content-Type"] = "text/html";

          return (
            <SignUpForm
              values={body}
              errors={{
                email: errors.email?._errors.at(0),
                password: errors.password?._errors.at(0),
                confirmPassword: errors.confirmPassword?._errors.at(0),
              }}
            />
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
            <SignInForm
              values={body}
              errors={{ password: "incorrect username or password" }}
            />
          );
        }

        if (error instanceof ZodError) {
          const errors = (error as ZodError<SignInSchema>).format();

          set.status = "Unprocessable Content";
          set.headers["Content-Type"] = "text/html";

          return (
            <SignInForm
              values={body}
              errors={{
                email: errors.email?._errors.at(0),
                password: errors.password?._errors.at(0),
              }}
            />
          );
        }
      },
    },
  )
  .post("/sign-out", async ({ session, cookie, set }) => {
    if (!session) {
      set.status = "Unauthorized";

      throw new Error("Unauthorized");
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

const Main = (props: JSX.HtmlTag) => {
  return (
    <main
      class="mx-auto flex max-w-lg flex-col p-4"
      hx-ext="response-targets"
      {...props}
    >
      {props.children}
    </main>
  );
};

const SubTitle = (props: JSX.HtmlTag) => {
  return (
    <h2 class="mt-20 text-center text-3xl font-semibold" {...props}>
      {props.children}
    </h2>
  );
};
