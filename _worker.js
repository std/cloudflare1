export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api')) {
      const api_address = "http://ledg.app/mainnet";

      const statusCode = 301;

      const url = new URL(request.url);
      const { pathname, search } = url;

      const destinationURL = `${api_address}${pathname}${search}`;

      // const url = someHost //+ "/static/json";
      // /**
      //  * gatherResponse awaits and returns a response body as a string.
      //  * Use await gatherResponse(..) in an async function to get the response body
      //  * @param {Response} response
      //  */
      async function gatherResponse(response) {
        const { headers } = response;
        const contentType = headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          return JSON.stringify(await response.json());
        }
        return response.text();
      }
      //
      //
      const init = {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      };
      return new Response(JSON.stringify({new_url: destinationURL}));
      //
      const response = await fetch(destinationURL, init);
      //
      // //console.log(response)
      const results = await gatherResponse(response);
      return new Response(results, init);
    }

    return env.ASSETS.fetch(request);
  },
}