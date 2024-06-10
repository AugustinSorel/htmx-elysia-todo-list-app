import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, verifyRequestOrigin } from "lucia";
import { db } from "../db";
import { sessionTable, userTable } from "../db/schema";
import { Cookie } from "elysia";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: Bun.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
    };
  }
}

export const validateRequest = async (
  req: Request,
  cookie: Record<string, Cookie<any>>,
) => {
  // CSRF check
  if (req.method !== "GET") {
    const originHeader = req.headers.get("Origin");
    const hostHeader = req.headers.get("Host");
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return {
        user: null,
        session: null,
      };
    }
  }

  // use headers instead of Cookie API to prevent type coercion
  const cookieHeader = req.headers.get("Cookie") ?? "";
  const sessionId = lucia.readSessionCookie(cookieHeader);

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookie[sessionCookie.name].set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });
  }

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    cookie[sessionCookie.name].set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });
  }

  return {
    user,
    session,
  };
};
