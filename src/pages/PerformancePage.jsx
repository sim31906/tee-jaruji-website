import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { colors, fonts } from "../styles/theme";
import CursorSparkle from "../components/CursorSparkle";
import { useLang } from "../context/LanguageContext";
import { SiNetflix, SiYoutube } from "react-icons/si";
import { translations } from "../data/translations";

const SHOWS = [
  {
    id: 1,
    titleTh: "ปั่นไปให้ถึงรัก",
    titleEn: "Love Like a Bike",
    type: "series",
    gradient: ["#aecde0", "#dceaf4"],
    accentColor: colors.blueDeep,
    summaryTh:
      "เรื่องราวของสายลม หนุ่มนักเรียนนอกที่ป่วยเป็นโรคกลัวการสัมผัส ซึ่งบังเอิญพบกับนับหนึ่ง โดยอุบัติเหตุ ความใกล้ชิดจากการปั่นจักรยานช่วยรักษาแผลใจและเปลี่ยนจากความไม่ตั้งใจเป็นความรักที่ต้องตัดสินใจในตอนจบ",
    summaryEn:
      "The story of the Wind, a young student who suffers from contact phobia. He accidentally met Nabneung by accident. The intimacy of cycling heals the wounds and turns from inattention to love that has to be decided at the end.",
    summaryZh:
      "讲述了患有接触恐惧症的留学生赛隆的故事。他与纳布嫩意外相遇，骑自行车的亲密相处治愈了他内心的创伤，让这段无心之缘慢慢变成一段需要在结局做出抉择的爱情。",
    trailerUrl: "https://www.youtube.com/embed/rvFBiV1SWoc",
    image: "/posters/pan-pai-preview.jpg",
    posterImage: "/posters/pan-pai.jpg",
    platforms: [
      {
        name: "Netflix",
        url: "https://www.netflix.com/th-en/title/82745549",
        color: "#E50914",
      },
    ],
  },
  {
    id: 2,
    titleTh: "แสนรัก",
    titleEn: "My (Im)perfect Family",
    type: "series",
    gradient: ["#c4a882", "#e8d5b7"],
    accentColor: "#8B6A3E",
    summaryTh:
      '"ความรัก" เป็นความปราถนาดีของแม่ หากมันท่วมท้นจนเกินไป อาจกลายเป็นการบงการชีวิตลูก แต่ภายใต้ความเชื่อฟังกลับแอบซ่อนไว้ด้วยความรู้สึกต่อต้าน จนเกิดความแตกแยกเพราะความเข้าใจผิดและริษยา ทำให้สายสัมพันธ์พี่น้องสั่นคลอนจนต้องห้ำหั่นกันเอง มีเพียง "ความรัก" ที่จะหลอมรวมพวกเค้ากลับมาใหม่ แต่ใครคือคนนั้นที่จะช่วยให้พวกเค้าหลุดพ้นจากความเกลียดชังนี้ได้',
    summaryEn:
      '"Love" is a mother\'s good wish. If it\'s too overwhelming, it may become a manipulation of the child\'s life, but under obedience, it is hidden with a feeling of opposition, resulting in a division due to misunderstanding and jealousy. This makes the bond of siblings shaky. Only "love" will reunite them, but who will help them get rid of this hatred?',
    summaryZh:
      '"爱"是母亲的美好心愿。然而过度的爱，可能变成对子女生活的操控。在表面的顺从之下，暗藏着反抗的情绪，误解与嫉妒引发家庭分裂，兄弟姐妹间的情感纽带岌岌可危。唯有"爱"能将他们重新凝聚，但谁才是帮助他们走出仇恨的那个人？',
    trailerUrl: "https://www.youtube.com/embed/Pirl_NHw28s",
    image: "/posters/saen-rak-preview.jpg",
    posterImage: "/posters/saen-rak.jpg",
    platforms: [
      {
        name: "Netflix",
        url: "https://www.netflix.com/th/title/81992234",
        color: "#E50914",
      },
      { name: "Ch3+", url: "https://ch3plus.com/drama/1740", color: "#E87722" },
    ],
  },
  {
    id: 3,
    titleTh: "เรือนทาส",
    titleEn: "Mystery of The Spirit",
    type: "series",
    gradient: ["#8B7356", "#c4a882"],
    accentColor: "#8B7356",
    summaryTh:
      '"เรือนทาส" รกร้างถูกทิ้งไว้ในเรือนพระยาธรรมานุรักษ์ จุดเริ่มต้นความเฮี้ยนของ "ผีมะลิ" วิญญาณที่ถูกจองจำ เฝ้ารอวันทวงคืนทุกสิ่งและเปิดเผยความจริงที่ถูกซ่อนไว้ ณ เรือนแห่งนี้ ชาวบ้านริมคลองแสนแสบและบ่าวไพร่ในเรือนพระยาธรรมานุรักษ์ต่างร่ำลือถึงความน่ากลัวของ "ผีมะลิ" วิญญาณเฮี้ยนที่คอยหลอกหลอนในยามค่ำคืน',
    summaryEn:
      'The abandoned "slave house" left in Phraya Thammanurak\'s estate marks the beginning of the "Phi Mali" haunting — a spirit imprisoned, waiting for the day to reclaim everything and reveal the truth hidden in this house. Villagers and servants alike tremble at the legend of the spirit that haunts the night.',
    summaryZh:
      '帕雅·塔玛努拉克庄园内废弃的"奴隶屋"，是"玛莉幽灵"闹鬼事件的起点——这个被禁锢的灵魂，等待着夺回一切、揭开宅院中隐藏真相的那一天。附近的村民与仆人无不对夜间游荡的幽灵传说感到不寒而栗。',
    trailerUrl: "https://www.youtube.com/embed/Y3JpGKJnXNI",
    image: "/posters/ruean-that-preview.jpg",
    posterImage: "/posters/ruean-that.jpg",
    platforms: [
      { name: "Ch3+", url: "https://ch3plus.com/drama/1531", color: "#E87722" },
    ],
  },
  {
    id: 4,
    titleTh: "ทริอาช",
    titleEn: "Triage The Series",
    type: "series",
    gradient: ["#aecde0", "#7fa9c4"],
    accentColor: colors.blueDeep,
    summaryTh:
      'เรื่องราวของติณห์ แพทย์ประจำบ้านแผนกเวชศาตร์ฉุกเฉินอายุ 29 ปี ที่ต้องเผชิญกับความวุ่นวายของเคสในห้องฉุกเฉินอยู่ทุกวัน หลังจากที่ไม่สามารถช่วยชีวิตนักศึกษาได้ เขาก็พบว่าตนเองติดอยู่ในการย้อนเวลา วนซ้ำในคืนเดิมซ้ำแล้วซ้ำอีก จนกระทั่ง "จินตะ" เทพผู้ส่งสารของพระเจ้าปรากฏตัวพร้อมเงื่อนไขที่จะช่วยให้เขาหลุดพ้น',
    summaryEn:
      'The story of Tinh, a 29-year-old emergency medicine resident. When he fails to save a student\'s life, he finds himself trapped in a time loop — reliving the same night over and over. On the 18th night, a divine messenger named "Jinta" appears with a condition: save a certain patient to break free.',
    summaryZh:
      '讲述了29岁急诊科住院医生廷的故事。当他无法救回一名学生的生命，发现自己陷入了时间循环——一遍又一遍地重复同一个夜晚。第18个夜晚，神圣使者"金达"出现，带来了打破循环的条件：救活某位特定的患者。',
    trailerUrl: "https://www.youtube.com/embed/QeXnXV3FStg",
    image: "/posters/triage-preview.jpg",
    posterImage: "/posters/triage.jpg",
    platforms: [
      {
        name: "AIS Play",
        url: "https://aisplay.ais.co.th/portal/get_section/624ec4b9e0cbb729d7fa2af6/",
        color: "#CC0000",
      },
    ],
  },
  {
    id: 5,
    titleTh: "คุณหมีปาฏิหาริย์",
    titleEn: "The Miracle Of Teddy Bear",
    type: "series",
    gradient: ["#f4b8c8", "#fce4ea"],
    accentColor: colors.pinkDeep,
    summaryTh:
      "'เต้าหู้' ตุ๊กตาหมีขาวนวลตัวใหญ่ เป็นที่พักพิงใจให้ 'ณัฐ' มาหลายปี จู่ ๆ ปาฏิหาริย์ก็ทำให้เต้าหู้กลายร่างเป็นหนุ่มน้อย แต่ร่างใหม่กลับไร้ซึ่งความจำที่เคยมี เต้าหู้จึงต้องสืบเสาะค้นหาความเป็นมาของตัวเอง และเรื่องราวยิ่งซับซ้อนเมื่อเขาพบว่าที่มาของตนนั้นเกี่ยวข้องกับอดีตอันมืดมนและความลับของครอบครัวผู้เป็นเจ้าของ",
    summaryEn:
      "Tofu, a big white teddy bear, has been a shelter for Nat for many years. A miracle suddenly turns Tofu into a young man — but the new body has no memory. Tofu must search for his own history, discovering his origins involve a dark past and the deep secrets of his owner's family.",
    summaryZh:
      '"豆腐"这只大白泰迪熊，多年来一直是娜特心灵的港湾。奇迹突然将豆腐变成了一个年轻人——但新的身体没有任何记忆。豆腐必须寻找自己的来历，却发现自己的起源与主人家庭黑暗的过去和深藏的秘密密切相关。',
    trailerUrl: "https://www.youtube.com/embed/hLohjSSV-Xk",
    image: "/posters/khun-mee-preview.jpg",
    posterImage: "/posters/khun-mee.jpg",
    platforms: [
      { name: "Ch3+", url: "https://ch3plus.com/drama/1299", color: "#E87722" },
    ],
  },
  {
    id: 6,
    titleTh: "บุพเพร้อยร้าย",
    titleEn: "A Cunning Destiny",
    type: "series",
    gradient: ["#fce4ea", "#f4b8c8"],
    accentColor: colors.accent,
    summaryTh:
      "มุกมณี รอง บก.สาวแห่งสำนักข่าว Women on the Top เคยชินกับชีวิตที่เธอควบคุมทุกอย่างได้มาตลอด 27 ปี แต่แล้วชีวิตที่เป็นระบบระเบียบของเธอก็ถึงคราวสั่นคลอน เมื่อเธอได้พบกับ ชินกฤต ทนายหนุ่มหน้าตาคมเข้ม ผู้มาพร้อมฝีปากคมกริบ จนกระทั่งอุบัติเหตุบางอย่างทำให้เขาและเธอตื่นขึ้นมาบนเตียงเดียวกันในสภาพเปลือยเปล่าอย่างไม่รู้ต้นสายปลายเหตุ",
    summaryEn:
      "Mook Manee, deputy editor of Women on the Top, has controlled her perfectly ordered life for 27 years. That order is shattered when she meets Chinnakrit — a sharp-tongued young lawyer — at a wedding. A mysterious accident leaves them both waking up naked in the same bed with no memory of why.",
    summaryZh:
      '"Women on the Top"杂志副主编穆克玛尼，27年来将自己的生活安排得井井有条。然而当她在婚礼上遇见伶牙俐齿的年轻律师新纳克里特，这一切被彻底打乱。一次神秘意外，让两人在不明原因的情况下裸身同醒于同一张床上。',
    trailerUrl: "https://www.youtube.com/embed/uSr6o6_I2IY",
    image: "/posters/bupphe-preview.jpg",
    posterImage: "/posters/bupphe.jpg",
    platforms: [
      { name: "Ch3+", url: "https://ch3plus.com/drama/1317", color: "#E87722" },
    ],
  },
  {
    id: 7,
    titleTh: "สูตรรักนักการโรงแรม",
    titleEn: "Hotel Stars The Series",
    type: "series",
    gradient: ["#f5ead8", "#fdf6ec"],
    accentColor: "#c4a882",
    summaryTh:
      "โครงการฝึกงาน Hotel Stars ปีที่ 3 กำลังจะเริ่มต้นขึ้น โรงแรม LP Paradise ได้เฟ้นหานักศึกษาจากทั่วประเทศ 10 คนเข้ามาฝึกงานในสามแผนก ทั้งงานแม่บ้าน งานครัว และงานต้อนรับ พบกับมิตรภาพ การแข่งขัน และการแย่งชิงแบบไม่มีใครยอมใครของพวกเขา",
    summaryEn:
      "The 3rd year Hotel Stars internship program is about to begin. LP Paradise Hotel selects 10 students from across the country for three departments: housekeeping, kitchen, and reception. Watch friendship, fierce competition, and rivalry unfold as they fight for the top 2 spots and a trip abroad.",
    summaryZh:
      "第三届Hotel Stars实习计划即将开始。LP Paradise酒店从全国各地精选10名学生，分配至客房、厨房与前台三个部门。见证友情、激烈竞争与你追我赶的较量，他们争夺前两名名额与出国交流的机会。",
    trailerUrl: "https://www.youtube.com/embed/PjEtlSgL_Dk",
    image: "/posters/hotel-stars-preview.jpg",
    posterImage: "/posters/hotel-stars.jpg",
    platforms: [
      { name: "Ch3+", url: "https://ch3plus.com/drama/858", color: "#E87722" },
    ],
  },
  {
    id: 8,
    titleTh: "เดือนเกี้ยวเดือน",
    titleEn: "2 Moons 2 The Series",
    type: "series",
    gradient: ["#dceaf4", "#aecde0"],
    accentColor: colors.blue,
    summaryTh:
      'เรื่องราวความรักของเหล่าเดือนมหาวิทยาลัยและแก๊งหมอเถื่อนกับความรักสามแบบสามสไตล์ เรื่องราวของ "วาโย" และ "มิ่ง" สองเพื่อนซี้สมัยมัธยมต้องเข้าประกวดเดือนมหา\'ลัย และทำให้ต้องใกล้ชิดกับแก๊งหมอเถื่อนมากขึ้น ใครกันจะได้ใจใคร ร่วมลุ้นไปด้วยกัน',
    summaryEn:
      "2Moons2 — the love story of university moon candidates and the secret doctor gang, told in three love stories and three styles. Wayo and Ming, two high-school best friends, are selected as their faculty's moon candidates, pulling them closer to the upperclassmen who will change their lives.",
    summaryZh:
      "2Moons2——大学校花候选人与秘密医生团之间的爱情故事，三段爱情，三种风格。瓦约与明，两位高中时期的死党，被选为各自学院的校花候选人，由此与将要改变他们人生的学长们越走越近。",
    trailerUrl: "https://www.youtube.com/embed/yhl5W32cino",
    image: "/posters/2moons2-preview.jpg",
    posterImage: "/posters/2moons2.jpg",
    platforms: [
      {
        name: "Ch3+",
        url: "https://ch3plus.com/original/832",
        color: "#E87722",
      },
      {
        name: "YouTube",
        url: "https://www.youtube.com/playlist?list=PLMkILUgZPUDO_UtSmAAYLD3QT513ovsgd",
        color: "#FF0000",
      },
      {
        name: "YouTube (ENG SUB)",
        url: "https://www.youtube.com/playlist?list=PLy5w5Zsc63sIrSy_olA2SMIWDmmrAG2EA",
        color: "#FF0000",
      },
    ],
  },
  {
    id: 9,
    titleTh: "ส้มป่อย",
    titleEn: "Get Him Girl!",
    type: "movie",
    gradient: ["#fce4ea", "#f5ead8"],
    accentColor: colors.pinkDeep,
    summaryTh:
      '"ส้มป่อย" สาวลำพูน สาวโสดขาแรง สายฮา ที่ไม่อยากติดแหง็กใช้ชีวิตที่เหลืออยู่ในบ้านเกิด การได้แฟนดีๆ ไปใช้ชีวิตคูล ๆ อยู่กรุงเทพฯ ถือเป็นลาภอันประเสริฐ แล้วฟ้าก็ประทาน "แวน" ยูทูปเบอร์สายท่องเที่ยวมาให้ ส้มป่อยจึงโร่ปรึกษา "แซ้ป" เจ้าเข้าทรงสายแว้นท์เพื่อหากลเม็ดมัดใจ โดยที่ส้มป่อยไม่รู้เลยว่าแซ้ปแอบชอบเธออยู่',
    summaryEn:
      '"Som Poi", a funny and strong-willed single girl from Lamphun, dreams of escaping to Bangkok with a good boyfriend. When a travel YouTuber named "Van" appears, she consults "Sap" — a street spirit medium — for love advice. She doesn\'t know that Sap has secretly had a crush on her all along.',
    summaryZh:
      '"颂珀依"是来自南奔府的风趣爽朗单身女孩，渴望找个好男友去曼谷闯荡。当旅游YouTuber"万"出现，她向街头灵媒"萨普"寻求爱情秘诀。她不知道的是，萨普早已暗恋她许久。',
    trailerUrl: "https://www.youtube.com/embed/_Amb08XpAvA",
    image: "/posters/som-poi-preview.jpg",
    posterImage: "/posters/som-poi.jpg",
    platforms: [
      {
        name: "Netflix",
        url: "https://www.netflix.com/th/title/81511310",
        color: "#E50914",
      },
    ],
  },
];

function pad(n) {
  return String(n).padStart(2, "0");
}

const PLATFORM_CONFIG = {
  Netflix: { label: "Netflix", bg: "#E50914" },
  "Ch3+": { label: "Ch3+", bg: "#000000" },
  "AIS Play": { label: "AIS Play", bg: "#000000" },
  YouTube: { label: "YouTube", bg: "#FF0000" },
  "YouTube (ENG SUB)": { label: "YT ENG", bg: "#FF0000" },
};

const IMAGE_PLATFORMS = new Set(["Ch3+", "AIS Play"]);

function getPlatformIcon(name, size = 22) {
  if (name === "Netflix") return <SiNetflix size={size} />;
  if (name === "YouTube (ENG SUB)")
    return (
      <>
        <SiYoutube size={size} />
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: "0.38rem",
            letterSpacing: "0.08em",
            opacity: 0.9,
            lineHeight: 1,
            marginTop: "2px",
          }}
        >
          ENG
        </span>
      </>
    );
  if (name.startsWith("YouTube")) return <SiYoutube size={size} />;
  if (name === "Ch3+")
    return (
      <img
        src="/platforms/ch3plus.png"
        alt="Ch3+"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "inherit",
        }}
      />
    );
  if (name === "AIS Play")
    return (
      <img
        src="/platforms/ais-play.png"
        alt="AIS Play"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "inherit",
        }}
      />
    );
  return (
    <span
      style={{ fontFamily: fonts.mono, fontSize: "0.7rem", fontWeight: 700 }}
    >
      {name}
    </span>
  );
}

function PlatformBadge({ p }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      style={{
        display: "inline-block",
        padding: "0.35rem 0.85rem",
        borderRadius: "2px",
        background: p.color,
        color: "#fff",
        fontFamily: fonts.mono,
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.1em",
        textDecoration: "none",
        whiteSpace: "nowrap",
        transition: "opacity 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {p.name}
    </a>
  );
}

function ShowCard({ show, index, onClick, t, lang }) {
  const [hovered, setHovered] = useState(false);
  const typeLabel = show.type === "movie" ? t.typeMovie : t.typeSeries;
  const primaryTitle = lang === "th" ? show.titleTh : show.titleEn;
  const secondaryTitle = lang === "th" ? show.titleEn : show.titleTh;
  const secondaryIsThai = lang !== "th";

  return (
    <div
      onClick={() => onClick(show)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="show-card-tj"
      style={{
        position: "relative",
        background: colors.cream,
        border: `1px solid ${colors.ink}`,
        cursor: "pointer",
        overflow: "hidden",
        transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: hovered
          ? `8px 8px 0 ${colors.ink}`
          : "4px 4px 0 transparent",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* accent bar */}
      <div
        style={{
          height: "5px",
          background: show.accentColor,
          transform: hovered ? "scaleX(1)" : "scaleX(0.3)",
          transformOrigin: "left",
          transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      />

      {/* poster area */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: `linear-gradient(135deg, ${show.gradient[0]}, ${show.gradient[1]})`,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {show.image ? (
          <img
            src={show.image}
            alt={show.titleTh}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: fonts.display,
                fontSize: "4.5rem",
                fontStyle: "italic",
                color: "rgba(61,44,46,0.15)",
                userSelect: "none",
                lineHeight: 1,
              }}
            >
              {pad(index + 1)}
            </span>
          </div>
        )}

        {/* type badge */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            background:
              show.type === "movie" ? colors.ink : "rgba(61,44,46,0.75)",
            color: colors.cream,
            fontFamily: fonts.mono,
            fontSize: "0.62rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "0.2rem 0.55rem",
            borderRadius: "2px",
            backdropFilter: "blur(4px)",
          }}
        >
          {typeLabel}
        </div>

        {/* hover overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `${show.accentColor}cc`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: "0.78rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: colors.ink,
              fontWeight: 600,
            }}
          >
            {t.viewDetail}
          </span>
        </div>
      </div>

      {/* card body */}
      <div
        style={{
          padding: "1.25rem 1.25rem 1.5rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            color: colors.accent,
          }}
        >
          {pad(index + 1)}
        </div>
        <h3
          style={{
            fontFamily: secondaryIsThai ? fonts.body : fonts.display,
            fontSize: "1.35rem",
            fontWeight: 700,
            lineHeight: 1.15,
            color: colors.ink,
          }}
        >
          {primaryTitle}
        </h3>
        <p
          style={{
            fontFamily: secondaryIsThai ? fonts.body : fonts.display,
            fontSize: "0.92rem",
            fontStyle: secondaryIsThai ? "normal" : "italic",
            color: colors.ink,
            lineHeight: 1.3,
          }}
        >
          {secondaryTitle}
        </p>

        {/* platforms */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "0.75rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {show.platforms.map((p, i) => (
            <a
              key={i}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={p.name}
              className="platform-tile"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1px",
                width: "48px",
                height: "48px",
                background: PLATFORM_CONFIG[p.name]?.bg ?? p.color,
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {getPlatformIcon(p.name, 24)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShowModal({ show, onClose, t, lang }) {
  const primaryTitle = lang === "th" ? show.titleTh : show.titleEn;
  const secondaryTitle = lang === "th" ? show.titleEn : show.titleTh;
  const secondaryIsThai = lang !== "th";
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(61,44,46,0.72)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: colors.cream,
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "4px",
          position: "relative",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* modal header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
            padding: "1.5rem 1.75rem",
            borderBottom: `1px solid ${colors.creamDark}`,
            position: "sticky",
            top: 0,
            background: colors.cream,
            zIndex: 10,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: colors.accent,
                marginBottom: "0.4rem",
              }}
            >
              {show.type === "movie" ? t.typeMovie : t.typeSeries} ·{" "}
              {t.modalCategory}
            </div>
            <h2
              style={{
                fontFamily: secondaryIsThai ? fonts.body : fonts.display,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                color: colors.ink,
                lineHeight: 1.1,
                marginBottom: "0.3rem",
              }}
            >
              {primaryTitle}
            </h2>
            <p
              style={{
                fontFamily: secondaryIsThai ? fonts.body : fonts.display,
                fontSize: "1rem",
                fontStyle: secondaryIsThai ? "normal" : "italic",
                color: colors.inkSoft,
              }}
            >
              {secondaryTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิด"
            style={{
              flexShrink: 0,
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: `1px solid ${colors.creamDark}`,
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              color: colors.inkSoft,
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.ink;
              e.currentTarget.style.color = colors.cream;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = colors.inkSoft;
            }}
          >
            ×
          </button>
        </div>

        {/* modal body */}
        <div className="modal-body-tj" style={{ display: "flex", gap: 0 }}>
          {/* left col: poster + platforms */}
          <div
            className="modal-left-tj"
            style={{
              width: "220px",
              flexShrink: 0,
              borderRight: `1px solid ${colors.creamDark}`,
              padding: "1.75rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {/* poster */}
            <div
              style={{
                width: "100%",
                aspectRatio: "2/3",
                background: `linear-gradient(160deg, ${show.gradient[0]}, ${show.gradient[1]})`,
                borderRadius: "4px",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              }}
            >
              {show.posterImage || show.image ? (
                <img
                  src={show.posterImage || show.image}
                  alt={show.titleTh}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: fonts.display,
                      fontSize: "3rem",
                      fontStyle: "italic",
                      color: "rgba(61,44,46,0.25)",
                      lineHeight: 1,
                    }}
                  >
                    {String(show.id).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: "0.55rem",
                      letterSpacing: "0.2em",
                      color: "rgba(61,44,46,0.35)",
                      textTransform: "uppercase",
                    }}
                  >
                    {t.posterAlt}
                  </span>
                </div>
              )}
              {/* color bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: show.accentColor,
                }}
              />
            </div>

            {/* platform links */}
            <div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: colors.inkSoft,
                  marginBottom: "0.75rem",
                }}
              >
                {t.watchOn}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {show.platforms.map((p, i) => (
                  <a
                    key={i}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={p.name}
                    className="platform-tile"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "1px",
                      width: "64px",
                      height: "64px",
                      background: PLATFORM_CONFIG[p.name]?.bg ?? p.color,
                      color: "#fff",
                      borderRadius: "10px",
                      textDecoration: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {getPlatformIcon(p.name, 28)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* right col: trailer + summary */}
          <div
            className="modal-right-tj"
            style={{
              flex: 1,
              minWidth: 0,
              padding: "1.75rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* trailer */}
            <div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: colors.accent,
                  marginBottom: "0.75rem",
                }}
              >
                {t.trailerLabel}
              </div>
              {show.trailerUrl ? (
                <div
                  style={{
                    position: "relative",
                    paddingTop: "56.25%",
                    borderRadius: "4px",
                    overflow: "hidden",
                    background: "#000",
                  }}
                >
                  <iframe
                    src={show.trailerUrl}
                    title={`${show.titleEn} trailer`}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  style={{
                    aspectRatio: "16/9",
                    background: `linear-gradient(135deg, ${show.gradient[0]}55, ${show.gradient[1]}55)`,
                    border: `1px dashed ${show.accentColor}`,
                    borderRadius: "4px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      border: `2px solid ${show.accentColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1rem",
                        marginLeft: "3px",
                        color: show.accentColor,
                      }}
                    >
                      ▶
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      color: colors.inkSoft,
                      textTransform: "uppercase",
                    }}
                  >
                    {t.noTrailer}
                  </span>
                </div>
              )}
            </div>

            {lang === "th" ? (
              <>
                {/* TH: แสดง summaryTh + summaryEn */}
                <div>
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: "0.62rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: colors.accent,
                      marginBottom: "0.6rem",
                    }}
                  >
                    {t.summaryLabel}
                  </div>
                  <p
                    style={{
                      fontFamily: fonts.body,
                      fontSize: "0.95rem",
                      lineHeight: 1.85,
                      color: colors.ink,
                    }}
                  >
                    {show.summaryTh}
                  </p>
                </div>
                <div
                  style={{
                    paddingTop: "0.25rem",
                    borderTop: `1px solid ${colors.creamDark}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: "0.62rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: colors.inkSoft,
                      marginBottom: "0.6rem",
                      marginTop: "1rem",
                    }}
                  >
                    {t.synopsisLabel}
                  </div>
                  <p
                    style={{
                      fontFamily: fonts.body,
                      fontSize: "0.92rem",
                      lineHeight: 1.8,
                      color: colors.inkSoft,
                      fontStyle: "italic",
                    }}
                  >
                    {show.summaryEn}
                  </p>
                </div>
              </>
            ) : (
              <div>
                <div
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: "0.62rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: colors.accent,
                    marginBottom: "0.6rem",
                  }}
                >
                  {t.synopsisLabel}
                </div>
                <p
                  style={{
                    fontFamily: fonts.body,
                    fontSize: "0.95rem",
                    lineHeight: 1.85,
                    color: colors.ink,
                  }}
                >
                  {lang === "zh" ? show.summaryZh : show.summaryEn}11
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PerformancePage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = translations[lang].performance;
  const [selectedShow, setSelectedShow] = useState(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClose = useCallback(() => setSelectedShow(null), []);

  function goBack() {
    navigate("/", { state: { scrollTo: "selected-works" } });
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${colors.cream}; }

        .perf-grid-tj {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }
        .modal-body-tj {
          display: flex;
        }
        .modal-left-tj {
          width: 220px !important;
        }

        @media (max-width: 1024px) {
          .perf-grid-tj { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .perf-grid-tj { grid-template-columns: 1fr !important; }
          .perf-hero-tj { padding: 6rem 1.5rem 3rem !important; }
          .perf-body-tj { padding: 3rem 1.5rem !important; }
          .modal-body-tj { flex-direction: column !important; }
          .modal-left-tj {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid ${colors.creamDark} !important;
          }
          .modal-left-tj > div:first-child {
            max-width: 200px;
            margin: 0 auto;
          }
          .modal-right-tj { padding: 1.5rem !important; }
        }

        .back-btn-perf:hover { color: ${colors.ink} !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${colors.creamDark}; border-radius: 3px; }

        @keyframes platform-pop {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.22) rotate(-4deg); }
          50%  { transform: scale(1.15) rotate(3deg); }
          70%  { transform: scale(1.18) rotate(-2deg); }
          85%  { transform: scale(1.12) rotate(1deg); }
          100% { transform: scale(1.12) rotate(0deg); }
        }
        @keyframes platform-pop-out {
          0%   { transform: scale(1.12); }
          40%  { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .platform-tile { animation: platform-pop-out 0.25s ease forwards; }
        .platform-tile:hover { animation: platform-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>

      <CursorSparkle />

      {/* nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.5rem 3rem",
          background: `${colors.cream}ee`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${colors.creamDark}`,
        }}
      >
        <button
          onClick={goBack}
          className="back-btn-perf"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: fonts.mono,
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colors.inkSoft,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "color 0.2s",
          }}
        >
          {t.backNav}
        </button>
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: "1.1rem",
            letterSpacing: "0.15em",
            color: colors.ink,
          }}
        >
          Tee · Jaruji
        </span>
      </nav>

      {/* hero */}
      <div
        className="perf-hero-tj"
        style={{
          padding: "10rem 4rem 5rem",
          background: `linear-gradient(135deg, ${colors.pinkSoft}, ${colors.blueSoft})`,
          backgroundImage: `linear-gradient(135deg, rgba(252,228,234,0.75), rgba(220,234,244,0.75)), url(/perf-hero-bg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* watermark */}
        <div
          style={{
            position: "absolute",
            right: "-1rem",
            bottom: "-3rem",
            fontFamily: fonts.display,
            fontSize: "clamp(10rem, 25vw, 20rem)",
            fontStyle: "italic",
            color: colors.blue,
            opacity: 0.12,
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          P
        </div>

        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: "0.85rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: colors.accent,
            marginBottom: "1rem",
          }}
        >
          {t.categoryLabel}
        </div>
        <h1
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
            fontWeight: 500,
            lineHeight: 1.05,
            color: colors.ink,
            maxWidth: "700px",
            marginBottom: "1.5rem",
          }}
        >
          {t.titleMain}{" "}
          <em style={{ fontStyle: "italic", color: colors.accent }}>
            {t.titleItalic}
          </em>
        </h1>
        <p
          style={{
            fontFamily: fonts.display,
            fontSize: "1.1rem",
            fontStyle: "italic",
            color: colors.inkSoft,
            marginBottom: "0.75rem",
          }}
        >
          Performance &amp; Acting
        </p>
        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.75,
            color: colors.inkSoft,
            maxWidth: "560px",
          }}
        >
          {t.subtitle}
        </p>
        <div
          style={{
            width: "60px",
            height: "4px",
            background: colors.blue,
            borderRadius: "2px",
            marginTop: "2.5rem",
          }}
        />
      </div>

      {/* grid */}
      <div
        className="perf-body-tj"
        style={{ padding: "4rem", maxWidth: "1200px", margin: "0 auto" }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: "0.85rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: colors.accent,
            marginBottom: "2rem",
          }}
        >
          {t.allWorks} · {SHOWS.length} {t.itemsUnit}
        </div>

        <div className="perf-grid-tj">
          {SHOWS.map((show, i) => (
            <ShowCard
              key={show.id}
              show={show}
              index={i}
              onClick={setSelectedShow}
              t={t}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* footer */}
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
          borderTop: `1px solid ${colors.creamDark}`,
          marginTop: "2rem",
        }}
      >
        <button
          onClick={goBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: colors.ink,
            color: colors.cream,
            padding: "1rem 2.5rem",
            borderRadius: "2px",
            fontFamily: fonts.mono,
            fontSize: "0.78rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            gap: "0.5rem",
            cursor: "pointer",
            border: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {t.backButton}
        </button>
      </div>

      {/* modal */}
      {selectedShow && (
        <ShowModal
          show={selectedShow}
          onClose={handleClose}
          t={t}
          lang={lang}
        />
      )}
    </>
  );
}
