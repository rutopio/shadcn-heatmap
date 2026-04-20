import { format, parseISO } from "date-fns";
import type { Locale } from "date-fns";
import type { ReactNode } from "react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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

export const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sum"];

export function MonthTooltipContent({
    activity,
    locale,
}: {
    activity: { date: string; count: number };
    locale?: any;
}) {
    return (
        <>
            <p className="font-medium">
                {format(parseISO(activity.date), "PPP", locale ? { locale } : undefined)}
            </p>
            <p className="text-muted-foreground">
                {activity.count} contribution{activity.count !== 1 ? "s" : ""}
            </p>
        </>
    );
}

export function MonthBinaryTooltipContent({
    activity,
    locale,
    dateFormat = "PPP",
}: {
    activity: { date: string; count: number };
    locale?: Locale;
    dateFormat?: string;
}) {
    return (
        <>
            <p className="font-medium">
                {format(parseISO(activity.date), dateFormat, locale ? { locale } : undefined)}
            </p>
            <p className="text-muted-foreground">
                {activity.count > 0 ? "1" : "0"}
            </p>
        </>
    );
}

export function WeekTooltipContent({
    activity,
}: {
    activity: { weekday: number; hour: number; count: number };
}) {
    const day = WEEKDAY_NAMES[activity.weekday];
    const hour =
        activity.hour === 24
            ? "Total"
            : `${String(activity.hour).padStart(2, "0")}:00`;
    return (
        <>
            <p className="font-medium">
                {day} {hour}
            </p>
            <p className="text-muted-foreground">
                {activity.count} contribution{activity.count !== 1 ? "s" : ""}
            </p>
        </>
    );
}

export function DateTooltipContent({
    activity,
    locale,
    dateFormat = "PPP",
}: {
    activity: { date: string; hour: number; count: number };
    locale?: any;
    dateFormat?: string;
}) {
    const hour =
        activity.hour === 24
            ? "Total"
            : `${String(activity.hour).padStart(2, "0")}:00`;
    return (
        <>
            <p className="font-medium">
                {format(parseISO(activity.date), dateFormat, locale ? { locale } : undefined)} {hour}
            </p>
            <p className="text-muted-foreground">
                {activity.count} contribution{activity.count !== 1 ? "s" : ""}
            </p>
        </>
    );
}
