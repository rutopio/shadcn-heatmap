import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { Children, isValidElement, type ReactElement } from "react";
import { cn } from "@/lib/utils";

// Accept the Radix-style `delayDuration` prop so existing call sites keep
// working; map it to Base UI's `delay`. `skipDelayDuration` has no Base UI
// equivalent and is ignored.
function TooltipProvider({
  delay,
  delayDuration,
  skipDelayDuration: _skipDelayDuration,
  ...props
}: TooltipPrimitive.Provider.Props & {
  delayDuration?: number;
  skipDelayDuration?: number;
}) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay ?? delayDuration ?? 0}
      {...props}
    />
  );
}

const Tooltip = (props: TooltipPrimitive.Root.Props) => (
  <TooltipPrimitive.Root data-slot="tooltip" {...props} />
);

// Accept the Radix-style `asChild` prop: render the single child element via
// Base UI's `render`, so existing `<TooltipTrigger asChild><El/></TooltipTrigger>`
// call sites keep working.
function TooltipTrigger({
  asChild,
  children,
  render,
  ...props
}: TooltipPrimitive.Trigger.Props & { asChild?: boolean }) {
  const resolvedRender =
    render ??
    (asChild && isValidElement(children)
      ? (Children.only(children) as ReactElement)
      : undefined);
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      render={resolvedRender}
      {...props}
    >
      {resolvedRender ? undefined : children}
    </TooltipPrimitive.Trigger>
  );
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 w-fit origin-(--transform-origin) overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-popover-foreground text-xs shadow-md",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            "data-starting-style:fade-in-0 data-starting-style:zoom-in-95 data-starting-style:animate-in",
            "data-ending-style:fade-out-0 data-ending-style:zoom-out-95 data-ending-style:animate-out",
            className,
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
