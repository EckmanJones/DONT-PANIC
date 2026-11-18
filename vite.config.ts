import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-expect-error type error without @types/node package
import process from "node:process";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const offline = mode === "offline";

  return {
    plugins: [react()],

    // Dev: absolute. Production zip/Electron: relative. Offline single HTML: relative.
    base: command === "build" ? "./" : "/",

    clearScreen: false,
    server: {
      port: 1440,
      strictPort: true,
      host: host || "127.0.0.1",
      hmr: host
        ? {
            protocol: "ws",
            host,
            port: 1421,
          }
        : undefined,
      watch: {
        ignored: ["**/src-tauri/**"],
      },
    },

    // Classic IIFE bundle so a double-clicked index.html works on file:// (no Node).
    build: offline
      ? {
          cssCodeSplit: false,
          modulePreload: false,
          assetsInlineLimit: 100_000_000,
          rollupOptions: {
            output: {
              format: "iife",
              name: "DontPanic",
              inlineDynamicImports: true,
              entryFileNames: "assets/app.js",
              assetFileNames: "assets/[name][extname]",
            },
          },
        }
      : undefined,
  };
});
