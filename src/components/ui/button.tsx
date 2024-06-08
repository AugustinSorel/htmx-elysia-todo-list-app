import { cn } from "../../lib/tailwindcss";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-background hover:bg-accent/80",
        ghost: "bg-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = JSX.HtmlButtonTag &
  VariantProps<typeof buttonVariants>;

export const Button = ({ size, variant, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      class={cn(buttonVariants({ variant, size, class: props.class }))}
    >
      {props.children}
    </button>
  );
};
