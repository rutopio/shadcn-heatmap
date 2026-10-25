const SITE_URL = "https://heatmap.chingru.com";
export const SITE_NAME = "shadcn-heatmap";
export const SITE_TITLE =
  "shadcn-heatmap: Heatmap components for React, built for shadcn/ui";
export const SITE_DESCRIPTION =
  "Four heatmap components for React: calendar, weekday, date, and status. Built on SVG and Tailwind v4 tokens. Copy the source, own it entirely.";
// Site-wide default OG image; the calendar image doubles as the default for
// pages without a route-specific one (home, install, binary).
export const OG_IMAGE = `${SITE_URL}/og-calendar.png`;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  // Relative to the canonical site URL.
  image?: string;
};

export function pageHead({ title, description, path, image }: PageMeta) {
  const url = new URL(path, SITE_URL).toString();
  const meta = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  const imageUrl = image ? new URL(image, SITE_URL).toString() : OG_IMAGE;
  meta.push(
    { property: "og:image", content: imageUrl },
    { name: "twitter:image", content: imageUrl },
  );
  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}

export const PAGE_META = {
  home: { title: SITE_TITLE, description: SITE_DESCRIPTION, path: "/" },
  calendar: {
    title: "CalendarHeatmap: shadcn-heatmap",
    description:
      "GitHub-style yearly contribution calendar for React. Supports multiple years, a Monday start, custom colors, and tooltips.",
    path: "/calendar",
    image: "/og-calendar.png",
  },
  weekday: {
    title: "WeekdayHeatmap: shadcn-heatmap",
    description:
      "Weekday × hour-of-day activity grid for React. Optional aggregate rows and columns, independent min-max scaling, tooltips, and full i18n support.",
    path: "/weekday",
    image: "/og-weekday.png",
  },
  date: {
    title: "DateHeatmap: shadcn-heatmap",
    description:
      "Date × hour activity grid for React. One row per date, with optional aggregate rows and columns for hourly data.",
    path: "/date",
    image: "/og-date.png",
  },
  status: {
    title: "StatusHeatmap: shadcn-heatmap",
    description:
      "Atlassian-style status timeline for React. Vertical bars show daily uptime across a period, with healthy-day counts, custom colors, and legends.",
    path: "/status",
    image: "/og-status.png",
  },
  install: {
    title: "Install: shadcn-heatmap",
    description:
      "Install shadcn-heatmap components via the shadcn CLI or copy manually. Includes runtime dependencies, theme tokens, and the cn helper.",
    path: "/install",
  },
  binary: {
    title: "Binary mode: shadcn-heatmap",
    description:
      "Use CalendarHeatmap, WeekdayHeatmap, or DateHeatmap with levels={2} for active or inactive states. Ideal for habit trackers, meeting schedules, and uptime dashboards.",
    path: "/binary",
  },
} satisfies Record<string, PageMeta>;
