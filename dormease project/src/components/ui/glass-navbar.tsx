
import React from "react";
import { cn } from "../../lib/utils";

interface GlassNavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark";
}

const GlassNavbar = React.forwardRef<HTMLDivElement, GlassNavbarProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        className={cn(
          "w-full py-4 px-6 rounded-full",
          variant === "default" ? "glass-navbar" : "glass-dark glass-navbar",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

GlassNavbar.displayName = "GlassNavbar";

export { GlassNavbar };
