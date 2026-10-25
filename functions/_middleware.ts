/// <reference types="@cloudflare/workers-types" />

// Assign the path separately so a leading "//" cannot change the host.
export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);
  if (url.hostname.endsWith(".pages.dev")) {
    const target = new URL("https://heatmap.chingru.com");
    target.pathname = url.pathname;
    target.search = url.search;
    return Response.redirect(target.toString(), 301);
  }
  return next();
};
