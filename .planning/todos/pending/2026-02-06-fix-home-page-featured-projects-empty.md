---
created: 2026-02-06T13:30
title: Fix home page featured projects section showing empty
area: ui
files:
  - app/(home)/page.tsx
---

## Problem

The "Recent Work" section on the home page shows a large blank space where featured project cards should appear. The section heading ("Recent Work"), description, and the mid-page CTA ("Like What You See?" / "Start Your Project") all render correctly, but no project cards are visible between them.

The home page uses `.slice(0, 3)` to limit featured projects to 3 (per Phase 13-01 decision). The `useQuery` for projects may return:
- `undefined` (loading state) - should show skeleton/loading
- Empty array (no featured projects) - should show fallback or hide section
- Data (normal case) - should render 3 cards

In the dev Convex instance, projects exist (visible on /projects page with 7 items), but the featured filter may not match any projects (the `featured` boolean field may be `false` on all dev data).

Discovered during Phase 13 visual verification via Playwright screenshots.

## Solution

TBD - investigate whether:
1. The featured projects query filters correctly (check if any projects have `featured: true` in dev Convex)
2. The section handles empty state gracefully (hide section or show "No featured projects" message instead of blank space)
3. Loading state renders a skeleton instead of blank space
