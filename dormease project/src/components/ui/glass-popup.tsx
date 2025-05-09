import React from "react";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent } from "./popover";

interface GlassPopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  variant?: "default" | "dark";
  glow?: boolean;
}

const GlassPopoverContent = React.forwardRef<HTMLDivElement, GlassPopoverContentProps>(
  ({ className, variant = "default", glow = false, sideOffset = 5, children, ...props }, ref) => {
    return (
      <PopoverContent
        className={cn(
          variant === "default" ? "glass" : "glass-dark",
          glow && "glow",
          "border border-white/20 shadow-lg backdrop-blur-md rounded-xl p-4",
          "animate-in fade-in-50 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        ref={ref}
        sideOffset={sideOffset}
        {...props}
      >
        {children}
      </PopoverContent>
    );
  }
);

GlassPopoverContent.displayName = "GlassPopoverContent";

export { GlassPopoverContent };