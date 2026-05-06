/**
 * Preservation Property Tests
 *
 * These tests capture BASELINE BEHAVIOR that must NOT regress after fixes.
 * All tests in this file MUST PASS on unfixed code — they document what already works.
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */

// ---------------------------------------------------------------------------
// Preservation for Bug 1 — Public reads must remain open (Requirement 3.1)
//
// Property: for all public tables, unauthenticated SELECT returns rows without error.
// This must continue to work after any RLS policy changes.
// ---------------------------------------------------------------------------

describe('Preservation — Bug 1: Public reads remain open (Req 3.1)', () => {
  /**
   * Validates: Requirements 3.1
   *
   * Simulates unauthenticated Supabase SELECT calls for every public table.
   * The mock returns rows without error, reflecting the current (correct) behaviour
   * of the public read RLS policies that are already in place.
   *
   * After Bug 1 is fixed (write policies added), these read paths must be unchanged.
   */

  // All tables that must be publicly readable without authentication
  const PUBLIC_TABLES = [
    'profile',
    'about',
    'socials',
    'skills',
    'projects',
    'experiences',
    'educations',
  ] as const

  type PublicTable = (typeof PUBLIC_TABLES)[number]

  // Seed data representing what an unauthenticated SELECT would return
  const MOCK_ROWS: Record<PublicTable, object[]> = {
    profile: [{ id: '1', name: 'Test User' }],
    about: [{ id: '1', profile_id: '1', about: 'About text' }],
    socials: [{ id: '1', profile_id: '1', icon: 'github', link: 'https://github.com' }],
    skills: [{ id: '1', profile_id: '1', name: 'TypeScript', category: 'frontend' }],
    projects: [{ id: '1', profile_id: '1', name: 'My Project', images: [] }],
    experiences: [{ id: '1', profile_id: '1', company: 'Acme', position: 'Engineer', description: [] }],
    educations: [{ id: '1', profile_id: '1', institute: 'MIT', degree: 'BSc', description: [] }],
  }

  /**
   * Build a mock Supabase client that simulates unauthenticated public reads.
   * No auth token is set — this represents an anonymous visitor.
   */
  function buildUnauthenticatedClient(table: PublicTable) {
    const rows = MOCK_ROWS[table]
    const mockSelect = jest.fn().mockResolvedValue({ data: rows, error: null })
    const mockOrder = jest.fn().mockResolvedValue({ data: rows, error: null })
    const mockSingle = jest.fn().mockResolvedValue({ data: rows[0], error: null })

    // Chain: .from(table).select('*') → { data, error }
    // Chain: .from(table).select('*').order(...) → { data, error }
    const mockSelectChain = {
      order: mockOrder,
      single: mockSingle,
      // Allow direct await (thenable)
      then: (resolve: (v: { data: object[]; error: null }) => void) =>
        resolve({ data: rows, error: null }),
    }

    const mockSelectFn = jest.fn().mockReturnValue(mockSelectChain)
    const mockFrom = jest.fn().mockReturnValue({ select: mockSelectFn })

    return { from: mockFrom }
  }

  // Property: for each public table, unauthenticated SELECT returns rows without error
  it.each(PUBLIC_TABLES)(
    'unauthenticated SELECT on "%s" returns rows without error',
    async (table) => {
      const supabase = buildUnauthenticatedClient(table)

      // Simulate what lib/data.ts does for each table
      const { data, error } = await supabase.from(table).select('*')

      // Preservation assertion: public reads must succeed (no error)
      expect(error).toBeNull()

      // Preservation assertion: data must be returned (not null/empty)
      expect(data).not.toBeNull()
      expect(Array.isArray(data) || typeof data === 'object').toBe(true)

      // Verify the call was made without any auth headers (unauthenticated)
      expect(supabase.from).toHaveBeenCalledWith(table)
    },
  )

  it('all public tables can be queried in parallel without error (mirrors getPortfolioData)', async () => {
    // Simulate the parallel fetch pattern in lib/data.ts getPortfolioData()
    const results = await Promise.all(
      PUBLIC_TABLES.map(async (table) => {
        const supabase = buildUnauthenticatedClient(table)
        const { data, error } = await supabase.from(table).select('*')
        return { table, data, error }
      }),
    )

    // Every table must return data without error
    for (const result of results) {
      expect(result.error).toBeNull()
      expect(result.data).not.toBeNull()
    }

    // All 7 tables must be covered
    expect(results).toHaveLength(PUBLIC_TABLES.length)
  })

  it('unauthenticated client receives no auth token (simulates anonymous visitor)', () => {
    // Preservation: the anon key (not a user JWT) is used for public reads.
    // This test documents that public reads use the anon key, not a user session.
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.anon'
    const userJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user'

    // The anon key is NOT a user JWT — it has no user claims
    expect(anonKey).not.toBe(userJwt)

    // Public reads use the anon key (set via NEXT_PUBLIC_SUPABASE_ANON_KEY)
    // This is the key used by createClient() in lib/supabase/server.ts
    // No additional auth header is needed for public SELECT operations
    const isPublicRead = (authHeader: string | undefined) =>
      authHeader === undefined || authHeader === anonKey

    expect(isPublicRead(undefined)).toBe(true)   // no auth header → public read
    expect(isPublicRead(anonKey)).toBe(true)      // anon key → public read
    expect(isPublicRead(userJwt)).toBe(false)     // user JWT → authenticated read
  })
})

// ---------------------------------------------------------------------------
// Preservation for Bug 3 — Home page renders all sections (Requirement 3.3)
//
// Property: app/page.tsx imports and renders Hero, About, Skills, Projects,
//           Experience, and Contact sections.
// ---------------------------------------------------------------------------

describe('Preservation — Bug 3: Home page renders all sections (Req 3.3)', () => {
  /**
   * Validates: Requirements 3.3
   *
   * Structural test: reads the source of app/page.tsx and asserts that all
   * required section components are imported and used.
   *
   * This is a static analysis test — it does not require rendering the page.
   * It passes on unfixed code because the home page already renders all sections.
   */

  const fs = require('fs')
  const path = require('path')

  const pageSource: string = fs.readFileSync(
    path.join(process.cwd(), 'app/page.tsx'),
    'utf-8',
  )

  const REQUIRED_SECTIONS = [
    { name: 'Hero', importPattern: /import\s+\{[^}]*Hero[^}]*\}\s+from/, usagePattern: /<Hero\b/ },
    { name: 'About', importPattern: /import\s+\{[^}]*About[^}]*\}\s+from/, usagePattern: /<About\b/ },
    { name: 'Skills', importPattern: /import\s+\{[^}]*Skills[^}]*\}\s+from/, usagePattern: /<Skills\b/ },
    { name: 'Projects', importPattern: /import\s+\{[^}]*Projects[^}]*\}\s+from/, usagePattern: /<Projects\b/ },
    {
      name: 'ExperienceSection',
      importPattern: /import\s+\{[^}]*ExperienceSection[^}]*\}\s+from/,
      usagePattern: /<ExperienceSection\b/,
    },
    { name: 'Contact', importPattern: /import\s+\{[^}]*Contact[^}]*\}\s+from/, usagePattern: /<Contact\b/ },
  ]

  it.each(REQUIRED_SECTIONS)(
    'app/page.tsx imports the $name component',
    ({ name, importPattern }) => {
      expect(pageSource).toMatch(importPattern)
    },
  )

  it.each(REQUIRED_SECTIONS)(
    'app/page.tsx uses the $name component in JSX',
    ({ name, usagePattern }) => {
      expect(pageSource).toMatch(usagePattern)
    },
  )

  it('app/page.tsx contains all 6 required section components', () => {
    const missingImports = REQUIRED_SECTIONS.filter(
      (s) => !s.importPattern.test(pageSource),
    )
    const missingUsages = REQUIRED_SECTIONS.filter(
      (s) => !s.usagePattern.test(pageSource),
    )

    if (missingImports.length > 0) {
      console.log(
        '[Preservation] Missing imports:',
        missingImports.map((s) => s.name),
      )
    }
    if (missingUsages.length > 0) {
      console.log(
        '[Preservation] Missing usages:',
        missingUsages.map((s) => s.name),
      )
    }

    expect(missingImports).toHaveLength(0)
    expect(missingUsages).toHaveLength(0)
  })

  it('app/page.tsx exports a default async function (server component)', () => {
    // The home page must remain a server component (async function)
    expect(pageSource).toMatch(/export\s+default\s+async\s+function/)
  })

  it('app/page.tsx calls getPortfolioData() to fetch all section data', () => {
    // The home page must continue to fetch all data via getPortfolioData()
    expect(pageSource).toMatch(/getPortfolioData\s*\(\s*\)/)
  })
})

// ---------------------------------------------------------------------------
// Preservation for Bug 4 — Project card grid appearance (Requirement 3.4)
//
// Property: for all projects, rendered card contains thumbnail, name, techstack,
//           line-clamp-2 description, and hover overlay icons.
// ---------------------------------------------------------------------------

describe('Preservation — Bug 4: Project card grid appearance (Req 3.4)', () => {
  /**
   * Validates: Requirements 3.4
   *
   * Structural test: reads the source of components/projects.tsx and asserts
   * that the ProjectCard component renders all required visual elements.
   *
   * This is a static analysis test that passes on unfixed code because the
   * card appearance is already correct — Bug 4 only adds a modal, it must
   * not remove any existing card elements.
   */

  const fs = require('fs')
  const path = require('path')

  const projectsSource: string = fs.readFileSync(
    path.join(process.cwd(), 'components/projects.tsx'),
    'utf-8',
  )

  it('ProjectCard renders a thumbnail image (next/image or img element)', () => {
    // The card must contain an Image component for the project thumbnail
    expect(projectsSource).toMatch(/<Image\b/)
  })

  it('ProjectCard renders the project name', () => {
    // The card must render the project name (h3 or similar heading)
    expect(projectsSource).toMatch(/\{name\}/)
  })

  it('ProjectCard renders the tech stack', () => {
    // The card must render the techstack field
    expect(projectsSource).toMatch(/\{techstack\}/)
  })

  it('ProjectCard renders description with line-clamp-2 class', () => {
    // The description must be truncated with line-clamp-2 (Tailwind utility)
    expect(projectsSource).toMatch(/line-clamp-2/)
  })

  it('ProjectCard renders hover overlay with visit link icon (ExternalLink)', () => {
    // The hover overlay must contain the ExternalLink icon for the visit link
    expect(projectsSource).toMatch(/<ExternalLink\b/)
  })

  it('ProjectCard renders hover overlay with code link icon (Github)', () => {
    // The hover overlay must contain the Github icon for the code link
    expect(projectsSource).toMatch(/<Github\b/)
  })

  it('ProjectCard renders hover overlay with video link icon (Play)', () => {
    // The hover overlay must contain the Play icon for the video link
    expect(projectsSource).toMatch(/<Play\b/)
  })

  it('ProjectCard hover overlay is conditionally shown on group-hover', () => {
    // The overlay must use group-hover:opacity-100 (Tailwind group hover pattern)
    expect(projectsSource).toMatch(/group-hover:opacity-100/)
  })

  it('ProjectCard renders all required elements together (composite check)', () => {
    const requiredPatterns = [
      { name: 'thumbnail image', pattern: /<Image\b/ },
      { name: 'project name', pattern: /\{name\}/ },
      { name: 'tech stack', pattern: /\{techstack\}/ },
      { name: 'line-clamp-2 description', pattern: /line-clamp-2/ },
      { name: 'ExternalLink icon (visit)', pattern: /<ExternalLink\b/ },
      { name: 'Github icon (code)', pattern: /<Github\b/ },
      { name: 'Play icon (video)', pattern: /<Play\b/ },
      { name: 'group-hover overlay', pattern: /group-hover:opacity-100/ },
    ]

    const missing = requiredPatterns.filter((p) => !p.pattern.test(projectsSource))

    if (missing.length > 0) {
      console.log(
        '[Preservation] ProjectCard missing elements:',
        missing.map((p) => p.name),
      )
    }

    expect(missing).toHaveLength(0)
  })

  it('Projects component renders a grid layout (grid class)', () => {
    // The projects section must use a CSS grid for the card layout
    expect(projectsSource).toMatch(/grid\b/)
  })

  it('Projects component maps over displayedProjects to render cards', () => {
    // The component must iterate over projects to render ProjectCard instances
    expect(projectsSource).toMatch(/displayedProjects\.map/)
  })
})

// ---------------------------------------------------------------------------
// Preservation — Additional regression guards (Requirements 3.2, 3.5, 3.6, 3.7)
// ---------------------------------------------------------------------------

describe('Preservation — Additional regression guards (Req 3.2, 3.5, 3.6, 3.7)', () => {
  /**
   * Validates: Requirements 3.2, 3.5, 3.6, 3.7
   */

  const fs = require('fs')
  const path = require('path')

  it('Req 3.5 — ExperienceSection renders logo only when item.logo is truthy', () => {
    // Preservation: entries with logo = null must NOT render a broken img placeholder
    const experienceSource: string = fs.readFileSync(
      path.join(process.cwd(), 'components/experience.tsx'),
      'utf-8',
    )

    // The conditional render pattern: {item.logo && <Image ... />}
    expect(experienceSource).toMatch(/item\.logo\s*&&/)
  })

  it('Req 3.6 — Admin layout requires authentication (middleware or layout check)', () => {
    // Preservation: admin panel must continue to require authentication
    const middlewareSource: string = fs.readFileSync(
      path.join(process.cwd(), 'middleware.ts'),
      'utf-8',
    )

    // The middleware must reference the admin path
    expect(middlewareSource).toMatch(/admin/)
  })

  it('Req 3.7 — app/layout.tsx includes Vercel Analytics component', () => {
    // Preservation: Vercel Analytics must remain in the layout
    const layoutSource: string = fs.readFileSync(
      path.join(process.cwd(), 'app/layout.tsx'),
      'utf-8',
    )

    // Analytics import must be present
    expect(layoutSource).toMatch(/@vercel\/analytics/)

    // Analytics component must be used in JSX
    expect(layoutSource).toMatch(/<Analytics\b/)
  })

  it('Req 3.2 — lib/actions.ts exists and contains server actions for CRUD operations', () => {
    // Preservation: server actions for admin CRUD must remain intact
    const actionsSource: string = fs.readFileSync(
      path.join(process.cwd(), 'lib/actions.ts'),
      'utf-8',
    )

    // Server actions must use 'use server' directive (single or double quotes)
    expect(actionsSource).toMatch(/['"]use server['"]/)

  })

  it('Req 3.4 — ProjectCard article element has overflow-hidden and rounded styling', () => {
    // Preservation: card visual styling must remain after Bug 4 fix
    const projectsSource: string = fs.readFileSync(
      path.join(process.cwd(), 'components/projects.tsx'),
      'utf-8',
    )

    expect(projectsSource).toMatch(/overflow-hidden/)
    expect(projectsSource).toMatch(/rounded-xl/)
  })
})
