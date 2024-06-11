import { Elysia } from "elysia";
import staticPlugin from "@elysiajs/static";
import { router } from "./router";

new Elysia()
  .use(staticPlugin({ noCache: Bun.env.NODE_ENV === "dev" }))
  .use(router)
  .listen(3000);
