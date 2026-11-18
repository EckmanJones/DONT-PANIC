/**
 * Bump VERSION (patch by default), then sync.
 * Usage: node scripts/bump-version.js [patch|minor|major]
 */
const fs = require("fs");
const path = require("path");
const { sync } = require("./sync-version.cjs");

const root = path.join(__dirname, "..");
const versionFile = path.join(root, "VERSION");
const kind = (process.argv[2] || "patch").toLowerCase();

const current = fs.readFileSync(versionFile, "utf8").trim();
const parts = current.split(".").map((n) => Number(n));
if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
  throw new Error(`Bad VERSION: ${current}`);
}

let [maj, min, pat] = parts;
if (kind === "major") {
  maj += 1;
  min = 0;
  pat = 0;
} else if (kind === "minor") {
  min += 1;
  pat = 0;
} else {
  pat += 1;
}

const next = `${maj}.${min}.${pat}`;
fs.writeFileSync(versionFile, `${next}\n`);
sync(next);
console.log(`Bumped ${current} → ${next} (${kind})`);
