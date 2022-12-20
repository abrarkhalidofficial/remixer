import { ViteWebfontDownload } from "vite-plugin-webfont-dl";
import autoImport from "unplugin-auto-import/vite";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: "src/assets",
  resolve: {
    alias: [
      {
        find: "components",
        replacement: path.resolve(__dirname, "./src/components"),
      },
      {
        find: "assets",
        replacement: path.resolve(__dirname, "./src/assets"),
      },
      {
        find: "global",
        replacement: path.resolve(__dirname, "./src/global"),
      },
      {
        find: "router",
        replacement: path.resolve(__dirname, "./src/router"),
      },
    ],
  },
  plugins: [
    react(),
    ViteWebfontDownload(),
    chunkSplitPlugin(),
    autoImport({
      dts: false,
      defaultExportByFilename: true,
      dirs: ["src/components"],
    }),
    viteCompression({
      algorithm: "brotliCompress",
      threshold: 100,
    }),
  ],
});
