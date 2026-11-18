/**
 * Build a versioned local-web archive (no Windows, no installer, no accounts).
 * Output: dist-web/Dont-Panic-web-vX.Y.Z.zip
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { sync } = require("./sync-version.cjs");

const root = path.join(__dirname, "..");
const version = sync();
const dist = path.join(root, "dist");
const outDir = path.join(root, "dist-web");
const stage = path.join(outDir, `Dont-Panic-web-v${version}`);
const zipName = `Dont-Panic-web-v${version}.zip`;
const zipPath = path.join(outDir, zipName);

console.log(`Building web archive v${version}…`);
execSync("npm run build", { cwd: root, stdio: "inherit" });

if (!fs.existsSync(path.join(dist, "index.html"))) {
  throw new Error("Missing dist/index.html");
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(stage, { recursive: true });
fs.cpSync(dist, stage, { recursive: true });
fs.copyFileSync(
  path.join(root, "scripts", "serve-static.mjs"),
  path.join(stage, "serve.mjs"),
);

const runLocal = `# DONT PANIC!!! — local web v${version}

No Windows. No installer. No bot / cloud account.

## Run (Node.js 18+ installed)

\`\`\`bash
node serve.mjs
\`\`\`

Open http://127.0.0.1:1420 in any browser. Project that screen.

Stop with Ctrl+C.

## Alternate (Python)

\`\`\`bash
python3 -m http.server 1420 --bind 127.0.0.1
\`\`\`

Then open http://127.0.0.1:1420
`;

fs.writeFileSync(path.join(stage, "RUN-LOCAL.txt"), runLocal);
fs.writeFileSync(
  path.join(stage, "start.sh"),
  `#!/usr/bin/env bash\ncd "$(dirname "$0")"\nexec node serve.mjs\n`,
  { mode: 0o755 },
);
fs.writeFileSync(
  path.join(stage, "start.bat"),
  `@echo off\r\ncd /d "%~dp0"\r\nnode serve.mjs\r\npause\r\n`,
);

// Prefer system zip; fall back to best-effort via PowerShell / ditto patterns not needed —
// use Node + built-in compression via `npm pack` style: spawn zip CLI.
fs.rmSync(zipPath, { force: true });
try {
  execSync(`zip -r "${zipName}" "Dont-Panic-web-v${version}"`, {
    cwd: outDir,
    stdio: "inherit",
  });
} catch {
  // Windows CI may lack zip — use PowerShell Compress-Archive
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${stage}' -DestinationPath '${zipPath}' -Force"`,
    { stdio: "inherit" },
  );
}

console.log(`Web archive ready: ${zipPath}`);
