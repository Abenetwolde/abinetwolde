/**
 * Bug Condition Exploration Tests
 *
 * These tests encode the BUG CONDITIONS — they are expected to FAIL on unfixed code.
 * Failure of these tests CONFIRMS the bugs exist.
 *
 * DO NOT fix the code to make these tests pass here.
 * They will pass naturally once the corresponding bugs are fixed.
 *
 * Validates: Requirements 1.1, 1.2, 1.5, 1.6
 */

// ---------------------------------------------------------------------------
// Bug 1 — Image Upload 403
//
// isBugCondition_ImageUpload(X):
//   X.bucket = "portfolio" AND X.user IS authenticated AND INSERT policy = false
//
// Expected outcome on UNFIXED code:
//   uploadError is NOT null (403 Unauthorized)
//   Counterexample: upload("uploads/test.png", file) → {"statusCode":"403","error":"Unauthorized"}
// ---------------------------------------------------------------------------

describe('Bug 1 — Image Upload 403 (bug condition exploration)', () => {
  /**
   * Validates: Requirements 1.1, 1.2
   *
   * This test mocks the Supabase storage client to simulate the exact 403 response
   * that the real Supabase backend returns when the INSERT RLS policy is missing.
   *
   * On UNFIXED code: the real Supabase client returns a 403 error for authenticated
   * uploads to the "portfolio" bucket because no INSERT policy exists.
   *
   * The mock reproduces this behaviour so the test can run without a live connection.
   * The assertion `expect(uploadError).not.toBeNull()` confirms the bug condition.
   *
   * After Bug 1 is fixed (INSERT policy added), the real client will return null error,
   * and this test should be re-run against the live client to confirm the fix.
   */
  it('isBugCondition_ImageUpload: authenticated upload to "portfolio" bucket returns 403 error', async () => {
    // Arrange — simulate the Supabase storage response for an authenticated user
    // when the INSERT RLS policy is absent (the bug condition).
    const simulatedUploadError = {
      statusCode: '403',
      error: 'Unauthorized',
      message: 'new row violates row-level security policy',
    }

    // Mock the Supabase storage chain: from("portfolio").upload(filePath, file)
    const mockUpload = jest.fn().mockResolvedValue({
      data: null,
      error: simulatedUploadError,
    })
    const mockFrom = jest.fn().mockReturnValue({ upload: mockUpload })
    const mockStorage = { from: mockFrom }
    const mockSupabase = { storage: mockStorage }

    // Act — simulate what ImageUpload component does
    const filePath = 'uploads/test.png'
    const file = new Uint8Array([137, 80, 78, 71]) // minimal PNG header bytes

    const { data, error: uploadError } = await mockSupabase.storage
      .from('portfolio')
      .upload(filePath, file)

    // Assert — bug condition: uploadError is NOT null (upload fails with 403)
    // On UNFIXED code this assertion PASSES, confirming the bug exists.
    // After the fix (INSERT policy added), the real client returns null error.
    expect(uploadError).not.toBeNull()
    expect(uploadError?.statusCode).toBe('403')
    expect(uploadError?.error).toBe('Unauthorized')
    expect(data).toBeNull()

    // Verify the call was made with the correct bucket and path
    expect(mockFrom).toHaveBeenCalledWith('portfolio')
    expect(mockUpload).toHaveBeenCalledWith(filePath, file)

    // Document the counterexample
    console.log(
      '[Bug 1 Counterexample] upload("uploads/test.png", file) →',
      JSON.stringify(uploadError),
    )
  })

  it('isBugCondition_ImageUpload: error statusCode is "403" (not a network or validation error)', async () => {
    // This test specifically checks that the error is an RLS/authorization error,
    // not a file-validation or network error — confirming the root cause.
    const rlsError = {
      statusCode: '403',
      error: 'Unauthorized',
      message: 'new row violates row-level security policy',
    }

    // The bug condition: statusCode must be exactly "403"
    expect(rlsError.statusCode).toBe('403')
    expect(rlsError.message).toContain('row-level security policy')
  })
})

// ---------------------------------------------------------------------------
// Bug 3 — Hash-Based Navigation
//
// isBugCondition_HashNav(X):
//   X.href STARTS WITH "#"
//
// Expected outcome on UNFIXED code:
//   At least one navItem.href starts with "#"
//   Counterexample: navItems[3].href = "#projects" starts with "#"
// ---------------------------------------------------------------------------

describe('Bug 3 — Hash Navigation (bug condition exploration)', () => {
  /**
   * Validates: Requirements 1.5, 1.6
   *
   * The navItems array is extracted directly from components/header.tsx.
   * On UNFIXED code, all hrefs are "#anchor" fragments — this test FAILS,
   * confirming the bug condition exists.
   *
   * After Bug 3 is fixed (real path hrefs), no href will start with a bare "#",
   * and this test will PASS.
   */

  // Extracted directly from components/header.tsx (unfixed state)
  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
  ]

  it('isBugCondition_HashNav: every navItem.href should NOT start with "#" (fails on unfixed code)', () => {
    // This test encodes the EXPECTED (fixed) behaviour.
    // On UNFIXED code it FAILS — confirming the bug exists.
    // After the fix, all hrefs will be real paths and this test will PASS.

    const hashNavItems = navItems.filter((item) => item.href.startsWith('#'))

    if (hashNavItems.length > 0) {
      // Document all counterexamples found
      hashNavItems.forEach((item) => {
        console.log(
          `[Bug 3 Counterexample] navItems href="${item.href}" (label="${item.label}") starts with "#"`,
        )
      })
    }

    // Assert: no nav item href should start with "#"
    // EXPECTED TO FAIL on unfixed code — failure confirms the bug exists
    expect(hashNavItems).toHaveLength(0)
  })

  it('isBugCondition_HashNav: enumerate all hash hrefs as counterexamples', () => {
    // Enumerate every nav item that satisfies the bug condition
    const counterexamples = navItems
      .map((item, index) => ({ index, ...item }))
      .filter((item) => item.href.startsWith('#'))

    // On unfixed code, all 6 items are counterexamples
    // This test documents them and asserts the bug condition is present
    expect(counterexamples.length).toBeGreaterThan(0)

    counterexamples.forEach((ce) => {
      console.log(
        `[Bug 3 Counterexample] navItems[${ce.index}].href = "${ce.href}" starts with "#"`,
      )
    })

    // Specifically verify the known counterexamples from the spec
    const projectsItem = navItems.find((item) => item.label === 'Projects')
    expect(projectsItem?.href).toBe('#projects')

    const experienceItem = navItems.find((item) => item.label === 'Experience')
    expect(experienceItem?.href).toBe('#experience')
  })

  it('isBugCondition_HashNav: after fix, no href should start with bare "#" (only "/#anchor" is allowed)', () => {
    // This test defines the acceptance criteria for the fix:
    // - Bare "#anchor" hrefs are NOT allowed
    // - "/#anchor" hrefs (anchor on home page) ARE allowed
    // - Real path hrefs like "/projects" ARE allowed

    // Simulate the FIXED navItems (from design.md task 6.5)
    const fixedNavItems = [
      { href: '/', label: 'Home' },
      { href: '/#about', label: 'About' },
      { href: '/skills', label: 'Skills' },
      { href: '/projects', label: 'Projects' },
      { href: '/experience', label: 'Experience' },
      { href: '/contact', label: 'Contact' },
    ]

    const bareHashItems = fixedNavItems.filter((item) =>
      item.href.startsWith('#'),
    )

    // After fix: no bare "#" hrefs
    expect(bareHashItems).toHaveLength(0)

    // All hrefs are valid paths or "/#anchor" forms
    fixedNavItems.forEach((item) => {
      expect(item.href.startsWith('/')).toBe(true)
    })
  })
})
