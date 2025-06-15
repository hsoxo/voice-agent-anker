import React from "react";
import styled from "@emotion/styled";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "success"
    | "ghost"
    | "outline"
    | "light"
    | "icon"
    | "danger";
  size?: "default" | "sm" | "lg" | "icon" | "iconSm";
  isRound?: boolean;
  fullWidthMobile?: boolean;
  asChild?: boolean;
}

const variantStyles = {
  primary: `
    border: 1px solid #111827;
    background-color: #111827;
    color: white;
    &:hover {
      background-color: #374151;
    }
    &:disabled {
      color: #9ca3af;
    }
  `,
  success: `
    border: 1px solid #a7f3d0;
    background-color: #a7f3d0;
    color: #065f46;
    &:hover {
      background-color: #5eead4;
    }
    &:disabled {
      color: #059669;
      background-color: #bbf7d0;
      border-color: #bbf7d0;
    }
  `,
  ghost: `
    border: 1px solid #e5e7eb;
    background-color: white;
    color: var(--color-primary);
    &:hover {
      border-color: #d1d5db;
      background-color: rgba(255, 255, 255, 0);
    }
    &:disabled {
      color: #9ca3af;
    }
  `,
  outline: `
    border: 1px solid var(--color-primary);
    background-color: transparent;
    color: var(--color-primary);
  `,
  light: `
    border: transparent;
    background-color: transparent;
    &:hover {
      background-color: #e5e7eb;
    }
  `,
  icon: `
    border: 0;
    background-color: transparent;
    &:hover {
      background-color: #e5e7eb;
    }
  `,
  danger: `
    border: 1px solid #ef4444;
    background-color: #ef4444;
    color: white;
    &:hover {
      background-color: #dc2626;
    }
    &:disabled {
      color: #9ca3af;
    }
  `,
};

/**
 * CSS styles for different button sizes.
 *
 * - `default`: Standard button with height 48px and padding 8px 24px.
 * - `sm`: Small button with height 36px, padding 6px 12px, and font size 14px.
 * - `lg`: Large button with height 44px, padding 8px 32px, and border radius 8px.
 * - `icon`: Icon button with height and width 48px.
 * - `iconSm`: Small icon button with height and width 36px.
 */
const sizeStyles = {
  default: `
    height: 48px;
    padding: 8px 24px;
  `,
  sm: `
    height: 36px;
    padding: 6px 12px;
    font-size: 14px;
  `,
  lg: `
    height: 44px;
    padding: 8px 32px;
    border-radius: 8px;
  `,
  icon: `
    height: 48px;
    width: 48px;
  `,
  iconSm: `
    height: 36px;
    width: 36px;
  `,
};

const StyledButton = styled.button<
  Required<Pick<ButtonProps, "variant" | "size" | "isRound">> & {
    fullWidthMobile?: boolean;
  }
>`
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: ${({ isRound }) => (isRound ? "9999px" : "0.75rem")};
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s ease, color 0.2s ease;
  ring-offset-color: white;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  ${({ variant }) => variantStyles[variant]}
  ${({ size }) => sizeStyles[size]}
  ${({ fullWidthMobile }) =>
    fullWidthMobile
      ? "width: 100%; @media(min-width: 768px) { width: auto; }"
      : ""}
  
  & > svg {
    width: 20px;
    height: 20px;
  }
`;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "default",
      isRound = false,
      fullWidthMobile = false,
      className,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : StyledButton;
    return (
      <Comp
        ref={ref}
        as={asChild ? "button" : undefined}
        variant={variant}
        size={size}
        isRound={isRound}
        fullWidthMobile={fullWidthMobile}
        className={className}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
