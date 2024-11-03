/* eslint-disable no-console */
import { RequestContext } from "rakkasjs";
import { createRequestHandler } from "rakkasjs/server";

declare global {
  // eslint-disable-next-line no-var
  var RAKKAS_BUILD_TYPE: "edge" | "origin";
}

export default createRequestHandler({
  middleware: {
    beforeAll: [
      (ctx) => {
        if (
          RAKKAS_BUILD_TYPE === "edge" &&
          ctx.url.pathname.startsWith("/_app/data/id/origin-")
        ) {
          return forwardRequest(ctx);
        }
      },
    ],
    beforeNotFound: [
      (ctx) => {
        if (RAKKAS_BUILD_TYPE === "edge") {
          return forwardRequest(ctx);
        }
      },
    ],
  },
});

function forwardRequest(ctx: RequestContext) {
  const newUrl = "http://localhost:3001" + ctx.url.pathname + ctx.url.search;

  console.log("Forwarding to", newUrl);

  return fetch(newUrl, {
    method: ctx.method,
    headers: ctx.request.headers,
    body: ctx.request.body,
  });
}
