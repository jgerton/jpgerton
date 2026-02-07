---
phase: 04-admin-dashboard
plan: 01
subsystem: auth
tags: [convex-auth, password-provider, authentication, sessions]

# Dependency graph
requires:
  - phase: 03-services-contact
    provides: Contact form submissions with status tracking
provides:
  - Convex Auth with Password provider configured
  - 7-day session duration for admin users
  - Four-state contact workflow (unread/read/responded/archived)
  - Login page with email/password authentication
affects: [04-admin-dashboard, admin-routes, contact-management]

# Tech tracking
tech-stack:
  added: ["@convex-dev/auth"]
  patterns: ["Convex Auth Password provider", "Session-based authentication with 7-day duration"]

key-files:
  created:
    - convex/auth.config.ts
    - convex/auth.ts
    - lib/auth.ts
    - app/login/page.tsx
  modified:
    - convex/schema.ts
    - convex/contacts.ts
    - package.json

key-decisions:
  - "7-day session duration (totalDurationMs and inactiveDurationMs)"
  - "Four-state contact workflow: unread -> read -> responded -> archived"
  - "Convex Auth uses authTables pattern integrated into schema"

patterns-established:
  - "Auth configuration in convex/auth.config.ts with providers array"
  - "Re-export auth functions in convex/auth.ts for mutation use"
  - "Client-side auth hooks via lib/auth.ts wrapper"
  - "Login page at /admin/login redirects to /admin on success"

# Metrics
duration: 3min
completed: 2026-02-04
---

# Phase 4 Plan 1: Admin Auth Setup Summary

**Convex Auth Password provider with 7-day sessions, four-state contact workflow (unread/read/responded/archived), and email/password login page**

## Performance

- **Duration:** 3.05 min
- **Started:** 2026-02-04T05:55:01Z
- **Completed:** 2026-02-04T05:58:05Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- Convex Auth installed and configured with Password provider
- 7-day session duration for both total and inactive timeouts
- Contact schema updated from 3-state to 4-state workflow with "responded" status
- Login page created with email/password form, loading states, and error handling

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Convex Auth and configure Password provider** - `72eef91` (feat)
2. **Task 2: Update contact schema for four-state workflow** - `981569e` (feat)
3. **Task 3: Create login page with email/password form** - `be5da14` (feat)

## Files Created/Modified
- `convex/auth.config.ts` - Convex Auth configuration with Password provider and 7-day sessions
- `convex/auth.ts` - Re-exports auth functions (signIn, signOut) and getAuthUserId helper
- `lib/auth.ts` - Client-side auth hooks (useAuthActions)
- `convex/schema.ts` - Added authTables from Convex Auth, updated contact status to four states
- `convex/contacts.ts` - Changed default status from "new" to "unread"
- `app/login/page.tsx` - Login page with email/password form, error display, and /admin redirect
- `package.json` - Added @convex-dev/auth dependency

## Decisions Made
- **7-day session duration:** LOCKED decision from planning - both totalDurationMs and inactiveDurationMs set to 7 days (604800000 ms)
- **Four-state contact workflow:** Enhanced from 3-state (new/read/archived) to 4-state (unread/read/responded/archived) for better admin workflow tracking
- **Rename "new" to "unread":** Matches inbox mental model more clearly
- **authTables integration:** Convex Auth automatically manages user/session tables via authTables spread in schema
- **No convex.config.ts changes needed:** Unlike resend component, Convex Auth doesn't require app.use() registration

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Initial confusion about convex.config.ts:** Attempted to add auth via app.use() pattern like resend, but Convex Auth doesn't export a convex.config module. Auth is configured entirely through auth.config.ts and authTables in schema.ts. Reverted the incorrect convex.config.ts change.

## User Setup Required

**External services require manual configuration.** Admin authentication is configured but requires environment variables:

**Environment Variables:**
1. `AUTH_SECRET` - Generate with: `openssl rand -base64 32`
2. `SITE_URL` - Set to `http://localhost:3400` for local dev

**Setup Steps:**
1. Add environment variables to `.env.local` (for local dev) and Convex dashboard (for production)
2. Run Convex Auth setup: `bunx auth --web-server-url http://localhost:3400`
3. Create first admin user via Convex dashboard or CLI

**Verification:**
- Visit http://localhost:3400/login
- Login form should render
- Attempting to sign in will fail until environment variables are set

## Next Phase Readiness

**Ready for:**
- Admin dashboard routing and layout (protected routes)
- Contact management UI (list, detail, status updates)
- Admin-only mutations using getAuthUserId

**Blockers/Concerns:**
- Environment variables must be configured before testing authentication flow
- First admin user must be created (no registration endpoint planned - admin-only system)

---
*Phase: 04-admin-dashboard*
*Completed: 2026-02-04*
