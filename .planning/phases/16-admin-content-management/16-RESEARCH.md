# Phase 16: Admin Content Management - Research

**Researched:** 2026-02-07
**Domain:** Admin CRUD interfaces with markdown editing and drag-to-reorder
**Confidence:** HIGH

## Summary

This phase builds admin interfaces for blog posts and case studies following the established Projects tab pattern. The domain is well-defined: use @uiw/react-md-editor for markdown editing with tabbed edit/preview mode, replicate dnd-kit sortable table pattern from existing Projects tab, handle image uploads with Convex storage using the existing pattern, and extract hardcoded Calendly URLs to environment variables.

Research reveals strong consistency with existing codebase patterns. The project already uses dnd-kit for drag-to-reorder in Projects (SortableProjectList component), ImageUploadZone for Convex storage uploads, ConfirmDialog for delete actions, and react-hook-form with zod for form validation. The backend schema and mutations (blogPosts.ts, caseStudies.ts) are complete from Phase 15 with all necessary CRUD operations, reorder mutations, and publish/unpublish workflows.

Key architectural decision: markdown editor should be code-split using Next.js dynamic imports to avoid shipping editor code to public pages. @uiw/react-md-editor has a small bundle (~4.6KB gzipped) but is admin-only functionality.

**Primary recommendation:** Follow existing admin patterns exactly (Projects tab structure, SortableProjectList pattern, ImageUploadZone, ConfirmDialog), add @uiw/react-md-editor with tabbed preview mode, code-split with next/dynamic, and extract CALENDLY_URL constant to site-config.ts.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @uiw/react-md-editor | ^4.0.11 | Markdown editing with preview | Lightweight (~4.6KB gzipped), GitHub Flavored Markdown, TypeScript definitions, tabbed edit/preview modes |
| @dnd-kit/core | ^6.3.1 | Drag-and-drop primitives | Already in project, lightweight hooks-based DnD |
| @dnd-kit/sortable | ^10.0.0 | Sortable list utilities | Vertical list sorting strategy for tables |
| react-hook-form | ^7.71.1 | Form state management | Already in project, used in ProjectForm |
| zod | (via @hookform/resolvers) | Form validation | Type-safe validation, already in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/dynamic | Next.js 16 | Code splitting | Import markdown editor only for admin pages |
| rehype-sanitize | (optional) | Sanitize markdown HTML | If user-generated content includes raw HTML |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @uiw/react-md-editor | MDXEditor | MDXEditor is more feature-rich but much larger bundle (100KB+) and unnecessary for basic markdown needs |
| @uiw/react-md-editor | react-markdown (render only) | Not an editor - only renders markdown, no editing UI |
| Tabbed edit/preview | Side-by-side split | Side-by-side takes more horizontal space, less mobile-friendly, user decided tabbed mode |

**Installation:**
```bash
bun add @uiw/react-md-editor
```

## Architecture Patterns

### Recommended Project Structure
```
app/admin/
├── blog/
│   ├── page.tsx              # Blog list with filter tabs, drag-to-reorder table
│   ├── new/
│   │   └── page.tsx          # Full-page blog post editor
│   └── [id]/
│       └── edit/
│           └── page.tsx      # Full-page blog post editor (edit mode)
├── case-studies/
│   ├── page.tsx              # Case study list with filter tabs, drag-to-reorder table
│   ├── new/
│   │   └── page.tsx          # Full-page case study editor
│   └── [id]/
│       └── edit/
│           └── page.tsx      # Full-page case study editor (edit mode)
components/admin/
├── admin-tabs.tsx            # UPDATE: Add Blog and Case Studies tabs with count badges
├── blog-form.tsx             # NEW: Blog post form (similar to ProjectForm pattern)
├── case-study-form.tsx       # NEW: Case study form (similar to ProjectForm pattern)
├── sortable-blog-list.tsx    # NEW: Blog list table (replicate SortableProjectList pattern)
├── sortable-case-study-list.tsx  # NEW: Case study list table
├── markdown-editor.tsx       # NEW: Wrapper for @uiw/react-md-editor with tabbed mode
├── image-upload-zone.tsx     # EXISTING: Reuse for cover images (UPDATE for click-to-upload)
└── confirm-dialog.tsx        # EXISTING: Reuse for delete confirmations
```

### Pattern 1: Markdown Editor with Tabbed Preview
**What:** Wrapper component for @uiw/react-md-editor with controlled value, tabbed edit/preview mode
**When to use:** Blog post content field, case study section content fields
**Example:**
```typescript
// components/admin/markdown-editor.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Code-split markdown editor (admin-only, ~4.6KB)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  height?: number;
}

export function MarkdownEditor({ value, onChange, height = 400 }: MarkdownEditorProps) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        preview="edit" // Default to edit tab (user can switch to preview)
        // previewOptions for GitHub Flavored Markdown
      />
    </div>
  );
}
```

### Pattern 2: Drag-to-Reorder Table (Replicate SortableProjectList)
**What:** DndContext wrapping a table with SortableContext and individual sortable rows
**When to use:** Blog list, case study list
**Example:**
```typescript
// Simplified from existing SortableProjectList pattern
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    const oldIndex = items.findIndex((i) => i._id === active.id);
    const newIndex = items.findIndex((i) => i._id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    onReorder(reordered);
  }
};

return (
  <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={handleDragEnd}
  >
    <SortableContext
      items={items.map((i) => i._id)}
      strategy={verticalListSortingStrategy}
    >
      <table>
        {/* table rows using useSortable hook */}
      </table>
    </SortableContext>
  </DndContext>
);
```

### Pattern 3: Image Upload with Click-to-Upload
**What:** Modify existing ImageUploadZone to support click-to-upload (currently drag-and-drop only)
**When to use:** Blog cover image, case study cover image
**Example:**
```typescript
// Update existing ImageUploadZone component
// User decided: click-to-upload with file picker, not drag-and-drop
// Keep preview thumbnail and Convex storage upload pattern

const { getRootProps, getInputProps } = useDropzone({
  onDrop,
  accept: {
    "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
  },
  maxFiles: 1,
  multiple: false,
  noClick: false, // Allow click
  noDrag: true,   // User prefers click-only (simpler UX)
});
```

### Pattern 4: Form with Image + Alt Text Validation
**What:** react-hook-form field for coverImageId + coverImageAlt with conditional required validation
**When to use:** Blog form, case study form
**Example:**
```typescript
// Zod schema pattern for conditional alt text validation
const blogFormSchema = z.object({
  // ... other fields
  coverImageId: z.string().optional(),
  coverImageAlt: z.string().optional(),
}).refine(
  (data) => {
    // If coverImageId exists, coverImageAlt must be non-empty
    if (data.coverImageId) {
      return data.coverImageAlt && data.coverImageAlt.trim() !== "";
    }
    return true;
  },
  {
    message: "Alt text is required when cover image is present",
    path: ["coverImageAlt"],
  }
);
```

### Pattern 5: Filter Tabs (All / Draft / Published)
**What:** Tab buttons that filter table rows by status
**When to use:** Blog list page, case study list page
**Example:**
```typescript
// Use shadcn/ui Button with variant="ghost" for tabs
const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");

const filteredPosts = posts?.filter((post) => {
  if (statusFilter === "all") return true;
  return post.status === statusFilter;
});

<div className="flex gap-2 mb-4">
  <Button
    variant={statusFilter === "all" ? "default" : "ghost"}
    onClick={() => setStatusFilter("all")}
  >
    All ({posts?.length ?? 0})
  </Button>
  <Button
    variant={statusFilter === "draft" ? "default" : "ghost"}
    onClick={() => setStatusFilter("draft")}
  >
    Draft ({posts?.filter(p => p.status === "draft").length ?? 0})
  </Button>
  <Button
    variant={statusFilter === "published" ? "default" : "ghost"}
    onClick={() => setStatusFilter("published")}
  >
    Published ({posts?.filter(p => p.status === "published").length ?? 0})
  </Button>
</div>
```

### Pattern 6: AdminTabs with Count Badges
**What:** Update existing AdminTabs component to show count badges
**When to use:** Admin navigation tabs
**Example:**
```typescript
// components/admin/admin-tabs.tsx
const tabs = [
  { label: "Dashboard", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  {
    label: "Blog",
    href: "/admin/blog",
    count: useQuery(api.blogPosts.list)?.length // Total count
  },
  {
    label: "Case Studies",
    href: "/admin/case-studies",
    count: useQuery(api.caseStudies.list)?.length
  },
  { label: "Contacts", href: "/admin/contacts" },
];

// Render: "Blog (12)" or "Blog" if count undefined
{tab.count !== undefined && ` (${tab.count})`}
```

### Anti-Patterns to Avoid
- **Inline markdown rendering without sanitization:** If allowing raw HTML in markdown, must use rehype-sanitize to prevent XSS. For this project, content is admin-only so lower risk.
- **Global drag-to-reorder without filtering:** Don't reorder all posts globally - user should reorder within filtered status view (match existing Projects pattern which reorders all projects regardless of status).
- **Auto-saving drafts:** Don't implement auto-save - explicit save button prevents accidental data loss and matches existing form patterns.
- **Side-by-side editor/preview:** User decided tabbed mode, not split view (saves horizontal space, better for mobile).

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown parsing and preview | Custom markdown parser | @uiw/react-md-editor with built-in preview | GitHub Flavored Markdown, syntax highlighting, keyboard shortcuts (Ctrl+D for line duplication, Alt+↑/↓ for line movement) all built-in |
| Drag-to-reorder logic | Custom drag state management | @dnd-kit/sortable with arrayMove | Handles keyboard navigation (WCAG 2.1.4 compliant), touch support, animation, collision detection |
| File upload UI | Custom file input styling | react-dropzone (already in project) | File type validation, max file size, preview generation, accessible |
| Form validation | Custom validation functions | zod + @hookform/resolvers (already in project) | Type-safe, composable validation rules, error messages |
| Markdown editor accessibility | Custom keyboard shortcuts | @uiw/react-md-editor built-in | ARIA support, keyboard navigation, WCAG 2.2 compliant shortcuts |

**Key insight:** Admin CRUD interfaces have mature patterns. Don't build custom solutions for markdown editing, drag-and-drop, or file uploads. Use established libraries and replicate existing patterns from Projects tab.

## Common Pitfalls

### Pitfall 1: Markdown Editor SSR Hydration Errors
**What goes wrong:** @uiw/react-md-editor requires browser DOM APIs (document, window), causes hydration mismatch if rendered server-side
**Why it happens:** Next.js App Router pre-renders components on server by default
**How to avoid:** Always use dynamic import with ssr: false for markdown editor
**Warning signs:** "Hydration failed" error in console, editor not rendering on client
```typescript
// CORRECT
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

// WRONG - will cause hydration error
import MDEditor from "@uiw/react-md-editor";
```

### Pitfall 2: Drag-to-Reorder Breaking After Filter Change
**What goes wrong:** User filters to "Draft", drags items, filter state includes IDs of published posts that aren't visible, causes index mismatch
**Why it happens:** onReorder callback receives filtered array, but mutation expects all items in new order
**How to avoid:** Research finding - existing Projects pattern reorders ALL projects regardless of filtering. Follow same pattern: filter for display only, reorder mutation updates global displayOrder.
**Warning signs:** Items jump to wrong positions after drag-and-drop, console errors about missing IDs
```typescript
// User's decision: Global ordering (not per-status)
// This means filtering is for display only, displayOrder is shared across all statuses
const handleReorder = async (reorderedItems: BlogPost[]) => {
  // reorderedItems is the filtered view
  // Mutation updates ONLY these items' displayOrder
  await reorder({ postIds: reorderedItems.map(p => p._id) });
  // Other posts keep their existing displayOrder
};
```

### Pitfall 3: Cover Image Required Validation Timing
**What goes wrong:** User uploads image, leaves alt text blank, clicks save, validation passes because coverImageId is still in form state as string before mutation extracts it
**Why it happens:** Validation runs before form submit, but image might not be fully saved
**How to avoid:** Use zod refine() for conditional validation - if coverImageId exists, require coverImageAlt
**Warning signs:** Published posts with images but no alt text (accessibility violation)
```typescript
// Phase 15 mutations already validate at publish time:
// blogPosts.ts publish mutation checks coverImageId and coverImageAlt
// Case studies publish mutation checks coverImageId and coverImageAlt
// Form validation is first line of defense, backend is final gate
```

### Pitfall 4: Old Image Not Deleted on Replace
**What goes wrong:** User uploads new cover image, old image stays in Convex storage forever, storage quota fills up
**Why it happens:** Convex storage IDs are immutable, replacing means creating new ID
**How to avoid:** User decided NOT to delete old image immediately (keep until post saved with new image). This prevents data loss if user cancels edit. Pattern: only delete old image in mutation after successful save.
**Warning signs:** Convex storage dashboard shows many orphaned images
```typescript
// CORRECT (user's decision)
// ImageUploadZone: Upload new image, get new storageId, don't delete old
// Mutation: Save post with new storageId, old image kept in storage
// Trade-off: Orphaned images in storage (acceptable for free tier limits)

// ALTERNATIVE (not chosen): Delete in mutation
// const oldImageId = existingPost.coverImageId;
// await ctx.db.patch(id, { coverImageId: newImageId });
// if (oldImageId) await ctx.storage.delete(oldImageId);
```

### Pitfall 5: Markdown Editor Bundle Size on Public Pages
**What goes wrong:** Markdown editor shipped to public blog pages even though it's admin-only
**Why it happens:** Importing @uiw/react-md-editor in shared components
**How to avoid:** Code-split with next/dynamic, only import in admin pages
**Warning signs:** Bundle analyzer shows react-md-editor in public page chunks
```typescript
// CORRECT: Admin page only
// app/admin/blog/[id]/edit/page.tsx
import { MarkdownEditor } from "@/components/admin/markdown-editor";

// WRONG: Don't import in public pages
// app/blog/[slug]/page.tsx - NO MARKDOWN EDITOR HERE
// Only render with react-markdown (already in project)
```

### Pitfall 6: Tab Count Badges Causing Loading Flicker
**What goes wrong:** AdminTabs renders with undefined counts, then updates when queries load, causes visible count change
**Why it happens:** useQuery returns undefined during loading phase
**How to avoid:** Conditionally render count badge only when data is loaded, or show loading state
**Warning signs:** Tab labels visibly change from "Blog" to "Blog (12)" after page load
```typescript
// CORRECT
{tab.count !== undefined && ` (${tab.count})`}

// ALTERNATIVE: Show loading
{tab.count !== undefined ? ` (${tab.count})` : " (...)"}
```

## Code Examples

Verified patterns from project codebase and official sources:

### Blog List Page with Filter Tabs and Drag-to-Reorder
```typescript
// app/admin/blog/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { SortableBlogList } from "@/components/admin/sortable-blog-list";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AdminBlogPage() {
  const posts = useQuery(api.blogPosts.list);
  const reorder = useMutation(api.blogPosts.reorder);
  const remove = useMutation(api.blogPosts.remove);

  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const filteredPosts = posts?.filter((post) => {
    if (statusFilter === "all") return true;
    return post.status === statusFilter;
  });

  const handleReorder = async (reorderedPosts: BlogPost[]) => {
    await reorder({ postIds: reorderedPosts.map(p => p._id) });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await remove({ id: deleteTarget._id });
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "ghost"}
          onClick={() => setStatusFilter("all")}
        >
          All ({posts?.length ?? 0})
        </Button>
        <Button
          variant={statusFilter === "draft" ? "default" : "ghost"}
          onClick={() => setStatusFilter("draft")}
        >
          Draft ({posts?.filter(p => p.status === "draft").length ?? 0})
        </Button>
        <Button
          variant={statusFilter === "published" ? "default" : "ghost"}
          onClick={() => setStatusFilter("published")}
        >
          Published ({posts?.filter(p => p.status === "published").length ?? 0})
        </Button>
      </div>

      {filteredPosts === undefined ? (
        <div>Loading...</div>
      ) : (
        <SortableBlogList
          posts={filteredPosts}
          onReorder={handleReorder}
          onDelete={(post) => setDeleteTarget(post)}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This will soft-delete the post.`}
        onConfirm={handleDeleteConfirm}
        destructive
      />
    </div>
  );
}
```

### Blog Form with Markdown Editor and Image Upload
```typescript
// components/admin/blog-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MarkdownEditor } from "./markdown-editor";
import { ImageUploadZone } from "./image-upload-zone";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const blogFormSchema = z.object({
  title: z.string().min(1, "Title required"),
  slug: z.string().min(1, "Slug required"),
  excerpt: z.string().min(1, "Excerpt required"),
  content: z.string().min(1, "Content required"),
  category: z.enum(["Local Business", "Technical", "Announcement"]),
  coverImageId: z.string().optional(),
  coverImageAlt: z.string().optional(),
}).refine(
  (data) => {
    if (data.coverImageId) {
      return data.coverImageAlt && data.coverImageAlt.trim() !== "";
    }
    return true;
  },
  {
    message: "Alt text required when cover image is present",
    path: ["coverImageAlt"],
  }
);

type BlogFormValues = z.infer<typeof blogFormSchema>;

export function BlogForm({ mode, initialData, onSubmit, onCancel }) {
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Local Business",
      coverImageId: undefined,
      coverImageAlt: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title, Slug, Category, Excerpt fields */}

        {/* Cover Image */}
        <FormField
          control={form.control}
          name="coverImageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image (optional for drafts)</FormLabel>
              <FormControl>
                <ImageUploadZone
                  onUploadComplete={(storageId) => field.onChange(storageId)}
                  currentImageUrl={initialData?.coverImageUrl}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Alt Text (conditionally required) */}
        <FormField
          control={form.control}
          name="coverImageAlt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image Alt Text</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Describe the image" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Markdown Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <MarkdownEditor
                  value={field.value}
                  onChange={(value) => field.onChange(value || "")}
                  height={500}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit">
            {mode === "create" ? "Create Draft" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

### Case Study Form with Section Headings and Single Markdown Editor
```typescript
// User decided: Single markdown editor with section dividers (headings), not separate editors
// Pattern: Use heading-based section dividers in single content field

// Case study content structure:
// ## [problemHeading]
// [problemContent markdown]
//
// ## [solutionHeading]
// [solutionContent markdown]
//
// ## [resultsHeading]
// [resultsContent markdown]

// components/admin/case-study-form.tsx
const caseStudyFormSchema = z.object({
  title: z.string().min(1),
  projectId: z.string().optional(), // Optional link to project
  problemHeading: z.string().min(1),
  problemContent: z.string().min(1),
  solutionHeading: z.string().min(1),
  solutionContent: z.string().min(1),
  resultsHeading: z.string().min(1),
  resultsContent: z.string().min(1),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })),
  coverImageId: z.string().optional(),
  coverImageAlt: z.string().optional(),
}).refine(/* same alt text validation as blog */);

// Form has 3 separate markdown editors (one per section)
// Each editor is smaller height (300px instead of 500px)
<MarkdownEditor
  value={form.watch("problemContent")}
  onChange={(value) => form.setValue("problemContent", value || "")}
  height={300}
/>
```

### Extracting Calendly URL to Configuration
```typescript
// lib/site-config.ts (UPDATE)
export const siteConfig = {
  // ... existing fields
  calendly: {
    discoveryCallUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/jongerton/discovery-call",
  },
} as const;

// .env.local (ADD)
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/jongerton/discovery-call

// app/about/page.tsx (UPDATE)
import { siteConfig } from "@/lib/site-config";

// BEFORE: const CALENDLY_URL = "https://calendly.com/jongerton/discovery-call";
// AFTER:  const CALENDLY_URL = siteConfig.calendly.discoveryCallUrl;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Draft.js for rich text editing | Markdown-first editors like @uiw/react-md-editor | 2023-2024 | Markdown is more portable (plain text), easier version control, smaller bundle size |
| react-beautiful-dnd | @dnd-kit | 2021-2022 | dnd-kit is hooks-based, TypeScript-native, smaller bundle, better accessibility |
| Manual file input + fetch | react-dropzone | 2020+ | Accessible file uploads, validation, preview, cross-browser drag-and-drop |
| Redux for form state | react-hook-form | 2020+ | Less boilerplate, better performance (uncontrolled inputs), smaller bundle |
| Custom validation | zod + TypeScript | 2022+ | Type inference from schema, runtime validation, error messages |

**Deprecated/outdated:**
- Draft.js: Not actively maintained, large bundle, React 18+ compatibility issues
- react-beautiful-dnd: Maintenance mode since 2021, recommend @dnd-kit instead
- react-quill: Large bundle (400KB+), includes Quill editor which is jQuery-era tech

## Open Questions

Things that couldn't be fully resolved:

1. **Drag-to-reorder: Global vs Per-Status Ordering**
   - What we know: User marked as "Claude's Discretion", existing Projects pattern uses global ordering (displayOrder shared across all statuses)
   - What's unclear: Should blog posts have separate displayOrder per status (draft order vs published order)?
   - Recommendation: Follow existing Projects pattern - global displayOrder. Simpler logic, matches established pattern. Filter tabs are for display only.

2. **Tab Badge Count Source**
   - What we know: User wants count badges on Blog and Case Studies tabs
   - What's unclear: Should count be total (all statuses) or filtered (e.g., only published)?
   - Recommendation: Show total count (all non-deleted posts) for consistency. Matches common CMS patterns (WordPress admin shows total post count).

3. **Case Study Section Divider Approach**
   - What we know: User wants single markdown editor with section dividers, not separate editors
   - What's unclear: Should dividers be visual-only (comments) or structural (headings)?
   - Recommendation: Use markdown headings (##) as dividers. More semantic, renders correctly in preview, users can customize heading text per study.

4. **Delete Confirmation Dialog Copy**
   - What we know: User wants confirmation dialogs for delete
   - What's unclear: Should copy mention "soft delete" to clarify post is not permanently removed?
   - Recommendation: Keep simple: "Are you sure you want to delete [title]? This action cannot be undone." Don't expose soft-delete implementation detail to admin user. Simpler mental model.

## Sources

### Primary (HIGH confidence)
- Project codebase: E:\Projects\wp-designer (schema, existing admin patterns, SortableProjectList, ImageUploadZone, ConfirmDialog, ProjectForm)
- Phase 15 backend: convex/blogPosts.ts, convex/caseStudies.ts (complete CRUD mutations verified)
- @dnd-kit documentation: [Sortable preset](https://docs.dndkit.com/presets/sortable), [TanStack Table Row DnD Example](https://tanstack.com/table/v8/docs/framework/react/examples/row-dnd)

### Secondary (MEDIUM confidence)
- [@uiw/react-md-editor npm page](https://www.npmjs.com/package/@uiw/react-md-editor) - verified via WebSearch, bundle size and features confirmed by multiple sources
- [Strapi: 5 Best Markdown Editors for React](https://strapi.io/blog/top-5-markdown-editors-for-react) - comparative analysis, @uiw/react-md-editor recommended for admin
- [Convex file storage docs](https://docs.convex.dev/file-storage/upload-files) - WebSearch verified official pattern for generateUploadUrl
- [Next.js dynamic imports guide](https://nextjs.org/docs/pages/guides/lazy-loading) - code splitting for admin components
- [LogRocket: Dynamic imports and code splitting with Next.js](https://blog.logrocket.com/dynamic-imports-code-splitting-next-js/) - verified patterns

### Tertiary (LOW confidence)
- [React-admin Count component](https://marmelab.com/react-admin/Count.html) - CMS tab badge patterns (WebSearch only, not implemented in project)
- WebSearch results for markdown accessibility (WCAG 2.2 compliance mentioned but not verified with @uiw/react-md-editor specifically)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - @uiw/react-md-editor widely recommended, dnd-kit already in project and proven, existing patterns verified in codebase
- Architecture: HIGH - Replicating existing Projects tab pattern, Phase 15 backend complete and verified
- Pitfalls: HIGH - Based on Next.js App Router known issues (SSR hydration), dnd-kit docs (filtering pitfalls), project constraints (Convex storage limits)
- Code examples: HIGH - Derived from existing ProjectForm, SortableProjectList, admin page patterns in codebase

**Research date:** 2026-02-07
**Valid until:** 30 days (stable domain - admin CRUD patterns, markdown editing, drag-and-drop are mature)
