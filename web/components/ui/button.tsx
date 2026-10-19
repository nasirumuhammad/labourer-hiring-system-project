import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-transparent text-sm font-medium whitespace-nowrap transition-[color,background-color,filter,opacity] outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/40 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:brightness-95",
        dark: "bg-brand text-white hover:bg-brand/90",
        outline:
          "border-black/10 bg-card text-brand hover:bg-brand-soft aria-expanded:bg-brand-soft",
        secondary: "bg-brand-soft text-brand hover:bg-brand-soft/70",
        ghost: "text-brand hover:bg-brand-soft",
        destructive: "bg-red-50 text-red-600 hover:bg-red-100",
        link: "text-link underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5",
        xs: "h-7 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 px-3.5 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 px-7 text-base",
        icon: "size-10",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
