# Phase 4: Admin Dashboard - Research

**Researched:** 2026-02-03
**Domain:** Admin dashboard with authentication, CRUD operations, file uploads, drag-and-drop
**Confidence:** HIGH

## Summary

Phase 4 builds a complete admin dashboard for managing projects and contact submissions. The standard approach uses Convex Auth for password authentication with 7-day sessions, Next.js middleware for route protection, dnd-kit for drag-and-drop (both file uploads and row reordering), and react-dropzone for file upload UI. Convex's native file storage handles image uploads with a three-step process: generate upload URL, POST file, save storage ID.

The architecture follows a clear separation pattern: middleware for optimistic auth checks and redirects, Data Access Layer (DAL) for secure session verification close to data, Server Actions for mutations, and Convex's reactive queries for real-time updates. For the UI, horizontal tabs navigation at the top, table components with checkbox selection for bulk actions, and confirmation dialogs before destructive operations are standard patterns.

**Primary recommendation:** Use Convex Auth Password provider with 7-day session configuration, protect routes with Next.js middleware + DAL pattern, implement dnd-kit for sortable project lists, use react-dropzone + Convex storage.generateUploadUrl() for image uploads, and leverage Convex's real-time subscriptions for instant dashboard updates.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @convex-dev/auth | Latest | Authentication & sessions | Official Convex auth library, integrates with Convex backend, supports password auth with reset/verification |
| @dnd-kit/core | Latest | Drag-and-drop foundation | Modern, performant, accessible DnD toolkit, 10KB core with zero dependencies |
| @dnd-kit/sortable | Latest | Sortable list reordering | Official preset for list reordering, keyboard support, smooth animations |
| react-dropzone | Latest | File upload UI | Simple HTML5 drag-drop zone, 19K+ stars, handles both drag-drop and click-to-browse |
| next-themes | Already installed | Dark mode toggle | Already used in Phase 1, consistent theme switching |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @dnd-kit/modifiers | Latest | Restrict drag behavior | When needing axis locks or grid snapping during drag |
| @dnd-kit/utilities | Latest | Helper functions (arrayMove) | For reordering arrays after drag-end events |
| zod | Latest | Form validation | Validating login forms, project CRUD forms, password requirements |
| jose | Latest | JWT signing/verification | If implementing custom session encryption (Next.js example uses this) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Convex Auth | Clerk, Auth0 | Convex Auth keeps auth in same ecosystem, no extra service/cost, but less feature-rich than enterprise solutions |
| dnd-kit | react-beautiful-dnd | react-beautiful-dnd is archived/deprecated by Atlassian as of 2026 |
| dnd-kit | pragmatic-drag-and-drop | Pragmatic is framework-agnostic (5KB), but dnd-kit has stronger React integration and ecosystem |
| react-dropzone | Native HTML5 | Native works but react-dropzone provides better UX, validation, cross-browser support |

**Installation:**
```bash
bun add @convex-dev/auth @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-dropzone zod
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── admin/
│   ├── layout.tsx           # Admin-specific layout with tabs navigation
│   ├── page.tsx              # Dashboard home (contact submissions + stats)
│   ├── projects/
│   │   ├── page.tsx          # Projects list with drag-to-reorder
│   │   ├── new/page.tsx      # Create project (full page form)
│   │   └── [id]/edit/page.tsx # Edit project (full page form)
│   ├── contacts/
│   │   └── page.tsx          # Contact submissions (inbox-style)
│   └── settings/
│       └── page.tsx          # Settings page
├── login/
│   └── page.tsx              # Login form (outside /admin)
└── middleware.ts             # Route protection (optimistic check)

convex/
├── auth.config.ts            # Convex Auth configuration (Password provider, 7-day sessions)
├── projects.ts               # Project CRUD mutations/queries
├── contacts.ts               # Contact submission queries/mutations
└── http.ts                   # HTTP actions if needed for file access control

lib/
├── dal.ts                    # Data Access Layer - secure session verification
└── session.ts                # Session helpers (if using stateless sessions)

components/
├── admin/
│   ├── DashboardTabs.tsx     # Horizontal tabs navigation
│   ├── ProjectForm.tsx       # Reusable form for create/edit
│   ├── ImageUploadZone.tsx   # react-dropzone + Convex upload
│   ├── SortableProjectList.tsx # dnd-kit sortable table
│   ├── ContactsTable.tsx     # Table with bulk actions
│   └── ConfirmDialog.tsx     # Reusable delete confirmation
```

### Pattern 1: Convex Auth Setup with 7-Day Sessions
**What:** Configure Password provider with custom session duration
**When to use:** Phase 4 initialization
**Example:**
```typescript
// convex/auth.config.ts
// Source: https://labs.convex.dev/auth/config/passwords
// Source: https://labs.convex.dev/auth/api_reference/server
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  session: {
    totalDurationMs: 7 * 24 * 60 * 60 * 1000,      // 7 days (locked decision)
    inactiveDurationMs: 7 * 24 * 60 * 60 * 1000   // 7 days idle timeout
  },
  jwt: {
    durationMs: 60 * 60 * 1000                     // 1 hour JWT validity (default)
  }
});
```

### Pattern 2: Next.js Middleware for Route Protection
**What:** Optimistic auth check in middleware, redirect unauthenticated users
**When to use:** Protecting /admin/* routes
**Example:**
```typescript
// middleware.ts
// Source: https://nextjs.org/docs/app/guides/authentication
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

const protectedRoutes = ['/admin']
const publicRoutes = ['/login', '/']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  // Decrypt session from cookie (optimistic check)
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect authenticated users away from login
  if (isPublicRoute && session?.userId && path === '/login') {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

### Pattern 3: Data Access Layer (Secure Verification)
**What:** Memoized session verification close to data source
**When to use:** Server Components, Server Actions, Route Handlers
**Example:**
```typescript
// lib/dal.ts
// Source: https://nextjs.org/docs/app/guides/authentication
import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { getAuthUserId } from '@convex-dev/auth/server'

// Memoized session verification
export const verifySession = cache(async () => {
  const userId = await getAuthUserId(ctx) // Convex auth helper

  if (!userId) {
    redirect('/login')
  }

  return { isAuth: true, userId }
})
```

### Pattern 4: File Upload with Convex Storage
**What:** Three-step upload process: generate URL, POST file, save storage ID
**When to use:** Project image uploads
**Example:**
```typescript
// convex/projects.ts
// Source: https://docs.convex.dev/file-storage/upload-files
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Step 1: Generate upload URL (with access control)
export const generateUploadUrl = mutation(async (ctx) => {
  // Verify user is authenticated admin
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorized");

  return await ctx.storage.generateUploadUrl();
});

// Step 3: Save storage ID to database
export const saveImage = mutation({
  args: { storageId: v.id("_storage"), projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.patch(args.projectId, {
      imageStorageId: args.storageId,
    });
  },
});

// components/admin/ImageUploadZone.tsx
// Source: https://react-dropzone.js.org/
import { useDropzone } from 'react-dropzone'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

export function ImageUploadZone({ onUploadComplete }) {
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl)
  const saveImage = useMutation(api.projects.saveImage)

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0]

    // Step 1: Generate upload URL
    const uploadUrl = await generateUploadUrl()

    // Step 2: POST file to URL
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    })
    const { storageId } = await result.json()

    // Step 3: Save storage ID
    await saveImage({ storageId, projectId })
    onUploadComplete(storageId)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }
  })

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-8">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here...</p>
      ) : (
        <p>Drag and drop an image, or click to browse</p>
      )}
    </div>
  )
}
```

### Pattern 5: Sortable List with dnd-kit
**What:** Drag-to-reorder project list with keyboard support
**When to use:** Projects list page for reordering
**Example:**
```typescript
// components/admin/SortableProjectList.tsx
// Source: https://docs.dndkit.com/presets/sortable
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, project }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td>{project.name}</td>
      <td>{project.description}</td>
    </tr>
  );
}

export function SortableProjectList({ projects, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = projects.findIndex(p => p._id === active.id);
      const newIndex = projects.findIndex(p => p._id === over.id);
      const reordered = arrayMove(projects, oldIndex, newIndex);
      onReorder(reordered);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={projects.map(p => p._id)} strategy={verticalListSortingStrategy}>
        <table>
          <tbody>
            {projects.map(project => (
              <SortableItem key={project._id} id={project._id} project={project} />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}
```

### Pattern 6: Bulk Actions with Checkboxes
**What:** Multi-select rows with checkbox, bulk archive action
**When to use:** Contact submissions table
**Example:**
```typescript
// Source: https://www.shadcn.io/blocks/tables-bulk-actions
// Source: https://www.patternfly.org/patterns/bulk-selection/
function ContactsTable({ contacts }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const archiveMutation = useMutation(api.contacts.archiveBulk);

  const toggleAll = () => {
    if (selected.size === contacts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(contacts.map(c => c._id)));
    }
  };

  const toggleOne = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleBulkArchive = async () => {
    await archiveMutation({ ids: Array.from(selected) });
    setSelected(new Set());
  };

  return (
    <>
      {selected.size > 0 && (
        <div className="flex items-center gap-2 p-2 bg-blue-50">
          <span>{selected.size} selected</span>
          <button onClick={handleBulkArchive}>Archive</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selected.size === contacts.length}
                onChange={toggleAll}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.has(contact._id)}
                  onChange={() => toggleOne(contact._id)}
                />
              </td>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
```

### Pattern 7: Confirm Dialog for Deletes
**What:** Interrupt user with confirmation before destructive action
**When to use:** Delete project action
**Example:**
```typescript
// components/admin/ConfirmDialog.tsx
// Source: https://mui.com/material-ui/react-dialog/
// Source: https://www.dhiwise.com/post/how-react-confirmation-dialogs-enhance-user-experience-in-apps
export function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <dialog open={open} className="rounded-lg p-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-gray-600">{message}</p>
      <div className="mt-4 flex gap-2 justify-end">
        <button onClick={onClose} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">
          Delete
        </button>
      </div>
    </dialog>
  );
}

// Usage in projects list
function ProjectRow({ project }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteProject = useMutation(api.projects.deleteProject);

  const handleDelete = async () => {
    await deleteProject({ id: project._id });
    setConfirmOpen(false);
  };

  return (
    <>
      <tr>
        <td>{project.name}</td>
        <td>
          <button onClick={() => setConfirmOpen(true)}>Delete</button>
        </td>
      </tr>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
      />
    </>
  );
}
```

### Anti-Patterns to Avoid
- **Client-side only auth checks:** Always verify sessions server-side in DAL, middleware is just optimistic redirect
- **Uploading files directly to mutations:** Convex mutations have size limits, use storage.generateUploadUrl() workflow
- **Using react-beautiful-dnd:** Library is archived/deprecated as of 2026, use dnd-kit or pragmatic-drag-and-drop
- **Treating admin like landing page:** Admin needs dense information display, not marketing-style spacing
- **No delete confirmations:** Always confirm destructive actions to prevent accidental data loss
- **Single layer protection:** Use middleware + DAL + Server Action checks, not just one

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drag-and-drop sorting | Custom mousedown/mousemove handlers | dnd-kit/sortable | Accessibility (keyboard nav, screen readers), touch support, collision detection, smooth animations all solved |
| File upload UI | Custom file input styling | react-dropzone | Cross-browser file validation, drag-drop + click-to-browse, file type restrictions, multiple files, preview generation |
| Session management | Custom cookie encryption | Convex Auth + Next.js patterns | Session rotation, JWT signing, secure cookie flags (httpOnly, secure, sameSite), expiration handling |
| Form validation | Manual input checking | Zod | Type-safe schemas, error messages, async validation, integration with Server Actions |
| Optimistic UI updates | Manual state rollback on error | Convex optimistic updates | Automatic rollback on mutation failure, rerun on data changes, handles race conditions |
| Real-time sync | WebSocket setup | Convex reactive queries | useQuery auto-subscribes, automatic reconnection, handles network issues, scales automatically |

**Key insight:** Admin dashboards have deeply solved patterns for auth, CRUD, file uploads, and real-time sync. Convex + dnd-kit + react-dropzone covers 90% of needs without custom infrastructure.

## Common Pitfalls

### Pitfall 1: Middleware-Only Auth (Insecure)
**What goes wrong:** Only checking auth in middleware, not in Server Components/Actions, allows bypassing protection via direct API calls or client-side manipulation.
**Why it happens:** Misunderstanding that middleware is for optimization (redirect), not security.
**How to avoid:** Follow layered protection: middleware (optimistic) → DAL (secure verification) → Server Actions (mutation authorization).
**Warning signs:** No `verifySession()` calls in Server Components, mutations not checking `getAuthUserId()`.

### Pitfall 2: Large File Uploads via HTTP Actions
**What goes wrong:** Trying to upload images >20MB through HTTP actions hits size limit, fails silently or with cryptic errors.
**Why it happens:** Confusion between storage.generateUploadUrl() (no limit, 2min timeout) vs HTTP actions (20MB limit).
**How to avoid:** Always use storage.generateUploadUrl() for file uploads, reserve HTTP actions for access-controlled serving.
**Warning signs:** Users report "upload failed" for large images, 413 Payload Too Large errors.

### Pitfall 3: Not Handling Upload URL Expiration
**What goes wrong:** Generated upload URL expires after 1 hour, users with slow connections or who leave page idle can't complete upload.
**Why it happens:** Generating URL once on page load, not before actual upload.
**How to avoid:** Generate URL immediately before upload (in onDrop handler), not during component mount.
**Warning signs:** "Upload failed" errors after user waits on page, works fine for immediate uploads.

### Pitfall 4: Convex Storage URLs in Next.js Image Without Proxy
**What goes wrong:** Next.js Image component requires remotePatterns configuration for Convex storage URLs, images fail to load or optimization doesn't work.
**Why it happens:** Not configuring next.config.js to allow Convex storage domain.
**How to avoid:** Add Convex storage domain to remotePatterns or use custom loader. See: https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
**Warning signs:** Console errors about "Invalid src prop", images show broken icon.

### Pitfall 5: Reordering Without Debounce/Batch
**What goes wrong:** Every drag-end triggers mutation, rapid reordering causes mutation conflicts, jumpy UI, poor UX.
**Why it happens:** Calling mutation immediately in handleDragEnd without batching or debouncing.
**How to avoid:** Update local state optimistically, debounce/batch mutations (e.g., save order after 500ms idle or on blur).
**Warning signs:** Slow dragging, conflicts in Convex dashboard, users report "order doesn't save correctly".

### Pitfall 6: Information Overload on Dashboard Home
**What goes wrong:** Cramming too many stats, charts, recent items on dashboard landing causes cognitive overload, slow page load.
**Why it happens:** Trying to show "everything important" without user research or prioritization.
**How to avoid:** Start minimal (recent contacts + 2-3 key stats), add based on actual usage. Admin can navigate to dedicated pages for details.
**Warning signs:** Dashboard home takes >2 seconds to load, Jon says "too cluttered" or ignores the page.

### Pitfall 7: No Rate Limiting on Login
**What goes wrong:** Brute force attacks can try thousands of passwords, account takeover risk.
**Why it happens:** Forgetting to add rate limiting to auth mutations.
**How to avoid:** Implement IP-based + email-based rate limits (10 attempts per minute per email, 20 per IP). Consider Convex Auth rate limiting features or custom tracking.
**Warning signs:** Unusual login attempt patterns in logs, security audit flags missing rate limiting.

### Pitfall 8: Bulk Actions Without Feedback
**What goes wrong:** User selects 50 contacts, clicks "Archive", no loading state, no confirmation, user doesn't know if it worked.
**Why it happens:** Forgetting UX for async bulk operations.
**How to avoid:** Show loading state during bulk mutation, toast/notification on success, clear selection after completion.
**Warning signs:** Users click archive multiple times, ask "did it work?", duplicate operations.

## Code Examples

Verified patterns from official sources:

### Contact Four-State Workflow
```typescript
// convex/contacts.ts
// Four states: Unread -> Read -> Responded -> Archived
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // Inbox-style: unread first, then read
    const contacts = await ctx.db
      .query("contacts")
      .filter((q) => q.neq(q.field("status"), "archived"))
      .collect();

    return contacts.sort((a, b) => {
      const statusOrder = { unread: 0, read: 1, responded: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return b._creationTime - a._creationTime; // newest first within status
    });
  },
});

export const updateStatus = mutation({
  args: { id: v.id("contacts"), status: v.union(v.literal("read"), v.literal("responded"), v.literal("archived")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const archiveBulk = mutation({
  args: { ids: v.array(v.id("contacts")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await Promise.all(
      args.ids.map(id => ctx.db.patch(id, { status: "archived" }))
    );
  },
});
```

### Serving Uploaded Images in Next.js
```typescript
// convex/projects.ts
// Source: https://docs.convex.dev/file-storage/serve-files
export const getProject = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) return null;

    // Generate URL for each image storage ID
    const imageUrls = await Promise.all(
      project.imageStorageIds.map(async (storageId) => {
        return await ctx.storage.getUrl(storageId);
      })
    );

    return { ...project, imageUrls };
  },
});

// app/admin/projects/page.tsx
function ProjectCard({ project }) {
  return (
    <div>
      {project.imageUrls?.map((url, i) => (
        <img key={i} src={url} alt={`${project.name} screenshot ${i + 1}`} />
      ))}
    </div>
  );
}
```

### Real-Time Updates with Optimistic UI
```typescript
// Source: https://docs.convex.dev/client/react/optimistic-updates
// app/admin/projects/page.tsx
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function ProjectsList() {
  const projects = useQuery(api.projects.list); // Auto-subscribes, updates on changes
  const updateOrder = useMutation(api.projects.updateOrder);

  const handleReorder = (reordered) => {
    // Optimistic update: UI changes instantly, rolls back on failure
    updateOrder({ projectIds: reordered.map(p => p._id) })
      .withOptimisticUpdate((localStore) => {
        // Update local query results immediately
        const current = localStore.getQuery(api.projects.list);
        if (current) {
          localStore.setQuery(api.projects.list, {}, reordered);
        }
      });
  };

  return <SortableProjectList projects={projects ?? []} onReorder={handleReorder} />;
}
```

### Login Form with Server Action
```typescript
// app/login/page.tsx
// Source: https://nextjs.org/docs/app/guides/authentication
import { signIn } from "@/convex/auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

async function loginAction(formData: FormData) {
  'use server'

  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("password", { email, password, flow: "signIn" });
    redirect('/admin');
  } catch (error) {
    return { errors: { _form: ["Invalid email or password"] } };
  }
}

export default function LoginPage() {
  return (
    <form action={loginAction}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Log In</button>
    </form>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-beautiful-dnd | dnd-kit / pragmatic-drag-and-drop | 2024-2026 | react-beautiful-dnd archived by Atlassian, must migrate to modern alternatives |
| NextAuth v4 | Auth.js (NextAuth v5) / Convex Auth | 2023-2025 | NextAuth rebranded to Auth.js, Convex has native auth library now |
| Clerk exclusive | Multiple auth options | 2024-2025 | Convex Auth, Better Auth emerged as alternatives to Clerk monopoly |
| Manual WebSocket | Convex reactive queries | N/A | Convex handles real-time out of box, no custom WebSocket code needed |
| Client-side routing auth | Middleware + DAL pattern | 2023-2024 | Next.js App Router introduced middleware, security requires layered checks |
| next-images plugin | Native Image component | 2021+ | Next.js 11+ has built-in image optimization, no plugin needed |

**Deprecated/outdated:**
- **react-beautiful-dnd**: Archived, use dnd-kit or pragmatic-drag-and-drop
- **NextAuth v4 patterns**: Use Auth.js v5 or Convex Auth for new projects
- **getServerSideProps for auth**: App Router uses middleware + Server Components
- **next-images, next-optimized-images**: Use built-in next/image component

## Open Questions

Things that couldn't be fully resolved:

1. **Convex Auth Password Reset Flow Implementation**
   - What we know: Convex Auth supports password reset via `reset` option with email provider (Resend example shown)
   - What's unclear: Complete implementation example for reset flow with Resend in Phase 4 context
   - Recommendation: Defer password reset to Phase 5 (post-MVP) or implement basic version without reset initially, add if Jon requests it

2. **Rate Limiting in Convex Auth**
   - What we know: Standard practice is 10-20 attempts per minute per email/IP, industry uses tiered blocking
   - What's unclear: Whether Convex Auth has built-in rate limiting or requires custom implementation
   - Recommendation: Check Convex Auth advanced docs during planning, likely needs custom tracking table (loginAttempts) with cleanup

3. **Next.js Image Component with Convex Storage URLs**
   - What we know: Next.js Image requires remotePatterns config for external URLs, Convex storage.getUrl() returns URL
   - What's unclear: Exact remotePatterns config for Convex storage domain, whether optimization works or needs custom loader
   - Recommendation: Test during implementation, likely needs remotePatterns: `[{ protocol: 'https', hostname: '*.convex.cloud' }]`

4. **Admin Route Path Decision**
   - What we know: User left this to Claude's discretion (obscured vs /admin)
   - What's unclear: Whether Jon prefers security-by-obscurity (e.g., /x37hka9) or simple /admin
   - Recommendation: Use /admin for simplicity, security comes from auth not obscurity. Can change easily if Jon requests.

5. **Contact Detail Viewing Pattern**
   - What we know: User left this to Claude's discretion (inline expand vs panel vs page)
   - What's unclear: Which pattern fits Jon's workflow best
   - Recommendation: Start with inline expand (click row, expands to show full message), simplest to implement, can iterate

## Sources

### Primary (HIGH confidence)
- [Convex Auth Passwords](https://labs.convex.dev/auth/config/passwords) - Password provider setup, validation, reset flow
- [Convex Auth Server API](https://labs.convex.dev/auth/api_reference/server) - Session configuration (7-day duration)
- [Convex File Upload](https://docs.convex.dev/file-storage/upload-files) - Storage upload workflow, limits
- [Convex File Serving](https://docs.convex.dev/file-storage/serve-files) - storage.getUrl() for serving images
- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication) - Middleware, DAL, Server Actions pattern
- [dnd-kit Sortable](https://docs.dndkit.com/presets/sortable) - Complete sortable setup, sensors, strategies
- [Convex Optimistic Updates](https://docs.convex.dev/client/react/optimistic-updates) - withOptimisticUpdate pattern

### Secondary (MEDIUM confidence)
- [Top 5 Drag-and-Drop Libraries for React (2026)](https://puckeditor.com/blog/top-5-drag-and-drop-libraries-for-react) - dnd-kit vs alternatives comparison
- [react-dropzone](https://react-dropzone.js.org/) - File upload hook documentation
- [PatternFly Bulk Selection](https://www.patternfly.org/patterns/bulk-selection/) - Checkbox bulk actions pattern
- [Cloudflare Rate Limiting Best Practices](https://developers.cloudflare.com/waf/rate-limiting-rules/best-practices/) - Login rate limiting thresholds
- [Common Mistakes in React Admin Dashboards](https://dev.to/vaibhavg/common-mistakes-in-react-admin-dashboards-and-how-to-avoid-them-1i70) - Admin UX pitfalls
- [Bad Dashboard Examples (Databox)](https://databox.com/bad-dashboard-examples) - Dashboard design mistakes

### Tertiary (LOW confidence)
- WebSearch results on admin dashboard UX patterns - General guidance, not authoritative
- Community discussions on dnd-kit examples - Helpful but not official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries have official docs, active maintenance, verified 2026 compatibility
- Architecture: HIGH - Patterns from Next.js official docs, Convex official docs, battle-tested libraries
- Pitfalls: MEDIUM - Combination of official warnings and community experience, some extrapolated from similar domains
- Open questions: LOW - These are gaps requiring validation during implementation

**Research date:** 2026-02-03
**Valid until:** 2026-03-03 (30 days, stable ecosystem - Next.js, Convex, dnd-kit have predictable release cycles)
