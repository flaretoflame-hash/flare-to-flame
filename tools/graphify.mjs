#!/usr/bin/env node
/**
 * graphify - minimal static code-graph generator for ftf-coworkers.
 * ------------------------------------------------------------------
 * Usage: node tools/graphify.mjs <root> [--code-only] [--out <dir>]
 *   <root>        directory to scan (usually ".")
 *   --code-only   only graph real code files (.mjs/.js/.ts/.tsx/.sh) - skips
 *                 the markdown agent/skill/library "content" tree under
 *                 .claude/, knowledge-atoms/, knowledge-packs/, handoff/,
 *                 architecture-proposals/. Without this flag every file
 *                 (including markdown) is a node, with no edge extraction
 *                 beyond what's implemented below.
 *   --out <dir>   output directory (default: graphify-out)
 *
 * What it finds (regex-based, not a real parser - see ceiling note below):
 *   - imports         static/dynamic import() and require() between code files
 *   - external        bare specifiers (npm packages, node: builtins)
 *   - spawns          child_process spawn/execSync/runCommand(<literal cmd>)
 *   - produces/reads  JSON/markdown data-file contracts passed through a
 *                     path.join(...) assigned to a variable or CONFIG.<key>,
 *                     then later touched by readFile/writeFile - this is how
 *                     the conductor/*.mjs pipeline hands off shot-brief.json
 *                     -> shots.json between scripts without importing each
 *                     other directly.
 *
 * ponytail: regex/brace-matching, not an AST parser - multi-line destructured
 * imports, aliased path resolution (tsconfig "paths"), and re-exports will be
 * missed. Ceiling: correct for this repo's current file count (~10 code
 * files). Upgrade path: swap the regex extractors for es-module-lexer +
 * a proper TS parser if the codebase grows past what a human can eyeball.
 */

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const CODE_EXTS = new Set([".mjs", ".js", ".ts", ".tsx", ".jsx", ".sh"]);
const DATA_EXTS = new Set([".json", ".md"]);

const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  "public",
  "whisper.cpp",
]);

const CONTENT_ONLY_DIRS = new Set([
  ".claude",
  "knowledge-atoms",
  "knowledge-packs",
  "architecture-proposals",
  "handoff",
]);

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
      if (codeOnly && CONTENT_ONLY_DIRS.has(entry.name)) continue;
      await walk(path.join(dir, entry.name), codeOnly, acc);
    } else {
      const ext = path.extname(entry.name);
      if (codeOnly && !CODE_EXTS.has(ext) && entry.name !== "package.json") continue;
      acc.push(path.join(dir, entry.name));
    }
  }
  return acc;
}

function relId(absPath) {
  return path.relative(REPO_ROOT, absPath).split(path.sep).join("/");
}

/** Extract top-level function/arrow blocks via brace counting, so data-file
 *  literals can be associated with the readFile/writeFile call that actually
 *  uses them even when the path.join(...) assignment sits on an earlier line. */
function splitIntoBlocks(content) {
  const blocks = [];
  const sigRe = /(?:async\s+)?function\s+\w+\s*\([^)]*\)\s*\{/g;
  let m;
  while ((m = sigRe.exec(content))) {
    const start = m.index;
    let depth = 0;
    let i = content.indexOf("{", start);
    const bodyStart = i;
    for (; i < content.length; i++) {
      if (content[i] === "{") depth++;
      else if (content[i] === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    blocks.push(content.slice(bodyStart, i + 1));
  }
  if (blocks.length === 0) blocks.push(content); // no functions - treat whole file as one block
  return blocks;
}

function extractImportEdges(content, fileId, codeFileIds) {
  const edges = [];
  const specRe = /(?:import\s+(?:[\s\S]*?from\s+)?|require\(\s*|import\(\s*)["']([^"']+)["']/g;
  let m;
  while ((m = specRe.exec(content))) {
    const spec = m[1];
    if (spec.startsWith(".") || spec.startsWith("/")) {
      const resolved = resolveRelative(fileId, spec, codeFileIds);
      if (resolved) edges.push({ from: fileId, to: resolved, kind: "imports" });
    } else {
      const pkg = spec.startsWith("node:") ? spec : spec.split("/").slice(0, spec.startsWith("@") ? 2 : 1).join("/");
      edges.push({ from: fileId, to: `pkg:${pkg}`, kind: spec.startsWith("node:") ? "builtin" : "external" });
    }
  }
  return edges;
}

function resolveRelative(fromFileId, spec, codeFileIds) {
  const fromDir = path.dirname(fromFileId);
  const base = path.normalize(path.join(fromDir, spec)).split(path.sep).join("/");
  const candidates = [base, ...[...CODE_EXTS].map((e) => base + e), ...[...CODE_EXTS].map((e) => `${base}/index${e}`)];
  return candidates.find((c) => codeFileIds.has(c));
}

function extractSpawnEdges(content, fileId) {
  const edges = [];
  const spawnRe = /\b(?:spawn|execSync|exec)\(\s*["'`]([^"'`]+)["'`]/g;
  let m;
  while ((m = spawnRe.exec(content))) {
    edges.push({ from: fileId, to: `tool:${m[1]}`, kind: "spawns" });
  }
  const runCommandRe = /runCommand\(\s*["'`]([^"'`]+)["'`]/g;
  while ((m = runCommandRe.exec(content))) {
    edges.push({ from: fileId, to: `tool:${m[1]}`, kind: "spawns" });
  }
  const npxRe = /["'`]npx["'`],\s*\[\s*["'`]([^"'`]+)["'`]/g;
  while ((m = npxRe.exec(content))) {
    edges.push({ from: fileId, to: `tool:npx ${m[1]}`, kind: "spawns" });
  }
  return edges;
}

/** Data-file contract edges: path.join(..., "literal.json"|"literal.md")
 *  assigned to `const NAME = ...` or as a `KEY: path.join(...)` object
 *  property, then later read/written via readFile(NAME)/writeFile(NAME) or
 *  readFile(CONFIG.KEY) elsewhere in the same block. */
function extractDataEdges(content, fileId) {
  const edges = [];
  const varMap = new Map();

  const assignRe = /(?:const|let)\s+(\w+)\s*=\s*path\.join\(([^)]*)\)/g;
  let m;
  while ((m = assignRe.exec(content))) {
    const literal = lastQuotedLiteral(m[2]);
    if (literal && DATA_EXTS.has(path.extname(literal))) varMap.set(m[1], literal);
  }

  const propRe = /(\w+)\s*:\s*path\.join\(([^)]*)\)/g;
  while ((m = propRe.exec(content))) {
    const literal = lastQuotedLiteral(m[2]);
    if (literal && DATA_EXTS.has(path.extname(literal))) varMap.set(`CONFIG.${m[1]}`, literal);
  }

  for (const block of splitIntoBlocks(content)) {
    const hasRead = /\breadFile(?:Sync)?\(/.test(block);
    const hasWrite = /\bwriteFile(?:Sync)?\(/.test(block);
    if (!hasRead && !hasWrite) continue;
    for (const [varName, literal] of varMap) {
      const used = new RegExp(`\\b(readFile|writeFile)(?:Sync)?\\(\\s*${escapeRe(varName)}\\b`).exec(block);
      if (!used) continue;
      edges.push({
        from: fileId,
        to: `data:${normalizeDataPath(fileId, literal)}`,
        kind: used[1] === "readFile" ? "reads" : "produces",
      });
    }
    // direct literal readFile/writeFile calls (no intermediate variable)
    const directRe = /\b(readFile|writeFile)(?:Sync)?\(\s*["'`]([^"'`]+\.(?:json|md))["'`]/g;
    let dm;
    while ((dm = directRe.exec(block))) {
      edges.push({ from: fileId, to: `data:${normalizeDataPath(fileId, dm[2])}`, kind: dm[1] === "readFile" ? "reads" : "produces" });
    }
  }
  return edges;
}

/** Data literals found in path.join(...) calls are relative to the file's own
 *  directory (e.g. "../.claude/libraries/x.md") - normalize to a repo-root
 *  relative id so the same data file gets one node regardless of which
 *  script's directory the literal was written from. Bare filenames with no
 *  directory component (e.g. "shots.json", the common case - the real
 *  directory is a runtime jobId this script can't know statically) are left
 *  as-is so scripts that hand off the same filename share one node. */
function normalizeDataPath(fromFileId, literal) {
  if (!literal.includes("/")) return literal;
  const fromDir = path.dirname(fromFileId);
  return path.normalize(path.join(fromDir, literal)).split(path.sep).join("/");
}

function lastQuotedLiteral(argsStr) {
  const matches = [...argsStr.matchAll(/["'`]([^"'`]+)["'`]/g)];
  return matches.length ? matches[matches.length - 1][1] : null;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function main() {
  const { root, codeOnly, out } = parseArgs(process.argv);
  const scanRoot = path.resolve(root);
  const files = await walk(scanRoot, codeOnly);

  const nodes = [];
  const nodeIds = new Set();
  const codeFileIds = new Set();
  for (const f of files) {
    const id = relId(f);
    const ext = path.extname(f);
    const kind = ext === ".sh" ? "script" : ext === ".json" ? "manifest" : "code";
    nodes.push({ id, kind });
    nodeIds.add(id);
    if (CODE_EXTS.has(ext)) codeFileIds.add(id);
  }

  const edges = [];
  const seenPair = new Set();
  const addEdge = (e) => {
    const key = `${e.from}@${e.to}@${e.kind}`;
    if (seenPair.has(key)) return;
    seenPair.add(key);
    edges.push(e);
  };

  for (const f of files) {
    const ext = path.extname(f);
    if (!CODE_EXTS.has(ext)) continue;
    const id = relId(f);
    const content = await readFile(f, "utf-8");

    for (const e of extractImportEdges(content, id, codeFileIds)) {
      addEdge(e);
      if (!nodeIds.has(e.to)) {
        nodes.push({ id: e.to, kind: e.kind === "builtin" ? "builtin" : e.kind === "imports" ? "code" : "package" });
        nodeIds.add(e.to);
      }
    }
    const spawnEdges = extractSpawnEdges(content, id);
    const bareCommandsWithSpecificForm = new Set(
      spawnEdges.filter((e) => e.to.includes(" ")).map((e) => e.to.split(" ")[0]),
    );
    for (const e of spawnEdges) {
      if (bareCommandsWithSpecificForm.has(e.to)) continue; // drop bare "tool:npx" when "tool:npx remotion" also present
      addEdge(e);
      if (!nodeIds.has(e.to)) {
        nodes.push({ id: e.to, kind: "external-tool" });
        nodeIds.add(e.to);
      }
    }
    for (const e of extractDataEdges(content, id)) {
      addEdge(e);
      if (!nodeIds.has(e.to)) {
        nodes.push({ id: e.to, kind: "data-contract" });
        nodeIds.add(e.to);
      }
    }
  }

  const graph = {
    generatedAt: new Date().toISOString(),
    root: relId(scanRoot) || ".",
    codeOnly,
    nodes,
    edges,
  };

  const outDir = path.resolve(REPO_ROOT, out);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "code-graph.json"), JSON.stringify(graph, null, 2));
  await writeFile(path.join(outDir, "code-graph.mmd"), toMermaid(graph));
  await writeFile(path.join(outDir, "README.md"), toReadme(graph));

  console.log(`graphify: ${nodes.length} nodes, ${edges.length} edges -> ${path.relative(REPO_ROOT, outDir)}/`);
}

function mermaidId(id) {
  return "n" + id.replace(/[^a-zA-Z0-9]/g, "_");
}

function toMermaid(graph) {
  const lines = ["flowchart LR"];
  for (const n of graph.nodes) {
    const label = n.id.replace(/^(pkg|tool|data):/, "").replace(/"/g, "'");
    const shape = n.kind === "external-tool" ? `([${label}])` : n.kind === "data-contract" ? `[(${label})]` : n.kind === "package" || n.kind === "builtin" ? `{{${label}}}` : `["${label}"]`;
    lines.push(`  ${mermaidId(n.id)}${shape}`);
  }
  for (const e of graph.edges) {
    const arrow = e.kind === "reads" ? "-. reads .->" : e.kind === "produces" ? "-. writes .->" : e.kind === "spawns" ? "-. spawns .->" : e.kind === "external" || e.kind === "builtin" ? "-.->" : "-->";
    lines.push(`  ${mermaidId(e.from)} ${arrow} ${mermaidId(e.to)}`);
  }
  return lines.join("\n") + "\n";
}

function toReadme(graph) {
  const byKind = {};
  for (const n of graph.nodes) (byKind[n.kind] ??= []).push(n.id);
  const section = (kind, title) =>
    byKind[kind]?.length ? `\n### ${title}\n${byKind[kind].map((id) => `- \`${id}\``).join("\n")}\n` : "";

  return `# graphify-out: code graph (${graph.codeOnly ? "code-only" : "full"})

Generated ${graph.generatedAt} by \`tools/graphify.mjs\` scanning \`${graph.root}\`.
Regenerate with:

\`\`\`
./graphify . --code-only
\`\`\`

- \`code-graph.json\` — full node/edge data
- \`code-graph.mmd\` — Mermaid flowchart (paste into any Mermaid renderer, or view inline on GitHub)

## Nodes (${graph.nodes.length})
${section("code", "Code files")}${section("script", "Shell scripts")}${section("manifest", "Manifests")}${section("data-contract", "Data contracts (JSON/markdown handed between scripts)")}${section("external-tool", "External processes spawned")}${section("package", "External npm packages")}${section("builtin", "Node builtins")}

## Edges (${graph.edges.length})
| from | kind | to |
|---|---|---|
${graph.edges.map((e) => `| \`${e.from}\` | ${e.kind} | \`${e.to}\` |`).join("\n")}
`;
}

main().catch((err) => {
  console.error("graphify failed:", err);
  process.exit(1);
});
