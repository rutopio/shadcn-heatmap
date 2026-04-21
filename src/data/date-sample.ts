import { createRng, weightedHour } from "./rng";

import type { DateHourlyActivity } from "@/components/heatmap/date-heatmap";

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * N consecutive days x 24 hours + daily Sum column (hour = 24) + hourly Sum row (date = "sum").
 * Default 14 days ending 2025-12-24 for a deterministic snapshot.
 */
export function generateDateSample(
  seed: number = 31,
  days: number = 14,
  endDate: Date = new Date(2025, 11, 24)
): DateHourlyActivity[] {
  const rng = createRng(seed);
  const result: DateHourlyActivity[] = [];

  const start = new Date(endDate);
  start.setDate(endDate.getDate() - (days - 1));

  const hourlySums: number[] = Array(24).fill(0);

  for (let i = 0; i < days; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    const dateStr = formatDate(current);
    const isWeekend = current.getDay() === 0 || current.getDay() === 6;

    const rowRaw: number[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const weight = weightedHour(rng, hour) * (isWeekend ? 0.4 : 1);
      const value = Math.round(weight * 8);
      rowRaw.push(value);
      hourlySums[hour] += value;
      if (value > 0) {
        result.push({ date: dateStr, hour, value });
      }
    }

    const sum = rowRaw.reduce((a, b) => a + b, 0);
    result.push({ date: dateStr, hour: 24, value: sum });
  }

  // Add hourly sum row
  for (let hour = 0; hour < 24; hour++) {
    if (hourlySums[hour] > 0) {
      result.push({ date: "sum", hour, value: hourlySums[hour] });
    }
  }

  return result;
}
