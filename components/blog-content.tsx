'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none
      prose-headings:font-bold prose-headings:text-foreground
      prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
      prose-p:text-muted-foreground prose-p:leading-relaxed
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-foreground
      prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none
      prose-pre:rounded-xl prose-pre:bg-muted prose-pre:p-4
      prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
      prose-ul:text-muted-foreground prose-ol:text-muted-foreground
      prose-li:marker:text-primary
      prose-img:rounded-xl prose-img:shadow-md
      prose-hr:border-border
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
