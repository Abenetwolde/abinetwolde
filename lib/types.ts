// Portfolio Data Types

export interface Profile {
  id: string
  name: string
  short_desc: string | null
  titles: string[]
  hero_image: string | null
  tech_stack_images: string[]
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
  images: string[]
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
  experiences: Experience[]
  educations: Education[]
}
