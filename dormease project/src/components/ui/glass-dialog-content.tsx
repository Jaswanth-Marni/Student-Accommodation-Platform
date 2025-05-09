
import React from "react";
import { cn } from "../../lib/utils";
import { DialogContent } from "./dialog";

interface GlassDialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  variant?: "default" | "dark";
  glow?: boolean;
}

const GlassDialogContent = React.forwardRef<HTMLDivElement, GlassDialogContentProps>(
  ({ className, variant = "default", glow = false, children, ...props }, ref) => {
    return (
      <DialogContent
        className={cn(
          variant === "default" ? "glass" : "glass-dark",
          glow && "glow",
          "border border-white/20 shadow-lg backdrop-blur-md rounded-2xl",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </DialogContent>
    );
  }
);

GlassDialogContent.displayName = "GlassDialogContent";

export { GlassDialogContent };
