
export default {

  async fetch(request, env,ctx) {
    async function addCors(response){
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Max-Age', '86400');
      return response;
    }
    const url = new URL(request.url);

    const api_address = "http://ledg.app/mainnet";

    if (url.pathname.startsWith('/api')) {

      const url = new URL(request.url);
      const { pathname, search } = url;

      const destinationURL = `${api_address}${pathname}${search}`;

      async function gatherResponse(response) {
        const { headers } = response;
        const contentType = headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          return JSON.stringify(await response.json());
        }
        return response.text();
      }

      const init = {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      };

      const cache=caches.default
      const cacheKey=destinationURL
      let  response=await cache.match(cacheKey);

      if (!response) {
        response = await fetch(destinationURL, init);

        const results = await gatherResponse(response);
        response = new Response(results);
        response.headers.append("Cache-Control", "s-maxage=60");
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      }
      return response
    }

    return env.ASSETS.fetch(request);
  },
}