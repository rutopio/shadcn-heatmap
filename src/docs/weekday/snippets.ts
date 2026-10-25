export const weekdaySampleData = `
// type WeekdayHourlyActivity = { weekday: number; hour: number; value: number }
//   weekday: 0 to 6 (Sunday to Saturday)
//   hour:    0 to 23
//   value:   average temperature in °C

const data: WeekdayHourlyActivity[] = [
  { weekday: 0, hour: 0, value: 10.2 }, // Sun 00:00
  { weekday: 1, hour: 9, value: 16.3 }, // Mon 09:00
  { weekday: 1, hour: 14, value: 22.1 }, // Mon 14:00
  { weekday: 5, hour: 14, value: 21.8 }, // Fri 14:00
  // ...
];
`;
export { default as weekdayBasicCode } from "@/examples/weekday.tsx?raw";
