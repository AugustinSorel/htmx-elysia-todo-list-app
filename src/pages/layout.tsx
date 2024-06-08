import { Html } from "@elysiajs/html";

export const Layout = ({
  children,
  scripts = {},
}: Html.PropsWithChildren & { scripts?: Scripts }) => {
  return (
    <html lang="en">
      <head>
        <title>HTMX🤝Elysia</title>
        <link rel="stylesheet" href="/public/styles.css" />
        {Object.keys(scripts).map(
          (script) => scriptTags[script as keyof typeof scriptTags],
        )}
      </head>
      <body class="bg-background text-foreground">
        <header class="sticky top-0 flex items-center justify-between border-b border-current bg-accent px-max-width py-4 text-background">
          <h1 class="text-xl font-semibold capitalize">
            <a href="/">todo list</a>
          </h1>
        </header>

        {children}
      </body>
    </html>
  );
};

export type Scripts = Partial<Record<keyof typeof scriptTags, true>>;

const scriptTags = {
  htmx: (
    <script
      src="https://unpkg.com/htmx.org@1.9.12"
      integrity="sha384-ujb1lZYygJmzgSwoxRggbCHcjc0rB2XoQrxeTUQyRjrOnlCoYta87iKBWq3EsdM2"
      crossorigin="anonymous"
    ></script>
  ),
  "htmx-response-target": (
    <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/response-targets.js"></script>
  ),
} as const;
