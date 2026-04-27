import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BUCKET_NAME = 'portfolio'

// Recursively find all image files
function findImages(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next') {
        findImages(filePath, fileList)
      }
    } else {
      const ext = path.extname(file).toLowerCase()
      if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
        fileList.push(filePath)
      }
    }
  }
  
  return fileList
}

// Get MIME type from extension
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

async function uploadFile(filePath) {
  // Create storage path - preserve directory structure
  let storagePath = filePath
    .replace('./assets/', '')
    .replace('./public/', '')
    .replace(/\\/g, '/')
    .replace(/ /g, '-') // Replace spaces with hyphens
  
  const fileBuffer = fs.readFileSync(filePath)
  const mimeType = getMimeType(filePath)
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: true
    })
  
  if (error) {
    console.error(`Failed to upload ${filePath}:`, error.message)
    return null
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath)
  
  console.log(`Uploaded: ${filePath} -> ${publicUrl}`)
  return { originalPath: filePath, storagePath, publicUrl }
}

async function main() {
  console.log('Finding images in assets/ and public/ directories...')
  
  const assetsImages = fs.existsSync('./assets') ? findImages('./assets') : []
  const publicImages = fs.existsSync('./public') ? findImages('./public') : []
  
  const allImages = [...assetsImages, ...publicImages]
  
  console.log(`Found ${allImages.length} images to upload`)
  
  const results = []
  
  for (const imagePath of allImages) {
    const result = await uploadFile(imagePath)
    if (result) {
      results.push(result)
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log(`\nSuccessfully uploaded ${results.length} images`)
  
  // Save mapping for reference
  fs.writeFileSync('./scripts/media-mapping.json', JSON.stringify(results, null, 2))
  console.log('Saved media mapping to scripts/media-mapping.json')
}

main().catch(console.error)
