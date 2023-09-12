import react from "@vitejs/plugin-react";
import path from "node:path";
import url from "url";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import siteConfig from "../site/vite.config";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: siteConfig.optimizeDeps,
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
