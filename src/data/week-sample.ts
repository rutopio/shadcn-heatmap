import { createRng, weightedHour } from "./rng";

import type { HeatmapActivity } from "@/components/heatmap/weekday-heatmap";

/**
 * 7 weekdays x 24 hours + "Sum" row and "Sum" column.
 * - weekday 0..6 = Sun..Sat
 * - weekday 7     = hourly sum row (aggregated across all weekdays)
 * - hour    0..23
 * - hour    24    = daily sum column (aggregated across all hours)
 */
export function generateWeekSample(seed: number = 17): HeatmapActivity[] {
  const rng = createRng(seed);
  const matrix: HeatmapActivity[] = [];

  // Fill regular 7x24 cells.
  const regular: Record<string, number> = {};
  for (let weekday = 0; weekday < 7; weekday++) {
    for (let hour = 0; hour < 24; hour++) {
      const weekend = weekday === 0 || weekday === 6;
      const weight = weightedHour(rng, hour) * (weekend ? 0.35 : 1);
      const value = Math.round(weight * 8);
      regular[`${weekday}-${hour}`] = value;
      if (value > 0) {
        matrix.push({ weekday, hour, value });
      }
    }
  }

  // Daily sum (hour = 24) per weekday.
  for (let weekday = 0; weekday < 7; weekday++) {
    let sum = 0;
    for (let hour = 0; hour < 24; hour++) {
      sum += regular[`${weekday}-${hour}`] ?? 0;
    }
    matrix.push({ weekday, hour: 24, value: sum });
  }

  // Hourly sum (weekday = 7) per hour of day.
  for (let hour = 0; hour < 24; hour++) {
    let sum = 0;
    for (let weekday = 0; weekday < 7; weekday++) {
      sum += regular[`${weekday}-${hour}`] ?? 0;
    }
    matrix.push({ weekday: 7, hour, value: sum });
  }

  return matrix;
}
