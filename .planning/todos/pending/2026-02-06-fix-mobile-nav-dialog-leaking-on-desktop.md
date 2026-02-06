---
created: 2026-02-06T13:30
title: Fix mobile nav dialog leaking on desktop viewport
area: ui
files:
  - components/navigation/mobile-menu.tsx:54-92
  - components/navigation/site-nav.tsx:74-78
---

## Problem

The mobile navigation slide-out panel (`MobileMenu` component) is visually visible on the right edge of every page at desktop viewport widths, even when `isOpen` is `false`. The panel renders as a fixed-position element (`fixed inset-y-0 right-0`) and relies on `translate-x-full` to hide it off-screen when closed.

During Phase 13 visual verification (Playwright screenshots at 1280px), every page shows the nav links (Home, Projects, Services, About, Contact) as a visible sidebar on the right edge. This pushes content or overlaps it.

The `MobileMenu` component uses:
- `fixed inset-y-0 right-0 z-50 w-3/4 max-w-sm` for positioning
- `translate-x-full` when closed (should shift 100% off-screen right)
- `translate-x-0` when open

Possible causes:
- Tailwind v4 `translate-x-full` may not resolve correctly (CSS-first config could affect transform utilities)
- The panel sits inside `<header>` which has `overflow` or `backdrop-blur` that may interfere
- The `fixed` positioning combined with `w-3/4 max-w-sm` may still leave part visible at certain widths

This is a pre-existing issue from Phase 9 nav implementation, not introduced by Phase 13.

## Solution

TBD - investigate whether `translate-x-full` resolves correctly in Tailwind v4 CSS-first mode. May need:
- Explicit `translate-x-[100%]` instead of `translate-x-full`
- Adding `hidden md:hidden` or `overflow-hidden` on the parent
- Moving the MobileMenu outside the `<header>` element
- Using `display: none` / conditional rendering instead of CSS transform to hide on desktop
