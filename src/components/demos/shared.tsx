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

export const generateWeekdayNames = (locale?: Locale): string[] =>
  Array.from({ length: 7 }, (_, i) =>
    format(new Date(2000, 0, 2 + i), "EEEE", locale ? { locale } : undefined)
  );

export const WEEKDAY_NAMES = generateWeekdayNames();

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
  extra,
  use12Hour = false,
  locale,
  avgLabel = "Avg",
  avgPrefix = "avg. ",
}: {
  activity: { weekday: number; hour: number; value: number };
  extra?: "row" | "column";
  use12Hour?: boolean;
  locale?: Locale;
  avgLabel?: string;
  avgPrefix?: string;
}) {
  const names = generateWeekdayNames(locale);
  const day = extra === "row" ? avgLabel : names[activity.weekday];
  const hour =
    extra === "column" ? avgLabel : formatHourRange(activity.hour, use12Hour);
  const isAvg = extra !== undefined;
  return (
    <>
      <p className="font-medium">
        {day}, {hour}
      </p>
      <p className="text-muted-foreground">
        {isAvg ? avgPrefix : ""}
        {activity.value.toFixed(1)} °C
      </p>
    </>
  );
}

export function DateTooltipContent({
  activity,
  extra,
  locale,
  dateFormat = "PPP",
  use12Hour = false,
}: {
  activity: { date: string; hour: number; value: number };
  extra?: "row" | "column";
  locale?: Locale;
  dateFormat?: string;
  use12Hour?: boolean;
}) {
  const hour =
    extra === "column" ? "Total" : formatHourRange(activity.hour, use12Hour);

  const dateLabel =
    extra === "row"
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
      <p className="text-muted-foreground">{activity.value.toFixed(1)} mm</p>
    </>
  );
}
