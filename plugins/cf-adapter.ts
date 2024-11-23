import type { Plugin } from "vite";

export function cfAdapter(): Plugin[] {
  return [
    {
      name: "cf-adapter",

      apply(_cfg, env) {
        const apply = !!env.isSsrBuild;
        return apply;
      },

      config(cfg) {
        cfg.define = cfg.define ?? {};
        cfg.define["process.env.RAKKAS_PRERENDER"] = "false";

        return {
          // There seems to be a bug in Vite that prevents this from working
          // define: {
          //   "process.env.RAKKAS_PRERENDER": JSON.stringify(
          //     process.env.RAKKAS_PRERENDER,
          //   ),
          // },
          build: {
            rollupOptions: {
              input: {
                "entry-cf": "src/entry-cf.ts",
              },
            },
          },
        };
      },
    },
  ];
}
