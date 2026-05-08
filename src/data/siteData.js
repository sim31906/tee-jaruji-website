// ============================================
// SITE DATA — เเก้ข้อมูลทุกอย่างที่นี่
// ============================================

import { colors } from '../styles/theme';

// ---- HERO ----
export const hero = {
  name: 'Tee',
  surname: 'Jaruji',
  tagline: 'EST. ONLINE · 2026',
  description: 'นักเเสดง · นักร้อง · ศิลปิน — เก็บรวบรวมเรื่องราว ผลงาน เเละช่วงเวลาดี ๆ ที่อยากเเบ่งปันกับทุกคน ยินดีต้อนรับสู่บ้านอย่างเป็นทางการของผมครับ',
  tags: ['Performer', 'Vocalist', 'Storyteller'],
  // ใส่ลิงก์วิดีโอเเนะนำตัวที่นี่ (MP4 หรือ YouTube embed URL)
  videoUrl: '', // ตัวอย่าง: 'https://www.youtube.com/embed/VIDEO_ID' หรือ '/intro.mp4'
};

// ---- WORKS ----
export const works = [
  {
    icon: 'E',
    type: 'Category 01',
    title: 'Event\nAppearances',
    desc: 'งานเปิดตัว · งานเเฟนมีต · งานพรีเซนเตอร์ · กิจกรรมพิเศษทั้งในประเทศเเละต่างประเทศ',
    items: [
      { name: 'Fan Meeting Bangkok', year: '2025' },
      { name: 'Brand Event · BKK', year: '2025' },
      { name: 'Press Conference', year: '2024' },
    ],
    color: colors.pink,
  },
  {
    icon: 'P',
    type: 'Category 02',
    title: 'Performance\n& Acting',
    desc: 'งานเเสดงละคร · ซีรีส์ · ภาพยนตร์ · เเละการเเสดงบนเวที',
    items: [
      { name: 'Lead Role · Series', year: '2025' },
      { name: 'Stage Performance', year: '2024' },
      { name: 'Short Film', year: '2024' },
    ],
    color: colors.blue,
  },
  {
    icon: 'M',
    type: 'Category 03',
    title: 'Music\n& Sound',
    desc: 'ผลงานเพลง · ซิงเกิล · OST · เเละการเเสดงดนตรีสด',
    items: [
      { name: 'Single Release', year: '2025' },
      { name: 'OST Collaboration', year: '2024' },
      { name: 'Live Concert', year: '2024' },
    ],
    color: colors.creamDark,
  },
];

// ---- EDUCATION ----
export const education = [
  {
    date: '2022 — Present',
    degree: "Bachelor's Degree",
    school: 'University Name · Faculty',
    desc: 'การศึกษาเเละความสนใจในด้านศิลปะการเเสดง สื่อสารมวลชน เเละการสร้างสรรค์ผลงาน เป็นรากฐานสำคัญของเส้นทางอาชีพในวันนี้',
  },
  {
    date: '2019 — 2022',
    degree: 'High School',
    school: 'School Name',
    desc: 'เริ่มต้นเส้นทางในวงการบันเทิงควบคู่กับการเรียน เก็บประสบการณ์ผ่านกิจกรรมการเเสดงเเละดนตรีของโรงเรียน',
  },
];

// ---- SOCIAL MEDIA ----
// เเก้ url ใส่ลิงก์จริงได้เลย
export const socials = [
  { platform: 'Facebook', handle: '@teejaruji', url: 'https://facebook.com/teejaruji' },
  { platform: 'Instagram', handle: '@teejaruji', url: 'https://instagram.com/teejaruji' },
  { platform: 'X / Twitter', handle: '@teejaruji', url: 'https://x.com/teejaruji' },
  { platform: 'YouTube', handle: '@teejaruji', url: 'https://youtube.com/@teejaruji' },
  { platform: 'Weibo', handle: 'Tee Jaruji', url: 'https://weibo.com/teejaruji' },
  { platform: 'RedNote · 小红书', handle: 'Tee Jaruji', url: 'https://xiaohongshu.com/teejaruji' },
  { platform: 'TikTok', handle: '@teejaruji', url: 'https://tiktok.com/@teejaruji' },
];

// ---- ABOUT QUOTE ----
export const aboutQuote = {
  text: 'ขอบคุณที่เเวะมาทำความรู้จักกัน ฝากติดตามผลงานเเละเรื่องราวต่าง ๆ ผ่านช่องทางออนไลน์ของผมได้นะครับ',
  signature: '— Tee Jaruji',
};

// ---- CONTACT ----
export const contacts = [
  { label: 'Telephone', value: '+66 (0) ___-___-____', action: 'Call now', href: 'tel:+66' },
  { label: 'Line Official', value: '@teejaruji', action: 'Add friend', href: 'https://line.me/ti/p/~teejaruji' },
  { label: 'Email', value: 'contact@teejaruji.com', action: 'Send mail', href: 'mailto:contact@teejaruji.com' },
];

// ---- UPCOMING EVENTS ----
export const upcomingEvents = [
  { day: '15', month: 'May', title: 'Fan Meeting', detail: 'Bangkok · 18:00' },
  { day: '22', month: 'May', title: 'Brand Event', detail: 'Siam Paragon · 14:00' },
  { day: '03', month: 'Jun', title: 'Concert', detail: 'Impact Arena · 19:00' },
];

// ---- GOOGLE CALENDAR ----
// เปลี่ยน calendar ID เพื่อเชื่อมต่อปฏิทินจริง
// วิธีหา ID: Google Calendar > Settings > Integrate calendar > Calendar ID
export const googleCalendarUrl = 'https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23fdf6ec&ctz=Asia%2FBangkok&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&mode=MONTH';

// ---- FAN STATS ----
export const fanStats = [
  { num: '1.2M+', label: 'Followers' },
  { num: '50+', label: 'Fan Projects' },
  { num: '∞', label: 'Love' },
];

// ---- FAN PHOTOS (gradient placeholders) ----
// ในเวอร์ชันจริง สามารถเปลี่ยนเป็น array ของ URL รูปได้
export const fanGradients = [
  ['#f4b8c8', '#aecde0'],
  ['#aecde0', '#fdf6ec'],
  ['#f4b8c8', '#fce4ea'],
  ['#dceaf4', '#f4b8c8'],
  ['#fce4ea', '#aecde0'],
  ['#aecde0', '#dceaf4'],
  ['#f4b8c8', '#fdf6ec'],
  ['#dceaf4', '#fce4ea'],
  ['#fce4ea', '#aecde0'],
  ['#fdf6ec', '#f4b8c8'],
  ['#aecde0', '#fce4ea'],
  ['#f4b8c8', '#dceaf4'],
];

// ---- FANCLUB SERVICES ----
export const services = [
  {
    num: 'i.',
    title: 'Support\nFood Truck',
    desc: 'สำหรับเเฟนคลับที่ต้องการส่งกำลังใจในรูปเเบบฟู้ดทรัค กาเเฟ ของหวาน หรือสิ่งของสนับสนุนในกองถ่าย / กิจกรรม สามารถติดต่อทีมงานเพื่อประสานงานได้',
    arrow: 'Contact team →',
  },
  {
    num: 'ii.',
    title: 'Project &\nCollaboration',
    desc: 'โปรเจกต์เเฟนคลับ ของขวัญวันเกิด งานบุญในนามเเฟนคลับ หรือกิจกรรมพิเศษ — ทีมงานพร้อมให้คำปรึกษาเเละช่วยประสานงาน',
    arrow: 'Get in touch →',
  },
];

// ---- REPORT FORM ----
// ใส่ลิงก์ Google Form ที่นี่
export const reportFormUrl = 'https://forms.google.com/your-form-id';

// ---- NAV LINKS ----
export const navItems = ['home', 'profile', 'about', 'contact', 'schedule', 'supporters', 'fanclub'];
