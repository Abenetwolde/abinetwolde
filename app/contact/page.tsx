import { getPortfolioData } from '@/lib/data'
import { Header } from '@/components/header'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'

export const revalidate = 3600

export const metadata = {
  title: 'Contact',
}

export default async function ContactPage() {
  const data = await getPortfolioData()

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
        <Contact socials={data.socials} />
      </main>
      <Footer name={profile.name} socials={data.socials} />
    </>
  )
}
