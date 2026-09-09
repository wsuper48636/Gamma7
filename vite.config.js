import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "checkout-src",
  base: "/checkout/",
  plugins: [react()],
  build: {
    outDir: "../checkout",
    emptyOutDir: true,
  },
});
