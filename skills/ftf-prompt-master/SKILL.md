---
name: ftf-prompt-master
description: Writes the exact, load-bearing prompt for whichever tool the task targets (ComfyUI PuLID+Wan2.2, Google Stitch, Canva, content scripts) using FTF's own locked specs instead of a generic prompt. Use whenever Buddy needs a prompt written or sharpened for any downstream FTF tool, says "write me a prompt for X", "sharpen this prompt", "give me a ready prompt", or before anything goes to ComfyUI/Stitch/Canva/content agents. Chains after ftf-brainstorming (decides WHAT) and before execution (writes HOW). Stops Buddy having to leave the system to enhance a prompt elsewhere.
---

# FTF Prompt Master

## Purpose
Write the sharpest possible prompt for the exact tool being targeted — no filler, no
generic phrasing, every word load-bearing. Never re-derive FTF's own locked specs from
memory; always pull them from the files that own them, so this skill can't drift.

## Chain position
`ftf-brainstorming` (frame the problem, decide WHAT) → **this skill (write HOW)** →
execution. Format/locks are owned by `be-aligned` — this skill never restates them, only
reads and applies them.

## STEP 1 — Detect the target tool
Ask internally first, only surface a question to Buddy if genuinely unclear (be-aligned
RULE 9 — one relevant question, never a menu):
1. ComfyUI / PuLID + Wan 2.2 (GPU render pipeline) — reels, stills, camera/motion shots
2. Google Stitch — full UI screens (see `stitch-ftf`)
3. Canva — hero/marketing images, once in active use (see `ftf-brainstorming` STEP 3)
4. Content script / caption / hook — text-only, chains into `content-research`/voice skills

## STEP 2 — Pull real FTF context (never hardcode a copy — read the source)
- Master style seed + current pipeline (PROVEN vs CANDIDATE) + camera/motion library →
  `gpu-ftf` skill. Never assume which pipeline is active; that file's PROVEN label is the
  only source of truth, and it can go stale — if this skill's own output contradicts it,
  flag the mismatch rather than silently trusting either source.
- Camera movement / shot grammar terms (e.g. SLOW_PUSH_IN) → check the Director Library
  (Notion: Reel Grammar / Motion Library / Film-Craft Skill) FIRST before inventing a new
  camera term — duplicate camera IDs have happened before (ML-01 vs CAMERA_ID clash).
- Locked palette, fonts, format, no-price/no-address, English-only → `be-aligned` RULE 4.
- Service names, categories, sphere colours → Salon OS Airtable (never hardcode a service
  list here) and `ftf-brainstorming` STEP 3 category table.
- Voice/tone chain (hook, anti-AI pass, plain-English pass) → `voice-dna-ftf` →
  `viral-hooks-ftf` → `anti-ai-ftf` → `dumbify-ftf`, for any text-output prompt.

## STEP 3 — Write the prompt (prompt-master method, condensed)
- Sharp over long: the best prompt is the one where every word is load-bearing, not the
  longest one. Strip anything that isn't doing real work.
- Always append the master style seed (from `gpu-ftf`) to any ComfyUI/Wan2.2 prompt,
  verbatim, every time — never optional, never paraphrased.
- Ask 1-3 sharp clarifying questions ONLY if the tool, subject, or a locked spec genuinely
  can't be resolved from context — never pad with questions that memory/files already answer.
- Match format to the destination tool, not a generic template — a ComfyUI prompt, a Stitch
  screen brief, and a caption hook are three different shapes; do not force one template
  onto all three.

## STEP 4 — Optional reference library
`prompts.chat` (community prompt library, official MCP at `https://prompts.chat/api/mcp`)
may be consulted for genre/structure inspiration on a novel prompt shape this skill hasn't
handled before — never as a source of FTF's actual specs, and never copied verbatim (its
prompts are CC0, structure-only reference, not FTF voice).

## STEP 5 — Output format
Owned by `be-aligned` RULE 9. For a prompt-write, structure as:
```
TARGET TOOL: [ComfyUI / Stitch / Canva / content script]
CONTEXT PULLED: [which files/specs this drew from]
PROMPT:
[the actual ready-to-use prompt]
FLAGS: [any stale/conflicting spec found while pulling context, or "none"]
```

## Known gaps at time of writing (flag, don't silently fix here)
- `gpu-ftf` still labels PuLID+Wan2.2 as CANDIDATE though it's confirmed live (05 Sep 2026
  session) — this skill should read the label as-is and flag the mismatch if relevant,
  not override it unilaterally.
- `stitch-ftf` still uses background `#F3ECED`, superseded by `#FAF7F2` per be-aligned
  RULE 4 — flag if a Stitch prompt is being written, don't silently substitute.
