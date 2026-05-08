// Portfolio Data Types

export interface Profile {
  id: string
  name: string
  short_desc: string | null
  hero_headline: string | null
  hero_subtitle: string | null
  hero_stats: { label: string; value: string }[]
  availability: string | null
  availability_label: string | null
  titles: string[]
  hero_image: string | null
  tech_stack_images: string[]
  created_at: string
  updated_at: string
}

export interface RecentWork {
  id: string
  profile_id: string
  name: string
  role: string
  short_description: string | null
  key_achievement: string | null
  techstack: string | null
  category: string | null
  image: string | null
  images: string[]
  link_visit: string | null
  link_code: string | null
  link_video: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface About {
  id: string
  profile_id: string
  about_image: string | null
  about_image_caption: string | null
  title: string | null
  about: string | null
  resume_url: string | null
  call_url: string | null
  cv_url: string | null
  created_at: string
  updated_at: string
}

export interface Social {
  id: string
  profile_id: string
  icon: string
  link: string
  display_order: number
  created_at: string
}

export interface Skill {
  id: string
  profile_id: string
  name: string
  image: string | null
  category: 'frontend' | 'backend' | 'mobile' | 'tools'
  display_order: number
  created_at: string
}

export interface Project {
  id: string
  profile_id: string
  name: string
  techstack: string | null
  category: string | null
  description: string | null
  blog: string | null
  cover_image: string | null
  images: string[]
  features: string[]
  link_visit: string | null
  link_code: string | null
  link_video: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  profile_id: string
  logo: string | null
  company: string
  position: string
  duration: string | null
  description: string[]
  display_order: number
  created_at: string
}

export interface Education {
  id: string
  profile_id: string
  logo: string | null
  institute: string
  degree: string
  duration: string | null
  description: string[]
  display_order: number
  created_at: string
}

export interface PortfolioData {
  profile: Profile | null
  about: About | null
  socials: Social[]
  skills: Skill[]
  projects: Project[]
  recentWorks: RecentWork[]
  experiences: Experience[]
  educations: Education[]
  certifications: Certification[]
  blogs: Blog[]
}

export interface Certification {
  id: string
  profile_id: string
  title: string
  issuer: string
  issued_date: string | null
  address: string | null
  type: string | null
  image: string | null
  credential_url: string | null
  description: string[]
  display_order: number
  created_at: string
}

export interface Blog {
  id: string
  profile_id: string
  title: string
  slug: string | null
  summary: string | null
  content: string | null
  cover_image: string | null
  tags: string[]
  url: string | null
  published_at: string | null
  display_order: number
  created_at: string
  updated_at: string
}
