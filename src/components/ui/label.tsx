import { cva } from "class-variance-authority";
import { cn } from "../../lib/tailwindcss";

const labelVariants = cva(
  "text-sm font-medium leading-none first-letter:capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export const Label = (props: JSX.HtmlLabelTag) => {
  return (
    <label {...props} class={cn(labelVariants(), props.class)}>
      {props.children}
    </label>
  );
};
