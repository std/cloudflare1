
export async function onRequest(context) {

    const someHost = "http://ledg.app/mainnet/api/Sector";

    const url = someHost + "/mainnet/api/Account?id=eq.101";

    console.log(url);
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

    //const response = await fetch(url, init);
    //const results = await gatherResponse(response);
    console.log({res:url})
    
  return new Response(results)
}