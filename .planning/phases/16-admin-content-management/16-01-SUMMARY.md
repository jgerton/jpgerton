---
phase: 16
plan: 01
subsystem: admin-ui
tags: [markdown, navigation, image-upload, configuration, code-splitting]

dependencies:
  requires: [15-02]
  provides:
    - Markdown editor component (SSR-safe, code-split)
    - Admin navigation with Blog and Case Studies tabs
    - Configurable image upload for multiple content types
    - Centralized Calendly URL configuration
  affects: [16-02, 16-03]

tech-stack:
  added:
    - "@uiw/react-md-editor": "Markdown editor with preview"
  patterns:
    - next/dynamic with ssr: false for client-only libraries
    - Conditional prop pattern for backward compatibility

key-files:
  created:
    - components/admin/markdown-editor.tsx
  modified:
    - components/admin/admin-tabs.tsx
    - components/admin/image-upload-zone.tsx
    - lib/site-config.ts
    - app/about/page.tsx
    - app/contact/page.tsx
    - app/services/page.tsx
    - .env.example

decisions:
  - slug: markdown-editor-code-splitting
    title: Use next/dynamic with ssr: false for markdown editor
    rationale: "@uiw/react-md-editor has client-only dependencies; loading via next/dynamic prevents hydration errors and reduces initial bundle size"
  - slug: click-to-upload-only
    title: Disable drag-and-drop for image uploads
    rationale: "User decision: click-to-upload is simpler and more predictable than drag-drop; sets noDrag: true in useDropzone config"
  - slug: backward-compatible-upload-zone
    title: Optional generateUploadUrlFn prop with fallback
    rationale: "Allows ImageUploadZone to support blog/case study uploads without breaking existing ProjectForm usage; defaults to api.projects.generateUploadUrl"
  - slug: remove-as-const-from-site-config
    title: Remove 'as const' type assertion from siteConfig
    rationale: "Adding calendly.discoveryCallUrl with process.env requires mutable type; 'as const' prevented dynamic env variable usage"

metrics:
  duration: 301s
  tasks-completed: 2
  commits: 2
  files-modified: 8
  completed: 2026-02-07
---

# Phase 16 Plan 01: Shared Admin Infrastructure Summary

**One-liner:** Markdown editor with code-splitting, admin navigation with Blog/Case Studies tabs, configurable image upload, and centralized Calendly URL from env variable

## What Was Built

### 1. Markdown Editor Component
Created `components/admin/markdown-editor.tsx` with:
- **Code-split loading:** `next/dynamic` with `ssr: false` prevents hydration errors from client-only @uiw/react-md-editor library
- **Loading fallback:** 400px skeleton div with "Loading editor..." text during dynamic import
- **Themed wrapper:** `data-color-mode="light"` div required by @uiw/react-md-editor for correct styling
- **Props interface:** `value`, `onChange`, optional `height` (default 400px)
- **Edit mode default:** `preview="edit"` for immediate editing (user switches to preview tab manually)

This component is ready for use in blog post and case study admin forms (plans 16-02, 16-03).

### 2. Admin Navigation Updates
Updated `components/admin/admin-tabs.tsx` with:
- **Two new tabs:** Blog (`/admin/blog`) and Case Studies (`/admin/case-studies`) between Projects and Contacts
- **Tab order:** Dashboard, Projects, Blog, Case Studies, Contacts
- **Reactive count badges:** Query `api.blogPosts.list` and `api.caseStudies.list` to show `(${count})` next to Blog and Case Studies labels
- **Conditional rendering:** Only show count when data is loaded (not undefined), preventing flash during query loading
- **Proper routing:** Existing `isActive` function handles new routes correctly with `startsWith` matching

Queries run client-side behind AdminAuthGuard, so authentication is guaranteed.

### 3. Configurable Image Upload
Updated `components/admin/image-upload-zone.tsx` with:
- **Optional prop:** `generateUploadUrlFn?: () => Promise<string>` for custom upload endpoints
- **Fallback to default:** If not provided, uses existing `useMutation(api.projects.generateUploadUrl)` (backward compatible)
- **Click-to-upload:** Set `noDrag: true` in useDropzone config to disable drag-and-drop
- **Updated UI text:**
  - Empty state: "Click to upload an image" (was "Drag and drop...")
  - Replacement text: "Click to upload a new image" (was "Drop a new image...")
- **No breaking changes:** ProjectForm continues to work without passing `generateUploadUrlFn`

This enables blog and case study forms to pass `api.blogPosts.generateUploadUrl` and `api.caseStudies.generateUploadUrl` respectively.

### 4. Centralized Calendly Configuration
Extracted hardcoded Calendly URL to `lib/site-config.ts`:
- **New property:** `siteConfig.calendly.discoveryCallUrl` backed by `NEXT_PUBLIC_CALENDLY_URL` env variable
- **Fallback:** Defaults to `https://calendly.com/jongerton/discovery-call` if env var not set
- **Removed `as const`:** Mutable type allows dynamic env variable usage
- **Updated 3 pages:** `app/about/page.tsx`, `app/contact/page.tsx`, `app/services/page.tsx` now import and use `siteConfig.calendly.discoveryCallUrl`
- **Env documentation:** Added `NEXT_PUBLIC_CALENDLY_URL` to `.env.example` with default value

Addresses DEBT-02 from project backlog. Zero hardcoded Calendly URLs remain in app/ directory.

## Deviations from Plan

None. Plan executed exactly as written.

## Technical Notes

### Code-Splitting Pattern for Client-Only Libraries
```typescript
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <div className="h-[400px] ...">Loading editor...</div>,
});
```

This pattern is critical for libraries with client-only dependencies (browser APIs, window object). Benefits:
- Prevents "ReferenceError: window is not defined" during SSR
- Reduces initial page bundle (markdown editor only loads when component mounts)
- Loading fallback prevents layout shift

### Conditional Props for Backward Compatibility
```typescript
const uploadUrl = generateUploadUrlFn
  ? await generateUploadUrlFn()
  : await defaultGenerateUploadUrl();
```

This pattern allows adding new functionality without breaking existing usage. ProjectForm doesn't need changes; blog/case study forms can opt into custom upload endpoints.

### Environment Variables in siteConfig
Removing `as const` makes siteConfig mutable but enables dynamic env variable usage. Trade-off:
- **Lost:** TypeScript literal type inference for static properties
- **Gained:** Ability to read process.env at runtime (Next.js replaces `process.env.NEXT_PUBLIC_*` at build time)

For this project, dynamic config is more valuable than literal types.

## Integration Points

### For Plan 16-02 (Blog Admin UI)
- Import `{ MarkdownEditor }` from `@/components/admin/markdown-editor`
- Pass `content` and `setContent` to MarkdownEditor in BlogPostForm
- Pass `generateUploadUrlFn={() => generateCoverUploadUrl()}` to ImageUploadZone
- Admin navigation automatically shows Blog tab with post count

### For Plan 16-03 (Case Study Admin UI)
- Same MarkdownEditor usage as blog admin
- Pass `generateUploadUrlFn={() => generateCoverUploadUrl()}` to ImageUploadZone
- Admin navigation automatically shows Case Studies tab with count

### For All Admin Pages
- AdminTabs renders Blog and Case Studies links
- Count badges update reactively as posts/case studies are created/deleted
- No additional setup required

## Verification Results

All verifications passed:
- ✅ `bun run type-check` - TypeScript compilation clean
- ✅ `bun run lint` - No new ESLint errors (pre-existing warnings in about/page.tsx unrelated to this plan)
- ✅ `bun run build` - Production build succeeds (11.5s compile, 22 routes)
- ✅ Grep for hardcoded Calendly URL returns 0 matches
- ✅ package.json includes @uiw/react-md-editor@^4.0.11
- ✅ MarkdownEditor uses dynamic import with ssr: false
- ✅ AdminTabs has 5 tabs (Dashboard, Projects, Blog, Case Studies, Contacts)
- ✅ ImageUploadZone accepts optional generateUploadUrlFn prop

## Build Artifacts

Production build output:
- 22 routes (15 static, 3 dynamic, 4 proxy via middleware)
- AdminTabs queries work client-side (no SSR issues)
- `public/llms.txt` generated successfully via next-aeo

## Next Phase Readiness

### Ready for Immediate Continuation
- ✅ Plan 16-02 (Blog Admin UI) can proceed - MarkdownEditor and ImageUploadZone ready
- ✅ Plan 16-03 (Case Study Admin UI) can proceed - same components available
- ✅ Admin navigation shows Blog and Case Studies tabs - no frontend surprises for users

### Blockers
None.

### Recommendations
- Plans 16-02 and 16-03 are wave-parallel compatible (different file sets: blog-form.tsx vs case-study-form.tsx)
- Both can execute simultaneously after this plan completes
- Consider running them in parallel to speed up phase completion

## Commits

1. **cef502d** - `feat(16-01): add markdown editor component with SSR code-splitting`
   - Install @uiw/react-md-editor
   - Create MarkdownEditor wrapper with dynamic import
   - Loading fallback prevents hydration errors

2. **7dcfbf7** - `feat(16-01): update admin infrastructure for content management`
   - AdminTabs: Blog and Case Studies tabs with count badges
   - ImageUploadZone: configurable generateUploadUrlFn prop, click-to-upload
   - Calendly URL: extract to siteConfig with env variable
   - Update 3 pages (about, contact, services) to use siteConfig

**Duration:** 5 minutes (301 seconds)
