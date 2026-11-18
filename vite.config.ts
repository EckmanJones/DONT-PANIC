import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Dev needs absolute base; production/Electron zip needs relative.
  base: command === "build" ? "./" : "/",
  server: {
    port: 1440,
    strictPort: true,
    host: "127.0.0.1",
  },
}));
