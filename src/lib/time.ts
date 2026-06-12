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
  use12Hour: boolean = false,
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
