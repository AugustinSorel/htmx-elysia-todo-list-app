import Elysia from "elysia";
import { db } from "../db";
import { validateRequest } from "../lib/auth";

export const ctx = new Elysia()
  .decorate("db", db)
  .derive({ as: "scoped" }, async ({ request, cookie }) => {
    return await validateRequest(request, cookie);
  });
