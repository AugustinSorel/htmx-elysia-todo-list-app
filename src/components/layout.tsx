import { Button } from "./ui/button";
import { Toasts } from "./ui/toast";

type Props = Html.PropsWithChildren & { title: string; user?: any };

export const Layout = (props: Props) => {
  return (
    <html lang="en">
      <body>
        <head>
          <title>{props.title}</title>
          <link rel="stylesheet" href="/public/styles.css" />
          <script
            src="https://unpkg.com/htmx.org@1.9.12"
            integrity="sha384-ujb1lZYygJmzgSwoxRggbCHcjc0rB2XoQrxeTUQyRjrOnlCoYta87iKBWq3EsdM2"
            crossorigin="anonymous"
          ></script>
          <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/response-targets.js"></script>
          <script src="//unpkg.com/alpinejs" defer></script>
        </head>

        <body>
          <header class="sticky top-0 flex items-center justify-between border-b border-current bg-accent px-max-width py-4 text-background">
            <h1 class="text-xl font-semibold capitalize">todo list</h1>

            {props.user && (
              <button class="hover:underline" hx-post="/sign-out">
                sign out
              </button>
            )}
          </header>

          {props.children}

          <Toasts />
        </body>
      </body>
    </html>
  );
};
