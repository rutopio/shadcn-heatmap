export const binaryCalendarHighlightLines = [2, 4, 5, 10, 20];
export const binaryCalendarCode = `
// Binary data: value is strictly 0 (missed) or 1 (done)
const data = [
  { date: "2025-01-01", value: 1 },
  { date: "2025-01-02", value: 0 },
  // ... one entry per day
];

<TooltipProvider delayDuration={80} skipDelayDuration={0}>
  <CalendarHeatmap data={data} levels={2}>
    <CalendarHeatmapBody>
      {({ activity, dayIndex, weekIndex }) => <Tooltip>{/* ... */}</Tooltip>}
    </CalendarHeatmapBody>
    <CalendarHeatmapFooter>
      <CalendarHeatmapStat />
      <CalendarHeatmapLegend labels={{ less: "Missed", more: "Done" }} />
    </CalendarHeatmapFooter>
  </CalendarHeatmap>
</TooltipProvider>
`;

export const binaryWeekdayHighlightLines = [1, 3, 4, 9, 18];
export const binaryWeekdayCode = `
// Binary data: value is strictly 0 (free) or 1 (has meeting)
const data = [
  { weekday: 1, hour: 9, value: 1 },
  { weekday: 1, hour: 10, value: 1 },
  // ...
];

<TooltipProvider delayDuration={80} skipDelayDuration={0}>
  <WeekdayHeatmap data={data} levels={2}>
    <WeekdayHeatmapBody>
      {({ activity }) => <Tooltip>{/* ... */}</Tooltip>}
    </WeekdayHeatmapBody>
    <WeekdayHeatmapFooter>
      <WeekdayHeatmapLegend labels={{ less: "Free", more: "Meeting" }} />
    </WeekdayHeatmapFooter>
  </WeekdayHeatmap>
</TooltipProvider>
`;

export const binaryDateHighlightLines = [1, 3, 4, 5, 10, 19];
export const binaryDateCode = `
// Binary data: value is strictly 0 (down) or 1 (up)
const data = [
  { date: "2025-12-01", hour: 0, value: 1 },
  { date: "2025-12-01", hour: 1, value: 1 },
  { date: "2025-12-03", hour: 2, value: 0 },
  // ...
];

<TooltipProvider delayDuration={80} skipDelayDuration={0}>
  <DateHeatmap data={data} levels={2}>
    <DateHeatmapBody>
      {({ activity, dateIndex }) => <Tooltip>{/* ... */}</Tooltip>}
    </DateHeatmapBody>
    <DateHeatmapFooter>
      <DateHeatmapLegend labels={{ less: "Down", more: "Up" }} />
    </DateHeatmapFooter>
  </DateHeatmap>
</TooltipProvider>
`;

export const binarySampleData = `
// All three components accept the same data shapes as their regular counterparts.
// The only difference is that values are strictly 0 or 1.

// CalendarHeatmap binary: { date: string; value: 0 | 1 }
const calendarData = [
  { date: "2025-01-01", value: 1 }, // done
  { date: "2025-01-02", value: 0 }, // missed
  // ...
];

// WeekdayHeatmap binary: { weekday: number; hour: number; value: 0 | 1 }
const weekdayData = [
  { weekday: 1, hour: 9, value: 1 }, // Mon 09:00 — meeting
  { weekday: 1, hour: 11, value: 0 }, // Mon 11:00 — free
  // ...
];

// DateHeatmap binary: { date: string; hour: number; value: 0 | 1 }
const dateData = [
  { date: "2025-12-01", hour: 0, value: 1 }, // up
  { date: "2025-12-03", hour: 2, value: 0 }, // down (maintenance)
  // ...
]
`;
