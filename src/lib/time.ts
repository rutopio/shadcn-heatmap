import { format } from "date-fns";

import type { Locale } from "date-fns";

type DateFormat = "MMM-dd-yyyy" | "yyyy-MMM-dd" | "dd-MMM-yyyy";

/**
 * Format date without weekday.
 * @example formatDate(new Date("2025-12-24"), "MMM-dd-yyyy") → "Dec 24, 2025"
 */
export function formatDate(
  date: Date | string,
  dateFormat: string = "MMM-dd-yyyy",
  locale?: Locale
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.toLocaleDateString(locale ? locale.code : "en-US", {
    month: "short",
  });
  const day = d.getDate();

  switch (dateFormat as DateFormat) {
    case "yyyy-MMM-dd":
      return `${year} ${month} ${day}`;
    case "dd-MMM-yyyy":
      return `${day} ${month} ${year}`;
    case "MMM-dd-yyyy":
    default:
      return `${month} ${day}, ${year}`;
  }
}

/**
 * Format date with weekday prefix, day padded to 2 chars for monospace alignment.
 * Uses date-fns for locale support.
 * @example formatDateWithWeekday(new Date("2025-12-24")) → "Wed, Dec 24, 2025"
 */
export function formatDateWithWeekday(
  date: Date | string,
  dateFormat: string = "EEE, MMM dd, yyyy",
  locale?: Locale
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, dateFormat, locale ? { locale } : undefined);
}

/**
 * Format hour range for tooltip display.
 * @param hour - Hour (0-23)
 * @param use12Hour - Whether to use 12-hour format
 * @example formatHourRange(3, false) → "03:00-04:00"
 * @example formatHourRange(3, true) → "3:00 AM-4:00 AM"
 * @example formatHourRange(15, true) → "3:00 PM-4:00 PM"
 */
export function formatHourRange(
  hour: number,
  use12Hour: boolean = false
): string {
  if (hour < 0 || hour > 23) {
    throw new RangeError(`Hour must be between 0 and 23, got ${hour}`);
  }

  const nextHour = (hour + 1) % 24;

  if (use12Hour) {
    const formatHour12 = (h: number) => {
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const period = h < 12 ? "AM" : "PM";
      return `${hour12}:00 ${period}`;
    };
    return `${formatHour12(hour)}-${formatHour12(nextHour)}`;
  }

  return `${String(hour).padStart(2, "0")}:00-${String(nextHour).padStart(2, "0")}:00`;
}
