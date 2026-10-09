const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const distDir = path.join(ROOT, "dist");
const isWatch = process.argv.includes("--watch");

function cleanDist() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });
}

function copyStatic() {
  const fileMap = [
    ["src/sidebar.html", "sidebar.html"],
    ["src/settings.html", "settings.html"],
    ["manifest.json", "manifest.json"],
    ["dev/data/ucc.json", "data/ucc.json"],
  ];
  for (const [src, destName] of fileMap) {
    const srcPath = path.join(ROOT, src);
    if (fs.existsSync(srcPath)) {
      fs.mkdirSync(path.dirname(path.join(distDir, destName)), { recursive: true });
      fs.copyFileSync(srcPath, path.join(distDir, destName));
    } else {
      console.warn(`copyStatic: skipped missing ${src}`);
    }
  }
  const cssSrc = path.join(ROOT, "src/css");
  if (fs.existsSync(cssSrc)) {
    fs.cpSync(cssSrc, path.join(distDir, "css"), { recursive: true });
  } else {
    console.warn("copyStatic: skipped missing src/css");
  }

  const assetsSrc = path.join(ROOT, "src/shared/assets");
  if (fs.existsSync(assetsSrc)) {
    const skipFiles = new Set([path.join(assetsSrc, "demo2.gif")]);
    fs.cpSync(assetsSrc, path.join(distDir, "shared/assets"), {
      recursive: true,
      filter: (p) => !p.endsWith(".jsx") && !skipFiles.has(p),
    });
  } else {
    console.warn("copyStatic: skipped missing src/assets");
  }
}

const buildOptions = {
  entryPoints: {
    sidebar: path.join(ROOT, "src/sidebar.index.jsx"),
    settings: path.join(ROOT, "src/settings.index.jsx"),
    "global/background": path.join(ROOT, "src/global/background.js"),
    // "background/titlepreface-bridge": path.join(ROOT, "src/background/titlepreface-bridge.js"),
  },
  bundle: true,
  outdir: distDir,
  format: "iife",
  jsx: "automatic",
  target: "firefox115",
  logLevel: "info",
};

async function run() {
  cleanDist();
  copyStatic();
  if (isWatch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log("build run: watching src/ for changes...");
  } else {
    await esbuild.build(buildOptions);
    console.log("build run: build complete -> dist/");
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});