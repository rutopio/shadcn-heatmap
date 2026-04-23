export const SITE_URL = "https://shadcn-heatmap.pages.dev";
export const SITE_NAME = "shadcn-heatmap";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

type PageMeta = {
  title: string;
  description: string;
  path: string;
};

export function pageHead({ title, description, path }: PageMeta) {
  const url = new URL(path, SITE_URL).toString();
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
