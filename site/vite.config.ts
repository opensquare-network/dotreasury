import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

export default defineConfig({
  plugins: [react(), svgr()],
  assetsInclude: ["**/*.md"],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [NodeModulesPolyfillPlugin()],
    },
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
