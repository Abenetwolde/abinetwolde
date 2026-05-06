import { Suspense } from 'react'
import { getPortfolioData } from '@/lib/data'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Skills } from '@/components/skills'
import { Projects } from '@/components/projects'
import { RecentWorks } from '@/components/recent-works'
import { ExperienceAndEducationSection } from '@/components/experience'
import { Certifications } from '@/components/certifications'
import { BlogSection } from '@/components/blog'
import { About } from '@/components/about'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'

// ISR — revalidate every hour
export const revalidate = 3600

// Fallback profile used when DB is empty
const FALLBACK_PROFILE = {
  id: '1',
  name: 'Abenet Wolde',
  short_desc: 'I design and build software that solves real problems — from mobile apps to scalable backend systems.',
  hero_headline: 'Software engineer building things that matter',
  hero_subtitle: 'from idea to production',
  hero_stats: [] as { label: string; value: string }[],
  titles: ['Software Engineer', 'Full Stack Developer', 'Mobile App Developer'],
  hero_image: '/me2.png',
  tech_stack_images: [] as string[],
  created_at: '',
  updated_at: '',
}

const FALLBACK_ABOUT = {
  id: '1',
  profile_id: '1',
  about_image: '/me3.jpg',
  about_image_caption: '< I Build Stuff />',
  title: 'About Me',
  about: 'I am a software engineer with a passion for building products that are fast, reliable, and enjoyable to use. I work across the full stack — from crafting intuitive interfaces to designing robust backend systems and cloud infrastructure.',
  resume_url: null,
  call_url: null,
  cv_url: null,
  created_at: '',
  updated_at: '',
}

// Simple skeleton for below-fold sections while streaming
function SectionSkeleton() {
  return (
    <div className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const data = await getPortfolioData()

  const profile = data.profile ?? FALLBACK_PROFILE
  const about = data.about ?? FALLBACK_ABOUT

  return (
    <>
      <Header />
      <main>
        {/* Hero renders immediately — above the fold, no suspense needed */}
        <Hero profile={profile} socials={data.socials} />

        {/* Below-fold sections — wrapped in Suspense for streaming */}
        <Suspense fallback={<SectionSkeleton />}>
          {data.recentWorks.length > 0 && <RecentWorks works={data.recentWorks} />}
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {data.projects.length > 0 && <Projects projects={data.projects} />}
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {data.skills.length > 0 && <Skills skills={data.skills} />}
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {(data.experiences.length > 0 || data.educations.length > 0) && (
            <ExperienceAndEducationSection
              experiences={data.experiences}
              educations={data.educations}
            />
          )}
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {data.certifications.length > 0 && <Certifications certifications={data.certifications} />}
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {data.blogs.length > 0 && <BlogSection blogs={data.blogs} />}
        </Suspense>

        <About about={about} profile={profile} />
        <Contact socials={data.socials} />
      </main>
      <Footer name={profile.name} socials={data.socials} />
    </>
  )
}
