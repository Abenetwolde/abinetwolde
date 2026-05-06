-- =============================================================================
-- Storage RLS Policies for the "portfolio" bucket
-- =============================================================================
-- Run this in Supabase SQL Editor.
-- NOTE: Do NOT include the ALTER TABLE line — Supabase manages that internally.
--
-- If you get "policy already exists" errors, the DROP IF EXISTS lines handle it.
-- =============================================================================

-- Drop existing policies to avoid conflicts (safe to run multiple times)
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual insert access" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual update access" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual delete access" ON storage.objects;

-- Public read — anyone can view images
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'portfolio');

-- Authenticated upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'portfolio');

-- Authenticated update
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'portfolio')
WITH CHECK (bucket_id = 'portfolio');

-- Authenticated delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'portfolio');

-- Ensure the bucket is set to public (allows public URL access)
UPDATE storage.buckets SET public = true WHERE id = 'portfolio';
