import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub project Pages: https://<user>.github.io/<repo>/
const repoBase = process.env.VITE_BASE ?? "/gitproof/";

export default defineConfig({
  plugins: [react()],
  base: repoBase.endsWith("/") ? repoBase : `${repoBase}/`,
  build: {
    outDir: path.resolve(__dirname, "../docs"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
