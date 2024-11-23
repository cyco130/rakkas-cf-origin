import cloudflareWorkersAdapter from "@hattip/adapter-cloudflare-workers/no-static";
import handler from "./entry-hattip";

export default {
  fetch: cloudflareWorkersAdapter(handler),
};
