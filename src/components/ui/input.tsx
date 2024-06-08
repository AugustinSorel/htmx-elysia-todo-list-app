import { cn } from "../../lib/tailwindcss";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "px-2 py-1 bg-transparent disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-b-2 border-accent",
        form: "border border-border rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type InputProps = JSX.HtmlInputTag & VariantProps<typeof inputVariants>;

export const Input = ({ variant, ...props }: InputProps) => {
  return (
    <input
      {...props}
      class={cn(inputVariants({ variant: variant, class: props.class }))}
    />
  );
};
