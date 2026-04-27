import { getPortfolioData } from '@/lib/data'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Skills } from '@/components/skills'
import { Projects } from '@/components/projects'
import { ExperienceSection } from '@/components/experience'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'

// Enable ISR with revalidation every hour for static portfolio data
export const revalidate = 3600

export default async function HomePage() {
  const data = await getPortfolioData()

  // Fallback data if database is empty
  const profile = data.profile || {
    id: '1',
    name: 'Abenet Wolde',
    short_desc: 'A Software Engineer with experience in full-stack development',
    titles: ['Software Engineer', 'Full Stack Developer', 'Mobile App Developer'],
    hero_image: '/me2.png',
    tech_stack_images: [],
    created_at: '',
    updated_at: '',
  }

  const about = data.about || {
    id: '1',
    profile_id: '1',
    about_image: '/me3.jpg',
    about_image_caption: '< I Build Stuff />',
    title: 'About Me',
    about: 'I am a passionate Software Engineer with expertise in building scalable web and mobile applications.',
    resume_url: null,
    call_url: null,
    created_at: '',
    updated_at: '',
  }

  return (
    <>
      <Header />
      <main>
        <Hero profile={profile} socials={data.socials} />
        <About about={about} profile={profile} />
        {data.skills.length > 0 && <Skills skills={data.skills} />}
        {data.projects.length > 0 && <Projects projects={data.projects} />}
        {(data.experiences.length > 0 || data.educations.length > 0) && (
          <ExperienceSection
            experiences={data.experiences}
            educations={data.educations}
          />
        )}
        <Contact socials={data.socials} />
      </main>
      <Footer name={profile.name} socials={data.socials} />
    </>
  )
}
