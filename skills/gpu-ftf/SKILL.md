---
name: gpu-ftf
description: Local GPU generation status + stack tracker for Flare to Flame. NVIDIA 3060 12GB. The lead pipeline is PuLID single-identity -> Flux GGUF still -> Wan 2.2 i2v -> SeedVR2 -> RIFE; the PuLID identity-lock stage is CANDIDATE (not verified standalone this session), the Flux/Wan/SeedVR2/RIFE stages are PROVEN. Carries the component status table (PROVEN / CANDIDATE / BROKEN / LEGACY) and the embedded 99-command Wan 2.2 / Google Flow prompting reference. Use for any question about the local render stack, which pipeline is current, why an old approach was dropped, or Wan 2.2 scene-prompt vocabulary.
---

# GPU - Flare to Flame Local Generation Skill (v3, refreshed 29 Aug 2026)

## Why this file was rewritten
v2 (24 Jul 2026) tracked two pipelines side by side — a PROVEN InstantID + SVD-XT stack and a
CANDIDATE PuLID + Wan 2.2 stack under an unresolved A/B test. **That A/B test has concluded:
PuLID + Wan 2.2 won.** InstantID + SVD-XT is now LEGACY. Ken Burns still-motion for Beats 1/6
was tested in the same period and rejected (frozen-face look) in favour of AdvancedLivePortrait.
This v3 collapses to a single lead pipeline plus a component status table, and formalises the
four status labels so the file stops drifting. Note: "PuLID + Wan 2.2 won" is a direction —
the PuLID single-identity stage itself has not been verified standalone this session and is
labelled CANDIDATE until it is.

Last stack facts (from session memory, ComfyUI health-check was unreachable at rewrite time —
server not running): ComfyUI v0.34.0 (confirmed 26 Aug 2026), RTX 3060 12GB, Windows,
headless target `http://127.0.0.1:8188`. Re-run a health-check at the start of any render session.

---

## Status Vocabulary (LOCKED — these four labels only)
- **PROVEN** — run end-to-end at least once, output shipped or approved by Buddy. Safe to build
  automation against.
- **CANDIDATE** — installed and partially tested, not yet approved as the default. Do NOT target
  it in `conductor.mjs` or any automation until it is promoted to PROVEN.
- **BROKEN** — tried, does not work. Documented here so it is not silently retried. Needs a
  named fix before anyone attempts it again.
- **LEGACY** — was PROVEN or was the plan, now superseded. Kept for history and for "why don't
  we just use X" questions. Not for new work.

"ACTIVE" is deliberately not in this set — it was ambiguous between "in use", "working", and
"in progress". Use PROVEN / CANDIDATE / BROKEN / LEGACY.

---

## Hardware Stack (LOCKED)
- GPU: NVIDIA GeForce RTX 3060, 12GB VRAM
- OS: Windows
- ComfyUI: headless target `localhost:8188`, v0.34.0 (last confirmed 26 Aug 2026)
- Claude <-> ComfyUI bridge: the `comfy` plugin MCP server (`plugin:comfy:comfyui`), wired into
  local Claude Code. Local Claude Code can queue workflows, check status, and pull output
  through it. Cloud claude.ai sessions cannot reach `localhost:8188` — local-only.

---

## Lead Pipeline — PuLID + Wan 2.2

Chain: **PuLID (single-identity face-lock) -> Flux (GGUF still) -> Wan 2.2 i2v -> SeedVR2 upscale -> RIFE interpolation**

Direction chosen after the A/B against InstantID + SVD-XT. The four downstream stages are
PROVEN; the identity-lock stage is CANDIDATE (see status table) pending a standalone pass.

| Stage | Component | Notes |
|---|---|---|
| Identity lock | PuLID (`cubiq/PuLID_ComfyUI`) + InsightFace antelopev2 + EVA-CLIP | **CANDIDATE** — installed, not verified working standalone this session. Single subject only; two-person is BROKEN (see status table) |
| Still / keyframe | Flux, GGUF-quantized (`flux1-dev-Q5_K_S`, `t5xxl-encoder-Q5_K_M`) | quant chosen to fit 12GB; PuLID conditions this stage |
| Video | Wan 2.2 i2v (image-to-video) | one prompt = one continuous take (see Transitions section) |
| Upscale | SeedVR2 (`numz/ComfyUI-SeedVR2_VideoUpscaler`) | weights downloaded; optimization productionized (Beat 1 +33.3%, Beat 6 +44.4%) |
| Frame interpolation | RIFE | final smoothing pass |

This is the stack `conductor` / `script-to-shotlist.mjs` in `ftf-coworkers` should target once
that code is rewritten off the old Forge API — but do not wire automation to the PuLID
identity-lock stage until it is PROVEN (see Status Vocabulary).

### Face animation micro-moments — not in this file
Short talking / blink / smile beats for Aisha (2–4s each) are AdvancedLivePortrait, and the
locked 6-state command sequence + parameter table live in the **`aisha-motion` skill**. This
file does not duplicate it — `aisha-motion` is the source of truth for ALP. Referred to here as
"ALP".

---

## Component Status Table

| Component | Status | Note |
|---|---|---|
| PuLID single-identity face-lock | **CANDIDATE** | installed; not verified working standalone this session — no standalone identity-lock pass on record. Conditions the Flux still stage. Promote to PROVEN only with evidence of a passing run |
| PuLID two-person ("PuLID-2p") | **BROKEN** | two-identity conditioning fails — identity bleed / one face dominates. Do not retry blind; needs a named fix (separate conditioning paths or regional masking) before another attempt |
| Flux GGUF still generation | **PROVEN** | `flux1-dev-Q5_K_S` + `t5xxl` Q5_K_M |
| Wan 2.2 i2v | **PROVEN** | native image-to-video |
| SeedVR2 upscale | **PROVEN** | weights downloaded, optimization productionized |
| RIFE frame interpolation | **PROVEN** | |
| AdvancedLivePortrait (ALP) | **CANDIDATE — see `aisha-motion`** | installed and functional, but output does not yet conform to the locked "Aisha Motion Language" 6-state standard in `aisha-motion`. Micro-animation only, 2–4s ceiling; not for full shots. Promote to PROVEN once a clip matches the locked spec |
| InstantID + SVD-XT | **LEGACY** | was the v2 PROVEN pipeline; lost the A/B to PuLID + Wan 2.2, 29 Aug 2026 |
| Ken Burns still-motion (Beats 1/6) | **LEGACY** | tested Aug 2026; usable but frozen-face vs. real face performance. Replaced by ALP for Beats 1/6 |
| DreamShaperXL checkpoint | **LEGACY** | belonged to the InstantID + SVD-XT stack |

---

## Master Style Seed (LOCKED — ALWAYS APPEND)
"luxury Indian salon, warm golden lighting, shallow DOF, bokeh, 35mm film grain"
Never remove this from any prompt, any stage.

---

## Rules
1. Check the Component Status Table before assuming anything is available. Labels get updated
   the moment a status changes, in the same session — do not let this file go stale.
2. Always append the Master Style Seed to every prompt.
3. PuLID-2p is BROKEN. Do not attempt two-person identity lock without a named fix — flag it
   to Buddy instead.
4. Face animation (blink / smile / talk micro-beats) is ALP and lives in `aisha-motion` — do
   not re-derive it here.
5. ComfyUI / comfy-MCP work only from local Claude Code — cloud claude.ai sessions cannot
   reach `localhost:8188`.
6. Windows paths use backslash — never Linux paths in commands.
7. If VRAM runs out — reduce resolution first, then batch size.

---

## Wan 2.2 / Flow Prompting Reference — 99 Commands

Canonical source: https://app.notion.com/p/3c742284cc2281eda9bbf8f04f7d53a9?pvs=204
The full 9-category table is **mirrored below** (synced 2026-08-29) so coworkers do not need
Notion access mid-session. If the Notion page changes, re-sync this section.

### Why this section exists
Coworkers writing scripts / shot-lists do not freestyle camera language. They pick from this
fixed vocabulary using the Scene-Mood table, then fill the fixed template. This keeps every
Wan 2.2 / Flow prompt consistent with FTF's cinematic style instead of drifting shot to shot.

Note: three tokens are cross-listed across categories in the published list — `/cinematic`
(1 & 84), `/rimlight` (39 & 91), `/closeup` (3 & 97). That is intentional; the list is "99"
as published.

---

### The 99 Commands (mirrored from Notion, synced 2026-08-29)

#### 1. Camera & Movement (1–11)
| # | Command | What it does |
|---|---|---|
| 1 | /cinematic | Create a cinematic video shot |
| 2 | /droneview | Generate an aerial drone perspective |
| 3 | /closeup | Create an intense cinematic close-up |
| 4 | /wideangle | Generate a dramatic wide shot |
| 5 | /orbit | Smoothly orbit around the subject |
| 6 | /dollyin | Slowly push the camera toward the subject |
| 7 | /dollyout | Dramatically pull the camera away |
| 8 | /tracking | Track the subject while moving |
| 9 | /slowmotion | Create dramatic slow-motion action |
| 10 | /timelapse | Show time passing rapidly |
| 11 | /hyperlapse | Create fast cinematic camera movement |

#### 2. Advanced Camera Angles (12–22)
| # | Command | What it does |
|---|---|---|
| 12 | /lowangle | Shoot from below for a powerful look |
| 13 | /highangle | Shoot from above for a dramatic perspective |
| 14 | /overhead | Create a straight-down top view |
| 15 | /pov | Show the scene from a first-person perspective |
| 16 | /overtheshoulder | Create an over-the-shoulder shot |
| 17 | /establishing | Create a cinematic establishing shot |
| 18 | /rackfocus | Smoothly shift focus between subjects |
| 19 | /handheld | Create realistic handheld camera motion |
| 20 | /steadicam | Create smooth walking camera movement |
| 21 | /craneup | Lift the camera upward dramatically |
| 22 | /cranedown | Lower the camera smoothly |

#### 3. Motion & Action (23–33)
| # | Command | What it does |
|---|---|---|
| 23 | /running | Show dynamic running motion |
| 24 | /walking | Create natural walking movement |
| 25 | /turnaround | Smoothly rotate the subject |
| 26 | /reveal | Dramatically reveal the subject or scene |
| 27 | /entrance | Create a cinematic character entrance |
| 28 | /exit | Create a dramatic scene exit |
| 29 | /freeze | Freeze the action dramatically |
| 30 | /speedramp | Transition between fast and slow motion |
| 31 | /bullettime | Create a bullet-time camera effect |
| 32 | /floating | Make the subject appear to float |
| 33 | /falling | Create dramatic falling action |

#### 4. Cinematic Lighting (34–44)
| # | Command | What it does |
|---|---|---|
| 34 | /goldenhour | Warm cinematic sunset lighting |
| 35 | /bluehour | Cool atmospheric twilight lighting |
| 36 | /neonlight | Create vibrant cinematic neon lighting |
| 37 | /moody | Create dark, dramatic cinematic lighting |
| 38 | /softlight | Create soft diffused studio lighting |
| 39 | /rimlight | Add dramatic edge lighting |
| 40 | /silhouette | Create a powerful silhouette shot |
| 41 | /spotlight | Highlight the subject with focused light |
| 42 | /volumetric | Add cinematic light rays and atmosphere |
| 43 | /backlight | Create strong backlit visuals |
| 44 | /nightscene | Create a realistic cinematic night scene |

#### 5. Composition & Framing (45–55)
| # | Command | What it does |
|---|---|---|
| 45 | /wide | Use a wide composition to show the full scene |
| 46 | /tight | Use a tight frame to focus on the subject |
| 47 | /minimal | Create a clean minimal composition |
| 48 | /leadinglines | Use leading lines to guide the viewer's eye |
| 49 | /ruleofthirds | Apply the rule of thirds for balanced framing |
| 50 | /symmetry | Create a symmetrical composition |
| 51 | /foreground | Add strong foreground elements for depth |
| 52 | /framewithinframe | Use natural frames within the scene |
| 53 | /diagonal | Use diagonal composition for dynamic shots |
| 54 | /centered | Place the subject in the center |
| 55 | /negativespace | Use negative space for a powerful impact |

#### 6. Camera Effects (56–66)
| # | Command | What it does |
|---|---|---|
| 56 | /motionblur | Add motion blur for speed and movement |
| 57 | /zoomblur | Apply zoom blur for dramatic effect |
| 58 | /bokeh | Create background bokeh effect |
| 59 | /lensflare | Add cinematic lens flare |
| 60 | /vignette | Darken the edges for a cinematic look |
| 61 | /splittone | Apply split tone color grading |
| 62 | /monochrome | Convert the scene to black & white |
| 63 | /radialblur | Apply radial blur for a dynamic look |
| 64 | /prism | Add prism light refraction effect |
| 65 | /glitch | Add glitch effect for a digital vibe |
| 66 | /filmgrain | Add film grain for a vintage feel |

#### 7. Focus & Depth (67–77)
| # | Command | What it does |
|---|---|---|
| 67 | /macro | Capture extreme close-up details |
| 68 | /shallowdepth | Create a shallow depth of field |
| 69 | /deepfocus | Keep foreground and background sharp |
| 70 | /selectivefocus | Focus on the subject while blurring the rest |
| 71 | /eyefocus | Sharpen the eyes for an intense look |
| 72 | /centerfocus | Keep the center in focus with blurred surroundings |
| 73 | /tunnelfocus | Create a tunnel effect to draw attention |
| 74 | /focusstack | Combine multiple focus points for sharpness |
| 75 | /dropfocus | Focus on a specific droplet or detail |
| 76 | /manualfocus | Manually control the focus for precision |
| 77 | /bokehshape | Customize the shape of bokeh lights |

#### 8. Color Grading (78–88)
| # | Command | What it does |
|---|---|---|
| 78 | /warm | Apply warm tones for a cozy feel |
| 79 | /cool | Apply cool tones for a calm mood |
| 80 | /contrast | Increase contrast for bold visuals |
| 81 | /exposure | Adjust brightness and exposure levels |
| 82 | /saturation | Enhance or reduce color vibrancy |
| 83 | /desaturate | Reduce color for a muted look |
| 84 | /cinematic | Apply cinematic color grade |
| 85 | /tealorange | Apply teal and orange color grading |
| 86 | /vibrant | Boost colors for a vibrant look |
| 87 | /bw | Convert to black and white |
| 88 | /neon | Apply neon color grading effect |

#### 9. Portrait & Subject (89–99)
| # | Command | What it does |
|---|---|---|
| 89 | /portrait | Create a beautiful portrait shot |
| 90 | /beauty | Enhance natural beauty and skin tones |
| 91 | /rimlight | Add rim lighting around the subject |
| 92 | /backgroundblur | Blur the background to highlight subject |
| 93 | /sharpfocus | Keep the subject sharp and clear |
| 94 | /monotone | Apply black & white portrait effect |
| 95 | /lowkey | Create a dark low key effect |
| 96 | /highkey | Create a bright high key effect |
| 97 | /closeup | Capture detailed close-up shot |
| 98 | /fullbody | Show full body of the subject |
| 99 | /candid | Create a natural candid moment |

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

## Current Status (29 Aug 2026)
- ComfyUI: last confirmed v0.34.0 (26 Aug 2026); health-check unreachable at rewrite (server
  not running) — re-run before any render session
- ComfyUI <-> Claude Code bridge: `plugin:comfy:comfyui`
- PuLID + Wan 2.2: chosen direction (A/B concluded 29 Aug 2026). Flux GGUF / Wan 2.2 i2v /
  SeedVR2 / RIFE stages **PROVEN**
- PuLID single-identity face-lock: **CANDIDATE** — not verified standalone this session
- SeedVR2: **PROVEN**, weights downloaded, optimization productionized
- PuLID two-person: **BROKEN** — needs a named fix
- ALP (AdvancedLivePortrait): **CANDIDATE** — functional but diverges from the locked
  "Aisha Motion Language" spec; standard lives in `aisha-motion` skill
- InstantID + SVD-XT, Ken Burns Beat 1/6, DreamShaperXL: **LEGACY**
- `conductor.mjs` (ftf-coworkers repo): still targets old Forge API — needs rewrite to the
  PuLID + Wan 2.2 chain (hold the identity-lock stage until PuLID-1p is PROVEN)
