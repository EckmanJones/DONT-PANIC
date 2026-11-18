/**
 * Build one double-clickable HTML file for non-technical users.
 * No Node, no terminal, no server — open the .html in any browser (file://).
 *
 * Output:
 *   dist-web/Dont-Panic-vX.Y.Z.html
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { sync } = require("./sync-version.cjs");

const root = path.join(__dirname, "..");
const version = sync();
const dist = path.join(root, "dist");
const outDir = path.join(root, "dist-web");

console.log(`Building offline single-file HTML v${version}…`);
execSync("npx vite build --mode offline", { cwd: root, stdio: "inherit" });

const htmlPath = path.join(dist, "index.html");
if (!fs.existsSync(htmlPath)) {
  throw new Error("Missing dist/index.html");
}

const assetsDir = path.join(dist, "assets");
const jsFile = fs
  .readdirSync(assetsDir)
  .find((f) => f.endsWith(".js"));
const cssFile = fs
  .readdirSync(assetsDir)
  .find((f) => f.endsWith(".css"));

if (!jsFile) throw new Error("No JS bundle in dist/assets");

const js = fs.readFileSync(path.join(assetsDir, jsFile), "utf8");
const css = cssFile
  ? fs.readFileSync(path.join(assetsDir, cssFile), "utf8")
  : "";

// Escape closing script tags inside the bundle (rare, but safe).
const safeJs = js.replace(/<\/script/gi, "<\\/script");

const offlineHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DONT PANIC!!! v${version}</title>
    <style>
${css}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <!-- Classic script (not type=module) so double-click / file:// works -->
    <script>
${safeJs}
    </script>
  </body>
</html>
`;

fs.mkdirSync(outDir, { recursive: true });
const outName = `Dont-Panic-v${version}.html`;
const outPath = path.join(outDir, outName);
fs.writeFileSync(outPath, offlineHtml);

const readme = `DONT PANIC!!! v${version}

How to play (no install, no tech setup):

1. Double-click  ${outName}
2. It opens in your web browser.
3. Click “Start the chaos” and project that window.

That’s it. You do not need Node, Terminal, or Windows.
`;
fs.writeFileSync(path.join(outDir, "OPEN-ME.txt"), readme);

console.log(`Offline HTML ready: ${outPath}`);
console.log("End users: double-click the .html file.");
