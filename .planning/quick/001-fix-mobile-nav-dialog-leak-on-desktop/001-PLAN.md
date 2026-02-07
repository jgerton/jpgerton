---
quick_task: 001-fix-mobile-nav-dialog-leak-on-desktop
plan: 001
type: execute
wave: 1
depends_on: []
files_modified:
  - components/navigation/mobile-menu.tsx
autonomous: true

must_haves:
  truths:
    - "Mobile nav panel is not visible at desktop viewport when closed"
    - "Mobile nav panel does not receive keyboard focus at desktop viewport when closed"
    - "Mobile nav still functions correctly on mobile viewports"
  artifacts:
    - path: "components/navigation/mobile-menu.tsx"
      provides: "Fixed mobile menu with proper visibility and focus management"
      min_lines: 130
  key_links:
    - from: "components/navigation/mobile-menu.tsx"
      to: "isOpen prop"
      via: "visibility and focus control"
      pattern: "invisible.*isOpen"
---

<objective>
Fix mobile navigation dialog visibility and keyboard focus leak at desktop viewport.

Purpose: Prevent mobile nav panel from appearing as a visible sidebar and receiving keyboard focus when the hamburger menu is closed on desktop screens.
Output: Updated mobile-menu.tsx with proper inert behavior when closed.
</objective>

<execution_context>
@C:\Users\jonge\.claude/get-shit-done/workflows/execute-plan.md
@C:\Users\jonge\.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@E:\Projects\wp-designer\CLAUDE.md

Current bug: The MobileMenu component renders two `position: fixed` elements (backdrop and panel) that remain in the DOM at all viewports. When closed (`isOpen={false}`), the panel uses `translate-x-full` to push off-screen, but it still receives keyboard focus via Tab navigation at desktop, disrupting focus order.

The parent wrapper in site-nav.tsx has `md:hidden`, but this does NOT prevent the fixed-position children from being keyboard-focusable.

Fix approach: Add `invisible` (visibility: hidden) and `aria-hidden="true"` to both elements when closed to prevent both visual rendering AND keyboard focus.
</context>

<tasks>

<task type="auto">
  <name>Add visibility and focus controls to mobile menu</name>
  <files>components/navigation/mobile-menu.tsx</files>
  <action>
Update the MobileMenu component to add `invisible` class and `aria-hidden` when closed:

1. **Backdrop overlay (line 95-101):**
   - Add `invisible` to className when `!isOpen`
   - Current: `opacity-0 pointer-events-none` when closed
   - New: `opacity-0 pointer-events-none invisible` when closed
   - This prevents rendering AND keyboard interaction

2. **Slide-from-right panel (line 104-112):**
   - Add `invisible` to className when `!isOpen`
   - Add conditional `aria-hidden={!isOpen}` attribute
   - Current: `translate-x-full` when closed
   - New: `translate-x-full invisible` when closed
   - aria-hidden tells assistive tech to ignore the element when closed

Why `invisible` instead of `hidden`:
- `visibility: hidden` prevents focus and rendering (like display:none for focus)
- Can be transitioned (with delay) unlike display:none
- Combined with `pointer-events-none`, element is truly inert
- Maintains layout space but prevents interaction

Result: When closed, both elements are visually hidden AND cannot receive keyboard focus at any viewport width.
  </action>
  <verify>
```bash
# 1. Check file was updated with invisible class
grep "invisible" components/navigation/mobile-menu.tsx

# 2. Start dev server if not running
docker compose up -d

# 3. Manual verification:
# - Open http://localhost:3400 at desktop width (>768px)
# - Confirm mobile nav panel is NOT visible on right edge
# - Press Tab repeatedly and confirm focus never enters hidden mobile nav
# - Resize to mobile (<768px)
# - Click hamburger menu to open mobile nav
# - Confirm mobile nav slides in and functions correctly
# - Press Escape to close
# - Confirm mobile nav slides out and is hidden
```
  </verify>
  <done>
Mobile nav panel uses `invisible` class when closed, preventing visual rendering and keyboard focus at all viewports. Panel still functions correctly when opened on mobile. No visual sidebar leak at desktop width.
  </done>
</task>

</tasks>

<verification>
1. Build succeeds without TypeScript errors: `docker compose exec app bun run type-check`
2. Lint passes: `docker compose exec app bun run lint`
3. Visual test at http://localhost:3400:
   - Desktop width: no sidebar visible, Tab key skips mobile nav
   - Mobile width: hamburger opens/closes menu correctly
   - Escape key closes menu on mobile
   - Focus trap works when menu is open
</verification>

<success_criteria>
- Mobile nav panel not visible at desktop viewport when closed
- Mobile nav panel does not receive keyboard focus when closed
- Mobile nav still opens/closes correctly on mobile viewport
- Escape key still closes menu
- Focus trap still works when menu is open
- No TypeScript or lint errors
</success_criteria>

<output>
After completion, create `.planning/quick/001-fix-mobile-nav-dialog-leak-on-desktop/001-SUMMARY.md`
</output>
