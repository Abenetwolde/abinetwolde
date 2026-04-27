-- Seed Portfolio Data for Abnet Wolde

-- Insert profile
INSERT INTO public.profile (id, name, short_desc, titles, hero_image, tech_stack_images)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Abnet Wolde',
  'I specialize in creating user-friendly web, telegram bot, and mobile apps that fully meet client needs, with a strong focus on detail, scalability, and performance.',
  ARRAY['Full Stack Web Development', 'Telegram Bot Development', 'Mobile Application Development'],
  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
  ARRAY[
    'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Ffluency%2F144%2Fnull%2Fnode-js.png&w=128&q=75',
    'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fexternal-tal-revivo-color-tal-revivo%2F96%2Fnull%2Fexternal-mongodb-a-cross-platform-document-oriented-database-program-logo-color-tal-revivo.png&w=128&q=75',
    'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fultraviolet%2F120%2Fnull%2Freact--v1.png&w=128&q=75',
    'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fios%2F150%2Fnull%2Fexpress-js.png&w=128&q=75'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_desc = EXCLUDED.short_desc,
  titles = EXCLUDED.titles,
  hero_image = EXCLUDED.hero_image,
  tech_stack_images = EXCLUDED.tech_stack_images,
  updated_at = NOW();

-- Insert about
INSERT INTO public.about (profile_id, about_image, about_image_caption, title, about, resume_url, call_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
  '< Stick to your Guns />',
  'Full Stack Developer',
  'I am a visionary at heart, always driven by a desire to tackle meaningful challenges through technology. My curiosity for software development began early and continues to fuel my passion today. As a Full Stack Developer, I specialize in React.js, React Native, Node.js, Telegram bot development, and graphic design—bringing both creativity and technical expertise to every project. I have worked extensively on web and mobile applications, always aiming to craft user-friendly, impactful solutions.',
  'https://drive.google.com/file/d/1yhdgVTxQSeN5dU_kNxn0bWOHMn_OIIDk/view?usp=sharing',
  ''
)
ON CONFLICT DO NOTHING;

-- Insert socials
INSERT INTO public.socials (profile_id, icon, link, display_order) VALUES
('00000000-0000-0000-0000-000000000001', 'FaLinkedin', 'https://www.linkedin.com/in/abnet-wolde-8b3923220/', 1),
('00000000-0000-0000-0000-000000000001', 'FaGithub', 'https://github.com/Abenetwolde', 2),
('00000000-0000-0000-0000-000000000001', 'FaTelegram', 'https://t.me/abnet_abi', 3)
ON CONFLICT DO NOTHING;

-- Insert skills
INSERT INTO public.skills (profile_id, name, image, category, display_order) VALUES
-- Frontend
('00000000-0000-0000-0000-000000000001', 'JavaScript', 'https://img.icons8.com/color/144/null/javascript--v1.png', 'Frontend', 1),
('00000000-0000-0000-0000-000000000001', 'React.js', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fultraviolet%2F120%2Fnull%2Freact--v1.png&w=128&q=75', 'Frontend', 2),
('00000000-0000-0000-0000-000000000001', 'Next.js', 'https://res.cloudinary.com/lifecodes/image/upload/v1678131853/Portfolio/rmz2jvsww4cdwkfriuyc.svg', 'Frontend', 3),
('00000000-0000-0000-0000-000000000001', 'Redux', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Fredux.png&w=128&q=75', 'Frontend', 4),
('00000000-0000-0000-0000-000000000001', 'TypeScript', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Ftypescript.png&w=128&q=75', 'Frontend', 5),
('00000000-0000-0000-0000-000000000001', 'Tailwind', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Ftailwindcss.png&w=128&q=75', 'Frontend', 6),
('00000000-0000-0000-0000-000000000001', 'Material UI', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Fmaterial-ui.png&w=128&q=75', 'Frontend', 7),
('00000000-0000-0000-0000-000000000001', 'Chakra UI', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Fchakra-ui.png&w=128&q=75', 'Frontend', 8),
('00000000-0000-0000-0000-000000000001', 'HTML5', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Fhtml-5--v1.png&w=128&q=75', 'Frontend', 9),
('00000000-0000-0000-0000-000000000001', 'CSS3', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Fcss3.png&w=128&q=75', 'Frontend', 10),
('00000000-0000-0000-0000-000000000001', 'Bootstrap', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Fbootstrap.png&w=128&q=75', 'Frontend', 11),
('00000000-0000-0000-0000-000000000001', 'Sass', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Fsass.png&w=128&q=75', 'Frontend', 12),
-- Backend
('00000000-0000-0000-0000-000000000001', 'ExpressJS', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fios%2F150%2Fnull%2Fexpress-js.png&w=128&q=75', 'Backend', 1),
('00000000-0000-0000-0000-000000000001', 'Django', NULL, 'Backend', 2),
('00000000-0000-0000-0000-000000000001', 'MongoDB', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fexternal-tal-revivo-color-tal-revivo%2F96%2Fnull%2Fexternal-mongodb-a-cross-platform-document-oriented-database-program-logo-color-tal-revivo.png&w=128&q=75', 'Backend', 3),
('00000000-0000-0000-0000-000000000001', 'Firebase', 'https://img.icons8.com/color/144/null/firebase.png', 'Backend', 4),
('00000000-0000-0000-0000-000000000001', 'PHP', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Foffices%2F160%2Fnull%2Fphp-logo.png&w=128&q=75', 'Backend', 5),
('00000000-0000-0000-0000-000000000001', 'MySQL', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Fmysql-logo.png&w=128&q=75', 'Backend', 6),
-- Others
('00000000-0000-0000-0000-000000000001', 'Telegram Bot', 'https://img.icons8.com/?size=100&id=oWiuH0jFiU0R&format=png&color=000000', 'Others', 1),
('00000000-0000-0000-0000-000000000001', 'React Native', 'https://img.icons8.com/?size=100&id=wPohyHO_qO1a&format=png&color=000000', 'Others', 2),
('00000000-0000-0000-0000-000000000001', 'Java', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Fjava-coffee-cup-logo--v1.png&w=128&q=75', 'Others', 3),
('00000000-0000-0000-0000-000000000001', 'Android Studio', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Fandroid-studio--v3.png&w=128&q=75', 'Others', 4),
('00000000-0000-0000-0000-000000000001', 'Googling', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Fgoogle-logo.png&w=128&q=75', 'Others', 5),
('00000000-0000-0000-0000-000000000001', 'GitHub', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fmaterial-outlined%2F96%2Fnull%2Fgithub.png&w=128&q=75', 'Others', 6),
('00000000-0000-0000-0000-000000000001', 'DigitalOcean', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fexternal-tal-revivo-color-tal-revivo%2F96%2Fnull%2Fexternal-digital-ocean-a-cloud-infrastructure-with-data-centers-worldwide-logo-color-tal-revivo.png&w=128&q=75', 'Others', 7),
('00000000-0000-0000-0000-000000000001', 'Jira', 'https://jigarsable.vercel.app/_next/image?url=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F144%2Fnull%2Fjira.png&w=128&q=75', 'Others', 8),
('00000000-0000-0000-0000-000000000001', 'Penetration Testing', 'https://img.icons8.com/?size=100&id=Q8ShCeCnUwac&format=png&color=000000', 'Others', 9),
('00000000-0000-0000-0000-000000000001', 'UI/UX', 'https://img.icons8.com/?size=100&id=blpKd0mpBEOj&format=png&color=000000', 'Others', 10),
('00000000-0000-0000-0000-000000000001', 'Photoshop', 'https://img.icons8.com/?size=100&id=13677&format=png&color=000000', 'Others', 11)
ON CONFLICT DO NOTHING;

-- Insert projects
INSERT INTO public.projects (profile_id, name, techstack, category, description, blog, images, link_visit, link_code, link_video, display_order) VALUES
('00000000-0000-0000-0000-000000000001', 'Event Promotion', 'ReactNative', 'Mobile App', NULL, NULL, ARRAY['/assets/placetobe/image1.png', '/assets/placetobe/image2.png', '/assets/placetobe/image3.png'], 'https://play.google.com/store/apps/details?id=com.afromina.placetobe&hl=en', NULL, NULL, 1),
('00000000-0000-0000-0000-000000000001', 'Spelling Check for Channel Posts', 'TelegrafJs, speller.yandex.net', 'Telegram Bot', NULL, NULL, ARRAY['/assets/check/check1.png', '/assets/check/check2.png', '/assets/check/check3.png'], NULL, 'https://github.com/Abenetwolde/check-spelling-for-channel-posts.git', NULL, 2),
('00000000-0000-0000-0000-000000000001', 'Quiz Bot', 'TelegrafJs, MongoDB', 'Telegram Bot', NULL, NULL, ARRAY['/assets/quiz/quiz1.png', '/assets/quiz/quiz2.png', '/assets/quiz/quiz3.png', '/assets/quiz/quiz4.png'], NULL, NULL, NULL, 3),
('00000000-0000-0000-0000-000000000001', 'Ethiopian Employment Income Tax Calculator', 'TelegrafJs, MongoDB', 'Telegram Bot', NULL, NULL, ARRAY['/assets/tax/image1.png', '/assets/tax/image2.png', '/assets/tax/image3.png'], 'https://ethiopian-tax-calculator.vercel.app/', 'https://github.com/Abenetwolde/Ethiopian-Tax-calculator.git', NULL, 4),
('00000000-0000-0000-0000-000000000001', 'Cloud Storage SASS', 'NextJS, Firebase', 'Web App', NULL, NULL, ARRAY['/assets/cloud/image1.png', '/assets/cloud/image2.png', '/assets/cloud/image3.png'], 'https://ab-cloud-sass.vercel.app/', 'https://github.com/Abenetwolde/Sales_Dashboard', NULL, 5),
('00000000-0000-0000-0000-000000000001', 'Sales Performance Tracker', 'ReactJS, TailwindCSS, FastAPI', 'Web App', NULL, NULL, ARRAY['/assets/sales/image1.png', '/assets/sales/image2.png', '/assets/sales/image3.png', '/assets/sales/image5.png', '/assets/sales/image6.png'], 'https://sales-dashboard-mu.vercel.app/', 'https://github.com/Abenetwolde/Sales_Dashboard', NULL, 6),
('00000000-0000-0000-0000-000000000001', 'Chat App with Video and Audio', 'ReactJS, NodeJS, ExpressJS, MongoDB, Socket.IO', 'Web App', NULL, NULL, ARRAY['/assets/telegram/image2.png', '/assets/telegram/image2.png', '/assets/telegram/image3.png'], NULL, 'https://github.com/Abenetwolde/Messenger-.git', NULL, 7),
('00000000-0000-0000-0000-000000000001', 'Finance Calculator', 'NextJs, MongoDB, Prisma, Google Auth', 'Web App', NULL, NULL, ARRAY['/assets/calculator/image1.png', '/assets/calculator/image2.png', '/assets/calculator/image3.png', '/assets/calculator/image4.png', '/assets/calculator/image5.png'], 'https://finance-calculator-fawn.vercel.app/', 'https://github.com/Abenetwolde/Finance_Calculator-', NULL, 8),
('00000000-0000-0000-0000-000000000001', 'Telegram Ecommerce Bot', 'TelegrafJS, NodeJS, MongoDB', 'My Favorites', 'A feature-rich Telegram e-commerce bot with product filtering, cart management, search, pagination, image and video support, payment integration (Chapa and Stripe), user feedback, localization (Amharic and English), automated posting, click and time tracking, referral program with lottery, and admin scene for order management.', NULL, ARRAY['/assets/ecommercebot/imagebot1.png', '/assets/ecommercebot/imagebot2.png', '/assets/ecommercebot/imagebot3.png', '/assets/ecommercebot/imagebot4.png', '/assets/ecommercebot/imagebot5.png', '/assets/ecommercebot/imagebot6.png'], 'https://t.me/elitesporttgbot', 'https://github.com/Abenetwolde/FoodOrderingBot.git', 'https://www.youtube.com/watch?v=S90eIW0xMFk&t=88s', 9),
('00000000-0000-0000-0000-000000000001', 'Admin Web App for Ecommerce Telegram Bot', 'ReactJS, NodeJS, ExpressJS, MongoDB, Cloudinary', 'My Favorites', 'Comprehensive admin dashboard for the Telegram e-commerce bot with user analytics (growth tracking, time spent, click activity, language preferences, ratings), order and transaction management, product analytics, real-time feedback and response, lottery and invitation management, localization support, and theme customization.', 'https://www.linkedin.com/feed/update/urn:li:activity:7234514026720825344/', ARRAY['/assets/ecommerce/image1.png', '/assets/ecommerce/image2.png', '/assets/ecommerce/image3.png', '/assets/ecommerce/image4.png', '/assets/ecommerce/image5.png', '/assets/ecommerce/image6.png'], 'https://telegram-bot-ecommerce.netlify.app/', 'https://github.com/Abenetwolde/Admin_Dashboard_Ecommerce_Telegram_Bot.git', 'https://www.youtube.com/watch?v=B7YGERFo3Iw', 10),
('00000000-0000-0000-0000-000000000001', 'npm library: ethiopia-svg-map', 'ReactJS, NPM, SVG', 'My Favorites', NULL, 'https://www.linkedin.com/posts/abnet-wolde-8b3923220_i-released-a-react-component-npm-library-activity-7348969716595490816-u5xW', ARRAY['/assets/npm/image1.png', '/assets/npm/image2.png', '/assets/npm/image3.png'], 'https://www.npmjs.com/package/ethiopia-svg-map', 'https://github.com/Abenetwolde/ethiopian-svg-map-npm-library.git', NULL, 11),
('00000000-0000-0000-0000-000000000001', 'Telegram Mini App', 'ReactJS, NodeJS, MongoDB, TelegrafJS, Telegram Mini App', 'My Favorites', NULL, 'https://www.linkedin.com/feed/update/urn:li:activity:7301113262123724802/', ARRAY['/assets/tgminiapp/1.png', '/assets/tgminiapp/2.png', '/assets/tgminiapp/3.png', '/assets/tgminiapp/4.png', '/assets/tgminiapp/5.png', '/assets/tgminiapp/6.png', '/assets/tgminiapp/7.png', '/assets/tgminiapp/8.png', '/assets/tgminiapp/9.png'], 'http://t.me/TGCommerce1Bot', 'https://github.com/Abenetwolde/ecommerce-tg-mini-app-bot', 'https://www.youtube.com/watch?v=_lcuP0F7xFQ', 12)
ON CONFLICT DO NOTHING;

-- Insert experiences
INSERT INTO public.experiences (profile_id, logo, company, position, duration, description, display_order) VALUES
('00000000-0000-0000-0000-000000000001', 'https://www.afromina-digitals.com/v1.0/wp-content/uploads/2022/03/afromina_primerylogo_t.png', 'AfroMiNA Digital Technologies PLC', 'Software Developer', '2022-Aug - 2022-Dec', ARRAY['I contributed to the development of a Mobile Application called Place to be Ethiopia, an event-sharing platform with over 10,000 downloads on the Play Store', 'Built a Telegram referral bot using Telegraf.js framework to promote both the mobile application and the Telegram channel, with integrated rewards for users.', 'Played a key role in developing the mobile application using React Native.', 'Skills: ReactNative · Telegraf.js · Figma'], 1),
('00000000-0000-0000-0000-000000000001', 'https://i0.wp.com/ethiopianstoday.com/wp-content/uploads/2021/06/INSA.jpg?resize=640%2C640&ssl=1', 'Information Network Security Administrator', 'Software Application Developer', '2022 - Present', ARRAY['Developed web applications to control security system products and manage client interactions', 'Built APIs with Express.js for antivirus, web application firewall, and VPN products management, enabling real-time communication', 'Created frontend with React.js, ensuring efficient integration with backend services and clear data visualization.', 'Skills: React.js · Node.js · MongoDB · MySQL · Selenium · cypress.io · Jenkins · OWASP ZAP · JMeter · Sonarqube'], 2)
ON CONFLICT DO NOTHING;

-- Insert educations
INSERT INTO public.educations (profile_id, logo, institute, degree, duration, description, display_order) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Akaki Poly Technique Collage', 'Information System', '2020 - 2022', ARRAY['Good in DNS and DHCP configuration, and Access Role Management.', 'Adept at Network configuring and troubleshooting networks', 'Experienced in maintaining and troubleshooting hardware'], 1),
('00000000-0000-0000-0000-000000000001', 'http://www.aastu.edu.et/wp-content/uploads/2024/10/unnamed-1.jpg', 'Addis Ababa Science and Technology University', 'Software Engineering | BSC', '2018 - 2022', ARRAY['Proficient in C, C++, Java, PHP, and JavaScript.', 'Knowledgeable Data Structures and Algorithms', 'Knowledgeable in cyber security principles and practices', 'Knowledgeable in managing software development projects from inception to completion.'], 2)
ON CONFLICT DO NOTHING;
