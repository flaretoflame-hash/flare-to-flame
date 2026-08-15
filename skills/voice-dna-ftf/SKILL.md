---
name: voice-dna-ftf
description: Makes new Flare to Flame content sound like FTF specifically — not generic AI copy — by pulling tone, rhythm, and phrasing patterns from FTF's own locked content libraries (Hook Bank, Body Bank, past approved scripts) instead of a generic writing style. Use this for any new FTF content-generation request — reel scripts, captions, hooks, body copy, WhatsApp/Instagram messages — even if voice isn't mentioned explicitly, and always when the user says "make it sound like us," "match our voice," "does this sound on-brand," or asks for a check before something goes live.
---

# Voice-DNA-FTF

Generic AI writing makes *good* content. This skill makes it sound like Flare to Flame *specifically* — built from FTF's own locked libraries, not borrowed from a stranger's writing style.

For anything visual — colors, fonts, card design — defer to `ftf-brand-guidelines` in this same repo; that skill owns those specifics and this one doesn't restate them.

## Source material — pull from these, not invented examples

1. **Hook Bank** (Notion: "🪝 Hook Bank") — live library of opening lines, tagged by cinematic world + flow type, with a `[CANDIDATE]` → `[ACTIVE]` → `[RETIRED]` status system. Fetch this page before writing a hook rather than relying on memory — it's actively growing and status changes.
2. **Body Bank** (Notion: "📝 Body Bank") — library of body-copy *shapes* (structure, not exact wording), same status system. Key rule baked into every entry: body lines describe what the customer *experiences*, never technical/clinical terms.
3. **Mehsoos Bank** — the sensory word discipline: *one sensory word per script* (mehsoos = "feel" in Hindi/Urdu — name the felt moment before naming the service). ⚠️ Known gap: no accessible page with the actual bank entries was found in Notion or this repo when this skill was built (16 Aug 2026) — only the discipline rule itself is documented. Apply the discipline; don't invent entries to fill the bank. If you need real Mehsoos Bank entries, ask rather than fabricating plausible-sounding ones.
4. **Past approved scripts/captions** — not indexed anywhere in this repo. If matching a specific prior approved piece matters, ask for it directly rather than guessing at what "past approved" content sounded like.

## FTF Voice-DNA

| Trait | FTF Voice |
|---|---|
| Tone | Warm, cinematic, quietly confident — never loud or salesy |
| Phrasing | Plain English, conversational, never corporate or jargon-heavy |
| Rhythm | Uneven on purpose — short punch lines mixed with one longer reflective line |
| Sentence length | Mostly short; one slightly longer sentence for emotional weight |
| Favorite move | Naming a private feeling before naming the service (mehsoos — the felt moment comes first) |
| Closing style | Soft invitation, never a hard sell |
| Forbidden | Prices, salon address (pre-opening), Hinglish/mixed language, hard-sell language — see `ftf-brand-guidelines`'s Content Rules for the authoritative list, don't restate a separate version here |
| Always preserved | Ayurvedic ingredient names in their original Hindi/Sanskrit form, untranslated |

## Process

1. Before writing new FTF content, pull 3-5 relevant entries from Hook Bank / Body Bank that match the service or topic — fetch the live Notion pages, don't rely on cached memory of what they contained last time.
2. Match their tone, rhythm, and the mehsoos-first pattern (feeling named before the service/feature).
3. Check the result against `ftf-brand-guidelines`'s hard-stop content rules (no prices, English only, no hard sell, etc.) as a final pass.
4. If a genuinely new, reusable voice pattern emerges from the work and gets approved, that's a candidate for a fresh Hook/Body Bank entry — but adding to those libraries is a curation decision, not something this skill does unprompted.

## Output format

When asked "does this sound on-brand," give a direct verdict (on-brand / off-brand) naming the specific trait that's off, plus a one-line fix — not a long essay.

## What this skill does not cover (known gaps, not silently assumed)

This skill was rebuilt from an older draft that also referenced `aisha-voice-engine.md` (a fuller spoken-voice spec — structure variation, one concrete specific, controlled imperfection) and two finishing passes, `anti-ai-ftf` and `dumbify-ftf`. None of these have accessible rule content in this repo or in Notion as of 16 Aug 2026 — they're referenced by name elsewhere but the actual rules weren't findable. Don't apply guessed versions of these under their names; if they matter for a given task, ask for the source content first, or treat this skill's own trait table above as the current, complete standard until they're properly built.
