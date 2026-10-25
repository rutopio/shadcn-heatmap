import type { Locale } from "date-fns";
import { format, parseISO } from "date-fns";
import type { ReactElement, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatHourRange } from "@/lib/time";

export { TooltipProvider };

export function HeatmapTooltip({
  content,
  children,
  enabled = true,
}: {
  content: ReactNode;
  children: ReactElement;
  enabled?: boolean;
}) {
  if (!enabled) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger tabIndex={0} render={children} />
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

const weekdayNameCache = new WeakMap<Locale, string[]>();
export const generateWeekdayNames = (locale?: Locale): string[] => {
  if (locale && weekdayNameCache.has(locale))
    return weekdayNameCache.get(locale) as string[];
  const names = Array.from({ length: 7 }, (_, i) =>
    format(new Date(2000, 0, 2 + i), "EEEE", locale ? { locale } : undefined),
  );

  if (locale) weekdayNameCache.set(locale, names);
  return names;
};

export const WEEKDAY_NAMES = generateWeekdayNames();

export function WeekTooltipContent({
  activity,
  extra,
  use12Hour = false,
  locale,
  aggregateLabel = "Avg",
  aggregatePrefix = "avg. ",
}: {
  activity: { weekday: number; hour: number; value: number };
  extra?: "row" | "column";
  use12Hour?: boolean;
  locale?: Locale;
  aggregateLabel?: string;
  aggregatePrefix?: string;
}) {
  const names = locale ? generateWeekdayNames(locale) : WEEKDAY_NAMES;
  const day = extra === "row" ? aggregateLabel : names[activity.weekday];
  const hour =
    extra === "column"
      ? aggregateLabel
      : formatHourRange(activity.hour, use12Hour);
  const isAggregate = extra !== undefined;
  return (
    <>
      <p className="font-medium">
        {day}, {hour}
      </p>
      <p className="text-muted-foreground">
        {isAggregate ? aggregatePrefix : ""}
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
  aggregateLabel = "Total",
  use12Hour = false,
}: {
  activity: { date: string; hour: number; value: number };
  extra?: "row" | "column";
  locale?: Locale;
  dateFormat?: string;
  aggregateLabel?: string;
  use12Hour?: boolean;
}) {
  const hour =
    extra === "column"
      ? aggregateLabel
      : formatHourRange(activity.hour, use12Hour);

  const dateLabel =
    extra === "row"
      ? aggregateLabel
      : format(
          parseISO(activity.date),
          dateFormat,
          locale ? { locale } : undefined,
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
