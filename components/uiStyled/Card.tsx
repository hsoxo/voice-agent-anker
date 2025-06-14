import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

/* -------------------------------------------------------------------------- */
/*                                   types                                    */
/* -------------------------------------------------------------------------- */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadow?: boolean;
  fullWidthMobile?: boolean;
}

interface StyledCardProps {
  shadow?: boolean;
  fullWidthMobile?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                    Card                                    */
/* -------------------------------------------------------------------------- */

const StyledCard = styled("div", {
  shouldForwardProp: (prop) => prop !== "shadow" && prop !== "fullWidthMobile",
})<StyledCardProps>`
  border: 1px solid transparent;
  border-radius: 1.5rem; /* rounded-3xl */
  background-origin: border-box;
  background: var(--card-border-bg, inherit); /* fallback for gradient border */

  ${({ shadow }) =>
    shadow &&
    css`
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12); /* shadow-long */
    `};

  ${({ fullWidthMobile }) =>
    fullWidthMobile &&
    css`
      width: 100%;
      max-width: 100%;
      min-width: 100%;

      @media (min-width: 768px) {
        min-width: 0;
      }
    `};
`;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, shadow, fullWidthMobile = true, ...rest }, ref) => (
    <StyledCard
      ref={ref}
      shadow={shadow}
      fullWidthMobile={fullWidthMobile}
      {...rest}
    >
      {children}
    </StyledCard>
  )
);
Card.displayName = "Card";

/* -------------------------------------------------------------------------- */
/*                                 CardHeader                                 */
/* -------------------------------------------------------------------------- */

const StyledCardHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem; /* p-6 */

  @media (min-width: 1024px) {
    padding: 2.25rem; /* lg:p-9 */
  }

  & > * + * {
    margin-top: 0.75rem; /* space-y-3 */
  }
`;

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...rest }, ref) => (
  <StyledCardHeader ref={ref} {...rest}>
    {children}
  </StyledCardHeader>
));
CardHeader.displayName = "CardHeader";

/* -------------------------------------------------------------------------- */
/*                                  CardTitle                                 */
/* -------------------------------------------------------------------------- */

const StyledCardTitle = styled.h3`
  font-size: 1.5rem; /* text-2xl */
  line-height: 1; /* leading-none */
  font-weight: 600; /* font-semibold */
  letter-spacing: -0.025em; /* tracking-tight */
  text-wrap: balance; /* text-pretty equivalent */
`;

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ children, ...rest }, ref) => (
  <StyledCardTitle ref={ref} {...rest}>
    {children}
  </StyledCardTitle>
));
CardTitle.displayName = "CardTitle";

/* -------------------------------------------------------------------------- */
/*                               CardDescription                               */
/* -------------------------------------------------------------------------- */

const StyledCardDescription = styled.p`
  font-size: 1.125rem; /* text-lg */
  line-height: 1.75rem;
  color: var(--color-primary-500, #64748b); /* text-primary-500 */
  text-wrap: balance; /* text-pretty equivalent */
`;

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ children, ...rest }, ref) => (
  <StyledCardDescription ref={ref} {...rest}>
    {children}
  </StyledCardDescription>
));
CardDescription.displayName = "CardDescription";

/* -------------------------------------------------------------------------- */
/*                                 CardContent                                */
/* -------------------------------------------------------------------------- */

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  stack?: boolean;
}

interface StyledCardContentProps {
  stack?: boolean;
}

const StyledCardContent = styled("div", {
  shouldForwardProp: (prop) => prop !== "stack",
})<StyledCardContentProps>`
  padding: 0 1.5rem 1.5rem; /* p-6 pt-0 */

  @media (min-width: 1024px) {
    padding: 0 2.25rem 2.25rem; /* lg:p-9 lg:pt-0 */
  }

  ${({ stack }) =>
    stack &&
    css`
      display: flex;
      flex-direction: column;
      gap: 0.75rem; /* gap-3 */

      @media (min-width: 1024px) {
        gap: 1rem; /* lg:gap-4 */
      }
    `};
`;

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, stack = false, ...rest }, ref) => (
    <StyledCardContent ref={ref} stack={stack} {...rest}>
      {children}
    </StyledCardContent>
  )
);
CardContent.displayName = "CardContent";

/* -------------------------------------------------------------------------- */
/*                                  CardFooter                                */
/* -------------------------------------------------------------------------- */

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  isButtonArray?: boolean;
}

interface StyledCardFooterProps {
  isButtonArray?: boolean;
}

const StyledCardFooter = styled("div", {
  shouldForwardProp: (prop) => prop !== "isButtonArray",
})<StyledCardFooterProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1.5rem 1.5rem; /* p-6 pt-0 */

  @media (min-width: 1024px) {
    padding: 0 2.25rem 2.25rem; /* lg:p-9 lg:pt-0 */
  }

  ${({ isButtonArray }) =>
    isButtonArray &&
    css`
      flex-direction: column;
      gap: 0.5rem; /* gap-2 */

      @media (min-width: 768px) {
        flex-direction: row; /* md:flex-row */
      }

      & > * {
        width: 100%; /* *:w-full */

        @media (min-width: 768px) {
          width: auto; /* md:*:w-auto */
        }
      }
    `};
`;

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, isButtonArray = false, ...rest }, ref) => (
    <StyledCardFooter ref={ref} isButtonArray={isButtonArray} {...rest}>
      {children}
    </StyledCardFooter>
  )
);
CardFooter.displayName = "CardFooter";

/* -------------------------------------------------------------------------- */
/*                               module exports                               */
/* -------------------------------------------------------------------------- */

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
