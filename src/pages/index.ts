import Elysia from "elysia";
import { homePage } from "./home.page";
import { html } from "@elysiajs/html";
import { signUpPage } from "./signup.page";
import { signInPage } from "./signin.page";

export const pages = new Elysia()
  .use(html())
  .use(homePage)
  .use(signUpPage)
  .use(signInPage);
