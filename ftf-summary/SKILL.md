---
name: ftf-summary
description: "End-of-session summary generator for Flare to Flame. Triggers when: Buddy says summarize, wrap up, end session, what did we do today, update Notion, update memory, or session is naturally closing. Generates structured summary in locked format. Updates memory and Notion together — Notion only with explicit permission."
---

# FTF Session Summary Skill

## Purpose
Generate consistent, structured end-of-session summaries for Flare to Flame.
Keep memory accurate. Keep Notion clean. Never duplicate. Never guess.

---

## Trigger Phrases
- "summarize", "wrap up", "end session", "close session"
- "what did we do today", "today's progress"
- "update Notion", "update memory", "save progress"
- Session naturally winding down

---

## Summary Output Format (ALWAYS USE EXACTLY THIS)

```
SESSION SUMMARY — [DD MMM YYYY]

DONE TODAY ✅
1. [Specific task — not vague]
2. [Specific task]

LOCKED THIS SESSION 🔒
1. [Decision confirmed locked]

PENDING ❌
1. [Task started but not finished — state where it stopped]

BLOCKED ⏸
1. [Task blocked — reason + unblock date if known]

NEXT SESSION 🎯
1. [Task 1 — highest priority first]
2. [Task 2]
3. [Task 3]

RISKS TO WATCH ⚠️
1. [Live risk or time-sensitive item]
```

---

## Memory Update Rules
After Buddy approves the summary:
1. Update userMemories with session delta only — not full rewrite
2. Add NEXT SESSION tasks to recent_updates block
3. Flag any locked decisions added this session
4. Never update Notion without Buddy saying "update Notion" explicitly

---

## Notion Update Rules (STRICT)
- Always search Notion BEFORE creating anything
- Never create duplicates — update existing pages only
- Master pages (never touch structure, only update content):
  - "FTF Command Center"
  - "MASTER RECONCILIATION — All Pending Tasks"
  - "FTF Claude Brain"
- Only act after explicit: "update Notion" or "yes update Notion"
- After updating: confirm which page was updated and what changed

---

## Permanent Locked Context (Always Carry Forward)
These never reset — include in summary only if changed this session:
- Brand: Gold #C9A84C + Off-White #F3ECED — exact hex only
- No prices anywhere. No address until opening day.
- English only — no Hinglish in any content
- WhatsApp: 919718831333
- Airtable blocked until 1 June 2026
- Flare Engine v1 S2 logo test = PENDING (unblock after Airtable)
- services.html on GitHub — Airtable Base ID to be added 1 June
- Flare Engine v2 — ComfyUI install = next GPU step (GO/NO-GO gate pending)
- 61 services FINAL — do not touch Sort Order, Active status, or Experience Detail

---

## What NEVER Goes in a Summary
- Vague entries: "worked on app", "discussed design" — be specific always
- Prices or cost figures on client-facing items
- Salon address or location (until opening day)
- Duplicate tasks already captured in prior summaries
- Speculation — only confirmed completed work goes in DONE TODAY

---

## Summary Quality Check (Before Presenting)
Ask internally before outputting:
1. Is every DONE item specific enough to act on next session? ✅
2. Is every PENDING item showing exactly where it stopped? ✅
3. Is NEXT SESSION ordered by priority — most critical first? ✅
4. Are any risks time-sensitive flagged with dates? ✅
5. Does the summary fit in one scroll on mobile? ✅

---

## Working Style Rules (Active Every Session)
1. Buddy decides. Claude executes.
2. Complete one task fully before moving to next.
3. Number all options — no bullet soup.
4. Pros/cons before locking any decision.
5. No apologies — direct, risk-aware guidance only.
6. Flag brand violations proactively: location, prices, dark theme, Hinglish.
7. Maximum 4 steps per task at a time.
8. If something failed before — say so. Never repeat silently.
