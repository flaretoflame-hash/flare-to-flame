---
name: gpu-ftf
description: Local GPU B-roll generation for Flare Engine v2. NVIDIA 3060 12GB.
---

# GPU - Flare Engine v2 Local B-Roll Skill

## Purpose
Guide all local GPU-based B-roll generation for Flare Engine v2.
Scene 2 and Scene 4 ONLY. HeyGen handles Scene 1 and Scene 3 (Aisha avatar).
Free. No cloud costs. Runs entirely on Buddy's machine.

---

## Hardware Stack (LOCKED)
- GPU: NVIDIA GeForce RTX 3060 12GB VRAM
- Software: ComfyUI + Flux SDXL + SVD img2vid-xt-1-1
- OS: Windows
- Cost: Free (local)
- Estimated generation time: 60 to 90 min per full video

---

## 4-Scene Structure (LOCKED)
- Scene 1: HeyGen (Aisha) - Hook
- Scene 2: LOCAL GPU - Vulnerability / Environment B-roll
- Scene 3: HeyGen (Aisha) - Transformation
- Scene 4: LOCAL GPU - CTA / Result B-roll

---

## Master Style Seed (LOCKED - ALWAYS APPEND)
"luxury Indian salon, warm golden lighting, shallow DOF, bokeh, 35mm film grain"
Never remove this from any Flux prompt. This is the FTF visual signature.

---

## ComfyUI Setup Sequence (STRICT ORDER)
1. Install ComfyUI on Windows
2. Download Flux SDXL checkpoint (safetensors)
3. Download SVD img2vid-xt-1-1 model
4. Run a single test generation (1 image to 1 clip)
5. Apply GO/NO-GO gate - only proceed if PASS
6. Integrate into Flare Engine v2 pipeline after GO

---

## GO/NO-GO Quality Gate (MANDATORY BEFORE PIPELINE)
Test output must pass ALL 5 before proceeding:
1. Warm golden lighting visible
2. Bokeh / shallow DOF present
3. No clinical, sterile, or stock-photo look
4. Colour temperature matches HeyGen Aisha scenes
5. SVD motion is smooth - no jitter, no distortion

If ANY fail = NO-GO. Fix prompt or settings. Retest. Never bypass gate.

---

## Flux SDXL Prompt Formula
[Subject] + [Action] + [Location] + [Master Style Seed]

Negative prompt (always use):
"dark background, harsh lighting, generic stock photo, clinical, overexposed, text, watermark, blurry, low quality"

---

## Scene 2 Prompt Examples
- "Indian woman stepping into a luxury salon entrance, warm golden ambient light, shallow depth of field, bokeh background, 35mm film grain"
- "close-up of tired hands touching dry hair ends, soft warm light, cinematic bokeh, luxury Indian salon, 35mm film grain"

## Scene 4 Prompt Examples
- "confident Indian woman smiling at mirror in luxury salon, warm golden glow, shallow DOF, bokeh, 35mm film grain"
- "salon reception counter with gold accents, soft bokeh background, warm ambient light, cinematic grain"

---

## SVD Workflow
1. Generate still image using Flux SDXL
2. Feed image into SVD img2vid-xt-1-1 node in ComfyUI
3. Output: 2 to 4 second smooth video clip
4. Export as MP4 H.264
5. Hand off to FFmpeg for scene stitching

---

## FFmpeg Stitch Command
ffmpeg -i scene1_heygen.mp4 -i scene2_svd.mp4 -i scene3_heygen.mp4 -i scene4_svd.mp4 -filter_complex "[0:v][1:v][2:v][3:v]concat=n=4:v=1:a=0" -c:v libx264 -crf 18 output_final.mp4

All scenes must be same resolution and frame rate before stitching.

---

## Rules
1. Never use cloud B-roll for Scene 2 and Scene 4 - local GPU only
2. Always append master style seed to every Flux prompt
3. Always run GO/NO-GO gate before pipeline integration
4. Never change the 4-scene structure
5. ComfyUI install comes before any prompt engineering
6. If VRAM runs out - reduce resolution first, then batch size
7. Windows paths use backslash - never Linux paths in commands

---

## Current Status
- ComfyUI: NOT YET INSTALLED (next step)
- Flux SDXL: NOT YET DOWNLOADED
- SVD: NOT YET DOWNLOADED
- GO/NO-GO test: PENDING
- Pipeline integration: BLOCKED until GO confirmed
