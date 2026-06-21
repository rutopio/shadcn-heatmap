/// <reference types="@cloudflare/workers-types" />

// Canonical-host redirect. Any *.pages.dev host (<project>.pages.dev and every
// <hash>.<project>.pages.dev preview URL) is 301'd to the custom domain, path +
// query preserved, so the pages.dev origin never gets indexed or linked.
export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);
  if (url.hostname.endsWith(".pages.dev")) {
    const target = new URL(
      url.pathname + url.search,
      "https://heatmap.chingru.com",
    );
    return Response.redirect(target.toString(), 301);
  }
  return next();
};
