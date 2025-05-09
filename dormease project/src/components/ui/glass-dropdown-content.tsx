
import React from "react";
import { cn } from "../../lib/utils";
import { DropdownMenuContent } from "./dropdown-menu";

interface GlassDropdownContentProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuContent> {
  variant?: "default" | "dark";
  glow?: boolean;
}

const GlassDropdownContent = React.forwardRef<HTMLDivElement, GlassDropdownContentProps>(
  ({ className, variant = "default", glow = false, sideOffset = 5, children, ...props }, ref) => {
    return (
      <DropdownMenuContent
        className={cn(
          variant === "default" ? "glass-dropdown" : "glass-dark glass-dropdown",
          glow && "glow",
          "rounded-xl overflow-hidden",
          className
        )}
        ref={ref}
        sideOffset={sideOffset}
        {...props}
      >
        {children}
      </DropdownMenuContent>
    );
  }
);

GlassDropdownContent.displayName = "GlassDropdownContent";

export { GlassDropdownContent };
