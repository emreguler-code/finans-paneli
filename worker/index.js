export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname;
    if (/^\/api(?:\/|$)/i.test(pathname) || /\.php(?:\/|$)/i.test(pathname)) {
      return new Response("PHP API is not available on static hosting", {
        status: 404,
      });
    }
    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (
      response.status !== 404 ||
      !acceptsHtml ||
      !["GET", "HEAD"].includes(request.method)
    ) {
      return response;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
