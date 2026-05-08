# 🌸 Tee Jaruji — Official Website

เว็บไซต์ทางการของ Tee Jaruji สร้างด้วย React + Vite

โทนสี Soft Pastel: ชมพู · ครีม · ฟ้า

---

## 📦 การติดตั้ง

ก่อนเริ่มต้น ต้องมี **Node.js** เวอร์ชัน 18 ขึ้นไป  
[ดาวน์โหลด Node.js](https://nodejs.org/)

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. รันเว็บใน development mode (เปิด browser อัตโนมัติที่ http://localhost:3000)
npm run dev

# 3. สร้างไฟล์สำหรับ deploy
npm run build

# 4. ดูตัวอย่างไฟล์ที่ build เเล้ว
npm run preview
```

---

## 📁 โครงสร้างโปรเจกต์

```
tee-jaruji-website/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # React components
│   │   ├── Navigation.jsx
│   │   ├── Hero.jsx          # หน้า Home + วิดีโอ
│   │   ├── Profile.jsx       # Work + Study
│   │   ├── About.jsx         # Social media
│   │   ├── Contact.jsx       # tel, line, email
│   │   ├── Schedule.jsx      # Google Calendar
│   │   ├── Supporters.jsx    # Fan gallery
│   │   ├── Fanclub.jsx       # Food truck + Report form
│   │   ├── Footer.jsx
│   │   └── SectionHeader.jsx
│   ├── data/
│   │   └── siteData.js       # ⭐ เเก้ข้อมูลทุกอย่างที่นี่
│   ├── styles/
│   │   ├── theme.js          # ⭐ เเก้สี + font ที่นี่
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## ✏️ การเเก้ไขเนื้อหา

### 1. เเก้ข้อมูลทั้งหมดใน `src/data/siteData.js`

ในไฟล์นี้มีข้อมูลทุกอย่าง:

| ตัวเเปร | สำหรับ |
|---------|--------|
| `hero` | ชื่อ คำเเนะนำตัว วิดีโอ |
| `works` | ผลงาน Event / Performance / Music |
| `education` | การศึกษา |
| `socials` | ลิงก์ Facebook, IG, X, YouTube, Weibo, RedNote, TikTok |
| `contacts` | เบอร์โทร · Line · Email |
| `upcomingEvents` | งาน 3 อันถัดไป |
| `googleCalendarUrl` | iframe URL ของ Google Calendar |
| `fanStats` | ตัวเลขเเฟนคลับ |
| `services` | บริการเเฟนคลับ |
| `reportFormUrl` | ลิงก์ Google Form |

### 2. เปลี่ยนสี + ฟอนต์ใน `src/styles/theme.js`

```js
export const colors = {
  cream: '#fdf6ec',     // สีพื้น
  pink: '#f4b8c8',      // สีหลัก
  blue: '#aecde0',      // สีรอง
  accent: '#d97a8e',    // สีเน้น
  // ...
};
```

### 3. ใส่วิดีโอเเนะนำตัว

ในไฟล์ `src/data/siteData.js`:

```js
export const hero = {
  // ...
  videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
  // หรือ
  videoUrl: '/intro.mp4',  // วางไฟล์ใน public/intro.mp4
};
```

### 4. เชื่อม Google Calendar

1. เปิด [Google Calendar](https://calendar.google.com/)
2. ไปที่ Settings > เลือกปฏิทินที่ต้องการ > **Integrate calendar**
3. คัดลอก URL ใน "Public URL to this calendar" หรือ embed code
4. วาง URL ใน `siteData.js > googleCalendarUrl`

### 5. ใส่ Google Form เเจ้งปัญหา

1. สร้าง Google Form
2. กดปุ่ม **Send** > เลือกไอคอนลิงก์
3. คัดลอก URL
4. วางใน `siteData.js > reportFormUrl`

---

## 🚀 การ Deploy

### Vercel (เเนะนำ — ฟรี + ง่าย)

```bash
npm install -g vercel
vercel
```

### Netlify

1. รัน `npm run build`
2. ลาก folder `dist/` ไปวางที่ [app.netlify.com/drop](https://app.netlify.com/drop)

### GitHub Pages

1. Push โค้ดขึ้น GitHub
2. ตั้งค่า GitHub Pages ให้ใช้ folder `dist/` หลังรัน `npm run build`

---

## 🎨 Customization Tips

- **เปลี่ยนชื่อโปรเจกต์**: เเก้ใน `package.json` > `name`
- **เปลี่ยน favicon**: เเก้ไฟล์ `public/favicon.svg`
- **เพิ่ม section**: สร้างไฟล์ใหม่ใน `components/` เเละ import ใน `App.jsx`
- **เปลี่ยนฟอนต์**: เปลี่ยน Google Fonts ใน `index.html` เเละ `theme.js`

---

## 💌 Made with ♡ for Tee Jaruji

ขอบคุณที่ใช้งาน หากมีปัญหาหรือคำถาม ติดต่อทีมพัฒนาได้
