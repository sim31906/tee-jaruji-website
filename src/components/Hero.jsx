import { colors, fonts } from '../styles/theme';
import { hero } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function Hero() {
  const { lang } = useLang();
  const t = translations[lang].hero;

  const taglineParts = t.tagline.includes(' ')
    ? t.tagline.split(' ')
    : t.tagline.split('·');

  return (
    <>
      <style>{`
        .hero-cta-tj {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1.1rem 2.6rem;
          background: ${colors.pink};
          color: ${colors.ink};
          font-family: ${fonts.mono};
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 100px;
          transition: background 0.3s;
          white-space: nowrap;
        }
        .hero-cta-tj:hover { background: ${colors.cream}; }

        @keyframes hIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ha1 { animation: hIn .65s ease both .05s; }
        .ha2 { animation: hIn .65s ease both .22s; }
        .ha3 { animation: hIn .65s ease both .44s; }
        .ha4 { animation: hIn .65s ease both .62s; }
        .ha5 { animation: hIn .65s ease both .82s; }

        @media (max-width: 768px) {
          /* text บนซ้าย — ใต้ nav bar */
          .hero-text-col {
            padding: 5.5rem 1.2rem 3rem !important;
            max-width: 50% !important;
            justify-content: flex-start !important;
          }
          .hero-h1 { font-size: clamp(2.5rem, 9vw, 4rem) !important; }
          .hero-wm {
            font-size: clamp(2rem, 10vw, 4rem) !important;
            top: 28vh !important;
            left: 0.5rem !important;
          }
          /* รูป — ขนาด natural ratio ขวา, ไม่ override z-index → ใช้ z4 (front) จาก inline */
          .hero-photo-front {
            height: 90% !important;
            width: auto !important;
            top: 0 !important;
            right: 0 !important;
            left: auto !important;
            bottom: auto !important;
            object-fit: unset !important;
          }
          .hero-desc-p { display: none !important; }
          /* ปุ่มเล็กลง */
          .hero-cta-tj {
            padding: 0.7rem 1.6rem !important;
            font-size: 0.65rem !important;
          }
        }
      `}</style>

      <section
        id="home"
        style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: colors.ink }}
      >

        {/* ── z0: dark background ── */}
        {/* (section background = colors.ink) */}

        {/* ── z1: watermark — sits BEHIND the person photo ── */}
        <div
          className="hero-wm"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '36vh',
            left: '2.8rem',
            zIndex: 1,
            fontSize: 'clamp(8rem, 16vw, 18rem)',
            fontFamily: fonts.display,
            fontWeight: 700,
            color: `${colors.pink}42`,
            lineHeight: 0.82,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            letterSpacing: '-0.02em',
            userSelect: 'none',
          }}
        >
          TEE<br />JARUJI
        </div>

        {/* ── z2: left gradient — readable dark area for text ── */}
        <div className="hero-grad" style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: `linear-gradient(to right,
            rgba(12,8,18,0.90) 0%,
            rgba(12,8,18,0.75) 22%,
            rgba(12,8,18,0.35) 44%,
            rgba(12,8,18,0.08) 62%,
            transparent 76%
          )`,
        }} />

        {/* ── z3: text content ── */}
        <div
          className="hero-text-col"
          style={{
            position: 'relative', zIndex: 3,
            minHeight: '100vh',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '8rem 3.5rem 6rem',
            maxWidth: '48%',
          }}
        >
          {/* small name — two lines */}
          <div className="ha1" style={{ marginBottom: '0.4rem' }}>
            {taglineParts.map((p, i) => (
              <div key={i} style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.2,
              }}>{p}</div>
            ))}
          </div>

          {/* big name */}
          <h1
            className="hero-h1 ha2"
            style={{
              fontFamily: fonts.display,
              fontSize: 'clamp(6.5rem, 12vw, 14rem)',
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: '-0.025em',
              color: '#fff',
              margin: '0.3rem 0 2.25rem 0',
            }}
          >
            {hero.name}<br />
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: colors.pink }}>
              {hero.surname}
            </span>
          </h1>

          {/* CTA */}
          <div className="ha3">
            <a href="#profile" className="hero-cta-tj">
              <span style={{ fontSize: '0.85rem' }}>✦</span>
              {t.ctaButton}
            </a>
          </div>

          {/* description — ซ้าย ใต้ปุ่ม */}
          <p className="ha4 hero-desc-p" style={{
            marginTop: '1.5rem',
            fontSize: '1rem',
            lineHeight: 1.85,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: '380px',
            margin: '1.5rem 0 0 0',
          }}>
            {t.description}
          </p>

          {/* scroll indicator */}
          <div className="ha5" style={{
            marginTop: '1.5rem',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px',
          }}>
            <span style={{ fontFamily: fonts.mono, fontSize: '0.6rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em' }}>0</span>
            {[0,1,2].map(i => (
              <span key={i} style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', lineHeight: 1 }}>›</span>
            ))}
          </div>
        </div>

        {/* ── z4: PHOTO — หน้าสุด, เต็มสัดส่วน ── */}
        {(hero.bgImage || hero.bgVideo) && (
          hero.bgVideo ? (
            <video
              autoPlay muted loop playsInline
              className="hero-photo-front"
              style={{
                position: 'absolute',
                right: 0, top: 0,
                height: '100%',
                width: 'auto',      /* แสดงตามสัดส่วนจริง ไม่ crop */
                zIndex: 4,          /* หน้า text/watermark ทั้งหมด */
                pointerEvents: 'none',
              }}
            >
              <source src={hero.bgVideo} type="video/mp4" />
            </video>
          ) : (
            <img
              src={hero.bgImage}
              alt=""
              className="hero-photo-front"
              style={{
                position: 'absolute',
                right: 0, top: 0,
                height: '100%',
                width: 'auto',      /* แสดงตามสัดส่วนจริง ไม่ crop */
                zIndex: 4,          /* หน้า text/watermark ทั้งหมด */
                pointerEvents: 'none',
              }}
            />
          )
        )}

        {/* ── z5: bottom fade — ทับทุกอย่างรวมถึงรูป ── */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0, height: '12%',
          zIndex: 5,
          background: `linear-gradient(to top, ${colors.ink}, transparent)`,
        }} />

      </section>
    </>
  );
}
