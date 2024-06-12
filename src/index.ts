import { Elysia } from "elysia";
import staticPlugin from "@elysiajs/static";
import { router } from "./router";

new Elysia()
  .use(staticPlugin({ noCache: Bun.env.NODE_ENV === "dev" }))
  .use(router)
  .listen(3_000);

//TODO: routes error handling
//TODO: routes status
//TODO: todo error boundaries
//TODO: lucia auth guide
//TODO: loader between routes
//TODO: dnd
