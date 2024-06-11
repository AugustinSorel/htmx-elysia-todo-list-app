import Elysia from "elysia";
import { authRouter } from "./auth.router";
import { html } from "@elysiajs/html";
import { todosRouter } from "./todos.router";

export const router = new Elysia()
  .use(html())
  .get("/", ({ redirect }) => {
    return redirect("/todos", 302);
  })
  .use(authRouter)
  .use(todosRouter);
