---
name: ftf-session-manager
description: FTF session manager for tracking tasks and context across sessions.
---

# FTF Session Manager

Enforces session discipline for Flare to Flame work. One task at a time. No drift. No clutter.

---

## SESSION START PROTOCOL

When a new session begins:

1. **Load memory** — Read userMemories and recent_updates block. Identify what was last completed and what is next pending.

2. **Confirm with Buddy** — State in ONE line: "Last done: [X]. Next up: [Y]. Proceeding?" Wait for confirmation before executing anything.

3. **Lock the task** — Once confirmed, execute that task fully before touching anything else.

4. **Flag distractions** — If Buddy introduces a new topic mid-task, say: "Flagging this as a distraction from [current task]. Want to park it or switch?" Do not silently absorb and execute.

---

## DURING SESSION RULES

- Complete ONE task fully before starting the next
- Never create Notion pages unless Buddy explicitly says so
- Never update Notion unless Buddy says "update Notion now"
- All decisions require pros/cons before execution
- GitHub pushes: always strip sensitive tokens before pushing
- English only — no Hinglish in any FTF output
- No prices, no salon address/location on any public-facing content
- Flag immediately if any output touches: prices, location, Hinglish, dark backgrounds, more than 5 cards per page

---

## SESSION END PROTOCOL

When Buddy says done, wrap up, closing, I am done for today:

1. State what was completed this session
2. State what is pending in order
3. Update memory using memory_user_edits tool — completed tasks + next session first tasks
4. Confirm: "Memory updated. Next session I will start with: [X]."

---

## FTF CONTEXT SNAPSHOT

- Business: Flare to Flame — luxury unisex salon, Rajnagar Extension, Ghaziabad
- Brand: Gold #C9A84C + Off-White #F3ECED. Tagline: Start the Spark. Become the Flame.
- Stack: Airtable (61 services, 10 tables) + Make.com + HeyGen (Aisha) + HTML app + GitHub
- Language: English only. No Hinglish. No exceptions.
- Privacy: No prices anywhere. No salon address until official opening day.
- App: services.html live on GitHub (flaretoflame-hash/flare-to-flame). PAT local only, never in GitHub.
- Flare Engine v1: S1 FINAL. S2 logo test PENDING. Distribution starts after logo test confirmed.

---

## ANTI-DRIFT RULES (hard stops — never bypass)

1. Do NOT create Notion pages without explicit permission
2. Do NOT update Notion without explicit permission
3. Do NOT start a second task before first is complete
4. Do NOT push files to GitHub with real tokens or PATs embedded
5. Do NOT generate content with prices, location, or Hinglish
6. Do NOT absorb a new task mid-session without flagging it first
7. Do NOT apologize — direct, risk-aware guidance only

---

## TASK PRIORITY ORDER (current)

1. Complete FTF app (blocked on Airtable login — resume when Airtable access confirmed)
2. Install external skills one by one from approved repo list
3. Build custom skills: GPU skill, Summary skill, Self-improving memory skill
4. Flare Engine v1: S2 logo overlay test
5. Flare Engine v2: ComfyUI install then quality test
6. Marketing automation (Instagram + WhatsApp) — after app complete
7. Notion update — only when Buddy says go

---

## APPROVED EXTERNAL SKILLS LIST (install one by one, confirm before each)

1. Brand Guidelines — github.com/anthropics/skills/tree/main/skills/brand-guidelines
2. Marketing Skills — github.com/coreyhaines31/marketingskills
3. Web Artifacts Builder — github.com/anthropics/skills/tree/main/skills/web-artifacts-builder
4. Optimization — github.com/muratcankoylan/agent-skills-for-context-engineering
5. Claude SEO — github.com/AgricDaniel/claude-seo
6. Theme Factory — github.com/anthropics/skills/tree/main/skills/theme-factory
7. Canvas Design — github.com/anthropics/skills/tree/main/skills/canvas-design
8. Debugging — github.com/obra/superpowers
9. Remotion — github.com/remotion-dev/remotion (Phase 2)

---

## PERMANENT YAML RULE

All FTF SKILL.md files must wrap the description value in double quotes.
Never leave colons or special characters unquoted in YAML frontmatter.
Test: paste frontmatter into a YAML validator before pushing.
