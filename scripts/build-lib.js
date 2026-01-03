/**
 * Build script for the library
 * Bundles the editor into a distributable package
 */

const fs = require("fs");
const path = require("path");

// Copy package.json for library
const libPackageJson = require("../package-lib.json");
const distPath = path.join(__dirname, "../dist");

// Ensure dist directory exists
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Copy package.json to dist
fs.writeFileSync(
  path.join(distPath, "package.json"),
  JSON.stringify(libPackageJson, null, 2)
);

// Copy README if exists
const readmePath = path.join(__dirname, "../README-INSTALLATION.md");
if (fs.existsSync(readmePath)) {
  fs.copyFileSync(readmePath, path.join(distPath, "README.md"));
}

console.log("✅ Library build complete!");
console.log("📦 Output: ./dist");
