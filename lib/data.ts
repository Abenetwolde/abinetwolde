import { createClient } from '@/lib/supabase/server'
import type { Profile, About, Social, Skill, Project, Experience, Education, PortfolioData } from './types'

// Cache configuration for static portfolio data
export const revalidate = 3600 // Revalidate every hour

export async function getPortfolioData(): Promise<PortfolioData> {
  const supabase = await createClient()

  // Fetch all data in parallel for better performance
  const [
    { data: profile },
    { data: about },
    { data: socials },
    { data: skills },
    { data: projects },
    { data: experiences },
    { data: educations },
  ] = await Promise.all([
    supabase.from('profile').select('*').single(),
    supabase.from('about').select('*').single(),
    supabase.from('socials').select('*').order('display_order'),
    supabase.from('skills').select('*').order('display_order'),
    supabase.from('projects').select('*').order('display_order'),
    supabase.from('experiences').select('*').order('display_order'),
    supabase.from('educations').select('*').order('display_order'),
  ])

  return {
    profile: profile as Profile | null,
    about: about as About | null,
    socials: (socials || []) as Social[],
    skills: (skills || []) as Skill[],
    projects: (projects || []) as Project[],
    experiences: (experiences || []) as Experience[],
    educations: (educations || []) as Education[],
  }
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('profile').select('*').single()
  return data as Profile | null
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('*').order('display_order')
  return (data || []) as Project[]
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('skills').select('*').order('display_order')
  return (data || []) as Skill[]
}

export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('experiences').select('*').order('display_order')
  return (data || []) as Experience[]
}

export async function getEducations(): Promise<Education[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('educations').select('*').order('display_order')
  return (data || []) as Education[]
}
