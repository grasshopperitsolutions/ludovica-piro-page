import { defineConfig } from "vite";

export default defineConfig({
  base: "/ludovica-piro-page/",
  build: {
    target: "es2020",
    cssMinify: true,
    sourcemap: false,
    manifest: true,
  },
});
