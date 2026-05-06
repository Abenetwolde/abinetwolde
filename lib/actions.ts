"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath, revalidateTag } from "next/cache"

const PROFILE_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

// Helper — bust all portfolio caches after any mutation
function revalidatePortfolio() {
  revalidateTag('portfolio')
  revalidatePortfolio()
}

// Profile Actions
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const heroStatsRaw = formData.get('hero_stats') as string
  let heroStats = []
  try { heroStats = JSON.parse(heroStatsRaw || '[]') } catch { heroStats = [] }

  const { error } = await supabase
    .from("profile")
    .update({
      name: formData.get("name") as string,
      short_desc: formData.get("short_desc") as string,
      hero_headline: formData.get("hero_headline") as string || null,
      hero_subtitle: formData.get("hero_subtitle") as string || null,
      hero_stats: heroStats,
      titles: (formData.get("titles") as string).split(",").map(t => t.trim()).filter(Boolean),
      hero_image: formData.get("hero_image") as string,
      updated_at: new Date().toISOString(),
    })
    .eq("id", PROFILE_ID)

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function updateAbout(formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("about")
    .update({
      title: formData.get("title") as string,
      about: formData.get("about") as string,
      about_image: formData.get("about_image") as string,
      about_image_caption: formData.get("about_image_caption") as string,
      resume_url: formData.get("resume_url") as string,
      call_url: formData.get("call_url") as string,
      cv_url: formData.get("cv_url") as string || null,
      updated_at: new Date().toISOString(),
    })
    .eq("profile_id", PROFILE_ID)

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

// Projects Actions
export async function createProject(formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("projects")
    .insert({
      profile_id: PROFILE_ID,
      name: formData.get("name") as string,
      techstack: formData.get("techstack") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      features: JSON.parse(formData.get("features") as string || "[]"),
      images: JSON.parse(formData.get("images") as string || "[]"),
      link_visit: formData.get("link_visit") as string || null,
      link_code: formData.get("link_code") as string || null,
      link_video: formData.get("link_video") as string || null,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    })

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("projects")
    .update({
      name: formData.get("name") as string,
      techstack: formData.get("techstack") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      features: JSON.parse(formData.get("features") as string || "[]"),
      images: JSON.parse(formData.get("images") as string || "[]"),
      link_visit: formData.get("link_visit") as string || null,
      link_code: formData.get("link_code") as string || null,
      link_video: formData.get("link_video") as string || null,
      display_order: parseInt(formData.get("display_order") as string) || 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

// Skills Actions
export async function createSkill(formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("skills")
    .insert({
      profile_id: PROFILE_ID,
      name: formData.get("name") as string,
      image: formData.get("image") as string,
      category: formData.get("category") as string,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    })

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function updateSkill(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("skills")
    .update({
      name: formData.get("name") as string,
      image: formData.get("image") as string,
      category: formData.get("category") as string,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function deleteSkill(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

// Experience Actions
export async function createExperience(formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("experiences")
    .insert({
      profile_id: PROFILE_ID,
      company: formData.get("company") as string,
      position: formData.get("position") as string,
      duration: formData.get("duration") as string,
      logo: formData.get("logo") as string,
      description: (formData.get("description") as string).split("\n").filter(Boolean),
      display_order: parseInt(formData.get("display_order") as string) || 0,
    })

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("experiences")
    .update({
      company: formData.get("company") as string,
      position: formData.get("position") as string,
      duration: formData.get("duration") as string,
      logo: formData.get("logo") as string,
      description: (formData.get("description") as string).split("\n").filter(Boolean),
      display_order: parseInt(formData.get("display_order") as string) || 0,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

// Education Actions
export async function createEducation(formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("educations")
    .insert({
      profile_id: PROFILE_ID,
      institute: formData.get("institute") as string,
      degree: formData.get("degree") as string,
      duration: formData.get("duration") as string,
      logo: formData.get("logo") as string,
      description: (formData.get("description") as string).split("\n").filter(Boolean),
      display_order: parseInt(formData.get("display_order") as string) || 0,
    })

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function updateEducation(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("educations")
    .update({
      institute: formData.get("institute") as string,
      degree: formData.get("degree") as string,
      duration: formData.get("duration") as string,
      logo: formData.get("logo") as string,
      description: (formData.get("description") as string).split("\n").filter(Boolean),
      display_order: parseInt(formData.get("display_order") as string) || 0,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function deleteEducation(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("educations")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

// Social Links Actions
export async function createSocial(formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("socials")
    .insert({
      profile_id: PROFILE_ID,
      icon: formData.get("icon") as string,
      link: formData.get("link") as string,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    })

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function updateSocial(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("socials")
    .update({
      icon: formData.get("icon") as string,
      link: formData.get("link") as string,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function deleteSocial(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("socials")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

// Certification Actions
export async function createCertification(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('certifications').insert({
    profile_id: PROFILE_ID,
    title: formData.get('title') as string,
    issuer: formData.get('issuer') as string,
    issued_date: formData.get('issued_date') as string || null,
    address: formData.get('address') as string || null,
    type: formData.get('type') as string || 'online',
    image: formData.get('image') as string || null,
    credential_url: formData.get('credential_url') as string || null,
    description: (formData.get('description') as string).split('\n').filter(Boolean),
    display_order: parseInt(formData.get('display_order') as string) || 0,
  })
  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function updateCertification(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('certifications').update({
    title: formData.get('title') as string,
    issuer: formData.get('issuer') as string,
    issued_date: formData.get('issued_date') as string || null,
    address: formData.get('address') as string || null,
    type: formData.get('type') as string || 'online',
    image: formData.get('image') as string || null,
    credential_url: formData.get('credential_url') as string || null,
    description: (formData.get('description') as string).split('\n').filter(Boolean),
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function deleteCertification(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('certifications').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

// Blog Actions
export async function createBlog(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  // Auto-generate slug from title if not provided
  const slug = (formData.get('slug') as string)?.trim() ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const { error } = await supabase.from('blogs').insert({
    profile_id: PROFILE_ID,
    title,
    slug,
    summary: formData.get('summary') as string || null,
    content: formData.get('content') as string || null,
    cover_image: formData.get('cover_image') as string || null,
    tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
    url: formData.get('url') as string || null,
    published_at: formData.get('published_at') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
  })
  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function updateBlog(id: string, formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string)?.trim() ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const { error } = await supabase.from('blogs').update({
    title,
    slug,
    summary: formData.get('summary') as string || null,
    content: formData.get('content') as string || null,
    cover_image: formData.get('cover_image') as string || null,
    tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
    url: formData.get('url') as string || null,
    published_at: formData.get('published_at') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

export async function deleteBlog(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('blogs').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePortfolio()
}

// Recent Works Actions
export async function createRecentWork(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('recent_works').insert({
    profile_id: PROFILE_ID,
    name: formData.get('name') as string,
    role: formData.get('role') as string,
    short_description: formData.get('short_description') as string || null,
    key_achievement: formData.get('key_achievement') as string || null,
    techstack: formData.get('techstack') as string || null,
    category: formData.get('category') as string || null,
    image: formData.get('image') as string || null,
    images: JSON.parse(formData.get('images') as string || '[]'),
    link_visit: formData.get('link_visit') as string || null,
    link_code: formData.get('link_code') as string || null,
    link_video: formData.get('link_video') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
  })
  if (error) throw new Error(error.message)
  revalidatePortfolio()
  revalidatePortfolio()
}

export async function updateRecentWork(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('recent_works').update({
    name: formData.get('name') as string,
    role: formData.get('role') as string,
    short_description: formData.get('short_description') as string || null,
    key_achievement: formData.get('key_achievement') as string || null,
    techstack: formData.get('techstack') as string || null,
    category: formData.get('category') as string || null,
    image: formData.get('image') as string || null,
    images: JSON.parse(formData.get('images') as string || '[]'),
    link_visit: formData.get('link_visit') as string || null,
    link_code: formData.get('link_code') as string || null,
    link_video: formData.get('link_video') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePortfolio()
  revalidatePortfolio()
}

export async function deleteRecentWork(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('recent_works').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePortfolio()
  revalidatePortfolio()
}
