import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import type {
  Profile, About, Social, Skill, Project, RecentWork,
  Experience, Education, Certification, Blog, PortfolioData,
} from './types'

export const revalidate = 3600

// ---------------------------------------------------------------------------
// Cached portfolio data — single parallel fetch, cached for 1 hour
// Uses the public (cookie-free) Supabase client so it's safe inside unstable_cache
// ---------------------------------------------------------------------------

export const getPortfolioData = unstable_cache(
  async (): Promise<PortfolioData> => {
    const supabase = createPublicClient()

    const [
      { data: profile },
      { data: about },
      { data: socials },
      { data: skills },
      { data: projects },
      { data: recentWorks },
      { data: experiences },
      { data: educations },
      { data: certifications },
      { data: blogs },
    ] = await Promise.all([
      supabase.from('profile').select('*').single(),
      supabase.from('about').select('*').single(),
      supabase.from('socials').select('*').order('display_order'),
      supabase.from('skills').select('*').order('display_order'),
      supabase.from('projects').select('*').order('display_order'),
      supabase.from('recent_works').select('*').order('display_order'),
      supabase.from('experiences').select('*').order('display_order'),
      supabase.from('educations').select('*').order('display_order'),
      supabase.from('certifications').select('*').order('display_order'),
      supabase.from('blogs').select('*').order('display_order'),
    ])

    return {
      profile: profile as Profile | null,
      about: about as About | null,
      socials: (socials || []) as Social[],
      skills: (skills || []) as Skill[],
      projects: (projects || []) as Project[],
      recentWorks: (recentWorks || []) as RecentWork[],
      experiences: (experiences || []) as Experience[],
      educations: (educations || []) as Education[],
      certifications: (certifications || []) as Certification[],
      blogs: (blogs || []) as Blog[],
    }
  },
  ['portfolio-data'],
  { revalidate: 3600, tags: ['portfolio'] }
)

export const getProfile = unstable_cache(
  async (): Promise<Profile | null> => {
    const supabase = createPublicClient()
    const { data } = await supabase.from('profile').select('*').single()
    return data as Profile | null
  },
  ['profile'],
  { revalidate: 3600, tags: ['portfolio'] }
)

export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase.from('projects').select('*').order('display_order')
    return (data || []) as Project[]
  },
  ['projects'],
  { revalidate: 3600, tags: ['portfolio'] }
)

export const getRecentWorks = unstable_cache(
  async (): Promise<RecentWork[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase.from('recent_works').select('*').order('display_order')
    return (data || []) as RecentWork[]
  },
  ['recent-works'],
  { revalidate: 3600, tags: ['portfolio'] }
)

export const getSkills = unstable_cache(
  async (): Promise<Skill[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase.from('skills').select('*').order('display_order')
    return (data || []) as Skill[]
  },
  ['skills'],
  { revalidate: 3600, tags: ['portfolio'] }
)

export const getExperiences = unstable_cache(
  async (): Promise<Experience[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase.from('experiences').select('*').order('display_order')
    return (data || []) as Experience[]
  },
  ['experiences'],
  { revalidate: 3600, tags: ['portfolio'] }
)

export const getEducations = unstable_cache(
  async (): Promise<Education[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase.from('educations').select('*').order('display_order')
    return (data || []) as Education[]
  },
  ['educations'],
  { revalidate: 3600, tags: ['portfolio'] }
)

export const getCertifications = unstable_cache(
  async (): Promise<Certification[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase.from('certifications').select('*').order('display_order')
    return (data || []) as Certification[]
  },
  ['certifications'],
  { revalidate: 3600, tags: ['portfolio'] }
)

export const getBlogs = unstable_cache(
  async (): Promise<Blog[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase.from('blogs').select('*').order('display_order')
    return (data || []) as Blog[]
  },
  ['blogs'],
  { revalidate: 3600, tags: ['portfolio'] }
)
