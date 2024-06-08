import { Elysia } from "elysia";
import staticPlugin from "@elysiajs/static";
import { pages } from "./pages";
import { api } from "./api";

new Elysia()
  .use(staticPlugin({ noCache: Bun.env.NODE_ENV === "dev" }))
  .use(pages)
  .use(api)
  .listen(3_000);
