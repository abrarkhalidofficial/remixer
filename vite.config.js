import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import viteImagemin from "vite-plugin-imagemin";
import viteCompression from "vite-plugin-compression";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import { ViteWebfontDownload } from "vite-plugin-webfont-dl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteWebfontDownload(),
    chunkSplitPlugin(),
    imagetools(),
    viteCompression({
      algorithm: "brotliCompress",
      threshold: 100,
    }),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 8,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 8,
      },
      mozjpeg: {
        quality: 20,
      },
      pngquant: {
        quality: [0.7, 0.8],
        speed: 4,
      },
      webp: {
        quality: 70,
      },
      svgo: {
        multipass: true,
        plugins: [
          {
            name: "removeViewBox",
          },
          {
            name: "minifyStyles",
          },
          {
            name: "removeMetadata",
          },
          {
            name: "removeUselessStrokeAndFill",
          },
          {
            name: "reusePaths",
          },
          {
            name: "removeEmptyAttrs",
            active: true,
          },
        ],
      },
    }),
  ],
});
