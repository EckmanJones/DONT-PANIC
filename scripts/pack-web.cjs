const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { sync } = require("./sync-version.cjs");

const root = path.join(__dirname, "..");
const version = sync();
const outDir = path.join(root, "dist-web");

execSync("node scripts/build-offline-html.cjs", { cwd: root, stdio: "inherit" });

const htmlName = `Dont-Panic-v${version}.html`;
const htmlPath = path.join(outDir, htmlName);
if (!fs.existsSync(htmlPath)) throw new Error(`Missing ${htmlPath}`);

const stageName = `Dont-Panic-web-v${version}`;
const stage = path.join(outDir, stageName);
fs.rmSync(stage, { recursive: true, force: true });
fs.mkdirSync(stage, { recursive: true });
fs.copyFileSync(htmlPath, path.join(stage, htmlName));
fs.copyFileSync(path.join(outDir, "OPEN-ME.txt"), path.join(stage, "OPEN-ME.txt"));

const zipName = `Dont-Panic-web-v${version}.zip`;
const zipPath = path.join(outDir, zipName);
fs.rmSync(zipPath, { force: true });
try {
  execSync(`zip -r "${zipName}" "${stageName}"`, { cwd: outDir, stdio: "inherit" });
} catch {
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${stage}' -DestinationPath '${zipPath}' -Force"`,
    { stdio: "inherit" },
  );
}
console.log(`Handoff: ${htmlPath}`);
