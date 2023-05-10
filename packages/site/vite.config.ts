import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { transformDepsProcessEnvToImportMetaEnv } from "./builds/vite-plugin-transform-deps-process-env-to-import-meta-env";

export default defineConfig({
  plugins: [react(), svgr(), transformDepsProcessEnvToImportMetaEnv()],
  assetsInclude: ["**/*.md"],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: [
            "react",
            "react-dom",
            "react-router",
            "react-router-dom",
            "redux",
            "react-redux",
          ],
          ui: ["styled-components", "semantic-ui-react"],
          chartjs: ["chart.js", "react-chartjs-2"],
        },
      },
    },
  },
});
