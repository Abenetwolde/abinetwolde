import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Tag, ArrowRight, ExternalLink } from 'lucide-react'
import { Section } from './ui/section'
import type { Blog } from '@/lib/types'

interface BlogProps {
  blogs: Blog[]
}

export function BlogSection({ blogs }: BlogProps) {
  if (blogs.length === 0) return null

  return (
    <Section id="blog" className="bg-muted/30 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          Blog
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post) => {
            const href = `/blog/${post.slug || post.id}`
            return (
              <Link
                key={post.id}
                href={href}
                className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {/* Cover image */}
                {post.cover_image && (
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  {/* Summary */}
                  {post.summary && (
                    <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
                      {post.summary}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between">
                    {post.published_at && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.published_at}
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      {post.url && (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Source
                        </a>
                      )}
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                        Read More <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
