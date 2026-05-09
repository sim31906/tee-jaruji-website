// ============================================
// SITE DATA — เเก้ข้อมูลทุกอย่างที่นี่
// ============================================

import { colors } from "../styles/theme";

// ---- HERO ----
export const hero = {
  name: "Tee",
  surname: "Jaruji",
  tagline: "EST. ONLINE · 2026",
  description:
    "นักเเสดง · นักร้อง · ศิลปิน — เก็บรวบรวมเรื่องราว ผลงาน เเละช่วงเวลาดี ๆ ที่อยากเเบ่งปันกับทุกคน ยินดีต้อนรับสู่บ้านอย่างเป็นทางการของผมครับ",
  tags: ["Performer", "Vocalist", "Storyteller"],
  // ใส่ลิงก์วิดีโอเเนะนำตัวที่นี่ (MP4 หรือ YouTube embed URL)
  videoUrl: "", // ตัวอย่าง: 'https://www.youtube.com/embed/VIDEO_ID' หรือ '/intro.mp4'
};

// ---- WORKS ----
export const works = [
  {
    slug: "events",
    icon: "E",
    type: "Category 01",
    title: "Event\nAppearances",
    desc: "งานเปิดตัว · งานเเฟนมีต · งานพรีเซนเตอร์ · กิจกรรมพิเศษทั้งในประเทศเเละต่างประเทศ",
    items: [
      { name: "Fan Meeting Bangkok", year: "2025" },
      { name: "Brand Event · BKK", year: "2025" },
      { name: "Press Conference", year: "2024" },
    ],
    color: colors.pink,
    detail: {
      headline: "Event Appearances",
      sub: "งานเปิดตัว · แฟนมีต · งานพรีเซนเตอร์ · กิจกรรมพิเศษ",
      body: "รวบรวมกิจกรรมและงานอีเวนต์ต่าง ๆ ที่ Tee Jaruji เข้าร่วม ทั้งในประเทศและต่างประเทศ ตั้งแต่งานแฟนมีต งานแถลงข่าว ไปจนถึงการเป็นพรีเซนเตอร์ให้กับแบรนด์ชั้นนำ",
      items: [
        {
          name: "Fan Meeting Bangkok",
          year: "2025",
          detail: "Bitec · 2,000 ที่นั่ง",
        },
        {
          name: "Brand Event · BKK",
          year: "2025",
          detail: "Siam Paragon · Presenter",
        },
        {
          name: "Press Conference",
          year: "2024",
          detail: "Series Launch Event",
        },
        {
          name: "Fan Meeting Chiang Mai",
          year: "2024",
          detail: "Nimman Hall · 500 ที่นั่ง",
        },
        {
          name: "International Event · Japan",
          year: "2024",
          detail: "Tokyo · Thai Wave Festival",
        },
        { name: "Charity Event", year: "2024", detail: "Bangkok · Red Cross" },
      ],
    },
  },
  {
    slug: "performance",
    icon: "P",
    type: "Category 02",
    title: "Performance\n& Acting",
    desc: "งานเเสดงละคร · ซีรีส์ · ภาพยนตร์ · เเละการเเสดงบนเวที",
    items: [
      { name: "Lead Role · Series", year: "2025" },
      { name: "Stage Performance", year: "2024" },
      { name: "Short Film", year: "2024" },
    ],
    color: colors.blue,
    detail: {
      headline: "Performance & Acting",
      sub: "ซีรีส์ · ภาพยนตร์ · ละครเวที · Short Film",
      body: "ผลงานการแสดงที่ Tee Jaruji ฝากไว้บนจอและบนเวที ตั้งแต่บทนำในซีรีส์ ไปจนถึงการแสดงสดบนเวทีที่ต้องอาศัยความสามารถเต็มที่",
      items: [
        { name: "Lead Role · Series", year: "2025", detail: "CH3 · บทนำ" },
        {
          name: "Stage Performance",
          year: "2024",
          detail: "รอบพิเศษ · กรุงเทพฯ",
        },
        {
          name: "Short Film",
          year: "2024",
          detail: "Official Selection · Thai Film Fest",
        },
        { name: "Supporting Role · Film", year: "2024", detail: "ภาพยนตร์ไทย" },
        { name: "Guest Role · Series", year: "2023", detail: "GMM25" },
        { name: "Theater Play", year: "2023", detail: "Bangkok · 10 รอบ" },
      ],
    },
  },
  {
    slug: "music",
    icon: "M",
    type: "Category 03",
    title: "Music\n& Sound",
    desc: "ผลงานเพลง · ซิงเกิล · OST · เเละการเเสดงดนตรีสด",
    items: [
      { name: "Single Release", year: "2025" },
      { name: "OST Collaboration", year: "2024" },
      { name: "Live Concert", year: "2024" },
    ],
    color: colors.creamDark,
    detail: {
      headline: "Music & Sound",
      sub: "ซิงเกิล · OST · Live Performance · Collaboration",
      body: "ผลงานเพลงและการแสดงดนตรีสดของ Tee Jaruji ตั้งแต่ซิงเกิลเดี่ยว การร่วมงานกับศิลปินอื่น ไปจนถึง OST ประกอบซีรีส์และภาพยนตร์",
      items: [
        {
          name: "Single Release",
          year: "2025",
          detail: "Digital Streaming · All Platforms",
        },
        { name: "OST Collaboration", year: "2024", detail: "ประกอบซีรีส์ CH3" },
        {
          name: "Live Concert",
          year: "2024",
          detail: "Impact Arena · Guest Artist",
        },
        { name: "Acoustic Session", year: "2024", detail: "YouTube Live" },
        { name: "Collab Single", year: "2023", detail: "Feat. Artist" },
        {
          name: "Year-End Concert",
          year: "2023",
          detail: "Central World Stage",
        },
      ],
    },
  },
];

// ---- EDUCATION ----
export const education = [
  {
    date: "~2543 — 2552",
    dateEn: "~2000 — 2009",
    degree: "ประถม — มัธยมต้น",
    degreeEn: "Primary — Junior High",
    school: "โรงเรียนปรินส์รอยแยลส์วิทยาลัย",
    schoolEn: "Prince Royal's College",
    location: "เชียงใหม่",
    abbr: "PRC",
    logoColor: "#8B1A2D",
    logoUrl: "/Prince.png",
  },
  {
    date: "~2552 — 2555",
    dateEn: "~2009 — 2012",
    degree: "มัธยมปลาย",
    degreeEn: "Senior High School",
    school: "โรงเรียนวารีเชียงใหม่",
    schoolEn: "Waree Chiang Mai School",
    location: "เชียงใหม่",
    abbr: "วารี",
    logoColor: "#fbfbfc",
    logoUrl: "/varee_chiangmai_school_logo.png",
  },
  {
    date: "จบ ต.ค. 2561",
    dateEn: "Grad. Oct 2018",
    degree: "ปริญญาตรี",
    degreeEn: "Bachelor's Degree",
    school: "มหาวิทยาลัยเกษตรศาสตร์",
    schoolEn: "Kasetsart University",
    location: "คณะสังคมศาสตร์ ภาควิชาจิตวิทยา",
    locationEn: "Faculty of Social Sciences, Psychology",
    abbr: "KU",
    logoColor: "#2d6a2d",
    logoUrl: "/green.jpg",
  },
];

// ---- SOCIAL MEDIA ----
// เเก้ url ใส่ลิงก์จริงได้เลย
export const socials = [
  {
    platform: "Facebook",
    handle: "@teejaruji",
    url: "https://www.facebook.com/share/1JzG4Trtip/?mibextid=wwXIfr",
    color: "#1877F2",
  },
  {
    platform: "Instagram",
    handle: "@tee_jaruji",
    url: "https://www.instagram.com/tee_jaruji?igsh=bnI4cnVjejBkazJl",
    color: "#E1306C",
  },
  {
    platform: "X",
    handle: "@Tee_Jaruji",
    url: "https://x.com/Tee_Jaruji?lang=en",
    color: "#000000",
  },
  {
    platform: "TikTok",
    handle: "@tee_jaruji",
    url: "https://www.tiktok.com/@tee_jaruji?_r=1&_t=ZS-96B7FFn7PlN",
    color: "#69C9D0",
  },
  {
    platform: "Line",
    handle: "@369zivpv",
    url: "https://line.me/ti/g2/oOMD7IBEzAyK5iMXg_rsrVY6w5KvCcxOSyMTUw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default",
    color: "#00B900",
  },
  {
    platform: "Weibo",
    handle: "Tee Jaruji",
    url: "https://weibo.com/u/6186540338",
    color: "#E6162D",
  },
  {
    platform: "RedNote",
    handle: "Tee Jaruji",
    url: "https://xhslink.com/m/8XlnQB1Lywm",
    color: "#FF2442",
  },
];

// ---- ABOUT QUOTE ----
export const aboutQuote = {
  text: "ขอบคุณที่เเวะมาทำความรู้จักกัน ฝากติดตามผลงานเเละเรื่องราวต่าง ๆ ผ่านช่องทางออนไลน์ของผมได้นะครับ",
  signature: "— Tee Jaruji",
};

// ---- CONTACT ----
export const contacts = [
  {
    label: "Line Official",
    value: "@teejaruji",
    action: "Add friend",
    href: "https://line.me/R/ti/p/@369zivpv?ts=02130418&oat_content=url&utm_source=ig&utm_medium=social&utm_content=link_in_bio",
  },
  {
    label: "Email",
    value: "contact@teejaruji.com",
    action: "Send mail",
    href: "mailto:contact@teejaruji.com",
  },
];

// ---- UPCOMING EVENTS ----
export const upcomingEvents = [
  { day: "15", month: "May", title: "Fan Meeting", detail: "Bangkok · 18:00" },
  {
    day: "22",
    month: "May",
    title: "Brand Event",
    detail: "Siam Paragon · 14:00",
  },
  { day: "03", month: "Jun", title: "Concert", detail: "Impact Arena · 19:00" },
];

// ---- GOOGLE CALENDAR ----
// เปลี่ยน calendar ID เพื่อเชื่อมต่อปฏิทินจริง
// วิธีหา ID: Google Calendar > Settings > Integrate calendar > Calendar ID
export const googleCalendarUrl =
  "https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23fdf6ec&ctz=Asia%2FBangkok&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&mode=MONTH";

// ---- FAN STATS ----
export const fanStats = [
  { num: "1.2M+", label: "Followers" },
  { num: "50+", label: "Fan Projects" },
  { num: "∞", label: "Love" },
];

// ---- FAN PHOTOS (gradient placeholders) ----
// ในเวอร์ชันจริง สามารถเปลี่ยนเป็น array ของ URL รูปได้
export const fanGradients = [
  ["#f4b8c8", "#aecde0"],
  ["#aecde0", "#fdf6ec"],
  ["#f4b8c8", "#fce4ea"],
  ["#dceaf4", "#f4b8c8"],
  ["#fce4ea", "#aecde0"],
  ["#aecde0", "#dceaf4"],
  ["#f4b8c8", "#fdf6ec"],
  ["#dceaf4", "#fce4ea"],
  ["#fce4ea", "#aecde0"],
  ["#fdf6ec", "#f4b8c8"],
  ["#aecde0", "#fce4ea"],
  ["#f4b8c8", "#dceaf4"],
];

// ---- FANCLUB SERVICES ----
export const services = [
  {
    num: "i.",
    title: "Support\nFood Truck",
    desc: "สำหรับเเฟนคลับที่ต้องการส่งกำลังใจในรูปเเบบฟู้ดทรัค กาเเฟ ของหวาน หรือสิ่งของสนับสนุนในกองถ่าย / กิจกรรม สามารถติดต่อทีมงานเพื่อประสานงานได้",
    arrow: "Contact team →",
  },
  {
    num: "ii.",
    title: "Project &\nCollaboration",
    desc: "โปรเจกต์เเฟนคลับ ของขวัญวันเกิด งานบุญในนามเเฟนคลับ หรือกิจกรรมพิเศษ — ทีมงานพร้อมให้คำปรึกษาเเละช่วยประสานงาน",
    arrow: "Get in touch →",
  },
];

// ---- REPORT FORM ----
// ใส่ลิงก์ Google Form ที่นี่
export const reportFormUrl = "https://forms.google.com/your-form-id";

// ---- NAV LINKS ----
export const navItems = [
  "home",
  "profile",
  "about",
  "contact",
  "schedule",
  "supporters",
  "fanclub",
];
