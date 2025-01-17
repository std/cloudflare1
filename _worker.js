export default {
  async fetch(request, env,ctx) {
    const url = new URL(request.url);


    const api_address = "http://ledg.app/mainnet";

    // const { pathname, search } = url;
    // const destinationURL = `${api_address}${pathname}${search}`;

    if (url.pathname.startsWith('/api')) {

      const url = new URL(request.url);
      const { pathname, search } = url;

      const destinationURL = `${api_address}${pathname}${search}`;
      //return new Response(JSON.stringify({destinationURL, data:await fetch(destinationURL)}))
      //return new Response(`api: ${destinationURL}`)

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

      //const response = await fetch(destinationURL, init);
      //
      // const results = await gatherResponse(response);
      // const response = new Response(results, init);

      const cache=caches.default
      const cacheKey=destinationURL
      let  response=await cache.match(cacheKey);
      //let response=undefined
      if (!response) {
        const fetch_response = await fetch(destinationURL, init);

        const results = await gatherResponse(fetch_response);
        response = new Response(results,{headers:fetch_response.headers});
        response.headers.append("Cache-Control", "s-maxage=60");
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      }
      return response
    }
    //return new Response(url)
    return env.ASSETS.fetch(request);
  },
}