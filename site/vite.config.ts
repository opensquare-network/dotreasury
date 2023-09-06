import { defineConfig } from "vite";
import type { PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import nodePolyfills from "rollup-plugin-node-polyfills";

export default defineConfig({
  plugins: [react(), svgr(), nodePolyfills() as PluginOption],
  assetsInclude: ["**/*.md"],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
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
