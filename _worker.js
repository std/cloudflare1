export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api')) {
      const someHost = "http://ledg.app/mainnet/api/Sector";

      const url = someHost //+ "/static/json";

      /**
       * gatherResponse awaits and returns a response body as a string.
       * Use await gatherResponse(..) in an async function to get the response body
       * @param {Response} response
       */
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

      const response = await fetch(url, init);

      //console.log(response)
      const results = await gatherResponse(response);
      return new Response(results, init);
    }
    // Otherwise, serve the static assets.
    // Without this, the Worker will error and no assets will be served.
    console.log('fetch assets');
    return env.ASSETS.fetch(request);
  },
}