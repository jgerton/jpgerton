# Architecture Patterns: Next.js 14 + Convex Portfolio Site

**Project:** jpgerton.com
**Researched:** 2026-02-03
**Confidence:** HIGH

## Executive Summary

Modern Next.js 14 + Convex applications follow a **strict separation of concerns** pattern where backend logic lives in the `convex/` folder and frontend code lives in `app/` or `src/app/`. The architecture emphasizes server-first rendering with client components for reactive features, unified through a provider-based pattern that maintains a persistent WebSocket connection for real-time data synchronization.

For a portfolio site with admin dashboard, this translates to:

- **Public pages** rendered as Server Components for optimal SEO and performance
- **Admin dashboard** using Client Components for reactive CRUD operations
- **Shared data layer** in Convex providing type-safe queries and mutations
- **Authentication boundary** enforced via Next.js middleware and Convex Auth

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App (Frontend)                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  App Router                                             │ │
│ │  ├── / (public pages - Server Components)              │ │
│ │  │   ├── Home, Projects, Services, Contact, About      │ │
│ │  │   └── SEO optimized, static when possible           │ │
│ │  │                                                       │ │
│ │  ├── /admin (protected - Client Components)            │ │
│ │  │   ├── Dashboard, Projects CRUD, Contact Manager     │ │
│ │  │   └── Reactive UI, optimistic updates               │ │
│ │  │                                                       │ │
│ │  └── middleware.ts (auth boundary)                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                 ConvexClientProvider                         │
│                  (WebSocket connection)                      │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│                    Convex Backend                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  convex/                                                │ │
│ │  ├── schema.ts (data model)                            │ │
│ │  │   ├── projects table                                │ │
│ │  │   └── contactSubmissions table                      │ │
│ │  │                                                       │ │
│ │  ├── queries/ (read operations)                        │ │
│ │  │   ├── getProjects.ts                                │ │
│ │  │   ├── getProject.ts                                 │ │
│ │  │   └── getContactSubmissions.ts                      │ │
│ │  │                                                       │ │
│ │  ├── mutations/ (write operations)                     │ │
│ │  │   ├── createProject.ts, updateProject.ts, etc.     │ │
│ │  │   ├── deleteProject.ts, reorderProjects.ts         │ │
│ │  │   └── createContactSubmission.ts                    │ │
│ │  │                                                       │ │
│ │  └── auth.ts (Convex Auth configuration)              │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Boundaries

### 1. Next.js Frontend Layer

| Component                                        | Responsibility                     | Type              | Communicates With                      |
| ------------------------------------------------ | ---------------------------------- | ----------------- | -------------------------------------- |
| **Public Pages** (`app/`, `app/projects/`, etc.) | Render marketing/portfolio content | Server Components | Convex queries (via preload)           |
| **Admin Pages** (`app/admin/*`)                  | Provide CRUD interface             | Client Components | Convex queries & mutations (via hooks) |
| **ConvexClientProvider**                         | Establish WebSocket connection     | Client Component  | ConvexReactClient                      |
| **middleware.ts**                                | Protect admin routes               | Middleware        | Convex Auth                            |
| **Layout Components**                            | Shared UI structure                | Server or Client  | Child components                       |

### 2. Convex Backend Layer

| Component      | Responsibility                   | Communicates With       |
| -------------- | -------------------------------- | ----------------------- |
| **schema.ts**  | Define data model, validation    | All queries/mutations   |
| **queries/**   | Read operations with indexes     | Database tables         |
| **mutations/** | Write operations with validation | Database tables         |
| **auth.ts**    | Authentication configuration     | Convex Auth, middleware |

### 3. Data Tables

| Table                  | Purpose                  | Fields                                                                            | Relationships          |
| ---------------------- | ------------------------ | --------------------------------------------------------------------------------- | ---------------------- |
| **projects**           | Store portfolio projects | id, title, description, techStack, imageUrl, liveUrl, githubUrl, order, createdAt | None (simple list)     |
| **contactSubmissions** | Store contact form data  | id, name, email, message, source (calendly/form), status, createdAt               | None                   |
| **users**              | Admin authentication     | id, email, name, role                                                             | Managed by Convex Auth |

## Data Flow Patterns

### Pattern 1: Public Page Rendering (SSR)

```
User visits /projects
    ↓
Server Component renders
    ↓
Calls Convex query via preloadQuery (server-side)
    ↓
Returns HTML with project data
    ↓
Client hydrates (no WebSocket needed for read-only)
```

**When to use:** Public pages, SEO-critical content, static data
**Benefits:** Optimal performance, SEO friendly, no client-side data fetching delay

### Pattern 2: Admin Dashboard (Reactive)

```
Admin visits /admin/projects
    ↓
Client Component mounts
    ↓
useQuery hook subscribes via WebSocket
    ↓
Convex returns data + maintains subscription
    ↓
Admin edits project
    ↓
useMutation triggers write
    ↓
Mutation executes, DB updates
    ↓
All subscribed useQuery hooks auto-update
    ↓
UI re-renders with new data
```

**When to use:** Admin CRUD operations, real-time features
**Benefits:** Automatic reactivity, optimistic updates, no manual cache invalidation

### Pattern 3: Contact Form Submission

```
Visitor fills form on /contact (Client Component section)
    ↓
useMutation("createContactSubmission")
    ↓
Mutation validates data
    ↓
Inserts to contactSubmissions table
    ↓
Returns success/error
    ↓
UI shows confirmation
```

**When to use:** User-generated content, form submissions
**Benefits:** Validation enforced at backend, automatic retry on network failure

### Pattern 4: Authentication Flow

```
User navigates to /admin
    ↓
middleware.ts intercepts
    ↓
Checks convexAuth.isAuthenticated()
    ↓
If NO: redirect to /signin
    ↓
If YES: allow access
    ↓
Admin page calls authenticated queries
    ↓
Convex verifies JWT token
    ↓
Returns user-specific data
```

**When to use:** All protected routes
**Benefits:** Centralized auth check, prevents unauthorized access

## Architectural Patterns to Follow

### Pattern 1: Provider Wrapping

**What:** Wrap app with ConvexClientProvider that instantiates ConvexReactClient

**Implementation:**

```typescript
// app/ConvexClientProvider.tsx
"use client";

export function ConvexClientProvider({ children }) {
  return (
    <ConvexAuthNextjsProvider>
      {children}
    </ConvexAuthNextjsProvider>
  );
}

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```

**Why:** Establishes WebSocket connection once, available throughout component tree

### Pattern 2: Helper Function Extraction

**What:** Keep `query`/`mutation` wrappers thin, put logic in `convex/model/` helpers

**Implementation:**

```typescript
// convex/model/projects.ts
export function validateProject(project) {
  // validation logic
}

// convex/mutations/createProject.ts
import { validateProject } from "../model/projects";

export default mutation(async (ctx, args) => {
  validateProject(args);
  return await ctx.db.insert("projects", args);
});
```

**Why:** Easier testing, reusability, cleaner separation of concerns

### Pattern 3: Index-Based Queries

**What:** Use `.withIndex()` instead of `.filter()` for better performance

**Implementation:**

```typescript
// Good: indexed query
const projects = await ctx.db
  .query("projects")
  .withIndex("by_order")
  .order("asc")
  .collect();

// Avoid: filtering in code
const projects = await ctx.db
  .query("projects")
  .collect()
  .filter((p) => p.published === true);
```

**Why:** Orders of magnitude faster, leverages database indexes

### Pattern 4: Pagination Over Collect

**What:** Use `.take(limit)` instead of `.collect()` for potentially large datasets

**Implementation:**

```typescript
// Good: limited results
const recentSubmissions = await ctx.db
  .query("contactSubmissions")
  .order("desc")
  .take(50);

// Risky: unbounded query
const allSubmissions = await ctx.db.query("contactSubmissions").collect(); // Could be 10,000+ records
```

**Why:** Prevents database bandwidth exhaustion, faster queries

### Pattern 5: Optimistic Updates for CRUD

**What:** Update UI immediately, then sync with backend

**Implementation:**

```typescript
const updateProject = useMutation(api.mutations.updateProject);
const optimisticUpdate = useOptimisticUpdate();

function handleSave(projectId, changes) {
  optimisticUpdate(projectId, changes); // UI updates now
  updateProject({ id: projectId, ...changes }); // Backend syncs later
}
```

**Why:** Instant feedback, better UX, automatic rollback on errors

## Anti-Patterns to Avoid

### Anti-Pattern 1: Client Components for Static Content

**What:** Using `"use client"` for pages that don't need interactivity

**Why bad:**

- Larger bundle sizes
- Slower initial page load
- Missed SEO opportunities
- Unnecessary WebSocket connections

**Instead:** Use Server Components for public pages, add `"use client"` only where needed

---

### Anti-Pattern 2: Passing Functions Through Server/Client Boundary

**What:** Trying to pass callbacks or functions from Server to Client Components

**Why bad:**

- Functions cannot be serialized
- React will throw errors
- Breaks server/client separation

**Instead:** Use Server Actions for server-side logic, client-side handlers for interactions

---

### Anti-Pattern 3: Array-Based Relationships

**What:** Storing arrays of IDs like `projectIds: [id1, id2, id3]`

**Why bad:**

- Cannot index arrays in Convex
- Limited to 8192 entries
- Query performance degrades
- Difficult to query "find all projects in category X"

**Instead:** Use join tables with indexed references for many-to-many relationships

---

### Anti-Pattern 4: Using Date.now() in Queries

**What:** Filtering by current time in query functions

**Why bad:**

- Queries don't re-run when time changes
- Results become stale
- Users see outdated data

**Instead:** Pass timestamps as arguments or use scheduled functions to update status fields

---

### Anti-Pattern 5: Spoofable Access Control

**What:** Checking user permissions based on client-provided parameters

**Why bad:**

- Client can manipulate request parameters
- Security vulnerability
- No guarantee of identity

**Instead:** Always check `ctx.auth.getUserIdentity()` in mutations, never trust client input

---

### Anti-Pattern 6: Circular Schema References

**What:** Table A references table B, table B references table A (both required)

**Why bad:**

- Schema validation fails
- Cannot insert initial records
- Database constraints violated

**Instead:** Make one reference nullable, or reconsider relationship structure

## Build Order Recommendations

Based on component dependencies and architectural patterns, here's the recommended implementation sequence:

### Phase 1: Foundation (Week 1)

**Goal:** Establish core architecture and data layer

1. **Convex Setup**
   - Initialize Convex project (`npx convex dev`)
   - Define schema.ts (projects, contactSubmissions tables)
   - Create basic queries (getProjects, getProject)
   - Create basic mutations (createProject, updateProject, deleteProject)

2. **Next.js Setup**
   - Initialize Next.js 14 with App Router
   - Install Convex client libraries
   - Create ConvexClientProvider
   - Wire up layout.tsx with provider

**Why first:** Everything depends on data layer and provider setup

---

### Phase 2: Public Pages (Week 2)

**Goal:** Ship viewable portfolio site

1. **Server Components**
   - Home page (Server Component)
   - Projects page (Server Component with preloadQuery)
   - Services page (static)
   - About page (static)

2. **Contact Page**
   - Client Component for form
   - useMutation for form submission
   - Success/error handling

**Why second:** Public site can ship before admin, validates architecture

---

### Phase 3: Authentication (Week 2)

**Goal:** Secure admin section

1. **Convex Auth Setup**
   - Configure auth.ts
   - Create auth provider wrappers
   - Add email/password provider

2. **Next.js Middleware**
   - Create middleware.ts
   - Protect /admin/\* routes
   - Handle redirects

3. **Sign In Page**
   - Sign in form
   - Session management

**Why third:** Authentication blocks admin features, but doesn't block public launch

---

### Phase 4: Admin Dashboard (Week 3)

**Goal:** Enable content management

1. **Dashboard Home**
   - Recent activity display
   - Quick stats (project count, submission count)

2. **Projects CRUD**
   - List view (Client Component with useQuery)
   - Create/Edit forms
   - Delete confirmation
   - Drag-to-reorder (useMutation for order updates)

3. **Contact Submissions Manager**
   - List view with filters
   - Status updates (new/read/archived)
   - Search functionality

**Why fourth:** Admin requires auth and data layer, delivers full functionality

---

### Phase 5: Polish & SEO (Week 4)

**Goal:** Optimize for discoverability

1. **SEO Basics**
   - Meta tags (title, description, OG)
   - Semantic HTML
   - Sitemap generation

2. **AEO Treatment**
   - JSON-LD schema markup (Person, Organization, WebSite)
   - FAQ sections with schema
   - Speakable content markup

3. **Performance**
   - Image optimization (next/image)
   - Route prefetching
   - Lighthouse audit compliance

**Why last:** Functional site must exist before optimization makes sense

---

## Dependency Graph

```
Phase 1 (Foundation)
    ├─> Phase 2 (Public Pages) [depends on queries]
    └─> Phase 3 (Auth) [depends on schema]
            └─> Phase 4 (Admin) [depends on auth + mutations]
                    └─> Phase 5 (SEO) [depends on content]
```

**Critical path:** Foundation → Auth → Admin
**Parallel track:** Public Pages can develop independently after Foundation

## Scalability Considerations

| Concern           | At 100 visitors/month           | At 10K visitors/month  | At 100K visitors/month         |
| ----------------- | ------------------------------- | ---------------------- | ------------------------------ |
| **Database**      | Free tier sufficient (1M calls) | Free tier likely OK    | May need paid tier ($25/month) |
| **Hosting**       | Vercel free tier                | Vercel free tier       | Vercel Pro ($20/month)         |
| **Images**        | Local storage in public/        | Consider Cloudinary/S3 | Required CDN integration       |
| **Contact forms** | Manual review adequate          | Need spam filtering    | Add CAPTCHA, rate limiting     |
| **Admin users**   | Single admin (you)              | 2-3 admins             | Role-based access control      |

**Current architecture supports:** Up to 10K visitors/month without major changes

## Security Boundaries

### 1. Authentication Boundary

- **Enforced by:** Next.js middleware + Convex Auth
- **Protects:** All /admin/\* routes
- **Token flow:** JWT issued by Convex, validated on every request

### 2. Authorization Boundary

- **Enforced by:** Mutation argument validation + getUserIdentity()
- **Protects:** Write operations (create/update/delete)
- **Pattern:** Check auth in every mutation, never trust client input

### 3. Data Validation Boundary

- **Enforced by:** Convex schema + mutation validators
- **Protects:** Database integrity
- **Pattern:** Validate on insert/update, reject invalid data

### 4. CSRF Protection

- **Enforced by:** Next.js Server Actions + Convex mutations (POST only)
- **Protects:** State-changing operations
- **Pattern:** Never perform side effects on GET requests

## Sources

**High Confidence (Official Documentation):**

- [Next.js Architecture](https://nextjs.org/docs/architecture)
- [Convex Developer Hub - Next.js](https://docs.convex.dev/client/nextjs/app-router/)
- [Convex React Client](https://docs.convex.dev/client/react)
- [Convex Best Practices](https://docs.convex.dev/understanding/best-practices/)
- [Convex Schemas](https://docs.convex.dev/database/schemas)
- [Convex Auth with Next.js](https://labs.convex.dev/auth/authz/nextjs)
- [Backend Components](https://stack.convex.dev/backend-components)

**Medium Confidence (Community & Examples):**

- [Convex Next.js App Router Demo](https://github.com/get-convex/convex-nextjs-app-router-demo)
- [Next.js Architecture in 2026 - Server-First Patterns](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router)
- [Convex CRUD Patterns](https://www.freecodecamp.org/news/build-crud-app-react-and-convex/)
- [Convex Schema Best Practices Gist](https://gist.github.com/srizvi/966e583693271d874bf65c2a95466339)
- [Relationship Structures in Convex](https://stack.convex.dev/relationship-structures-let-s-talk-about-schemas)
- [Next.js Folder Structure 2026 Guide](https://www.codebydeep.com/blog/next-js-folder-structure-best-practices-for-scalable-applications-2026-guide)
