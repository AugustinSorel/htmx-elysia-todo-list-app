import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../lib/tailwindcss";

const iconVariants = cva("", {
  variants: {
    size: {
      md: "h-6 w-6",
      sm: "h-4 w-4",
      xs: "h-3 w-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const Icon = ({
  icon,
  ...props
}: JSX.HtmlSvgTag & { icon: keyof typeof icons } & VariantProps<
    typeof iconVariants
  >) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...props}
      class={cn(iconVariants({ size: props.size, class: props.class }))}
    >
      {icons[icon]}
    </svg>
  );
};

const icons = {
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </>
  ),
  edit: <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />,
  loader: <path d="M21 12a9 9 0 1 1-6.219-8.56" />,
  plus: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </>
  ),
} as const;
