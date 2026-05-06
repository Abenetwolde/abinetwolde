import { getEducations, getPortfolioData } from '@/lib/data'
import { Header } from '@/components/header'
import { EducationSection } from '@/components/experience'
import { Footer } from '@/components/footer'

export const revalidate = 3600

export const metadata = {
  title: 'Education',
}

export default async function EducationPage() {
  const [educations, data] = await Promise.all([
    getEducations(),
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
        <EducationSection educations={educations} />
      </main>
      <Footer name={profile.name} socials={data.socials} />
    </>
  )
}
