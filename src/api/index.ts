import Elysia from "elysia";
import { todoApi } from "./todos.api";
import { authApi } from "./auth.api";

export const api = new Elysia({ prefix: "/api" }).use(todoApi).use(authApi);
