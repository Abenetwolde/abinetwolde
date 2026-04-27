"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const PROFILE_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

// Profile Actions
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("profile")
    .update({
      name: formData.get("name") as string,
      short_desc: formData.get("short_desc") as string,
      titles: (formData.get("titles") as string).split(",").map(t => t.trim()).filter(Boolean),
      hero_image: formData.get("hero_image") as string,
      updated_at: new Date().toISOString(),
    })
    .eq("id", PROFILE_ID)

  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin/profile")
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
      updated_at: new Date().toISOString(),
    })
    .eq("profile_id", PROFILE_ID)

  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin/profile")
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
      images: JSON.parse(formData.get("images") as string || "[]"),
      link_visit: formData.get("link_visit") as string || null,
      link_code: formData.get("link_code") as string || null,
      link_video: formData.get("link_video") as string || null,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    })

  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin/projects")
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
      images: JSON.parse(formData.get("images") as string || "[]"),
      link_visit: formData.get("link_visit") as string || null,
      link_code: formData.get("link_code") as string || null,
      link_video: formData.get("link_video") as string || null,
      display_order: parseInt(formData.get("display_order") as string) || 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin/projects")
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin/projects")
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
  revalidatePath("/")
  revalidatePath("/admin/skills")
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
  revalidatePath("/")
  revalidatePath("/admin/skills")
}

export async function deleteSkill(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin/skills")
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
  revalidatePath("/")
  revalidatePath("/admin/experience")
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
  revalidatePath("/")
  revalidatePath("/admin/experience")
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin/experience")
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
  revalidatePath("/")
  revalidatePath("/admin/education")
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
  revalidatePath("/")
  revalidatePath("/admin/education")
}

export async function deleteEducation(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("educations")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin/education")
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
  revalidatePath("/")
  revalidatePath("/admin/socials")
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
  revalidatePath("/")
  revalidatePath("/admin/socials")
}

export async function deleteSocial(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("socials")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin/socials")
}
