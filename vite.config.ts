import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative asset URLs so the Electron `loadFile` package works offline.
  base: "./",
  server: {
    port: 1440,
    strictPort: true,
    host: "127.0.0.1",
  },
});
