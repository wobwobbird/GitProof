import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub project Pages: https://<user>.github.io/<repo>/ — must match repo name (case-sensitive path on some hosts)
const repoBase = process.env.VITE_BASE ?? "/GitProof/";

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
