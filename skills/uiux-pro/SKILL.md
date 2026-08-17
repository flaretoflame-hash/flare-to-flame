---
name: uiux-pro
description: Luxury UI/UX standards enforcer for Flare to Flame app design and all screens.
---

# UI/UX Pro - Flare to Flame

## Purpose
Enforce luxury UI/UX standards on every FTF screen and component.
Read this skill before building any screen, component, or UI element.

---

## Fonts (LOCKED)
- Headings: Playfair Display (serif, luxury)
- Body/UI: Outfit (clean, modern)
- Both loaded via Google Fonts in every HTML file

Google Fonts import (always include):
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');

---

## Core Design Rules (LOCKED)
- Mobile-first always
- Page background: #F3ECED off-white - never pure white, never dark
- Card surface: #FFFFFF pure white
- Text: #2C2C2C dark charcoal
- Gold accent: #C9A84C - accent and buttons only, never page fill
- Card shadow: 0 2px 16px rgba(201,168,76,0.08) - gold-tinted ONLY, never grey
- Rounded corners: cards 16px, buttons 12px
- Animation: 17s cycle, subtle only
- 5 cards per page - never more
- WhatsApp CTA fixed every screen: 919718831333
- No prices anywhere ever
- No address until opening day

---

## Background Smoothness (Apple-level finish)
Use this exact CSS for page background - never a flat colour:
body {
  background-color: #F3ECED;
  background-image: radial-gradient(ellipse at top left, #F9F4F5 0%, #F3ECED 60%);
  min-height: 100vh;
}

---

## Typography Hierarchy (LOCKED)
- Category label: Outfit 12px uppercase letter-spacing 0.1em
- Service name: Playfair Display bold 22px
- Description: Playfair Display italic 14px line-height 1.6
- CTA button: Outfit 14px medium
- Page heading: Playfair Display bold 28-32px
- Sub-heading: Outfit 16px medium

---

## Button Standards (LOCKED)
Primary button (Book on WhatsApp):
  background: #C9A84C
  color: #FFFFFF
  border-radius: 12px
  font: Outfit 14px medium
  padding: 12px 24px

Ghost button (Share Feedback):
  background: transparent
  border: 1.5px solid #C9A84C
  color: #C9A84C
  border-radius: 12px
  font: Outfit 14px medium
  padding: 12px 24px

---

## 8-Category Color System (LOCKED - DO NOT TOUCH)
ChatGPT designed the cinematic backgrounds.
Claude only populates structure - never redesigns these cards.

1. Hair - Lavender
2. Skin - Peach
3. Makeup - Pastel Pink
4. Nails - Pearl Mint
5. Waxing - Warm Nude Gold
6. Threading - Frost Ivory Silver
7. Grooming - Deep Teal Emerald
8. Packages/Signature - Aurora Prism

Kids cards inherit parent service color.

---

## Card Structure (LOCKED)
- ChatGPT cinematic PNG = background (DO NOT TOUCH)
- Claude adds: glass overlay, typography, layout, CTA
- Same layout every card - emotion rotates underneath
- Subcategory = same color as category, different luxury font style
- Decorative pattern varies per subcategory
- Card border-radius: 16px
- Card shadow: 0 2px 16px rgba(201,168,76,0.08)

---

## What Claude NEVER Does
- Never changes the cinematic PNG background on service cards
- Never changes category color assignment
- Never adds prices
- Never removes the glass overlay system
- Never uses grey shadows
- Never uses dark backgrounds
- Never uses fonts other than Playfair Display and Outfit
- Never puts more than 5 cards per page
- Never shows salon address before opening day

---

## Softr Layout Reference (LOCKED)
- Logo: top left
- Aisha image: right side of header, same row as logo
- Staff Login: bold, top right
- Filter: box style - no changes
- Cards: liquid style, 5 per page
- Thumbnail: square, bigger size, breathing room around it
- Animation: 17 second cycle
- Carousel: liquid card design (old carousel replaced)
- Palette: full SS2 gold wash on cards

---

## Skill Activation Order (MANDATORY)
Before building any app screen - activate in this order:
1. ftf-brainstorming (frame the problem first)
2. uiux-pro (this skill - apply brand rules)
3. frontend-design (rendering quality and smoothness)
4. impeccable (final quality check before delivery)

Never skip this order. Never deliver without impeccable check.
