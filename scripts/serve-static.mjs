#!/usr/bin/env node
/**
 * Zero-dependency local static server for the Cost Accounting Game web build.
 * Usage (from the unzipped web folder, or after npm run build):
 *   node scripts/serve-static.mjs [dir] [port]
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootArg = process.argv[2];
const port = Number(process.argv[3] || process.env.PORT || 1420);

const root = path.resolve(
  rootArg ||
    (fs.existsSync(path.join(process.cwd(), "index.html"))
      ? process.cwd()
      : path.join(__dirname, "..", "dist")),
);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

function send(res, status, body, type) {
  res.writeHead(status, {
    "Content-Type": type || "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let filePath = path.join(root, urlPath === "/" ? "index.html" : urlPath);
    if (!filePath.startsWith(root)) {
      send(res, 403, "Forbidden");
      return;
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    if (!fs.existsSync(filePath)) {
      // SPA-ish fallback
      const index = path.join(root, "index.html");
      if (fs.existsSync(index)) {
        send(res, 200, fs.readFileSync(index), TYPES[".html"]);
        return;
      }
      send(res, 404, "Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, fs.readFileSync(filePath), TYPES[ext] || "application/octet-stream");
  } catch (err) {
    send(res, 500, String(err));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Cost Accounting Game (web) → http://127.0.0.1:${port}`);
  console.log(`Serving: ${root}`);
  console.log("Ctrl+C to stop. No accounts, no Windows required.");
});
