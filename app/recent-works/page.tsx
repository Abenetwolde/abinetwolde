import { getRecentWorks, getPortfolioData } from '@/lib/data'
import { Header } from '@/components/header'
import { RecentWorks } from '@/components/recent-works'
import { Footer } from '@/components/footer'

export const revalidate = 0 // Always fresh — reorder should reflect immediately

export const metadata = {
  title: 'Recent Work',
}

export default async function RecentWorksPage() {
  const [works, data] = await Promise.all([
    getRecentWorks(),
    getPortfolioData(),
  ])

  const profile = data.profile || {
    id: '1', name: 'Abenet Wolde', short_desc: null, titles: [],
    hero_image: null, tech_stack_images: [], hero_headline: null,
    hero_subtitle: null, hero_stats: [], created_at: '', updated_at: '',
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        <RecentWorks works={works} />
      </main>
      <Footer name={profile.name} socials={data.socials} />
    </>
  )
}
