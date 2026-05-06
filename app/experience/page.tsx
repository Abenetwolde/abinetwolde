import { getExperiences, getPortfolioData } from '@/lib/data'
import { Header } from '@/components/header'
import { ExperienceSection } from '@/components/experience'
import { Footer } from '@/components/footer'

export const revalidate = 3600

export const metadata = {
  title: 'Experience',
}

export default async function ExperiencePage() {
  const [experiences, data] = await Promise.all([
    getExperiences(),
    getPortfolioData(),
  ])

  const profile = data.profile || {
    id: '1',
    name: 'Abenet Wolde',
    short_desc: null,
    titles: [],
    hero_image: null,
    tech_stack_images: [],
    created_at: '',
    updated_at: '',
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        <ExperienceSection experiences={experiences} />
      </main>
      <Footer name={profile.name} socials={data.socials} />
    </>
  )
}
