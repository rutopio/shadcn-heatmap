import { createRng } from "./rng";

import type {
  StatusActivity,
  StatusValue,
} from "@/components/heatmap/status-heatmap";

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Generate status data for N days (e.g., 90 days for Statuspage-style)
 * Status values: 0 = no-data, 1 = error, 2 = warning, 3 = normal
 */
export function generateStatusSample(
  seed: number = 42,
  days: number = 90
): StatusActivity[] {
  const rng = createRng(seed);
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);

  const activities: StatusActivity[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const roll = rng();
    let value: StatusValue;

    // Simulate different status levels
    if (roll < 0.01) {
      value = 0; // No data (1%)
    } else if (roll < 0.03) {
      value = 1; // Error (2%)
    } else if (roll < 0.08) {
      value = 2; // Warning (5%)
    } else {
      value = 3; // Normal (92%)
    }

    activities.push({ date: formatDate(new Date(d)), value });
  }

  return activities;
}
