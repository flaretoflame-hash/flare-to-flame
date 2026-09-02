#!/usr/bin/env node
/**
 * graphify - minimal static code-graph generator.
 * Usage: node tools/graphify.mjs <root> [--code-only] [--out <dir>]
 */

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const CODE_EXTS = new Set([".mjs", ".js", ".ts", ".tsx", ".jsx", ".sh"]);
const SKIP_DIRS = new Set([".git", "node_modules", "public"]);

function parseArgs(argv) {
  const positional = [];
  const flags = { codeOnly: false, out: "graphify-out" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--code-only") flags.codeOnly = true;
    else if (a === "--out") flags.out = argv[++i];
    else positional.push(a);
  }
  flags.root = positional[0] ?? ".";
  return flags;
}

async function walk(dir, codeOnly, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walk(path.join(dir, entry.name), codeOnly, acc);
    } else {
      const ext = path.extname(entry.name);
      if (codeOnly && !CODE_EXTS.has(ext)) continue;
      acc.push(path.join(dir, entry.name));
    }
  }
  return acc;
}

function relId(absPath) {
  return path.relative(REPO_ROOT, absPath).split(path.sep).join("/");
}

async function main() {
  const { root, codeOnly, out } = parseArgs(process.argv);
  const scanRoot = path.resolve(root);
  const files = await walk(scanRoot, codeOnly);
  const nodes = files.map((f) => ({ id: relId(f), kind: "reference" }));
  const graph = { generatedAt: new Date().toISOString(), root: relId(scanRoot) || ".", codeOnly, nodes, edges: [] };
  const outDir = path.resolve(REPO_ROOT, out);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "code-graph.json"), JSON.stringify(graph, null, 2));
  console.log(`graphify: ${nodes.length} nodes -> ${path.relative(REPO_ROOT, outDir)}/`);
}

main().catch((err) => { console.error("graphify failed:", err); process.exit(1); });
