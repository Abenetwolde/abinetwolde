# Design Document — Portfolio Bugs Fix

## Overview

This document describes the technical design for fixing four bugs in the Next.js + Supabase portfolio project. Each bug is addressed with a targeted, minimal change that preserves all existing behavior.

---

## Bug 1 — Image Upload 403 (Supabase Storage RLS)

### Root Cause

The Supabase `portfolio` storage bucket has no INSERT or UPDATE RLS policy for authenticated users. The `ImageUpload` component (`components/admin/image-upload.tsx`) calls `supabase.storage.from("portfolio").upload(...)` using the client-side Supabase client, which sends the authenticated user's JWT. Supabase Storage evaluates RLS policies and rejects the request because no matching policy exists.

### Technical Context

- **Affected file:** `components/admin/image-upload.tsx`
- **Supabase bucket:** `portfolio`
- **Auth flow:** Admin users authenticate via Supabase Auth; the client SDK attaches the JWT automatically.

### Fix Design

Add two Supabase Storage RLS policies on the `portfolio` bucket via the Supabase dashboard or a migration SQL script:

```sql
-- Allow authenticated users to upload (INSERT) objects
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio');

-- Allow authenticated users to update (UPDATE) objects
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio');

-- Allow authenticated users to delete (DELETE) objects
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio');

-- Allow public read access (SELECT) — must remain in place
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio');
```

These policies are additive and do not affect existing public read access or any other bucket.

### Correctness Properties

**Fix Checking:**
```pascal
FOR ALL X WHERE isBugCondition_ImageUpload(X) DO
  result ← uploadFile'(X)
  ASSERT result.error IS NULL
  ASSERT result.publicUrl IS NOT NULL AND result.publicUrl != ""
END FOR
```

**Preservation Checking:**
```pascal
FOR ALL X WHERE NOT isBugCondition_ImageUpload(X) DO
  ASSERT uploadFile(X) = uploadFile'(X)
  // Public reads continue to work; unauthenticated uploads continue to be rejected
END FOR
```

---

## Bug 2 — Experience / Education Logo Not Displayed

### Root Cause

Two sub-causes:
1. **Upload blocked** — Bug 1 prevents logos from being uploaded at all, leaving `logo` as `null` in the database.
2. **Public read policy** — If the `portfolio` bucket lacks a public SELECT policy, even successfully stored URLs return 403 when the `<Image>` component fetches them.

The rendering code in `components/experience.tsx` is correct — it already conditionally renders the logo with `{item.logo && <Image ... />}`. No component change is needed beyond ensuring the URL is valid and publicly readable.

### Technical Context

- **Affected files:** `components/experience.tsx` (rendering — already correct), Supabase Storage policies (fix via SQL above)
- **Data flow:** Admin uploads logo → stored in `portfolio` bucket → URL saved to `experiences.logo` or `educations.logo` → `getPortfolioData()` fetches it → `ExperienceSection` renders it.

### Fix Design

1. Apply the storage RLS policies from Bug 1 (covers the upload failure).
2. Ensure the public SELECT policy exists (included in Bug 1 SQL above).
3. No code changes required in `components/experience.tsx` — the conditional render is already implemented correctly.

### Correctness Properties

**Fix Checking:**
```pascal
FOR ALL X WHERE isBugCondition_LogoDisplay(X) DO
  result ← renderTimelineCard'(X)
  ASSERT result CONTAINS img_element WITH src = X.logo
  ASSERT img_element.src IS publicly accessible (HTTP 200)
END FOR
```

**Preservation Checking:**
```pascal
FOR ALL X WHERE X.logo IS NULL OR X.logo = "" DO
  result ← renderTimelineCard'(X)
  ASSERT result DOES NOT CONTAIN img_element  // no broken placeholder
END FOR
```

---

## Bug 3 — Hash-Based Navigation Instead of Real Pages

### Root Cause

All nav links in `components/header.tsx` use `href="#section"` anchors. There are no Next.js route files for `/projects`, `/experience`, etc. The single-page layout in `app/page.tsx` renders all sections together.

### Technical Context

- **Affected files:** `components/header.tsx`, `app/page.tsx`, new route files to be created
- **Analytics:** `app/layout.tsx` includes `<Analytics />` from `@vercel/analytics/react`, which tracks page views by URL. Hash changes do not trigger new page-view events.

### Fix Design

#### Option A — Dedicated Route Pages (Full Fix)

Create individual Next.js pages for each section:

| Route | File | Content |
|-------|------|---------|
| `/` | `app/page.tsx` | Full single-page portfolio (unchanged) |
| `/projects` | `app/projects/page.tsx` | Projects section only |
| `/experience` | `app/experience/page.tsx` | Experience section only |
| `/skills` | `app/skills/page.tsx` | Skills section only |
| `/contact` | `app/contact/page.tsx` | Contact section only |

Update `components/header.tsx` nav items to use real paths:

```typescript
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },       // About stays as anchor on home
  { href: '/skills', label: 'Skills' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/contact', label: 'Contact' },
]
```

Each new page fetches its own data slice via the existing `lib/data.ts` helpers (`getProjects()`, `getExperiences()`, etc.) and renders the corresponding component.

Vercel Analytics will automatically record a distinct page-view event for each URL visit.

#### Correctness Properties

**Fix Checking:**
```pascal
FOR ALL X WHERE isBugCondition_HashNav(X) DO
  result ← resolveNavLink'(X)
  ASSERT result.href IS a valid pathname
  ASSERT result.href DOES NOT START WITH "#"
  ASSERT HTTP GET result.href RETURNS 200
END FOR
```

**Preservation Checking:**
```pascal
// Home page still renders all sections
ASSERT GET "/" RETURNS full portfolio page with all sections
// Existing anchor links within the home page still work
FOR ALL X WHERE X.href STARTS WITH "/#" DO
  ASSERT X.href IS preserved for within-page anchors
END FOR
```

---

## Bug 4 — Project Detail Modal

### Root Cause

`components/projects.tsx` renders `ProjectCard` components that show a hover overlay with icon links (visit, code, video). There is no click handler on the card body that opens a detail view. The `Project` type includes `description`, `images[]`, `link_video`, `blog`, `link_visit`, and `link_code`, but only `link_visit`, `link_code`, and `link_video` are surfaced via the hover overlay icons.

### Technical Context

- **Affected file:** `components/projects.tsx`
- **Project type** (`lib/types.ts`):
  ```typescript
  interface Project {
    id: string
    name: string
    techstack: string | null
    category: string | null
    description: string | null
    blog: string | null
    images: string[]
    link_visit: string | null
    link_code: string | null
    link_video: string | null
    display_order: number
    // ...
  }
  ```
- **No routing change needed** — the modal opens as an overlay on the current page, preserving the single-page portfolio layout.

### Fix Design

#### Component Architecture

Add a `ProjectModal` component inside `components/projects.tsx` (or as a separate file `components/projects/project-modal.tsx`). The `Projects` component manages a `selectedProject: Project | null` state. Clicking a project card sets `selectedProject`; the modal renders when `selectedProject` is not null.

```
Projects (state: selectedProject)
├── ProjectCard (onClick → setSelectedProject)
│   └── hover overlay (visit / code / video icons — unchanged)
└── ProjectModal (project={selectedProject}, onClose={() => setSelectedProject(null)})
    ├── ImageGallery (images[])
    ├── Full description
    ├── Video link / embed
    ├── Blog link
    ├── Visit link
    └── GitHub link
```

#### State Management

```typescript
// In Projects component
const [selectedProject, setSelectedProject] = useState<Project | null>(null)
```

#### ProjectCard Changes

- Wrap the card `<article>` with an `onClick` handler that calls `setSelectedProject(project)`.
- The hover overlay icon links use `e.stopPropagation()` to prevent the card click from firing when an icon is clicked directly.

```typescript
<article
  onClick={() => onSelect(project)}
  className="group cursor-pointer overflow-hidden ..."
>
  {/* existing content */}
  <div
    className="absolute inset-0 ... overlay"
    onClick={(e) => e.stopPropagation()}
  >
    {/* icon links unchanged */}
  </div>
</article>
```

#### ProjectModal Component

```typescript
interface ProjectModalProps {
  project: Project
  onClose: () => void
}
```

**Modal structure:**
- Fixed overlay (`position: fixed; inset: 0`) with a semi-transparent backdrop.
- Scrollable inner panel (max-width ~800px, centered).
- Close button (×) in the top-right corner; also closes on backdrop click or `Escape` key.
- Sections rendered in order:
  1. **Image gallery** — if `images.length > 1`, show prev/next navigation arrows and a dot indicator. If `images.length === 1`, show a single image. If no images, show the project initial placeholder.
  2. **Project name** and **tech stack**.
  3. **Full description** (no `line-clamp`).
  4. **Links row** — Visit Site (`ExternalLink`), GitHub (`Github`), Watch Video (`Play`), Blog (`BookOpen`) — only rendered when the respective field is non-null.

#### Accessibility

- Modal uses `role="dialog"` and `aria-modal="true"`.
- Focus is trapped inside the modal while open.
- `aria-label` on the close button.
- `Escape` key closes the modal.
- Backdrop click closes the modal.

#### Image Gallery Sub-Component

```typescript
// Internal to ProjectModal
function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0)
  // prev / next handlers with wrap-around
}
```

### Correctness Properties

**Fix Checking:**
```pascal
FOR ALL X WHERE isBugCondition_ProjectDetail(X) DO
  result ← openProjectModal'(X.id)
  ASSERT result.isVisible = true
  ASSERT result.body CONTAINS X.description (full, not truncated)
  ASSERT result.body CONTAINS ALL images IN X.images
  ASSERT X.link_video IS NOT NULL IMPLIES result.body CONTAINS link to X.link_video
  ASSERT X.blog IS NOT NULL IMPLIES result.body CONTAINS link to X.blog
  ASSERT result.currentPage IS UNCHANGED  // URL does not change
END FOR
```

**Preservation Checking:**
```pascal
// Card grid appearance is unchanged
FOR ALL projects IN displayedProjects DO
  card ← renderProjectCard'(project)
  ASSERT card CONTAINS thumbnail image
  ASSERT card CONTAINS project.name
  ASSERT card CONTAINS project.techstack
  ASSERT card CONTAINS line-clamp-2 description
  ASSERT card hover overlay CONTAINS icon links (visit, code, video)
END FOR

// Modal does not affect other sections
ASSERT portfolioPage CONTAINS Hero, About, Skills, Projects, Experience, Contact
```

---

## Implementation Order

The bugs should be fixed in this order to minimize dependency issues:

1. **Bug 1** — Apply Supabase Storage RLS policies (unblocks Bug 2).
2. **Bug 2** — Verify logo rendering works after Bug 1 is fixed (no code change needed).
3. **Bug 4** — Add `ProjectModal` to `components/projects.tsx` (self-contained, no routing changes).
4. **Bug 3** — Create dedicated route pages and update nav links (largest change, done last).

---

## Files to Create / Modify

| File | Action | Bug |
|------|--------|-----|
| `scripts/003_storage_rls_policies.sql` | Create | Bug 1 |
| `components/projects.tsx` | Modify — add modal state, `ProjectModal`, `ImageGallery` | Bug 4 |
| `components/header.tsx` | Modify — update nav hrefs to real paths | Bug 3 |
| `app/projects/page.tsx` | Create | Bug 3 |
| `app/experience/page.tsx` | Create | Bug 3 |
| `app/skills/page.tsx` | Create | Bug 3 |
| `app/contact/page.tsx` | Create | Bug 3 |
