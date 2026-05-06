import { getBlogs, getPortfolioData } from '@/lib/data'
import { Header } from '@/components/header'
import { BlogSection } from '@/components/blog'
import { Footer } from '@/components/footer'

export const revalidate = 3600

export const metadata = {
  title: 'Blog',
}

export default async function BlogPage() {
  const [blogs, data] = await Promise.all([
    getBlogs(),
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
        <BlogSection blogs={blogs} />
      </main>
      <Footer name={profile.name} socials={data.socials} />
    </>
  )
}
