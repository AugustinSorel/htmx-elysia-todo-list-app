import { cn } from "../../lib/tailwindcss";
import { Icon } from "./icon";

export const Loader = ({ class: c, ...props }: JSX.HtmlSvgTag) => {
  return (
    <Icon
      icon="loader"
      size="sm"
      {...props}
      class={cn("mr-2 hidden animate-spin group-[.htmx-request]:block", c)}
    />
  );
};
