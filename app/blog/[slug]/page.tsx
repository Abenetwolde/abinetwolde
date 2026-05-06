import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { BlogContent } from '@/components/blog-content'
import { getPortfolioData } from '@/lib/data'
import type { Blog } from '@/lib/types'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

// Try to find a blog post by slug first, then fall back to id
async function getBlogPost(slug: string): Promise<Blog | null> {
  const supabase = await createClient()

  // Try by slug first
  const { data: bySlug } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (bySlug) return bySlug as Blog

  // Fall back to id (for posts that have no slug yet)
  const { data: byId } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', slug)
    .maybeSingle()

  return byId as Blog | null
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'Blog Post' }
  return {
    title: post.title,
    description: post.summary,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) notFound()

  const blog = post

  const data = await getPortfolioData()
  const profile = data.profile || { name: 'Abenet Wolde' }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Cover image */}
        {blog.cover_image && (
          <div className="relative h-64 w-full overflow-hidden bg-muted md:h-96">
            <Image
              src={blog.cover_image}
              alt={blog.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}

        <article className="mx-auto max-w-3xl px-4 py-12">
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
            {blog.title}
          </h1>

          {/* Meta row */}
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-8">
            {blog.published_at && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {blog.published_at}
              </span>
            )}
            {blog.url && (
              <Link
                href={blog.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Originally published
              </Link>
            )}
          </div>

          {/* Summary */}
          {blog.summary && (
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              {blog.summary}
            </p>
          )}

          {/* Full content */}
          {blog.content ? (
            <BlogContent content={blog.content} />
          ) : (
            <p className="text-muted-foreground italic">No content yet.</p>
          )}
        </article>
      </main>
      <Footer name={profile.name} socials={data.socials} />
    </>
  )
}
