import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  // Vite configuration options go here
  build: {
    target: "esnext",
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, "src/entries/config/main.ts"),
      plugins: [vue()],
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
        entryFileNames: 'index.js',
      },
    },
    outDir: 'plugin/js/config',
    emptyOutDir: true,
  }
});