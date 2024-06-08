import { cn } from "../../lib/tailwindcss";

export const Link = (props: JSX.HtmlAnchorTag) => {
  return (
    <a {...props} class={cn("text-accent hover:underline", props.class)}>
      {props.children}
    </a>
  );
};
