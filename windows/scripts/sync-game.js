/**
 * Build the Vite React game and copy dist/ into windows/game/ for Electron.
 * Syncs VERSION into package manifests before build so the zip name matches.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { sync: syncVersion } = require("../../scripts/sync-version.cjs");

const root = path.join(__dirname, "..", "..");
const dist = path.join(root, "dist");
const dest = path.join(__dirname, "..", "game");

const version = syncVersion();
console.log(`Building DONT PANIC!!! v${version} (vite)…`);
execSync("npm run build", { cwd: root, stdio: "inherit" });

if (!fs.existsSync(path.join(dist, "index.html"))) {
  console.error(`Missing build output: ${dist}/index.html`);
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(dist, dest, { recursive: true });
console.log("synced dist → windows/game");
