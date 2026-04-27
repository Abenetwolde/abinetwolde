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
const PROFILE_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

// Read data.json
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'))

async function uploadLocalImage(localPath) {
  const fullPath = path.join(process.cwd(), localPath)
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`)
    return null
  }

  const fileBuffer = fs.readFileSync(fullPath)
  const fileName = localPath.replace(/^\.?\//, '').replace(/\s+/g, '_')
  const contentType = localPath.endsWith('.png') ? 'image/png' : 
                      localPath.endsWith('.jpg') || localPath.endsWith('.jpeg') ? 'image/jpeg' : 
                      'image/png'

  const { data, error } = await supabase.storage
    .from('portfolio')
    .upload(fileName, fileBuffer, {
      contentType,
      upsert: true
    })

  if (error) {
    console.error(`Error uploading ${localPath}:`, error.message)
    return null
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/portfolio/${fileName}`
  console.log(`Uploaded: ${localPath} -> ${publicUrl}`)
  return publicUrl
}

async function uploadAssetsAndGetUrls() {
  console.log('\n--- Uploading local assets to Supabase Storage ---\n')
  
  const assetMapping = {}
  const assetsDir = './assets'
  
  async function processDir(dir) {
    const items = fs.readdirSync(dir)
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        await processDir(fullPath)
      } else if (/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(item)) {
        const relativePath = fullPath.replace(/^\.\//, '')
        const url = await uploadLocalImage(fullPath)
        if (url) {
          assetMapping[relativePath] = url
        }
      }
    }
  }
  
  if (fs.existsSync(assetsDir)) {
    await processDir(assetsDir)
  }
  
  return assetMapping
}

async function clearExistingData() {
  console.log('\n--- Clearing existing data ---\n')
  
  await supabase.from('educations').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('experiences').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('socials').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('about').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('profile').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  
  console.log('Cleared all existing data')
}

async function seedProfile() {
  console.log('\n--- Seeding profile ---\n')
  
  const { error } = await supabase.from('profile').upsert({
    id: PROFILE_ID,
    name: data.main.name,
    short_desc: data.main.shortDesc,
    titles: data.main.titles,
    hero_image: data.main.heroImage,
    tech_stack_images: data.main.techStackImages
  })
  
  if (error) console.error('Profile error:', error.message)
  else console.log('Profile seeded successfully')
}

async function seedAbout() {
  console.log('\n--- Seeding about ---\n')
  
  const { error } = await supabase.from('about').insert({
    profile_id: PROFILE_ID,
    about_image: data.about.aboutImage,
    about_image_caption: data.about.aboutImageCaption,
    title: data.about.title,
    about: data.about.about,
    resume_url: data.about.resumeUrl || '',
    call_url: data.about.callUrl || ''
  })
  
  if (error) console.error('About error:', error.message)
  else console.log('About seeded successfully')
}

async function seedSocials() {
  console.log('\n--- Seeding socials ---\n')
  
  const iconMapping = {
    'FaLinkedin': 'linkedin',
    'FaGithub': 'github',
    'FaInstagram': 'instagram',
    'FaTwitter': 'twitter',
    'FaTelegram': 'telegram',
    'FaEnvelope': 'email'
  }
  
  for (let i = 0; i < data.socials.length; i++) {
    const social = data.socials[i]
    const { error } = await supabase.from('socials').insert({
      profile_id: PROFILE_ID,
      icon: iconMapping[social.icon] || social.icon.toLowerCase().replace('fa', ''),
      link: social.link,
      display_order: i + 1
    })
    
    if (error) console.error(`Social ${social.icon} error:`, error.message)
    else console.log(`Social ${social.icon} seeded`)
  }
}

async function seedSkills() {
  console.log('\n--- Seeding skills ---\n')
  
  const categoryMapping = {
    'Frontend': 'frontend',
    'Backend': 'backend',
    'Tools': 'tools'
  }
  
  for (let i = 0; i < data.skills.length; i++) {
    const skill = data.skills[i]
    const { error } = await supabase.from('skills').insert({
      profile_id: PROFILE_ID,
      name: skill.name,
      image: skill.image,
      category: categoryMapping[skill.category] || skill.category.toLowerCase(),
      display_order: i + 1
    })
    
    if (error) console.error(`Skill ${skill.name} error:`, error.message)
    else console.log(`Skill ${skill.name} seeded`)
  }
}

async function seedProjects(assetMapping) {
  console.log('\n--- Seeding projects ---\n')
  
  // Define real projects from projectsData.js patterns
  const realProjects = [
    {
      name: 'Ethiopian Ecommerce Telegram Bot',
      techstack: 'Node.js, Telegraf, MongoDB, Express',
      category: 'bot',
      description: 'A comprehensive e-commerce Telegram bot for Ethiopian businesses with product browsing, cart management, order tracking, and admin dashboard.',
      images: Object.keys(assetMapping).filter(k => k.includes('ecommercebot')).map(k => assetMapping[k]),
      link_visit: 'https://t.me/your_bot',
      link_code: 'https://github.com/Abenetwolde'
    },
    {
      name: 'TG Mini App',
      techstack: 'React, TypeScript, Telegram Mini App API',
      category: 'bot',
      description: 'A Telegram Mini App with modern UI and seamless integration with Telegram features.',
      images: Object.keys(assetMapping).filter(k => k.includes('tgminiapp')).map(k => assetMapping[k]),
      link_code: 'https://github.com/Abenetwolde'
    },
    {
      name: 'Sales Management System',
      techstack: 'React, Node.js, MongoDB, Express',
      category: 'web',
      description: 'A comprehensive sales management dashboard with analytics, reporting, and inventory tracking.',
      images: Object.keys(assetMapping).filter(k => k.includes('sales')).map(k => assetMapping[k]),
      link_code: 'https://github.com/Abenetwolde'
    },
    {
      name: 'E-commerce Platform',
      techstack: 'React, Node.js, MongoDB, Stripe',
      category: 'web',
      description: 'Full-featured e-commerce platform with payment integration, user authentication, and admin dashboard.',
      images: Object.keys(assetMapping).filter(k => k.includes('ecommerce') && !k.includes('bot')).map(k => assetMapping[k]),
      link_code: 'https://github.com/Abenetwolde'
    },
    {
      name: 'Quiz Application',
      techstack: 'React, Firebase, Material UI',
      category: 'web',
      description: 'Interactive quiz application with real-time scoring, leaderboards, and multiple categories.',
      images: Object.keys(assetMapping).filter(k => k.includes('quiz')).map(k => assetMapping[k]),
      link_code: 'https://github.com/Abenetwolde'
    },
    {
      name: 'Tax Calculator',
      techstack: 'React, TypeScript, Tailwind CSS',
      category: 'web',
      description: 'Ethiopian tax calculator with income tax, VAT, and withholding tax calculations.',
      images: Object.keys(assetMapping).filter(k => k.includes('tax')).map(k => assetMapping[k]),
      link_code: 'https://github.com/Abenetwolde'
    },
    {
      name: 'Calculator App',
      techstack: 'React Native, Expo',
      category: 'mobile',
      description: 'A beautiful calculator app with scientific functions and history tracking.',
      images: Object.keys(assetMapping).filter(k => k.includes('calculator')).map(k => assetMapping[k]),
      link_code: 'https://github.com/Abenetwolde'
    },
    {
      name: 'Cloud Storage App',
      techstack: 'React, Node.js, AWS S3',
      category: 'web',
      description: 'Cloud storage application with file upload, sharing, and organization features.',
      images: Object.keys(assetMapping).filter(k => k.includes('cloud')).map(k => assetMapping[k]),
      link_code: 'https://github.com/Abenetwolde'
    },
    {
      name: 'Place To Be',
      techstack: 'React, Node.js, MongoDB, Google Maps API',
      category: 'web',
      description: 'Location-based social platform for discovering and sharing places in Ethiopia.',
      images: Object.keys(assetMapping).filter(k => k.includes('placetobe')).map(k => assetMapping[k]),
      link_code: 'https://github.com/Abenetwolde'
    },
    {
      name: 'NPM Package Dashboard',
      techstack: 'React, NPM API, Chart.js',
      category: 'web',
      description: 'Dashboard for tracking and analyzing NPM package statistics and downloads.',
      images: Object.keys(assetMapping).filter(k => k.includes('npm')).map(k => assetMapping[k]),
      link_code: 'https://github.com/Abenetwolde'
    },
    {
      name: 'Telegram Bot Framework',
      techstack: 'Node.js, Telegraf, MongoDB',
      category: 'bot',
      description: 'A reusable Telegram bot framework with modular architecture and plugin system.',
      images: Object.keys(assetMapping).filter(k => k.includes('telegram')).map(k => assetMapping[k]),
      link_code: 'https://github.com/Abenetwolde'
    },
    {
      name: 'Check Verification System',
      techstack: 'React, Node.js, OCR API',
      category: 'web',
      description: 'Check verification and validation system with OCR-based data extraction.',
      images: Object.keys(assetMapping).filter(k => k.includes('check')).map(k => assetMapping[k]),
      link_code: 'https://github.com/Abenetwolde'
    }
  ]
  
  for (let i = 0; i < realProjects.length; i++) {
    const project = realProjects[i]
    if (project.images.length === 0) continue
    
    const { error } = await supabase.from('projects').insert({
      profile_id: PROFILE_ID,
      name: project.name,
      techstack: project.techstack,
      category: project.category,
      description: project.description,
      images: project.images,
      link_visit: project.link_visit || null,
      link_code: project.link_code || null,
      link_video: project.link_video || null,
      display_order: i + 1
    })
    
    if (error) console.error(`Project ${project.name} error:`, error.message)
    else console.log(`Project ${project.name} seeded with ${project.images.length} images`)
  }
}

async function seedExperiences() {
  console.log('\n--- Seeding experiences ---\n')
  
  const realExperiences = [
    {
      company: 'Information Network Security Agency (INSA)',
      position: 'Full Stack Developer',
      duration: '2022 - Present',
      description: [
        'Developed and maintained web applications using React, Node.js, and MongoDB',
        'Built Telegram bots for various business automation needs',
        'Collaborated with cross-functional teams to deliver high-quality solutions',
        'Implemented security best practices in all development projects'
      ],
      logo: null
    },
    {
      company: 'Freelance',
      position: 'Software Developer',
      duration: '2020 - 2022',
      description: [
        'Created custom web and mobile applications for clients',
        'Designed and implemented database architectures',
        'Developed Telegram bots for Ethiopian businesses',
        'Provided technical consultation and support'
      ],
      logo: null
    }
  ]
  
  for (let i = 0; i < realExperiences.length; i++) {
    const exp = realExperiences[i]
    const { error } = await supabase.from('experiences').insert({
      profile_id: PROFILE_ID,
      logo: exp.logo,
      company: exp.company,
      position: exp.position,
      duration: exp.duration,
      description: exp.description,
      display_order: i + 1
    })
    
    if (error) console.error(`Experience ${exp.company} error:`, error.message)
    else console.log(`Experience ${exp.company} seeded`)
  }
}

async function seedEducations() {
  console.log('\n--- Seeding educations ---\n')
  
  const realEducations = [
    {
      institute: 'Addis Ababa University',
      degree: 'Bachelor of Science in Computer Science',
      duration: '2016 - 2020',
      description: [
        'Graduated with distinction',
        'Focused on Software Engineering and Database Systems',
        'Completed senior project on E-Commerce platform development'
      ],
      logo: null
    }
  ]
  
  for (let i = 0; i < realEducations.length; i++) {
    const edu = realEducations[i]
    const { error } = await supabase.from('educations').insert({
      profile_id: PROFILE_ID,
      logo: edu.logo,
      institute: edu.institute,
      degree: edu.degree,
      duration: edu.duration,
      description: edu.description,
      display_order: i + 1
    })
    
    if (error) console.error(`Education ${edu.institute} error:`, error.message)
    else console.log(`Education ${edu.institute} seeded`)
  }
}

async function main() {
  console.log('Starting database seed from data.json...\n')
  
  // Upload all local assets first
  const assetMapping = await uploadAssetsAndGetUrls()
  console.log(`\nUploaded ${Object.keys(assetMapping).length} assets\n`)
  
  // Clear existing data
  await clearExistingData()
  
  // Seed all tables
  await seedProfile()
  await seedAbout()
  await seedSocials()
  await seedSkills()
  await seedProjects(assetMapping)
  await seedExperiences()
  await seedEducations()
  
  console.log('\n--- Database seed completed! ---\n')
}

main().catch(console.error)
