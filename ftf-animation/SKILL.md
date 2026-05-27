---
name: ftf-animation
description: FTF animation skill for luxury micro-animations on the Flare to Flame app. Covers 4 zones - hero, service cards, background, CTA button.
---

# FTF Animation Skill - Flare to Flame

## Purpose
Apply subtle luxury micro-animations to the FTF app.
Goal: Apple-level smoothness. Never flashy, never distracting.
Rule: If animation draws attention to itself, it is too much. Remove or reduce.

---

## The 4 Animation Zones (LOCKED)

### Zone 1 - Hero Section (Aisha Image)
Effect: Subtle breathing/floating
CSS:
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
.aisha-image {
  animation: float 6s ease-in-out infinite;
}

### Zone 2 - Service Cards (Hover Effect)
Effect: Lift + gold shadow glow on hover
CSS:
.service-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(201,168,76,0.18);
}

### Zone 3 - Page Background (Warm Pulse)
Effect: Very subtle radial gradient shift - warm and calming
CSS:
@keyframes bgPulse {
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
}
body {
  background: linear-gradient(135deg, #F9F4F5, #F3ECED, #F5EFE8);
  background-size: 300% 300%;
  animation: bgPulse 17s ease infinite;
}

### Zone 4 - CTA Gold Button (Shimmer)
Effect: Gentle shimmer every 5 seconds
CSS:
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.btn-primary {
  background: linear-gradient(90deg, #C9A84C 40%, #E8C96A 50%, #C9A84C 60%);
  background-size: 200% auto;
  animation: shimmer 5s linear infinite;
}

---

## Scroll Reveal (Page Load Feel)
Cards and sections fade in as user scrolls - luxury feel.
CSS:
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in {
  animation: fadeInUp 0.6s ease forwards;
}

Apply with stagger delay on cards:
.service-card:nth-child(1) { animation-delay: 0.1s; }
.service-card:nth-child(2) { animation-delay: 0.2s; }
.service-card:nth-child(3) { animation-delay: 0.3s; }

---

## Animation Rules (NON-NEGOTIABLE)
1. All animations must be subtle - reduce intensity if in doubt
2. Never animate text while being read - only structural elements
3. Duration: hover effects 0.2-0.4s, ambient effects 5-17s
4. Always use ease or ease-in-out - never linear for ambient
5. All animations must respect prefers-reduced-motion:
   @media (prefers-reduced-motion: reduce) {
     * { animation: none !important; transition: none !important; }
   }
6. Test on low-end Android - if laggy, remove Zone 3 first
7. Never animate service card PNG backgrounds
8. Gold shimmer on button: max once every 5 seconds

---

## What NEVER Gets Animated
- Service card cinematic PNG backgrounds
- Prices (no prices exist anyway)
- Navigation bar (keep stable for usability)
- Text while being read
- Loading skeletons (use shimmer placeholder only)

---

## Performance Rules
- Use CSS animations only - no JavaScript animation libraries needed
- Use transform and opacity only - never animate width/height/top/left
- Add will-change: transform to floated elements only
- Test on real Android phone before final delivery
