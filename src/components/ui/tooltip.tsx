import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = ({
  ref,
  className,
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
  ref?: React.RefObject<React.ComponentRef<
    typeof TooltipPrimitive.Content
  > | null>;
}) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "bg-popover text-popover-foreground z-50 overflow-hidden rounded-md border px-3 py-1.5 text-xs shadow-md",
        "motion-safe:data-[state=delayed-open]:animate-in motion-safe:data-[state=closed]:animate-out",
        "motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=delayed-open]:fade-in-0",
        "motion-safe:data-[state=delayed-open]:zoom-in-95 motion-safe:data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
