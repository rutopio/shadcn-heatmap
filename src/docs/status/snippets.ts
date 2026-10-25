export const statusSampleData = `
// type StatusActivity = { date: string; value: 0 | 1 | 2 | 3 }
//   date: YYYY-MM-DD format
//   value: 0 = no-data (secondary)
//          1 = critical (red)
//          2 = degraded (orange)
//          3 = healthy (green)

const data: StatusActivity[] = [
  { date: "2025-01-01", value: 3 }, // Healthy
  { date: "2025-01-02", value: 3 }, // Healthy
  { date: "2025-01-03", value: 2 }, // Degraded
  { date: "2025-01-04", value: 1 }, // Critical
  { date: "2025-01-05", value: 0 }, // No data
  // ... more days
];
`;
export { default as statusBasicCode } from "@/examples/status.tsx?raw";
