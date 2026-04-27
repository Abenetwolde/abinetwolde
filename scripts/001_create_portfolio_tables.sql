-- Portfolio Database Schema
-- Creates all tables needed for the portfolio website

-- Main/Profile table
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_desc TEXT,
  titles TEXT[] DEFAULT '{}',
  hero_image TEXT,
  tech_stack_images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About section
CREATE TABLE IF NOT EXISTS public.about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profile(id) ON DELETE CASCADE,
  about_image TEXT,
  about_image_caption TEXT,
  title TEXT,
  about TEXT,
  resume_url TEXT,
  call_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social links
CREATE TABLE IF NOT EXISTS public.socials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profile(id) ON DELETE CASCADE,
  icon TEXT NOT NULL,
  link TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profile(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profile(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  techstack TEXT,
  category TEXT,
  description TEXT,
  blog TEXT,
  images TEXT[] DEFAULT '{}',
  link_visit TEXT,
  link_code TEXT,
  link_video TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profile(id) ON DELETE CASCADE,
  logo TEXT,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  duration TEXT,
  description TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education
CREATE TABLE IF NOT EXISTS public.educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profile(id) ON DELETE CASCADE,
  logo TEXT,
  institute TEXT NOT NULL,
  degree TEXT NOT NULL,
  duration TEXT,
  description TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_skills_profile ON public.skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_profile ON public.projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_experiences_profile ON public.experiences(profile_id);
CREATE INDEX IF NOT EXISTS idx_educations_profile ON public.educations(profile_id);

-- Enable Row Level Security (allow public read access for portfolio)
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;

-- Public read policies (portfolio is public)
CREATE POLICY "Allow public read on profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Allow public read on about" ON public.about FOR SELECT USING (true);
CREATE POLICY "Allow public read on socials" ON public.socials FOR SELECT USING (true);
CREATE POLICY "Allow public read on skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read on educations" ON public.educations FOR SELECT USING (true);
