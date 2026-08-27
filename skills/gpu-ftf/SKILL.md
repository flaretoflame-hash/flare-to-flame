---
name: gpu-ftf
description: Local GPU generation status + stack tracker for Flare to Flame. NVIDIA 3060 12GB. ACTIVE pipeline is PuLID + Wan 2.2 (A/B test concluded, confirmed by Buddy 27 Aug 2026). InstantID + SVD-XT is now LEGACY (previously proven, superseded). This file stops going stale every time the stack moves.
---

# GPU - Flare to Flame Local Generation Skill (v3, A/B test concluded 27 Aug 2026)

## Why this file was rewritten
The previous version of this file was badly out of date — it still said "ComfyUI: NOT YET
INSTALLED" and described an old Flux SDXL + 4-scene HeyGen-hybrid model that no longer
reflects reality. Real status as of 24 Jul 2026, confirmed via a live ComfyUI MCP bridge
health-check: ComfyUI 0.14.1, RTX 3060 (11/12GB VRAM free), PyTorch 2.10.0+cu130, running at
`http://127.0.0.1:8188`. That version tracked both pipelines side by side pending the A/B
result. **Buddy has now confirmed the result: PuLID + Wan 2.2 is the ACTIVE pipeline.**
Everything downstream should point to it from here — InstantID + SVD-XT stays in this file
as LEGACY reference only, not as an active target.

---

## Hardware Stack (LOCKED)
- GPU: NVIDIA GeForce RTX 3060, 12GB VRAM
- OS: Windows
- ComfyUI: confirmed running at `localhost:8188`, version 0.14.1
- Claude<->ComfyUI bridge: `artokun/comfyui-mcp` MCP server, wired into local Claude Code
  `settings.json`. This IS "the comfy skill" Buddy refers to — it's an MCP bridge, not a
  written skill file. Claude Code (local) can queue workflows, check status, and pull output
  through it. Cloud claude.ai sessions cannot reach `localhost:8188` — local-only.

---

## ACTIVE Pipeline (confirmed 27 Aug 2026) — PuLID + Wan 2.2
- Face-lock: PuLID (`cubiq/PuLID_ComfyUI`, SDXL variant matching DreamShaperXL) +
  InsightFace antelopev2 + EVA-CLIP
- Video: Wan 2.2 TI2V-5B (text+image->video, native)
- Upscale: SeedVR2 node installed (`numz/ComfyUI-SeedVR2_VideoUpscaler`), model weights NOT
  yet downloaded — confirm before relying on upscale in production renders
- Status: **CONFIRMED ACTIVE by Buddy, 27 Aug 2026.** The A/B test against InstantID+SVD-XT
  is concluded. This is now the pipeline every coworker, script, and prompt targets —
  do not default to the legacy pipeline below, and do not re-open the A/B question without
  a new explicit decision from Buddy.
- Outstanding follow-up: `conductor/script-to-shotlist.mjs` and `conductor/conductor.mjs`
  in `ftf-coworkers` still target the old Forge/SDXL API from the legacy pipeline — they
  need a real rewrite to target Wan 2.2, not a doc-only pointer swap. Flagged, not yet done.

## LEGACY Pipeline (superseded 27 Aug 2026) — InstantID + SVD-XT
- Face-lock: InstantID (ControlNet-based)
- Checkpoint: DreamShaperXL (`dreamshaperXL_alpha2Xl10`)
- Video: SVD img2vid-xt-1-1 (SVD-XT)
- Frame smoothing: RIFE (installed)
- Was PROVEN and the active target from 24 Jul 2026 until the A/B test concluded. Kept here
  as reference only — new work should not target this pipeline.

## A/B Test — CONCLUDED 27 Aug 2026
1. Same reference image, same prompt, both pipelines
2. Compared: identity lock quality, motion quality, render time
3. **Decision: PuLID + Wan 2.2 wins.** Confirmed by Buddy.
4. Whichever wins becomes the pipeline `conductor.mjs` targets — that decision is now made;
   the conductor/script-to-shotlist rewrite is the next concrete step (see Outstanding
   follow-up above), not a blind build ahead of the decision anymore.

---

## Master Style Seed (LOCKED - ALWAYS APPEND, both pipelines)
"luxury Indian salon, warm golden lighting, shallow DOF, bokeh, 35mm film grain"
Never remove this from any prompt, regardless of which pipeline generates it.

---

## Rules
1. PuLID + Wan 2.2 is the ACTIVE pipeline (confirmed 27 Aug 2026) — target it by default.
   InstantID + SVD-XT is LEGACY reference only. If this ever changes again, it will be a new
   explicit decision from Buddy, not a re-opened A/B test.
2. Always append master style seed to every prompt, whichever pipeline is active.
3. ComfyUI/ComfyUI-MCP work only from local Claude Code — cloud claude.ai sessions cannot
   reach `localhost:8188`.
4. Windows paths use backslash - never Linux paths in commands.
5. If VRAM runs out - reduce resolution first, then batch size.
6. When a pipeline decision changes, update this file's ACTIVE/LEGACY section immediately in
   the same session - do not let it go stale again.

---

## Wan 2.2 / Flow Prompting Reference — 99 Commands

Full command library: https://app.notion.com/p/3c742284cc2281eda9bbf8f04f7d53a9?pvs=204
(9 categories, 99 /commands, use this Notion page as the lookup source — this section is the decision layer that picks from it.)

### Why this section exists
Coworkers writing scripts/shot-lists should not freestyle camera language.
They pick from a fixed 99-command vocabulary, using the scene-mood table below,
then fill the fixed template. This keeps every Wan 2.2 / Flow prompt consistent
with FTF's cinematic style instead of drifting shot to shot.

---

### Scene-Mood → Command Combo Table

| Scene type | Camera move | Angle | Lighting | Focus | Color grade | VFX (optional) |
|---|---|---|---|---|---|---|
| Transformation reveal (hair/makeover) | /dollyin | /closeup | /spotlight | /shallowdepth | /cinematic | /bokeh |
| Salon ambience / establishing | /droneview or /wideangle | /establishing | /goldenhour | /deepfocus | /warm | /lensflare |
| Before/after comparison | /tracking | /centered | /softlight | /sharpfocus | /splittone | — |
| Service process (cut/color/style in action) | /steadicam | /overtheshoulder | /softlight | /selectivefocus | /warm | — |
| Client entrance / walk-in | /dollyout | /wideangle | /goldenhour | /deepfocus | /cinematic | /lensflare |
| Product / detail close-up | /macro | /closeup | /rimlight | /shallowdepth | /vibrant | /bokeh |
| Final look portrait | /orbit | /portrait | /rimlight | /eyefocus | /warm | /vignette |
| Testimonial / candid talk | /handheld | /overtheshoulder | /softlight | /sharpfocus | /warm | — |
| Luxury interior detail | /tracking | /wide | /volumetric | /deepfocus | /tealorange | /vignette |
| Day-in-the-life / speed montage | /hyperlapse | /highangle | /goldenhour | /deepfocus | /vibrant | /motionblur |

Rule: if a scene doesn't match a row above, the coworker picks the nearest mood match
from this table rather than inventing a new combo. New recurring scene types get added
as new rows here — not handled ad hoc. VFX column is a starting suggestion, not
mandatory — see Combine Rule below before adding or stacking any VFX.

---

### Fixed Prompt Template

```
[camera move] [angle] [lighting] [focus] [color grade] [VFX — optional, max 1–2] [subject command] — [scene description in plain words] — luxury Indian salon, warm golden lighting, shallow DOF, bokeh, 35mm film grain
```

Notes:
- The last clause (luxury Indian salon... film grain) is the Master Style Seed from
  gpu-ftf — always appended, never dropped, same as every other pipeline prompt.
- [subject command] pulls from the Portrait & Subject category (89–99) when a person
  is the focus — e.g. /beauty, /candid, /fullbody.
- Slots can repeat categories (e.g. two Camera Effects commands) but every prompt must
  fill camera move + lighting + focus + color grade at minimum. VFX is the only
  optional slot.

Example (transformation reveal):
`/dollyin /closeup /spotlight /shallowdepth /cinematic /bokeh /beauty — stylist finishes the
final blow-dry, client sees the new look for the first time — luxury Indian salon,
warm golden lighting, shallow DOF, bokeh, 35mm film grain`

---

### Combine Rule (VFX discipline — prevents muddy output)
1. Max 1 VFX command per prompt. 2 is allowed only if one is a subtle finishing
   effect (/filmgrain, /vignette) layered under a stronger primary VFX.
2. VFX never replaces or fights the locked camera/angle/lighting/focus/color-grade
   slots — it sits last, as a garnish, not a redesign of the shot.
3. If a scene doesn't need VFX, leave the slot empty. Don't force one in just to
   fill it — an empty VFX slot is correct, not incomplete.
4. Never combine two effects from the same sub-purpose (e.g. /motionblur +
   /zoomblur together) — pick the one that fits the shot, not both.
5. This rule applies only to the VFX slot. It does not touch camera, lighting,
   focus, or color-grade commands — those follow the Scene-Mood table above as
   normal.

---

### Where this hooks into the pipeline
This table runs at script/shot-list stage — before any prompt reaches ComfyUI/Wan 2.2.
Whichever coworker skill builds the shot breakdown should stamp each shot with its
command combo from this table automatically, so prompts arrive at the render pipeline
already tagged — not written free-hand at render time.

---

### SFX Cue Table (Remotion / post-production — NOT part of the Wan 2.2 prompt)
Wan 2.2 / Google Flow is text-to-video only — it carries no audio. SFX and music
happen downstream in Remotion, per the ftf-gpu-pipeline setup. This table hands the
scene-mood a matching sound cue so post-production isn't guessing either.

| Scene type | SFX cue |
|---|---|
| Transformation reveal (hair/makeover) | Soft whoosh + light chime on reveal beat |
| Salon ambience / establishing | Ambient salon room tone, light background music bed |
| Before/after comparison | Quick swipe/transition sound on the cut |
| Service process (cut/color/style in action) | Subtle scissors/dryer foley, low under music |
| Client entrance / walk-in | Door chime + footsteps, music swells in |
| Product / detail close-up | Soft tap/click accent on focus pull |
| Final look portrait | Gentle sparkle/shimmer accent, music peak |
| Testimonial / candid talk | Clean dialogue, music ducked low/out |
| Luxury interior detail | Ambient room tone, no foley needed |
| Day-in-the-life / speed montage | Upbeat music bed, no individual foley |

Combine rule for SFX: one cue per scene, same as VFX — don't stack multiple sound
effects on a single shot. If dialogue/testimonial is present, music always ducks
under it, never competes.

---

### Negative Prompt Block (always appended, alongside Master Style Seed)
Wan 2.2 uses a dedicated `negative_prompt` field — separate from the main text prompt.
This is a fixed global string, appended automatically to every job payload. Coworkers
never type this by hand.

Standard Negative Prompt:
`deformed hands, extra fingers, missing limbs, bad anatomy, face morphing, flickering face, body distortion, text overlay, watermark, subtitles, logos, blurry details, oversaturated, jitter, static image, fast motion, time-lapse, frame jumps, low quality, JPEG compression artifacts`

---

### Resolution & FPS (pipeline config, NOT text tags)
Framing is set at the API/ComfyUI payload level — never write things like `/9:16` or
`/vertical` inside the text prompt; the model reads them as text artifacts, not settings.

| Use case | Width x Height | FPS |
|---|---|---|
| Production render (Instagram Reels 9:16) | 1080x1920 | 24fps |
| Draft / fast iteration | 720x1280 | 16fps or 24fps |
| Rapid preview | 480x854 | 16fps |

Note: confirm exact field names and FPS defaults against your actual ComfyUI Wan 2.2
node before locking this into automation — node implementations can differ from the
general Wan 2.2 API spec.

---

### Transitions — 1 Prompt = 1 Continuous Shot
Wan 2.2 does not support transition commands inside a single generation. Writing
`/cut-to` or `/cross-dissolve` in one prompt confuses the motion model and causes
ghosting or warping. Rule: every prompt generates one continuous take, no transitions
inside it.

How to actually get transitions:
1. **Cross-dissolve / hard cuts** — generate each shot separately, stitch and
   transition downstream in Remotion/FFmpeg during post.
2. **Match-cuts** — pass the final frame of Shot A as the first-frame input
   (image-to-video mode) for Shot B, then write Shot B's prompt describing only the
   new motion from that matching position.

---

### Prompt Weighting & prompt_extend Flag
Wan 2.2 does not use bracket/colon weighting syntax like image models
(no `(word:1.2)`). Instead:
1. **Positional weighting** — the model reads left to right and weights the first
   15–20 words most heavily. If the subject/action keeps breaking, move Primary
   Subject + Action before the camera/lighting tags in that specific prompt.
2. **prompt_extend flag** — Wan 2.2 has an internal rewriter (`prompt_extend`)
   that is ON by default. Leaving it on lets the model rewrite your fixed
   99-command vocabulary, causing visual drift. Pipeline action: set
   `prompt_extend: false` in every job payload.

---

### Execution Payload Structure
The shot-builder should output text prompt and engine parameters as separate fields,
not one merged string:

```json
{
  "prompt": "/dollyin /closeup /spotlight /shallowdepth /cinematic /bokeh /beauty — stylist finishes the final blow-dry, client sees the new look for the first time — luxury Indian salon, warm golden lighting, shallow DOF, bokeh, 35mm film grain",
  "negative_prompt": "deformed hands, extra fingers, missing limbs, bad anatomy, face morphing, flickering face, body distortion, text overlay, watermark, subtitles, logos, blurry details, oversaturated, jitter, static image, fast motion, time-lapse, frame jumps, low quality, JPEG compression artifacts",
  "width": 1080,
  "height": 1920,
  "fps": 24,
  "prompt_extend": false
}
```

---

## Current Status (updated 27 Aug 2026)
- ComfyUI: RUNNING, confirmed via MCP health-check (last confirmed 24 Jul 2026 - re-verify if stale)
- ComfyUI<->Claude Code bridge: WORKING (artokun/comfyui-mcp)
- PuLID + Wan 2.2: **ACTIVE — A/B test CONCLUDED, confirmed by Buddy 27 Aug 2026.** This is
  the pipeline to target for all new generation work.
- InstantID + SVD-XT: LEGACY — superseded, kept for reference only.
- SeedVR2: node installed, model weights NOT downloaded — confirm before relying on upscale
- `conductor.mjs` / `conductor/script-to-shotlist.mjs` (ftf-coworkers repo): still target the
  old Forge/SDXL API from the legacy pipeline. The blocking decision (which pipeline wins) is
  now made — the rewrite to target Wan 2.2 is the next concrete engineering step, not yet done.
