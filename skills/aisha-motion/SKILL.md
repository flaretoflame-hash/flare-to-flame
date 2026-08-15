---
name: aisha-motion
description: The locked motion/parameter standard for animating Aisha via ComfyUI's AdvancedLivePortrait — the verified 6-state command sequence, starting parameter table, the six causes of "AI-looking" motion, and FFmpeg finishing rules. Use this whenever building, editing, or discussing a LivePortrait/AdvancedLivePortrait workflow for Aisha, even if the user just says "animate Aisha," "make a LivePortrait clip," "add a blink/smile to Aisha," or names ExpressionEditor/motion_link/AdvancedLivePortrait nodes — don't wait for them to name this skill or say "LivePortrait" explicitly. Critical: if a workflow is being built against the OLD 5-state frame table (0-9/10-17/18-31/32-37/38-49/50-71), stop — that table is superseded, use the corrected 6-state sequence in this skill instead.
---

# Aisha Motion — LivePortrait Standard

Source of truth: Notion page **"🎭 Aisha Motion Language — LivePortrait Standard"** (locked 15 Aug 2026). This skill is a working copy of that page for in-session use — if the Notion page changes, this file needs to change with it. Cross-checked against `PowerHouseMan/ComfyUI-AdvancedLivePortrait`'s actual `nodes.py` and the LivePortrait paper (arXiv 2407.03168), not just theory.

## Core principle — read this before touching any parameter

**Aisha is not a talking avatar. She is a premium human presence, on screen for 2-4 seconds at a time.**

LivePortrait manipulates learned facial motion on an existing still — it doesn't simulate real skin, optics, or facial muscle behavior. It cannot sustain 30 seconds of natural-looking performance. It's genuinely excellent at short, controlled, premium micro-moments. Design around that ceiling, don't fight it:

- Aisha: 2-4s of premium presence
- B-roll: 15-22s carrying the story (hair, texture, hands, tools, transformation)
- Aisha returns: 2-4s for the close/invitation

Confirmed on the local pipeline (RTX 3060 12GB): static-Aisha → micro-expression, subtle head movement, blink + eye movement + subtle smile, and a premium 2-3s cinematic insert all work well. Long natural conversation or highly expressive acting does **not** — that's where commercial tools (HeyGen, D-ID) win, and where this pipeline shouldn't compete. If a request implies more than a few seconds of continuous Aisha performance, push back and suggest breaking it into B-roll-separated micro-moments instead.

## The six causes of "AI-looking" motion

If a test clip "looks AI," it's almost always one of these — check in order:

1. **Motion starts/stops too cleanly.** Real human motion overlaps (eyes lead, head follows, blink happens mid-movement). Turn → blink → smile as three neat separate events reads as choreography, not reaction.
2. **Linear velocity curves.** Constant-rate movement looks robotic even at tiny amplitudes — the straight-line motion is the problem, not the size of the movement. Needs ease-in → cruise → ease-out, with a tiny settle after.
3. **Isolated, symmetrical blinks.** Real blinks are asymmetric: close quickly → brief compression → reopen more slowly. A blink while the head is completely frozen reads as more synthetic than one occurring during small head movement.
4. **Smile treated as a single mouth deformation.** A premium smile involves cheeks + mouth corners + slight eye involvement, not just the mouth. Mouth-only change reads as an "overlay."
5. **Eyes without intention.** Eyes should lead, head should follow — not head-rotates-while-eyes-stay-mathematically-fixed.
6. **Source image quality ceiling.** LivePortrait can't manufacture photographic qualities absent from the source still. Overly perfect skin, dead catchlights, excessive sharpening, and artificial symmetry all become *more* visible after animation, not less. The master still must already be premium before animating it — LivePortrait is a motion layer, not a cinematography layer.

## ⚠️ Superseded — do not build against this

An earlier 5-state frame table (0-9 / 10-17 / 18-31 / 32-37 / 38-49 / 50-71, mapped to Neutral / Eye lead / Head movement / Blink / Smile formation / Settle) was the original plan. **It was conceptual and has since been corrected against AdvancedLivePortrait's real source.** If you see this table, or anyone — including past-you in an old conversation — is about to build a `command` string against it, **stop and flag it as superseded.** Use the 6-state sequence below instead. The 5-state table is kept only as historical reference for why the correction happened.

## The corrected 6-state command sequence (verified against `nodes.py`)

The key correction: AdvancedLivePortrait's `command` parser is a **sequential state machine, not parallel tracks**. You cannot run blink on an independent timeline overlapping head movement. Real overlap is achieved by baking the blink into a compound state reached *while* the head motion is still resolving — not two simultaneous commands.

Syntax: `[motion_link_index]=[change_frames]:[keep_frames]` per line. `change` = frames to linearly interpolate the expression delta over. `keep` = frames to hold before the next command starts. **The interpolation is linear by design — the node has no built-in easing.** Easing has to come from FFmpeg post-processing, or from using more/shorter intermediate states to approximate a curve.

**Use this sequence:**
```
0=10:0
1=8:0
2=7:0
3=7:0
4=12:0
5=28:0
```
(10+8+7+7+12+28 = 72 frames = 3.000s at 24fps)

| Frames | State | Content |
|---|---|---|
| 0-9 | 0 — Neutral | Source state, zero delta |
| 10-17 | 1 — Eye lead | yaw=0.3, pupil_x=2.0, blink=0, smile=0 |
| 18-24 | 2 — Head begins | yaw=1.4, pupil_x=1.5, blink=0, smile=0.02 |
| 25-31 | 3 — Head + blink | yaw=2.0, pupil_x=1.5, blink=-5, smile=0.04 — blink onset while head motion is still resolving, this IS the overlap |
| 32-43 | 4 — Head + smile | yaw=2.0, pupil_x=1.5, blink=0, smile=0.10 |
| 44-71 | 5 — Settle | yaw=1.7, pupil_x=1.2, blink=0, smile=0.10 |

The `motion_link` chain (daisy-chained `ExpressionEditor` nodes) must contain these 6 states in order — index 0 is the neutral/source state, index N is the Nth chained `ExpressionEditor`'s target expression. Command line `0=...` always refers to a fresh neutral `ExpressionSet`, not `motion_link[0]` directly (see `AdvancedLivePortrait.parsing_command` in `nodes.py` if verifying this again).

AdvancedLivePortrait also exposes `OnlyEyes` / `OnlyRotation` / `OnlyMouth` / `All` sample-part modes. Building 3 separate passes (head-only, eyes-only, expression-only) and compositing is a viable technique worth exploring once the base 6-state structure is proven — not before.

## Starting parameter table

| Control | Value | Note |
|---|---|---|
| crop_factor | 1.7 | Starting point |
| rotate_yaw | 2.0° | Node reverses sign internally — don't manually compensate unless deliberately choosing the opposite direction |
| rotate_pitch | 0.5° | |
| rotate_roll | 0° | |
| pupil_x | 2.0 max | Keep tiny — target is "perceived attention," not visible eye movement. Do not start above 2.0 |
| pupil_y | 0 | |
| blink | -5.0 | Baseline only — don't combine with wink or eyebrow movement |
| eyebrow | 0 | |
| wink | 0 | |
| aaa / eee / woo | 0 / 0 / 0 | Don't add mouth-shape controls yet |
| smile | 0.10 | Test 0.10 first; if the source still already has a hint of smile, test 0.06-0.08 instead. Our first test used 0.13 — slightly strong for baseline |
| retargeting_eyes | 0 | Controlling Aisha directly, not copying another performer |
| retargeting_mouth | 0 | |
| stitching | ON | Keep on unless there's a specific reason to disable — reduces jitter/identity leakage |
| sample_parts | All (final) | Use `OnlyEyes` / `OnlyRotation` / `OnlyMouth` for isolated passes when composing separately |

**Motion envelope ranges** (a range to work within, not fixed values): total duration 2.6-3.2s · yaw ±1.5-3° · pitch ±0.5-1.5° · roll ~0-0.5° · smile ~0.06-0.16 · hold before movement ~0.3-0.6s · main movement ~0.6-1.0s · expression formation ~0.4-0.8s · final settle ~0.3-0.6s.

## FFmpeg finishing — multi-pass encoding warning

**Never save LivePortrait's output as H.264 and then pipe it through FFmpeg twice** (once for camera move, again for color grade). That's double/triple quantization, and the artifacts land exactly where it matters most for Aisha: macroblocking and color bleeding around the eyes and lips.

**Fix:**
1. Export LivePortrait's output as **ProRes 422 HQ (`prores_ks`) or FFV1, in `.mkv`/`.mov` — never H.264** — as the lossless intermediate.
2. Run **one combined FFmpeg pass**: camera motion + color grade + final H.264 export together, in a single filtergraph. Not stacked passes.

### Camera movement — verified command, one unresolved conflict

`scale (eval=frame) → crop → setsar` reproduces a smoothstep-eased push-in (100%→101.5% scale, tiny X/Y drift) without zoompan's still-image assumptions:
```
ffmpeg -i input.mp4 -vf "scale=w='trunc(1080*(1+0.015*(n/71)*(n/71)*(3-2*(n/71)))/2)*2':h='trunc(1920*(1+0.015*(n/71)*(n/71)*(3-2*(n/71)))/2)*2':eval=frame,crop=1080:1920:x='(iw-ow)/2+3*(n/71)*(n/71)*(3-2*(n/71))':y='(ih-oh)/2-2*(n/71)*(n/71)*(3-2*(n/71))',setsar=1" -c:v libx264 -crf 16 -preset medium -pix_fmt yuv420p -an output_camera_move_eased.mp4
```
This exact command assumes 1080×1920, 24fps, 72 frames. If actual output resolution/frame count differs, the movement constants (3px/2px/0.015) must be scaled proportionally — do not reuse unchanged on a different resolution.

**⚠️ UNRESOLVED — do not treat either approach as final.** `scale→crop→setsar` (above) was recommended on the reasoning that `zoompan` is built for animating a still into video, not moving through an already-existing multi-frame clip. A second-model cross-check instead used `zoompan` directly on existing video (with `format=gbrp` to avoid chroma-subsampling artifacts, and the source pre-scaled 15% up to avoid edge black-bars). **This has not been tested.** Before building the real pipeline, run both on the same test clip and compare edge artifacts, sub-pixel jitter, and whether `zoompan`'s `d=` parameter behaves correctly on pre-existing video vs. a still-image source. Whichever produces the cleaner result on actual footage wins — this is a testable question, not a style preference. If asked to pick one without having run this comparison, say so rather than silently defaulting to one.

## Beyond this skill

This skill covers the LivePortrait mechanics specifically — the command sequence, parameters, and the camera/encoding rules that apply directly to Aisha's output. The Notion source page also carries reel-level editorial principles (cold-open structure, energy-curve pacing, unsynced-VO micro-animation techniques like jaw compression and micro-saccades, and the TEST-A/B/C validation plan) that apply more broadly to reel assembly — pull from the Notion page directly for that, rather than treating this file as a full duplicate.
