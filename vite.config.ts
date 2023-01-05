import { defineConfig, loadEnv } from "vite";

import { ViteWebfontDownload } from "vite-plugin-webfont-dl";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import hotExport from "vite-plugin-hot-export";
import mix from "vite-plugin-mix";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";
import viteImagemin from "vite-plugin-imagemin";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
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
      hotExport(),
      chunkSplitPlugin(),
      ViteWebfontDownload(),
      viteCompression({
        algorithm: "brotliCompress",
        threshold: 100,
      }),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 30,
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
      process.env.VITE_BUILD_MODE === "ssr"
        ? mix.default({
            handler: "./src/layouts/api.jsx",
          })
        : null,
    ],
  });
};
