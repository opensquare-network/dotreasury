import { defineConfig } from "vite";
import type { PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import nodePolyfills from "rollup-plugin-node-polyfills";
import { transformDepsProcessEnvToImportMetaEnv } from "./builds/vite-plugin-transform-deps-process-env-to-import-meta-env";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    nodePolyfills() as PluginOption,
    transformDepsProcessEnvToImportMetaEnv(),
  ],
  assetsInclude: ["**/*.md"],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
      process: "rollup-plugin-node-polyfills/polyfills/process-es6",
    },
  },
});
