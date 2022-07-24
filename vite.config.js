import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";
import { ViteWebfontDownload } from "vite-plugin-webfont-dl";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ injectRegister: "auto" }),
    viteCompression(),
    ViteWebfontDownload(),
  ],
  esbuild: {
    drop: ["console", "debugger"],
  },
});
