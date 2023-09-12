import react from "@vitejs/plugin-react";
import path from "node:path";
import url from "url";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      plugins: [NodeModulesPolyfillPlugin()],
    },
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, "../site/public/imgs"),
          dest: ".",
        },
      ],
    }),
  ],
});
