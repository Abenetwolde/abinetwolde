/**
 * @jest-environment jsdom
 *
 * Experience / Education Logo Rendering Tests — Bug 2
 *
 * Sub-task 4.2: Verify logo renders when item.logo is non-null
 * Sub-task 4.3: Verify no img element renders when item.logo is null
 *
 * Validates: Requirements 2.3, 2.4, 3.5
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// ---------------------------------------------------------------------------
// Mock next/image — renders as a plain <img> in test environment
// ---------------------------------------------------------------------------
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    ...props
  }: {
    src: string
    alt: string
    [key: string]: unknown
  }) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return React.createElement('img', { src, alt, ...props })
  },
}))

// ---------------------------------------------------------------------------
// Mock next-themes (used transitively via Section component)
// ---------------------------------------------------------------------------
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// ---------------------------------------------------------------------------
// Import the component under test
// ---------------------------------------------------------------------------
import { ExperienceSection } from '../components/experience'
import type { Experience, Education } from '../lib/types'

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const LOGO_URL = 'https://example.com/storage/v1/object/public/portfolio/logos/acme.png'

const experienceWithLogo: Experience = {
  id: '1',
  profile_id: 'p1',
  logo: LOGO_URL,
  company: 'Acme Corp',
  position: 'Software Engineer',
  duration: '2022 – Present',
  description: ['Built features', 'Wrote tests'],
  display_order: 1,
  created_at: '2022-01-01T00:00:00Z',
}

const experienceWithoutLogo: Experience = {
  id: '2',
  profile_id: 'p1',
  logo: null,
  company: 'No Logo Inc',
  position: 'Developer',
  duration: '2020 – 2022',
  description: ['Did stuff'],
  display_order: 2,
  created_at: '2020-01-01T00:00:00Z',
}

const educationWithLogo: Education = {
  id: '3',
  profile_id: 'p1',
  logo: LOGO_URL,
  institute: 'MIT',
  degree: 'BSc Computer Science',
  duration: '2016 – 2020',
  description: ['Studied algorithms'],
  display_order: 1,
  created_at: '2016-01-01T00:00:00Z',
}

const educationWithoutLogo: Education = {
  id: '4',
  profile_id: 'p1',
  logo: null,
  institute: 'Online University',
  degree: 'Certificate',
  duration: '2021',
  description: ['Completed course'],
  display_order: 2,
  created_at: '2021-01-01T00:00:00Z',
}

// ---------------------------------------------------------------------------
// Sub-task 4.2 — Logo renders when item.logo is non-null
//
// Property: FOR ALL X WHERE X.logo IS NOT NULL
//   renderTimelineCard(X) CONTAINS img_element WITH src = X.logo
//
// Validates: Requirements 2.3, 2.4
// ---------------------------------------------------------------------------

describe('Bug 2 — Logo renders when item.logo is non-null (Req 2.3, 2.4)', () => {
  /**
   * Validates: Requirements 2.3, 2.4
   *
   * Renders ExperienceSection with an experience entry that has a non-null logo URL.
   * Asserts the rendered output contains an <img> element whose src matches the logo URL.
   *
   * This confirms the fix: after Bug 1 is resolved (upload succeeds), the logo URL
   * stored in the database will be rendered correctly by the TimelineCard component.
   */

  it('renders an <img> element with the correct src when experience.logo is non-null', () => {
    render(
      <ExperienceSection
        experiences={[experienceWithLogo]}
        educations={[]}
      />,
    )

    // The logo image must be present in the DOM
    const logoImg = screen.getByRole('img', { name: experienceWithLogo.company })
    expect(logoImg).toBeInTheDocument()

    // The src must match the stored logo URL
    expect(logoImg).toHaveAttribute('src', LOGO_URL)
  })

  it('renders an <img> element with the correct src when education.logo is non-null', () => {
    const { getByRole, getByText } = render(
      <ExperienceSection
        experiences={[]}
        educations={[educationWithLogo]}
      />,
    )

    // Switch to education tab
    const educationTab = getByText('education')
    educationTab.click()

    // The logo image must be present in the DOM
    const logoImg = getByRole('img', { name: educationWithLogo.institute })
    expect(logoImg).toBeInTheDocument()

    // The src must match the stored logo URL
    expect(logoImg).toHaveAttribute('src', LOGO_URL)
  })

  it('logo img element has proper alt text (company/institute name)', () => {
    render(
      <ExperienceSection
        experiences={[experienceWithLogo]}
        educations={[]}
      />,
    )

    // Alt text must be the company name for accessibility
    const logoImg = screen.getByAltText(experienceWithLogo.company)
    expect(logoImg).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Sub-task 4.3 — No img element rendered when item.logo is null
//
// Property: FOR ALL X WHERE X.logo IS NULL OR X.logo = ""
//   renderTimelineCard(X) DOES NOT CONTAIN img_element
//
// Validates: Requirement 3.5
// ---------------------------------------------------------------------------

describe('Bug 2 — No broken placeholder when item.logo is null (Req 3.5)', () => {
  /**
   * Validates: Requirements 3.5
   *
   * Renders ExperienceSection with entries that have logo = null.
   * Asserts no <img> element is rendered — no broken image placeholder.
   *
   * This is the preservation property: entries without a logo must not
   * render a broken <img> tag.
   */

  it('does NOT render an <img> element when experience.logo is null', () => {
    render(
      <ExperienceSection
        experiences={[experienceWithoutLogo]}
        educations={[]}
      />,
    )

    // No img element should be present in the DOM
    const images = screen.queryAllByRole('img')
    expect(images).toHaveLength(0)
  })

  it('does NOT render an <img> element when education.logo is null', () => {
    const { queryAllByRole, getByText } = render(
      <ExperienceSection
        experiences={[]}
        educations={[educationWithoutLogo]}
      />,
    )

    // Switch to education tab
    const educationTab = getByText('education')
    educationTab.click()

    // No img element should be present in the DOM
    const images = queryAllByRole('img')
    expect(images).toHaveLength(0)
  })

  it('renders logo for entries with logo but not for entries without logo (mixed list)', () => {
    render(
      <ExperienceSection
        experiences={[experienceWithLogo, experienceWithoutLogo]}
        educations={[]}
      />,
    )

    // Only one img should be present (for the entry with a logo)
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(1)
    expect(images[0]).toHaveAttribute('src', LOGO_URL)
  })
})

// ---------------------------------------------------------------------------
// Sub-task 4.1 — Source-level verification (static analysis)
//
// Confirms the conditional render pattern is present in the source code.
// Validates: Requirements 2.3, 2.4, 3.5
// ---------------------------------------------------------------------------

describe('Bug 2 — Source-level verification of logo conditional render (Req 2.3, 2.4, 3.5)', () => {
  /**
   * Validates: Requirements 2.3, 2.4, 3.5
   *
   * Static analysis test: reads components/experience.tsx and asserts the
   * conditional logo render pattern is present.
   *
   * This complements the rendering tests above and documents that the fix
   * is implemented at the source level.
   */

  const fs = require('fs')
  const path = require('path')

  const experienceSource: string = fs.readFileSync(
    path.join(process.cwd(), 'components/experience.tsx'),
    'utf-8',
  )

  it('TimelineCard conditionally renders logo with {item.logo && <Image ... />} pattern', () => {
    // The conditional render must use item.logo as the guard
    expect(experienceSource).toMatch(/item\.logo\s*&&/)
  })

  it('TimelineCard uses Next.js Image component for logo rendering', () => {
    // Must use the optimized Next.js Image component, not a plain <img>
    expect(experienceSource).toMatch(/import Image from ['"]next\/image['"]/)
    expect(experienceSource).toMatch(/<Image/)
  })

  it('TimelineCard logo Image has alt text set to the company/institute name', () => {
    // Alt text must reference the subtitle (company or institute name)
    expect(experienceSource).toMatch(/alt=\{subtitle\}/)
  })

  it('TimelineCard logo Image has explicit dimensions or fill prop', () => {
    // Image must have either explicit width/height or fill prop for Next.js optimization
    expect(experienceSource).toMatch(/fill|width=\{|height=\{/)
  })
})
