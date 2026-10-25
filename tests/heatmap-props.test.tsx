import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement, type ElementType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as calendar from "../src/components/heatmap/calendar-heatmap";
import * as date from "../src/components/heatmap/date-heatmap";
import * as status from "../src/components/heatmap/status-heatmap";
import * as weekday from "../src/components/heatmap/weekday-heatmap";

const fixtures = [
  {
    name: "Calendar",
    Root: calendar.CalendarHeatmap,
    Body: calendar.CalendarHeatmapBody,
    Block: calendar.CalendarHeatmapBlock,
    Stat: calendar.CalendarHeatmapStat,
    Legend: calendar.CalendarHeatmapLegend,
  },
  {
    name: "Date",
    Root: date.DateHeatmap,
    Body: date.DateHeatmapBody,
    Block: date.DateHeatmapBlock,
    Stat: date.DateHeatmapStat,
    Legend: date.DateHeatmapLegend,
  },
  {
    name: "Weekday",
    Root: weekday.WeekdayHeatmap,
    Body: weekday.WeekdayHeatmapBody,
    Block: weekday.WeekdayHeatmapBlock,
    Stat: weekday.WeekdayHeatmapStat,
    Legend: weekday.WeekdayHeatmapLegend,
  },
  {
    name: "Status",
    Root: status.StatusHeatmap,
    Body: status.StatusHeatmapBody,
    Block: status.StatusHeatmapBlock,
    Stat: status.StatusHeatmapStat,
    Legend: status.StatusHeatmapLegend,
  },
];
type Fixture = (typeof fixtures)[number];
const dataFor = (values = [1]) =>
  values.map((value, hour) => ({
    date: `2025-01-${String(hour + 1).padStart(2, "0")}`,
    weekday: 0,
    hour,
    value,
  }));
// Allow invalid JavaScript inputs so these tests exercise runtime validation.
const element = (component: ElementType, props: Record<string, unknown>) =>
  createElement(component, props);
function render(
  fixture: Fixture,
  props: Record<string, unknown> = {},
  part: "Body" | "Stat" | "Legend" = "Body",
  partProps: Record<string, unknown> = {},
  blockProps: Record<string, unknown> = {},
) {
  return renderToStaticMarkup(
    element(fixture.Root, {
      data: dataFor(),
      ...props,
      children: element(
        fixture[part],
        part === "Body"
          ? {
              children: (args: Record<string, unknown>) =>
                element(fixture.Block, { ...args, ...blockProps }),
              ...partProps,
            }
          : partProps,
      ),
    }),
  );
}
const rects = (html: string) =>
  [...html.matchAll(/<rect\b[^>]+/g)].map(([rect]) => rect);
const attribute = (html: string, name: string) =>
  html.match(new RegExp(`${name}="([^"]*)"`))?.[1];

for (const fixture of fixtures) {
  test(`${fixture.name}: layout props reject invalid numbers and preserve valid zero gaps`, () => {
    for (const prop of [
      "blockSize",
      "blockAspectRatio",
      "fontSize",
      "blockMargin",
      "blockRadius",
    ]) {
      const positive = ["blockSize", "blockAspectRatio", "fontSize"].includes(
        prop,
      );
      for (const value of [
        -1,
        NaN,
        Infinity,
        -Infinity,
        "12",
        null,
        ...(positive ? [0] : []),
      ]) {
        assert.throws(
          () => render(fixture, { [prop]: value }),
          RangeError,
          `${prop}=${String(value)}`,
        );
      }
    }
    const html = render(fixture, {
      blockSize: 0.5,
      blockAspectRatio: 0.5,
      fontSize: 0.5,
      blockMargin: 0,
      blockRadius: 0,
    });
    assert.equal(attribute(rects(html)[0], "width"), "0.25");
    assert.equal(attribute(rects(html)[0], "rx"), "0");
    assert.throws(
      () => render(fixture, { blockAspectRatio: Number.MAX_VALUE }),
      RangeError,
    );
  });

  test(`${fixture.name}: data and Stat results reject non-finite values`, () => {
    for (const value of [NaN, Infinity, -Infinity, "1", null, undefined]) {
      assert.throws(
        () => render(fixture, { data: [{ ...dataFor()[0], value }] }),
        RangeError,
      );
    }
    for (const value of [NaN, Infinity, -Infinity, null, undefined]) {
      assert.throws(
        () => render(fixture, {}, "Stat", { compute: () => value }),
        RangeError,
      );
    }
    assert.match(
      render(fixture, {}, "Stat", {
        compute: () => -2,
        label: "Result: {{value}}",
      }),
      /Result: -2/,
    );
  });

  test(`${fixture.name}: templates replace repeated tokens and preserve replacement text`, () => {
    assert.match(
      render(fixture, {}, "Stat", {
        compute: () => "$&",
        label: "{{value}} + {{value}}",
      }),
      /\$&amp; \+ \$&amp;/,
    );
    const token = fixture.name === "Status" ? "status" : "value";
    const html = render(fixture, {
      labels: { cellLabel: `{{${token}}} + {{${token}}}` },
    });
    assert.equal(
      attribute(rects(html)[0], "aria-label"),
      fixture.name === "Status" ? "Critical + Critical" : "1 + 1",
    );
  });

  test(`${fixture.name}: empty data returns the configured empty state`, () => {
    assert.equal(render(fixture, { data: [], emptyState: 0 }), "0");
    assert.equal(render(fixture, { data: [] }), "");
  });

  if (fixture.name === "Status") continue;

  test(`${fixture.name}: numeric totals fail on overflow and allow signed overrides`, () => {
    for (const totalCount of [NaN, Infinity, -Infinity, "1", null]) {
      assert.throws(() => render(fixture, { totalCount }, "Stat"), RangeError);
    }
    assert.throws(
      () =>
        render(
          fixture,
          { data: dataFor([Number.MAX_VALUE, Number.MAX_VALUE]) },
          "Stat",
        ),
      RangeError,
    );
    assert.match(render(fixture, { totalCount: -7 }, "Stat"), /: -7</);
    assert.match(render(fixture, { totalCount: 0 }, "Stat"), /: 0</);
    assert.match(
      render(fixture, { totalCount: 99 }, "Stat", { compute: () => 7 }),
      /: 7</,
    );
  });

  test(`${fixture.name}: normalized finite extremes keep valid colors and endpoint levels`, () => {
    const html = render(fixture, {
      data: dataFor([-Number.MAX_VALUE, Number.MAX_VALUE]),
      isNormalized: true,
    });
    const cells = rects(html).filter(
      (cell) => attribute(cell, "data-value") !== "0",
    );
    assert.deepEqual(
      cells.map((cell) => attribute(cell, "data-level")),
      ["1", "5"],
    );
    assert.doesNotMatch(html, /NaN|Infinity/);
  });

  test(`${fixture.name}: signed, constant and single-step scales follow the documented contract`, () => {
    for (const isNormalized of [false, true]) {
      const cells = rects(
        render(fixture, { data: dataFor([-2, -1]), isNormalized }),
      ).filter((cell) => attribute(cell, "data-value") !== "0");
      assert.deepEqual(
        cells.map((cell) => attribute(cell, "data-level")),
        isNormalized ? ["1", "5"] : ["0", "0"],
      );
    }
    const constant = rects(
      render(fixture, { data: dataFor([-2, -2]), isNormalized: true }),
    ).filter((cell) => attribute(cell, "data-value") !== "0");
    assert.deepEqual(
      constant.map((cell) => attribute(cell, "data-level")),
      ["1", "1"],
    );
    for (const [levels, isNormalized] of [
      [2, false],
      [1, true],
    ] as const) {
      assert.match(
        rects(render(fixture, { levels, isNormalized }))[0],
        /100%, transparent/,
      );
    }
    const highlightedEmpty = rects(
      render(
        fixture,
        { data: dataFor([0]) },
        "Body",
        {},
        { highlighted: true },
      ),
    )[0];
    assert.match(highlightedEmpty, /fill:var\(--color-secondary\)/);
  });

  test(`${fixture.name}: labels for SVG and legend support repeated placeholders`, () => {
    const labels = {
      heatmapLabel: "Grid {{year}} {{year}}",
      legendLabel: "Scale",
      legendLevelLabel: "{{level}} / {{level}}",
    };
    const html = render(fixture, { labels });
    assert.match(
      html,
      fixture.name === "Calendar"
        ? /aria-label="Grid 2025 2025"/
        : /aria-label="Grid \{\{year\}\} \{\{year\}\}"/,
    );
    const legend = render(fixture, { labels }, "Legend");
    assert.match(legend, /aria-label="Scale"/);
    assert.match(legend, /aria-label="0 \/ 0"/);
  });
}

for (const fixture of fixtures.filter((item) =>
  ["Date", "Weekday"].includes(item.name),
)) {
  test(`${fixture.name}: aggregates reject holes, invalid values and wrong lengths`, () => {
    for (const [prop, length] of [
      ["extraRow", 24],
      ["extraColumn", fixture.name === "Date" ? 1 : 7],
    ] as const) {
      for (const values of [
        Array(length),
        Array(length - 1).fill(1),
        [NaN, ...Array(length - 1).fill(1)],
        ["1", ...Array(length - 1).fill(1)],
        null,
      ]) {
        assert.throws(
          () =>
            render(fixture, {
              [prop]: { label: "Sum", compute: () => values },
            }),
          RangeError,
        );
      }
      assert.equal(
        render(fixture, {
          data: [],
          emptyState: "Empty",
          [prop]: {
            label: "Sum",
            compute: () => {
              throw new Error("Must not run");
            },
          },
        }),
        "Empty",
      );
    }
  });

  test(`${fixture.name}: aggregates have independent scales and signed extremes remain finite`, () => {
    for (const isNormalized of [false, true]) {
      const html = render(fixture, {
        isNormalized,
        extraRow: { label: "Sum", compute: () => [10, ...Array(23).fill(20)] },
      });
      const cell = rects(html).find((rect) =>
        /data-(date|weekday)="extra"/.test(rect),
      );
      assert.ok(cell);
      assert.equal(attribute(cell, "data-level"), isNormalized ? "1" : "2");
    }
    const html = render(fixture, {
      isNormalized: true,
      extraRow: {
        label: "Sum",
        compute: () => [-Number.MAX_VALUE, ...Array(23).fill(Number.MAX_VALUE)],
      },
    });
    assert.doesNotMatch(html, /NaN|Infinity/);
  });

  test(`${fixture.name}: callbacks get deduplicated inputs without filled or aggregate cells`, () => {
    const rows = dataFor([2]);
    rows.push({ ...rows[0], value: 4 });
    let seen: unknown;
    const html = render(fixture, {
      data: rows,
      extraRow: {
        label: "Sum",
        compute: (data: unknown) => {
          seen = data;
          return Array(24).fill(1);
        },
      },
    });
    assert.deepEqual(seen, [rows[1]]);
    assert.ok(rects(html).length > 24);
    assert.match(
      render(fixture, { data: rows }, "Stat", {
        compute: (data: unknown[]) => data.length,
        label: "Records: {{value}}",
      }),
      /Records: 1/,
    );
  });
}

const statusFixture = fixtures[3];
test("Status: legend overrides fall back per status and local aliases beat root numeric labels", () => {
  const html = render(
    statusFixture,
    { labels: { statuses: { 1: "Root critical", 3: "Root healthy" } } },
    "Legend",
    { labels: { healthy: "Local healthy" } },
  );
  assert.match(html, />Root critical</);
  assert.match(html, />Local healthy</);
  assert.doesNotMatch(html, />Root healthy</);
  assert.match(html, />Degraded</);
  assert.match(
    render(
      statusFixture,
      { labels: { statuses: { healthy: "Root healthy" } } },
      "Legend",
      { labels: { 3: "Local numeric" } },
    ),
    />Local numeric</,
  );
});

test("Status: legend codes and healthyValue require finite numbers, with unique legend entries", () => {
  for (const statusValues of [
    [NaN],
    [Infinity],
    [1, 1],
    ["1"],
    Array(1),
    null,
  ]) {
    assert.throws(
      () => render(statusFixture, { statusValues }, "Legend"),
      RangeError,
    );
  }
  for (const healthyValue of [NaN, Infinity, "3", null]) {
    assert.throws(
      () => render(statusFixture, { healthyValue }, "Stat"),
      RangeError,
    );
  }
  const html = render(statusFixture, {
    data: dataFor([-1.5]),
    healthyValue: -1.5,
    statusValues: [-1.5],
    colors: { [-1.5]: "blue" },
    labels: { statuses: { [-1.5]: "Custom" } },
  });
  assert.match(html, /fill:blue/);
  assert.match(html, /Custom/);
  assert.match(
    render(
      statusFixture,
      { data: dataFor([-1.5]), healthyValue: -1.5 },
      "Stat",
    ),
    /Healthy days: 1/,
  );
  assert.equal(
    rects(render(statusFixture, { statusValues: [] }, "Legend")).length,
    0,
  );
});

test("Status: date intervals require positive integers and retain both endpoints", () => {
  for (const labelInterval of [0, -1, 1.5, NaN, Infinity, "2", null]) {
    assert.throws(
      () => render(statusFixture, {}, "Body", { labelInterval }),
      RangeError,
    );
  }
  const data = [dataFor()[0], { date: "2025-01-04", value: 3 }];
  const html = render(statusFixture, { data }, "Body", { labelInterval: 2 });
  assert.deepEqual(
    [...html.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map(
      (match) => match[1],
    ),
    ["Jan 1", "Jan 3", "Jan 4"],
  );
  assert.doesNotMatch(
    render(statusFixture, { data }, "Body", { hideDateLabels: true }),
    /<text\b/,
  );
});

test("Status: filled days remain absent from custom statistics", () => {
  const data = [
    { date: "2025-01-01", value: 0 },
    { date: "2025-01-03", value: 3 },
  ];
  assert.equal(rects(render(statusFixture, { data })).length, 3);
  assert.match(
    render(statusFixture, { data, healthyValue: 0 }, "Stat"),
    /Healthy days: 1/,
  );
});

test("Date: missing whole dates are not added and negative peaks remain negative", () => {
  const fixture = fixtures[1];
  const data = [
    { date: "2025-01-01", hour: 0, value: -5 },
    { date: "2025-01-03", hour: 0, value: -2 },
  ];
  assert.equal(rects(render(fixture, { data })).length, 48);
  assert.match(
    render(fixture, { data }, "Stat", {
      compute: (rows: date.DateHourlyActivity[]) =>
        rows.reduce((max, item) => Math.max(max, item.value), -Infinity),
      label: "Peak: {{value}}",
    }),
    /Peak: -2/,
  );
});

test("Calendar: per-year totals also reject overflow when totalCount is overridden", () => {
  const fixture = fixtures[0];
  assert.throws(
    () =>
      render(fixture, {
        data: dataFor([Number.MAX_VALUE, Number.MAX_VALUE]),
        totalCount: 0,
      }),
    RangeError,
  );
});
