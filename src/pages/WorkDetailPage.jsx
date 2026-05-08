import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect } from 'react';
import { works } from '../data/siteData';
import { colors, fonts } from '../styles/theme';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import CursorSparkle from '../components/CursorSparkle';

export default function WorkDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = translations[lang].workDetail;
  const tp = translations[lang].profile;

  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);

  const workIndex = works.findIndex((w) => w.slug === slug);
  const work = works[workIndex];
  const detail = workIndex >= 0 ? tp.workDetail[workIndex] : null;

  function goBack() {
    navigate('/', { state: { scrollTo: 'selected-works' } });
  }

  if (!work || !detail) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', fontFamily: fonts.body }}>
        <p>ไม่พบข้อมูล</p>
        <button onClick={goBack} style={{ background: 'none', border: 'none', color: colors.accent, cursor: 'pointer' }}>
          {t.backNav}
        </button>
      </div>
    );
  }

  const { color, icon, type } = work;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${colors.cream}; }
        .detail-item-tj {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 1rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid ${colors.creamDark};
          align-items: center;
          transition: background 0.2s, padding 0.2s;
        }
        .detail-item-tj:hover {
          background: ${colors.creamDark};
          padding-left: 0.75rem;
          padding-right: 0.75rem;
          margin: 0 -0.75rem;
          border-radius: 8px;
        }
        .back-btn-tj {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: inherit;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${colors.inkSoft};
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0;
        }
        .back-btn-tj:hover { color: ${colors.ink}; }
        @media (max-width: 768px) {
          .detail-hero-tj { padding: 6rem 1.5rem 3rem !important; }
          .detail-body-tj { padding: 3rem 1.5rem !important; }
          .detail-item-tj { grid-template-columns: 1fr auto !important; }
          .detail-item-tj .item-detail { display: none; }
        }
      `}</style>

      <CursorSparkle />

      {/* Nav */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 3rem',
        background: `${colors.cream}ee`,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${colors.creamDark}`,
      }}>
        <button onClick={goBack} className="back-btn-tj">
          {t.backNav}
        </button>
        <span style={{ fontFamily: fonts.display, fontSize: '1.1rem', letterSpacing: '0.15em', color: colors.ink }}>
          Tee · Jaruji
        </span>
      </nav>

      {/* Hero */}
      <div
        className="detail-hero-tj"
        style={{
          padding: '10rem 4rem 5rem',
          background: `linear-gradient(135deg, ${colors.pinkSoft}, ${colors.blueSoft})`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute',
          right: '-0.5rem',
          bottom: '-3rem',
          fontFamily: fonts.display,
          fontSize: 'clamp(10rem, 25vw, 22rem)',
          fontStyle: 'italic',
          color: color,
          opacity: 0.12,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          {icon}
        </div>

        <div style={{
          fontFamily: fonts.mono,
          fontSize: '0.85rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: colors.accent,
          marginBottom: '1rem',
        }}>
          {type}
        </div>
        <h1 style={{
          fontFamily: fonts.display,
          fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
          fontWeight: 500,
          lineHeight: 1.05,
          color: colors.ink,
          maxWidth: '700px',
          marginBottom: '1.5rem',
        }}>
          {detail.headline}
        </h1>
        <p style={{
          fontFamily: fonts.display,
          fontSize: '1.1rem',
          fontStyle: 'italic',
          color: colors.inkSoft,
          marginBottom: '2rem',
        }}>
          {detail.sub}
        </p>
        <p style={{ fontSize: '1rem', lineHeight: 1.8, color: colors.inkSoft, maxWidth: '600px' }}>
          {detail.body}
        </p>
        <div style={{ width: '60px', height: '4px', background: color, borderRadius: '2px', marginTop: '2.5rem' }} />
      </div>

      {/* Items list */}
      <div className="detail-body-tj" style={{ padding: '4rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          fontFamily: fonts.mono,
          fontSize: '0.85rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: colors.accent,
          marginBottom: '2rem',
        }}>
          {t.allWorks}
        </div>

        {detail.items.map((item, i) => (
          <div key={i} className="detail-item-tj">
            <div style={{ fontFamily: fonts.body, fontSize: '1.05rem', fontWeight: 500, color: colors.ink }}>
              {item.name}
            </div>
            <div className="item-detail" style={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.inkSoft, textAlign: 'right' }}>
              {item.detail}
            </div>
            <div style={{
              fontFamily: fonts.mono,
              fontSize: '0.78rem',
              letterSpacing: '0.15em',
              color: colors.accent,
              textAlign: 'right',
              minWidth: '3rem',
            }}>
              {item.year}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '4rem',
        textAlign: 'center',
        borderTop: `1px solid ${colors.creamDark}`,
        marginTop: '2rem',
      }}>
        <button
          onClick={goBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: colors.ink,
            color: colors.cream,
            padding: '1rem 2.5rem',
            borderRadius: '2px',
            fontFamily: fonts.mono,
            fontSize: '0.78rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            gap: '0.5rem',
            transition: 'opacity 0.2s',
            cursor: 'pointer',
            border: 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {t.backButton}
        </button>
      </div>
    </>
  );
}
