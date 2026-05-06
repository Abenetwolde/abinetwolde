# Bugfix Requirements Document

## Introduction

This document captures the requirements for fixing four bugs in the Next.js portfolio project backed by Supabase:

1. **Image upload 403 error** — Supabase Storage RLS policies are missing write permissions for authenticated admin users, causing all image uploads to fail with a 403 Unauthorized error.
2. **Experience and Education logo not displayed** — The `logo` field is saved to the database but the public-facing portfolio page (`components/experience.tsx`) conditionally renders the logo only when `item.logo` is truthy; however, the upload succeeds yet the stored URL may not resolve correctly, or the RLS/storage policy blocks public reads on the `portfolio` bucket, so logos never appear on the site.
3. **Hash-based navigation instead of real pages** — All navigation links use `#anchor` fragments (e.g. `#projects`, `#experience`). There are no dedicated routes for sections, and there is no page-level analytics integration beyond the existing Vercel Analytics component.
4. **Project detail view missing** — Projects have rich data (`images[]`, `description`, `link_video`, `blog`, `link_visit`, `link_code`) but clicking a project card only shows the GitHub link via a hover overlay. There is no dedicated project detail page or modal, so visitors cannot see the full project information.

---

## Bug Analysis

### Current Behavior (Defect)

**Bug 1 — Image Upload 403**

1.1 WHEN an authenticated admin user attempts to upload an image via the `ImageUpload` component THEN the system returns `{"statusCode":"403","error":"Unauthorized","message":"new row violates row-level security policy"}` and the upload fails.

1.2 WHEN an authenticated admin user attempts to replace an existing uploaded image THEN the system returns a 403 Unauthorized error and the replacement fails.

**Bug 2 — Experience / Education Logo Not Displayed**

1.3 WHEN a logo URL is saved for an experience or education entry AND the portfolio page is loaded THEN the system does not display the company/institute logo image in the timeline card.

1.4 WHEN an admin uploads a logo for an experience or education entry THEN the system fails to complete the upload (due to Bug 1), leaving the `logo` field empty and the image absent from the public portfolio.

**Bug 3 — Hash Anchors Instead of Real Pages**

1.5 WHEN a visitor clicks a navigation link (e.g. "Projects", "Experience") THEN the system scrolls to an anchor on the single-page layout instead of navigating to a dedicated URL, making individual sections un-shareable and un-bookmarkable as standalone pages.

1.6 WHEN a visitor shares or bookmarks a section URL THEN the system loads the root page without scrolling to the intended section, because hash fragments are not preserved across hard navigations in all browsers.

1.7 WHEN the portfolio owner wants to view per-page visit analytics THEN the system provides no per-section or per-page analytics data beyond the global Vercel Analytics event, because all content lives on a single route (`/`).

**Bug 4 — Project Detail View Missing**

1.8 WHEN a visitor clicks on a project card THEN the system does not open a project detail view; only the hover overlay with icon links is shown.

1.9 WHEN a project has multiple images, a video URL, a blog link, or a detailed description THEN the system does not display this additional content anywhere on the public portfolio, because no project detail modal exists.

1.10 WHEN a visitor wants to read the full description or watch the demo video of a project THEN the system only shows a two-line truncated description (`line-clamp-2`) and icon links on hover, with no way to access the rest of the content.

---

### Expected Behavior (Correct)

**Bug 1 — Image Upload 403**

2.1 WHEN an authenticated admin user uploads an image THEN the system SHALL successfully store the file in the Supabase `portfolio` storage bucket and return a public URL without any RLS error.

2.2 WHEN an authenticated admin user replaces an existing image THEN the system SHALL successfully overwrite the file and return the updated public URL.

**Bug 2 — Experience / Education Logo Displayed**

2.3 WHEN a logo URL is saved for an experience or education entry AND the portfolio page is loaded THEN the system SHALL display the logo image inside the timeline card next to the company/institute name.

2.4 WHEN an admin uploads a logo for an experience or education entry THEN the system SHALL complete the upload successfully (after Bug 1 is fixed) and persist the public URL in the `logo` column of the `experiences` or `educations` table.

**Bug 3 — Real Pages with Analytics**

2.5 WHEN a visitor clicks a navigation link for a portfolio section THEN the system SHALL navigate to a dedicated URL (e.g. `/projects`, `/experience`) that renders that section's content as a standalone page.

2.6 WHEN a visitor shares or bookmarks a section URL THEN the system SHALL load the correct page content directly without requiring a scroll or hash fragment.

2.7 WHEN a page is visited THEN the system SHALL record a page-view analytics event scoped to that page's URL, enabling per-page traffic analysis via a third-party analytics integration.

**Bug 4 — Project Detail View**

2.8 WHEN a visitor clicks on a project card THEN the system SHALL open a modal overlay on the current page displaying the full project information, without navigating away from the portfolio.

2.9 WHEN the project detail modal is opened THEN the system SHALL display all available project data: full description, all images (as a gallery or carousel), video URL (embedded or linked), blog link, visit link, and GitHub link.

2.10 WHEN a project has multiple images THEN the system SHALL display them in a navigable image gallery inside the modal.

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a public (unauthenticated) visitor reads portfolio data (profile, about, skills, projects, experiences, educations, socials) THEN the system SHALL CONTINUE TO return all records without authentication, as the public read RLS policies must remain in place.

3.2 WHEN an admin user performs CRUD operations on portfolio table rows (projects, skills, experiences, educations, socials, profile, about) THEN the system SHALL CONTINUE TO apply and enforce the existing server-action authentication flow without regression.

3.3 WHEN the portfolio home page (`/`) is loaded THEN the system SHALL CONTINUE TO render all sections (Hero, About, Skills, Projects, Experience, Contact) with the same visual layout and data.

3.4 WHEN a project card is displayed in the projects grid THEN the system SHALL CONTINUE TO show the project thumbnail, name, tech stack, truncated description, and hover-overlay action links (visit, code, video); clicking the card body SHALL open the detail modal.

3.5 WHEN an experience or education entry has no logo THEN the system SHALL CONTINUE TO render the timeline card without a logo image, with no broken image placeholder.

3.6 WHEN the admin panel is accessed THEN the system SHALL CONTINUE TO require authentication and render all existing admin management pages (profile, projects, skills, experience, education, socials) without regression.

3.7 WHEN the existing Vercel Analytics component is present in the layout THEN the system SHALL CONTINUE TO fire Vercel Analytics events alongside any newly added third-party analytics.

---

## Bug Condition Pseudocode

### Bug 1 — Image Upload 403

```pascal
FUNCTION isBugCondition_ImageUpload(X)
  INPUT: X of type UploadRequest { user: AuthUser, bucket: string, filePath: string }
  OUTPUT: boolean

  RETURN X.bucket = "portfolio"
     AND X.user IS authenticated
     AND Supabase.storage.policies(X.bucket).INSERT FOR authenticated = false
END FUNCTION

// Property: Fix Checking
FOR ALL X WHERE isBugCondition_ImageUpload(X) DO
  result ← uploadFile'(X)
  ASSERT result.error IS NULL
  ASSERT result.publicUrl IS NOT NULL
END FOR

// Property: Preservation Checking
FOR ALL X WHERE NOT isBugCondition_ImageUpload(X) DO
  ASSERT uploadFile(X) = uploadFile'(X)
END FOR
```

### Bug 2 — Logo Not Displayed

```pascal
FUNCTION isBugCondition_LogoDisplay(X)
  INPUT: X of type ExperienceOrEducation { logo: string | null }
  OUTPUT: boolean

  RETURN X.logo IS NOT NULL AND X.logo != ""
     AND rendered_logo_element(X) IS NULL
END FUNCTION

// Property: Fix Checking
FOR ALL X WHERE isBugCondition_LogoDisplay(X) DO
  result ← renderTimelineCard'(X)
  ASSERT result CONTAINS img_element WITH src = X.logo
END FOR
```

### Bug 3 — Hash Anchors

```pascal
FUNCTION isBugCondition_HashNav(X)
  INPUT: X of type NavLink { href: string }
  OUTPUT: boolean

  RETURN X.href STARTS WITH "#"
END FUNCTION

// Property: Fix Checking
FOR ALL X WHERE isBugCondition_HashNav(X) DO
  result ← resolveNavLink'(X)
  ASSERT result.href IS a valid pathname (e.g. "/projects")
  ASSERT result.href DOES NOT START WITH "#"
END FOR
```

### Bug 4 — Project Detail Modal

```pascal
FUNCTION isBugCondition_ProjectDetail(X)
  INPUT: X of type Project { id: string, images: string[], description: string, link_video: string | null, blog: string | null }
  OUTPUT: boolean

  RETURN projectDetailModal(X.id) DOES NOT EXIST
     OR projectDetailModal(X.id) IS NOT TRIGGERED by project card click
END FUNCTION

// Property: Fix Checking
FOR ALL X WHERE isBugCondition_ProjectDetail(X) DO
  result ← openProjectModal'(X.id)
  ASSERT result.isVisible = true
  ASSERT result.body CONTAINS X.description
  ASSERT result.body CONTAINS ALL images IN X.images
  ASSERT X.link_video IS NOT NULL IMPLIES result.body CONTAINS X.link_video
  ASSERT result.currentPage IS UNCHANGED  // no navigation away from portfolio
END FOR
```
