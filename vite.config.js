import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "checkout-src",
  plugins: [react()],
  build: {
    outDir: "../checkout",
    emptyOutDir: true,
  },
});
