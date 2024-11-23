import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import rakkas from "rakkasjs/vite-plugin";
import fs from "node:fs";
import { cfAdapter } from "./plugins/cf-adapter";

export default defineConfig((env) => ({
  define: {
    RAKKAS_BUILD_TYPE: JSON.stringify(
      process.env.RAKKAS_BUILD_TYPE ?? "dev server",
    ),
  },
  build: {
    outDir: env.isSsrBuild ? "dist/ssr" : "dist/client",
  },
  plugins: [
    tsconfigPaths(),
    react(),
    rakkas(),
    process.env.RAKKAS_BUILD_TYPE === "edge" && cfAdapter(),
    {
      name: "move-build",
      apply: "build",
      async closeBundle() {
        if (!env.isSsrBuild) {
          return;
        }

        const target = process.env.RAKKAS_BUILD_TYPE;

        await fs.promises.rename("dist/server", "dist/" + target);
      },
    },
  ],
}));
