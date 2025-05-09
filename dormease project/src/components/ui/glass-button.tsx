
import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import type { ButtonProps as ShadcnButtonProps } from "./button";

// Create a type that omits the 'variant' prop from ButtonProps
type ButtonPropsWithoutVariant = Omit<ShadcnButtonProps, 'variant'>;

// Define our custom GlassButtonProps
interface GlassButtonProps extends ButtonPropsWithoutVariant {
  variant?: "default" | "dark";
  glow?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "default", glow = false, ...props }, ref) => {
    return (
      <Button
        className={cn(
          "rounded-full",
          variant === "default" ? "glass-button" : "glass-dark-button",
          glow && "glow glow-hover",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton };
