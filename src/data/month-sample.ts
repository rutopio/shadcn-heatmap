import type { Activity } from "@/components/heatmap/calendar-heatmap";

import { createRng } from "./rng";

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * One full year of daily activity, deterministic by seed. Weekends lighter,
 * weekdays busier, with a few sparse cold-streak days for realism.
 */
export function generateMonthSample(
  seed: number = 42,
  year: number = 2025,
): Activity[] {
  const rng = createRng(seed);
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  const activities: Activity[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const weekday = d.getDay(); // 0=Sun..6=Sat
    const isWeekend = weekday === 0 || weekday === 6;

    const baseRoll = rng();
    let value = 0;
    if (baseRoll < 0.12) {
      value = 0; // cold day
    } else if (isWeekend) {
      value = Math.round(rng() * 6);
    } else {
      value = Math.round(4 + rng() * 26);
    }

    activities.push({ date: formatDate(new Date(d)), value });
  }

  return activities;
}

/**
 * Two-year sample for showing the multi-year row behaviour.
 */
export function generateMultiYearSample(seed: number = 7): Activity[] {
  return [
    ...generateMonthSample(seed, 2024),
    ...generateMonthSample(seed + 1, 2025),
  ];
}
