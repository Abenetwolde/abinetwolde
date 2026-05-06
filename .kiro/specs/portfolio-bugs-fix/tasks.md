# Implementation Plan

- [x] 1. Write bug condition exploration tests (BEFORE implementing any fix)
  - **Property 1: Bug Condition** - Storage Upload 403 & Hash Navigation
  - **CRITICAL**: These tests MUST FAIL on unfixed code — failure confirms the bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: Tests encode the expected behavior — they will validate the fixes when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate each bug exists

  **Bug 1 — Image Upload 403:**
  - **Scoped PBT Approach**: Scope to the concrete failing case — authenticated user uploading any file to the `portfolio` bucket
  - Test that `supabase.storage.from("portfolio").upload(filePath, file)` returns a non-null error for an authenticated session
  - Assert `uploadError` is NOT null (i.e., the upload fails with 403)
  - Run on UNFIXED code — **EXPECTED OUTCOME**: Test FAILS (upload succeeds unexpectedly) OR confirms 403 error exists
  - Document counterexample: e.g., `upload("uploads/test.png", file)` → `{"statusCode":"403","error":"Unauthorized"}`
  - _Bug_Condition: isBugCondition_ImageUpload(X) where X.bucket = "portfolio" AND X.user IS authenticated AND INSERT policy = false_

  **Bug 3 — Hash Navigation:**
  - **Scoped PBT Approach**: Enumerate all nav items in `components/header.tsx` and assert none start with `#`
  - Test that every `navItems[i].href` does NOT start with `"#"`
  - Run on UNFIXED code — **EXPECTED OUTCOME**: Test FAILS (confirms hash hrefs exist)
  - Document counterexample: e.g., `navItems[3].href = "#projects"` starts with `#`
  - _Bug_Condition: isBugCondition_HashNav(X) where X.href STARTS WITH "#"_

  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.5, 1.6_

- [x] 2. Write preservation property tests (BEFORE implementing any fix)
  - **Property 2: Preservation** - Public Read Access & Home Page Integrity
  - **IMPORTANT**: Follow observation-first methodology — observe UNFIXED code behavior first
  - **GOAL**: Capture baseline behavior that must not regress after fixes

  **Preservation for Bug 1 — Public reads must remain open:**
  - Observe: `supabase.from("projects").select("*")` returns data without authentication on unfixed code
  - Observe: `supabase.from("experiences").select("*")` returns data without authentication on unfixed code
  - Write property-based test: for all public tables (profile, about, socials, skills, projects, experiences, educations), unauthenticated SELECT returns rows without error
  - Verify test PASSES on UNFIXED code (public reads already work)

  **Preservation for Bug 3 — Home page renders all sections:**
  - Observe: `GET /` renders Hero, About, Skills, Projects, Experience, Contact on unfixed code
  - Write test: assert `app/page.tsx` renders all section components
  - Verify test PASSES on UNFIXED code

  **Preservation for Bug 4 — Project card grid appearance:**
  - Observe: each `ProjectCard` renders thumbnail, name, techstack, line-clamp-2 description, hover overlay icons on unfixed code
  - Write property-based test: for all projects, rendered card contains these elements
  - Verify test PASSES on UNFIXED code

  - Run all preservation tests on UNFIXED code
  - **EXPECTED OUTCOME**: All tests PASS (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 3. Fix Bug 1 — Supabase Storage RLS policies

  - [x] 3.1 Create SQL migration script for storage RLS policies
    - Create file `scripts/003_storage_rls_policies.sql`
    - Add INSERT policy: `CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio')`
    - Add UPDATE policy: `CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio')`
    - Add DELETE policy: `CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio')`
    - Add public SELECT policy: `CREATE POLICY "Public read access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'portfolio')`
    - _Bug_Condition: isBugCondition_ImageUpload(X) where X.bucket = "portfolio" AND authenticated INSERT policy = false_
    - _Expected_Behavior: result.error IS NULL AND result.publicUrl IS NOT NULL_
    - _Preservation: Public SELECT policy must remain; unauthenticated uploads must still be rejected_
    - _Requirements: 2.1, 2.2, 3.1_

  - [x] 3.2 Apply the migration to Supabase
    - Run `scripts/003_storage_rls_policies.sql` in the Supabase SQL editor or via the Supabase CLI
    - Confirm all four policies appear in the Supabase dashboard under Storage → Policies for the `portfolio` bucket
    - _Requirements: 2.1, 2.2_

  - [x] 3.3 Verify bug condition exploration test (upload) now passes
    - **Property 1: Expected Behavior** - Authenticated Upload Succeeds
    - **IMPORTANT**: Re-run the SAME upload test from task 1 — do NOT write a new test
    - Run the upload bug condition test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (upload returns no error and a valid publicUrl)
    - _Requirements: 2.1, 2.2_

  - [x] 3.4 Verify preservation tests still pass after Bug 1 fix
    - **Property 2: Preservation** - Public Read Access Unchanged
    - **IMPORTANT**: Re-run the SAME preservation tests from task 2 — do NOT write new tests
    - Run public-read preservation tests from step 2
    - **EXPECTED OUTCOME**: All tests PASS (no regressions on public reads)
    - _Requirements: 3.1, 3.2_

- [x] 4. Fix Bug 2 — Verify Experience/Education logo rendering

  - [x] 4.1 Confirm logo rendering in components/experience.tsx is correct
    - Review `TimelineCard` in `components/experience.tsx` — the `{item.logo && <Image ... />}` conditional is already implemented correctly
    - No code change required; this task is a verification step
    - Upload a test logo via the admin panel (now unblocked by Bug 1 fix) and confirm it appears on the public portfolio
    - _Bug_Condition: isBugCondition_LogoDisplay(X) where X.logo IS NOT NULL AND rendered_logo_element IS NULL_
    - _Expected_Behavior: renderTimelineCard'(X) CONTAINS img_element WITH src = X.logo_
    - _Preservation: entries with logo = null must NOT render a broken img placeholder_
    - _Requirements: 2.3, 2.4, 3.5_

  - [x] 4.2 Verify logo display bug condition test passes
    - **Property 1: Expected Behavior** - Logo Renders When URL Is Present
    - Render a `TimelineCard` with a non-null `logo` value (a valid Supabase public URL)
    - Assert the rendered output contains an `<img>` element with `src` matching the logo URL
    - **EXPECTED OUTCOME**: Test PASSES (logo is visible after Bug 1 fix enables uploads)
    - _Requirements: 2.3, 2.4_

  - [x] 4.3 Verify preservation test for no-logo entries still passes
    - **Property 2: Preservation** - No Broken Placeholder When Logo Is Null
    - Re-run the preservation test from task 2 for entries where `logo` is null or empty
    - Assert no `<img>` element is rendered for those entries
    - **EXPECTED OUTCOME**: Test PASSES (no regressions)
    - _Requirements: 3.5_

- [x] 5. Fix Bug 4 — Add ProjectModal to components/projects.tsx

  - [x] 5.1 Add selectedProject state and onSelect prop wiring to Projects component
    - In `components/projects.tsx`, add `const [selectedProject, setSelectedProject] = useState<Project | null>(null)` to the `Projects` component
    - Pass `onSelect={setSelectedProject}` to each `ProjectCard`
    - Add `ProjectModal` render: `{selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}`
    - _Bug_Condition: isBugCondition_ProjectDetail(X) where projectDetailModal(X.id) DOES NOT EXIST_
    - _Expected_Behavior: openProjectModal'(X.id).isVisible = true AND body CONTAINS full description AND all images_
    - _Preservation: ProjectCard grid appearance (thumbnail, name, techstack, line-clamp-2 description, hover overlay) must remain unchanged_
    - _Requirements: 2.8, 2.9, 2.10, 3.3, 3.4_

  - [x] 5.2 Update ProjectCard to accept onSelect and stop propagation on overlay
    - Add `onSelect: (project: Project) => void` to `ProjectCard` props
    - Add `onClick={() => onSelect(project)}` and `className="... cursor-pointer"` to the `<article>` element
    - Add `onClick={(e) => e.stopPropagation()}` to the hover overlay `<div>` so icon link clicks do not trigger the card click
    - _Requirements: 2.8, 3.4_

  - [x] 5.3 Implement ImageGallery sub-component inside components/projects.tsx
    - Create internal `ImageGallery` component with `images: string[]` and `name: string` props
    - Add `const [current, setCurrent] = useState(0)` state
    - Render prev/next arrow buttons with wrap-around when `images.length > 1`
    - Render dot indicators for current image position
    - Show single image (no arrows) when `images.length === 1`
    - Show project initial placeholder when `images.length === 0`
    - _Requirements: 2.9, 2.10_

  - [x] 5.4 Implement ProjectModal component inside components/projects.tsx
    - Create `ProjectModal` component with `project: Project` and `onClose: () => void` props
    - Render fixed overlay (`position: fixed; inset: 0`) with semi-transparent backdrop; clicking backdrop calls `onClose`
    - Render scrollable inner panel (max-width ~800px, centered)
    - Add close button (×) in top-right corner calling `onClose`
    - Add `useEffect` to close modal on `Escape` key press
    - Add `role="dialog"`, `aria-modal="true"`, `aria-label` on close button for accessibility
    - Implement focus trap inside modal while open
    - Render sections in order: `ImageGallery`, project name + techstack, full description (no line-clamp), links row (Visit/GitHub/Video/Blog — only when non-null)
    - Use `BookOpen` icon from lucide-react for blog link
    - _Requirements: 2.8, 2.9, 2.10_

  - [x] 5.5 Verify project detail bug condition test now passes
    - **Property 1: Expected Behavior** - Project Modal Opens With Full Content
    - **IMPORTANT**: Re-run the SAME project detail test from task 1 — do NOT write a new test
    - Simulate a project card click and assert modal is visible with full description, all images, and applicable links
    - Assert current page URL is unchanged (no navigation)
    - **EXPECTED OUTCOME**: Test PASSES (modal opens correctly)
    - _Requirements: 2.8, 2.9, 2.10_

  - [x] 5.6 Verify preservation tests still pass after Bug 4 fix
    - **Property 2: Preservation** - Project Card Grid Appearance Unchanged
    - **IMPORTANT**: Re-run the SAME preservation tests from task 2 — do NOT write new tests
    - Assert each card still renders thumbnail, name, techstack, line-clamp-2 description, hover overlay icons
    - Assert home page still renders all sections (Hero, About, Skills, Projects, Experience, Contact)
    - **EXPECTED OUTCOME**: All tests PASS (no regressions)
    - _Requirements: 3.3, 3.4_

- [x] 6. Fix Bug 3 — Create dedicated route pages and update nav links

  - [x] 6.1 Create app/projects/page.tsx
    - Create `app/projects/page.tsx` as a Next.js async server component
    - Fetch projects data using `getProjects()` from `lib/data.ts`
    - Render `<Header />`, `<Projects projects={projects} />`, and `<Footer />` with appropriate layout
    - Export `revalidate = 3600` for ISR
    - _Bug_Condition: isBugCondition_HashNav(X) where X.href = "#projects"_
    - _Expected_Behavior: GET "/projects" returns HTTP 200 with Projects section content_
    - _Preservation: GET "/" still renders full portfolio with all sections_
    - _Requirements: 2.5, 2.6, 2.7, 3.3_

  - [x] 6.2 Create app/experience/page.tsx
    - Create `app/experience/page.tsx` as a Next.js async server component
    - Fetch data using `getExperiences()` and `getEducations()` from `lib/data.ts`
    - Render `<Header />`, `<ExperienceSection experiences={experiences} educations={educations} />`, and `<Footer />`
    - Export `revalidate = 3600` for ISR
    - _Requirements: 2.5, 2.6, 2.7, 3.3_

  - [x] 6.3 Create app/skills/page.tsx
    - Create `app/skills/page.tsx` as a Next.js async server component
    - Fetch data using `getSkills()` from `lib/data.ts`
    - Render `<Header />`, `<Skills skills={skills} />`, and `<Footer />`
    - Export `revalidate = 3600` for ISR
    - _Requirements: 2.5, 2.6, 2.7, 3.3_

  - [x] 6.4 Create app/contact/page.tsx
    - Create `app/contact/page.tsx` as a Next.js async server component
    - Fetch socials data using `getPortfolioData()` or a dedicated helper from `lib/data.ts`
    - Render `<Header />`, `<Contact socials={socials} />`, and `<Footer />`
    - Export `revalidate = 3600` for ISR
    - _Requirements: 2.5, 2.6, 2.7, 3.3_

  - [x] 6.5 Update nav links in components/header.tsx
    - Replace the `navItems` array in `components/header.tsx` with real path hrefs:
      ```typescript
      const navItems = [
        { href: '/', label: 'Home' },
        { href: '/#about', label: 'About' },
        { href: '/skills', label: 'Skills' },
        { href: '/projects', label: 'Projects' },
        { href: '/experience', label: 'Experience' },
        { href: '/contact', label: 'Contact' },
      ]
      ```
    - Verify no nav item href starts with a bare `#` (only `/#about` uses a hash, as an anchor on the home page)
    - _Bug_Condition: isBugCondition_HashNav(X) where X.href STARTS WITH "#"_
    - _Expected_Behavior: all navItems[i].href are valid pathnames or `/#anchor` forms_
    - _Preservation: `/#about` anchor on home page is preserved; Vercel Analytics fires per-page events automatically_
    - _Requirements: 2.5, 2.6, 2.7, 3.3, 3.7_

  - [x] 6.6 Verify hash navigation bug condition test now passes
    - **Property 1: Expected Behavior** - Nav Links Use Real Paths
    - **IMPORTANT**: Re-run the SAME hash navigation test from task 1 — do NOT write a new test
    - Assert no `navItems[i].href` starts with a bare `#`
    - Assert `GET /projects`, `GET /experience`, `GET /skills`, `GET /contact` each return HTTP 200
    - **EXPECTED OUTCOME**: Test PASSES (all nav links are real paths)
    - _Requirements: 2.5, 2.6, 2.7_

  - [x] 6.7 Verify preservation tests still pass after Bug 3 fix
    - **Property 2: Preservation** - Home Page and Existing Behavior Unchanged
    - **IMPORTANT**: Re-run the SAME preservation tests from task 2 — do NOT write new tests
    - Assert `GET /` still renders full portfolio with all sections
    - Assert Vercel Analytics `<Analytics />` component is still present in `app/layout.tsx`
    - Assert admin panel routes still require authentication
    - **EXPECTED OUTCOME**: All tests PASS (no regressions)
    - _Requirements: 3.3, 3.6, 3.7_

- [x] 7. Checkpoint — Ensure all tests pass
  - Re-run the full test suite (exploration tests + preservation tests)
  - Confirm **Property 1: Bug Condition** tests all PASS (bugs are fixed)
  - Confirm **Property 2: Preservation** tests all PASS (no regressions)
  - Manually verify in the browser:
    - Admin image upload succeeds without 403 error
    - Experience/Education logos appear on the public portfolio after uploading via admin
    - Nav links navigate to `/projects`, `/experience`, `/skills`, `/contact` as real pages
    - Clicking a project card opens the `ProjectModal` with full content
    - Home page (`/`) still renders all sections correctly
    - Admin panel remains accessible and functional
  - Ensure all tests pass; ask the user if questions arise.
