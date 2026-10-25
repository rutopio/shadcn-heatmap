export const dateSampleData = `
// type DateHourlyActivity = { date: string; hour: number; value: number }
//   date:  "YYYY-MM-DD"
//   hour:  0 to 23
//   value: rainfall in mm

const data: DateHourlyActivity[] = [
  { date: "2025-12-11", hour: 13, value: 8.4 },
  { date: "2025-12-11", hour: 14, value: 22.7 },
  { date: "2025-12-11", hour: 15, value: 15.3 },
  { date: "2025-12-12", hour: 14, value: 5.1 },
  // ...
];
`;
export { default as dateBasicCode } from "@/examples/date.tsx?raw";
