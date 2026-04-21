import { format, parseISO } from "date-fns";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatHourRange } from "@/lib/time";

import type { Locale } from "date-fns";
import type { ReactNode } from "react";

export { TooltipProvider };

export function HeatmapTooltip({
  content,
  children,
  enabled = true,
}: {
  content: ReactNode;
  children: ReactNode;
  enabled?: boolean;
}) {
  if (!enabled) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="top"
        className="pointer-events-none text-xs"
        sideOffset={6}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

export const WEEKDAY_NAMES = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sum",
];

export function MonthTooltipContent({
  activity,
  locale,
}: {
  activity: { date: string; value: number };
  locale?: Locale;
}) {
  return (
    <>
      <p className="font-medium">
        {format(
          parseISO(activity.date),
          "PPP",
          locale ? { locale } : undefined
        )}
      </p>
      <p className="text-muted-foreground">
        {activity.value} contribution{activity.value !== 1 ? "s" : ""}
      </p>
    </>
  );
}

export function MonthBinaryTooltipContent({
  activity,
  locale,
  dateFormat = "PPP",
}: {
  activity: { date: string; value: number };
  locale?: Locale;
  dateFormat?: string;
}) {
  return (
    <>
      <p className="font-medium">
        {format(
          parseISO(activity.date),
          dateFormat,
          locale ? { locale } : undefined
        )}
      </p>
      <p className="text-muted-foreground">{activity.value > 0 ? "1" : "0"}</p>
    </>
  );
}

export function WeekTooltipContent({
  activity,
  use12Hour = false,
}: {
  activity: { weekday: number; hour: number; value: number };
  use12Hour?: boolean;
}) {
  const day = WEEKDAY_NAMES[activity.weekday];
  const hour =
    activity.hour === 24 ? "Total" : formatHourRange(activity.hour, use12Hour);
  return (
    <>
      <p className="font-medium">
        {day}, {hour}
      </p>
      <p className="text-muted-foreground">
        {activity.value} contribution{activity.value !== 1 ? "s" : ""}
      </p>
    </>
  );
}

export function DateTooltipContent({
  activity,
  locale,
  dateFormat = "PPP",
  use12Hour = false,
}: {
  activity: { date: string; hour: number; value: number };
  locale?: Locale;
  dateFormat?: string;
  use12Hour?: boolean;
}) {
  const hour =
    activity.hour === 24 ? "Total" : formatHourRange(activity.hour, use12Hour);

  const dateLabel =
    activity.date === "sum"
      ? "Total"
      : format(
          parseISO(activity.date),
          dateFormat,
          locale ? { locale } : undefined
        );

  return (
    <>
      <p className="font-medium">
        {dateLabel}, {hour}
      </p>
      <p className="text-muted-foreground">
        {activity.value} contribution{activity.value !== 1 ? "s" : ""}
      </p>
    </>
  );
}
