const SITE_URL = "https://shadcn-heatmap.pages.dev";
export const SITE_NAME = "shadcn-heatmap";
export const SITE_TITLE =
  "shadcn-heatmap — Heatmap components for React, built for shadcn/ui";
export const SITE_DESCRIPTION =
  "Four heatmap components for React: calendar, weekday, date, and status. Built on SVG and Tailwind v4 tokens. Copy the source, own it entirely.";
// Site-wide default OG image; the calendar image doubles as the default for
// pages without a route-specific one (home, install, binary).
export const OG_IMAGE = `${SITE_URL}/og-calendar.png`;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /**
   * Path to a route-specific OG image (e.g. "/og-calendar.png"). Resolved to an
   * absolute URL and overrides the site-default og:image/twitter:image from the
   * root route. Omit to inherit the default OG image (/og-calendar.png).
   */
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
  if (image) {
    const imageUrl = new URL(image, SITE_URL).toString();
    meta.push(
      { property: "og:image", content: imageUrl },
      { name: "twitter:image", content: imageUrl },
    );
  }
  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}
