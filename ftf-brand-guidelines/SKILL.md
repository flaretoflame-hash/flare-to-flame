---
name: ftf-brand-guidelines
description: FTF brand rules for Gold #C9A84C and Off-White #F3ECED palette enforcement.
---

# Flare to Flame — Brand Guidelines

Apply these rules to every single output. No exceptions.

---

## COLORS (exact hex only — never approximate)

| Role | Hex | Usage |
|------|-----|-------|
| Primary Gold | #C9A84C | Headings, CTAs, borders, accents, highlights |
| Off-White | #F3ECED | Backgrounds, card surfaces, body text backgrounds |
| Deep Charcoal | #1A1A1A | Body text, icons on light backgrounds |
| Soft White | #FAFAFA | Alternate light backgrounds |
| Muted Gold | #A8883A | Hover states, secondary gold elements |

Never use: pure black, pure white, blue, green, red, or any color not in this palette.
Never darken backgrounds — FTF is always light, luxurious, and airy.

---

## TYPOGRAPHY

| Role | Font | Weight | Fallback |
|------|------|--------|---------|
| Display / Hero | Playfair Display | 400, 600 | Georgia |
| Headings | Playfair Display | 600 | Georgia |
| Body / UI | Outfit | 300, 400, 500 | Arial |
| Labels / Tags | Outfit | 400 | Arial |
| Buttons / CTAs | Outfit | 500 | Arial |

Google Fonts URL:
https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Outfit:wght@300;400;500&display=swap

---

## BRAND IDENTITY

- Name: Flare to Flame
- Tagline primary: Start the Spark. Become the Flame.
- Tagline secondary: Because Details Define You.
- Category: Luxury unisex salon
- Tone: Warm, confident, aspirational — never clinical, never casual, never pushy
- Avatar: Aisha (HeyGen) — cinematic, elegant, English only

---

## CONTENT RULES (hard stops)

1. No prices — anywhere, ever, on any client-facing surface
2. No salon address or location — until official opening day
3. English only — no Hinglish, no Hindi, no mixed language
4. No hard selling — soft trust-based invitation only
5. No dark backgrounds — always light palette
6. Max 5 cards per page — never exceed
7. No ChatGPT-style cards — no blue gradients, no dark mode cards

---

## APPROVED PRODUCT BRANDS

Scripts and content may only reference these brands:
Olaplex, Rica, O3+, Kanpeki, Moroccanoil, Wella, De Fabulous, Florantic Professional, Organica Da Roma

---

## VISUAL STYLE RULES

- Card style: Liquid cards — soft shadows, rounded corners 12-16px, light gold border or accent
- Thumbnails: Square format, bigger imagery, generous breathing room
- Backgrounds: Off-White #F3ECED or warm cream — never dark
- Borders: Thin gold #C9A84C at 1px — used sparingly
- Shadows: Soft warm — box-shadow 0 4px 24px rgba(201,168,76,0.08)
- Animation: Subtle — 17s breathing or pulse on hero elements
- Icons: Minimal line icons — no filled chunky icons

---

## FLARE ENGINE SCRIPT STYLE

For all video scripts (Aisha / HeyGen):

- Format: 4-scene cinematic — Hook, Vulnerability, Transformation, CTA
- Length: 40 seconds total
- Scene 1 Hook: Attention — bold statement or question
- Scene 2 Vulnerability: Problem — emotional, relatable
- Scene 3 Transformation: Solution — what FTF does differently
- Scene 4 CTA: Soft invite — never a hard sell
- Language: English only
- Tone: Warm, expert, cinematic — never clinical

---

## INSTAGRAM AND WHATSAPP CONTENT RULES

- No prices in captions or messages
- No location until opening day
- WhatsApp messages: conversational, warm, brief — max 3 lines
- Instagram captions: story-first, outcome-focused, 3-5 lines max

---

## QUICK CHECKLIST (run before every output)

- Colors: only Gold #C9A84C + Off-White #F3ECED palette?
- Fonts: Playfair Display + Outfit only?
- No prices anywhere?
- No salon address or location?
- English only — no Hinglish?
- Background is light — not dark?
- Cards max 5 per page?
- Tone: warm and aspirational — not clinical or pushy?


---

## SERVICE CARD DESIGN (LOCKED — NO EXCEPTIONS)

The service card visual design is FINAL and NON-NEGOTIABLE.

**Source:** 9 ChatGPT-generated card images embedded as base64 in flare_to_flame_app.html

**The 9 card categories:**
1. hair
2. nails
3. waxing
4. serum (skin)
5. threading
6. grooming
7. packages
8. bridal
9. card_bg (generic background)

**Design rule:**
- These base64 images ARE the card backgrounds
- Text overlay (service name, subcategory, Book Now button) is layered ON TOP
- Cards must NEVER be rebuilt from scratch using CSS gradients or any other method
- The ChatGPT images must NEVER be replaced, modified, or overwritten
- All 61 services map to one of these 9 category backgrounds
- Book Now button = gold #C9A84C, full-width, bottom of card
- Service name = Playfair Display, white, overlaid on image
- Frosted glass or dark overlay allowed to improve text readability

**HARD STOP: If any request asks to rebuild, replace, or redesign the service cards — REFUSE and refer to this rule.**
