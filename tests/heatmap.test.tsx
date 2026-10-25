import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { onRequest } from "../functions/_middleware";
import {
  CalendarHeatmap,
  CalendarHeatmapBlock,
  CalendarHeatmapBody,
  CalendarHeatmapStat,
} from "../src/components/heatmap/calendar-heatmap";
import {
  DateHeatmap,
  DateHeatmapBlock,
  DateHeatmapBody,
  DateHeatmapStat,
} from "../src/components/heatmap/date-heatmap";
import {
  StatusHeatmap,
  StatusHeatmapBlock,
  StatusHeatmapBody,
  StatusHeatmapStat,
} from "../src/components/heatmap/status-heatmap";
import {
  WeekdayHeatmap,
  WeekdayHeatmapBlock,
  WeekdayHeatmapBody,
} from "../src/components/heatmap/weekday-heatmap";

const calendarBody = (
  <CalendarHeatmapBody>
    {(props) => <CalendarHeatmapBlock {...props} />}
  </CalendarHeatmapBody>
);
const dateBody = (
  <DateHeatmapBody>
    {(props) => <DateHeatmapBlock {...props} />}
  </DateHeatmapBody>
);
const weekdayBody = (
  <WeekdayHeatmapBody>
    {({ activity }) => <WeekdayHeatmapBlock activity={activity} />}
  </WeekdayHeatmapBody>
);
const statusBody = (
  <StatusHeatmapBody>
    {(props) => <StatusHeatmapBlock {...props} />}
  </StatusHeatmapBody>
);
const render = renderToStaticMarkup;

for (const isNormalized of [false, true]) {
  test(`decimal color range uses the observed maximum (normalized=${isNormalized})`, () => {
    const values = isNormalized ? [-0.8, -0.2] : [0.2, 0.8];
    const data = values.map((value, hour) => ({
      date: `2025-01-0${hour + 1}`,
      hour,
      weekday: hour,
      value,
    }));
    for (const element of [
      <CalendarHeatmap key="Calendar" data={data} isNormalized={isNormalized}>
        {calendarBody}
      </CalendarHeatmap>,
      <DateHeatmap key="Date" data={data} isNormalized={isNormalized}>
        {dateBody}
      </DateHeatmap>,
      <WeekdayHeatmap key="Weekday" data={data} isNormalized={isNormalized}>
        {weekdayBody}
      </WeekdayHeatmap>,
    ])
      assert.match(render(element), /100%, transparent/);
  });
}

test("duplicate slots use the last input for both cells and statistics", () => {
  const data = [
    { date: "2025-01-01", hour: 0, value: 4 },
    { date: "2025-01-01", hour: 0, value: 9 },
  ];
  const html = render(
    <DateHeatmap data={data}>
      {dateBody}
      <DateHeatmapStat />
    </DateHeatmap>,
  );
  assert.match(html, /Contributions: 9/);
  assert.doesNotMatch(html, /Contributions: 13/);
  const statuses = render(
    <StatusHeatmap
      data={[
        { date: "2025-01-01", value: 3 },
        { date: "2025-01-01", value: 1 },
      ]}
    >
      {statusBody}
      <StatusHeatmapStat />
    </StatusHeatmap>,
  );
  assert.match(statuses, /Healthy days: 0/);
});

test("invalid data and scales fail explicitly", () => {
  for (const value of [NaN, Infinity, -Infinity])
    assert.throws(
      () =>
        render(
          <CalendarHeatmap data={[{ date: "2025-01-01", value }]}>
            {calendarBody}
          </CalendarHeatmap>,
        ),
      RangeError,
    );
  for (const date of ["2025-02-30", "2025-1-1", "invalid"])
    assert.throws(
      () =>
        render(
          <StatusHeatmap data={[{ date, value: 3 }]}>
            {statusBody}
          </StatusHeatmap>,
        ),
      RangeError,
    );
  for (const levels of [NaN, Infinity, 0, 1, 2.5])
    assert.throws(
      () =>
        render(
          <DateHeatmap data={[]} levels={levels}>
            {dateBody}
          </DateHeatmap>,
        ),
      RangeError,
    );
  assert.throws(
    () =>
      render(
        <WeekdayHeatmap data={[{ weekday: 7, hour: 0, value: 1 }]}>
          {weekdayBody}
        </WeekdayHeatmap>,
      ),
    RangeError,
  );
  assert.throws(
    () =>
      render(
        <DateHeatmap data={[{ date: "2025-01-01", hour: 24, value: 1 }]}>
          {dateBody}
        </DateHeatmap>,
      ),
    RangeError,
  );
});

test("calendar rows and totals stay within calendar years", () => {
  const data = [
    { date: "2025-01-02", value: 2 },
    { date: "2024-12-30", value: 1 },
  ];
  for (const continuousMonths of [true, false]) {
    const html = render(
      <CalendarHeatmap data={data} continuousMonths={continuousMonths}>
        {calendarBody}
        <CalendarHeatmapStat />
      </CalendarHeatmap>,
    );
    const groups = html.split('<svg role="group"').slice(1);
    assert.equal(groups.length, 2);
    assert.match(groups[0], /heatmap for 2024/);
    assert.doesNotMatch(groups[0], /2025-01/);
    assert.match(groups[1], /2025-01-02/);
    assert.match(html, /Contributions in 2024 to 2025: 3/);
  }
});

test("a single month keeps its label when there is room", () => {
  const html = render(
    <CalendarHeatmap
      data={[
        { date: "2025-01-01", value: 1 },
        { date: "2025-01-31", value: 1 },
      ]}
    >
      {calendarBody}
    </CalendarHeatmap>,
  );
  assert.match(html, />Jan<\/text>/);
});

test("status timelines include missing dates as no data", () => {
  const html = render(
    <StatusHeatmap
      data={[
        { date: "2025-01-01", value: 3 },
        { date: "2025-01-03", value: 3 },
      ]}
    >
      {statusBody}
    </StatusHeatmap>,
  );
  assert.match(html, /2025-01-02: No data/);
});

test("date-only labels remain on the same day across time zones", () => {
  const original = process.env.TZ;
  try {
    for (const zone of ["America/Los_Angeles", "UTC", "Asia/Taipei"]) {
      process.env.TZ = zone;
      assert.match(
        render(
          <DateHeatmap data={[{ date: "2025-01-01", hour: 0, value: 1 }]}>
            {dateBody}
          </DateHeatmap>,
        ),
        /Jan 01, 2025/,
      );
      assert.match(
        render(
          <StatusHeatmap data={[{ date: "2025-01-01", value: 3 }]}>
            {statusBody}
          </StatusHeatmap>,
        ),
        /Jan 1/,
      );
    }
  } finally {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  }
});

test("aggregate fallback marks cells and positions them outside the regular grid", () => {
  const data = [{ date: "2025-01-01", hour: 0, value: 1 }];
  const html = render(
    <DateHeatmap
      data={data}
      extraColumn={{ label: "Sum", compute: () => [1] }}
      extraRow={{ label: "Sum", compute: () => Array<number>(24).fill(1) }}
    >
      {dateBody}
    </DateHeatmap>,
  );
  const rects = [...html.matchAll(/<rect[^>]+/g)].map(([rect]) => rect);
  assert.equal(rects.length, 49);
  assert.notEqual(
    rects[0].match(/ x="([^"]+)"/)?.[1],
    rects[24].match(/ x="([^"]+)"/)?.[1],
  );
  assert.notEqual(
    rects[0].match(/ y="([^"]+)"/)?.[1],
    rects[25].match(/ y="([^"]+)"/)?.[1],
  );
  assert.throws(
    () =>
      render(
        <DateHeatmap
          data={data}
          extraRow={{ label: "Bad", compute: () => [1] }}
        >
          {dateBody}
        </DateHeatmap>,
      ),
    RangeError,
  );
  assert.throws(
    () =>
      render(
        <DateHeatmap
          data={data}
          extraColumn={{ label: "Bad", compute: () => [NaN] }}
        >
          {dateBody}
        </DateHeatmap>,
      ),
    RangeError,
  );
});

test("emptyState preserves a numeric zero", () => {
  assert.equal(
    render(
      <CalendarHeatmap data={[]} emptyState={0}>
        {calendarBody}
      </CalendarHeatmap>,
    ),
    "0",
  );
});

test("Pages redirects cannot change the destination host", async () => {
  for (const path of ["//example.org/path?x=1", "/calendar?x=1"]) {
    const response = await onRequest({
      request: new Request(`https://preview.pages.dev${path}`),
      next: async () => new Response("next"),
    } as Parameters<typeof onRequest>[0]);
    const location = new URL(response.headers.get("location") ?? "");
    assert.equal(location.origin, "https://heatmap.chingru.com");
    assert.equal(location.pathname + location.search, path);
  }
});

test("median averages the two middle values without changing input", async () => {
  const { median } = await import("../src/lib/statistics");
  const values = [8, 2, 4, 6];
  assert.equal(median(values), 5);
  assert.deepEqual(values, [8, 2, 4, 6]);
  assert.equal(median([7, 2, 3]), 3);
  assert.equal(median([]), 0);
});
