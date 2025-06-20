import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

const buttonVariants = cva(
  "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-xl border text-base font-semibold ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-5",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary text-primary-foreground hover:bg-primary/90 disabled:text-primary-foreground/50",
        success:
          "border-emerald-200 bg-emerald-200 text-emerald-800 hover:bg-teal/90 disabled:text-primary-600 disabled:bg-primary-200 disabled:border-primary-200",
        ghost:
          "border-primary-200 bg-white text-primary hover:border-primary-300 hover:bg-white/0 disabled:text-primary-foreground/50",
        outline: "button-outline",
        light: "border-transparent bg-transparent hover:bg-primary/[.05]",
        icon: "bg-transparent border-0 hover:bg-primary-200",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 rounded-md px-8",
        icon: "h-12 w-12",
        iconSm: "h-9 w-9",
      },
      isRound: {
        true: "rounded-full",
        false: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  fullWidthMobile?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant, size, fullWidthMobile, className, asChild = false, isRound = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, isRound }),
          fullWidthMobile ? "w-full md:w-auto" : "",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
