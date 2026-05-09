import { useState, useLayoutEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { careerTimeline } from '../data/siteData';
import { colors, fonts } from '../styles/theme';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import CursorSparkle from '../components/CursorSparkle';

const TYPE_COLORS = {
  event: colors.pink,
  acting: colors.blue,
  music: colors.creamDark,
};
const TYPE_BG = {
  event: '#fce4ea',
  acting: '#dceaf4',
  music: '#f5ead8',
};

export default function TimelinePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = translations[lang].timeline;
  const tp = translations[lang].profile;

  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);

  const initial = searchParams.get('type') || 'all';
  const [filter, setFilter] = useState(initial);

  const filtered = filter === 'all'
    ? careerTimeline
    : careerTimeline.filter(e => e.type === filter);

  const years = [...new Set(filtered.map(e => e.year))].sort((a, b) => a - b);

  const filters = [
    { key: 'all', label: t.filterAll },
    { key: 'event', label: tp.journeyLegend.event },
    { key: 'acting', label: tp.journeyLegend.acting },
    { key: 'music', label: tp.journeyLegend.music },
  ];

  function goBack() {
    navigate('/', { state: { scrollTo: 'selected-works' } });
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${colors.cream}; }
        .tl-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: ${fonts.mono};
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
        .tl-back-btn:hover { color: ${colors.ink}; }
        .tl-filter-btn {
          font-family: ${fonts.mono};
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.55rem 1.25rem;
          background: none;
          border: 1px solid ${colors.creamDark};
          cursor: pointer;
          transition: all 0.2s;
          color: ${colors.inkSoft};
        }
        .tl-filter-btn:hover { border-color: ${colors.ink}; color: ${colors.ink}; }
        .tl-filter-btn.active {
          background: ${colors.ink};
          border-color: ${colors.ink};
          color: ${colors.cream};
        }
        .tl-card {
          display: flex;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          transition: transform 0.2s;
        }
        .tl-card:hover { transform: translateX(4px); }
        @media (max-width: 768px) {
          .tl-hero { padding: 7rem 1.5rem 3rem !important; }
          .tl-body { padding: 3rem 1.5rem !important; }
          .tl-filter-row { gap: 0.5rem !important; }
          .tl-filter-btn { padding: 0.45rem 0.9rem; font-size: 0.65rem; }
          .tl-line { left: 4.2rem !important; }
          .tl-year { width: 3.2rem !important; font-size: 0.65rem !important; }
          .tl-dot { margin-left: 0.25rem !important; }
          .tl-items { padding-left: 5rem !important; }
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
        <button onClick={goBack} className="tl-back-btn">{t.backNav}</button>
        <span style={{ fontFamily: fonts.display, fontSize: '1.1rem', letterSpacing: '0.15em', color: colors.ink }}>
          Tee · Jaruji
        </span>
      </nav>

      {/* Hero */}
      <div
        className="tl-hero"
        style={{
          padding: '10rem 4rem 5rem',
          background: `linear-gradient(135deg, ${colors.pinkSoft}, ${colors.blueSoft})`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* big watermark */}
        <div style={{
          position: 'absolute',
          right: '-1rem',
          bottom: '-4rem',
          fontFamily: fonts.display,
          fontSize: 'clamp(8rem, 22vw, 20rem)',
          fontStyle: 'italic',
          color: colors.pink,
          opacity: 0.1,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          J
        </div>

        <div style={{
          fontFamily: fonts.mono,
          fontSize: '0.85rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: colors.accent,
          marginBottom: '1rem',
        }}>
          01 / Journey
        </div>
        <h1 style={{
          fontFamily: fonts.display,
          fontSize: 'clamp(2.5rem, 5vw, 5rem)',
          fontWeight: 500,
          lineHeight: 1.0,
          color: colors.ink,
          maxWidth: '700px',
          marginBottom: '1rem',
        }}>
          {t.heading} <span style={{ fontStyle: 'italic', color: colors.accent }}>{t.headingItalic}</span>
        </h1>
        <p style={{
          fontFamily: fonts.display,
          fontSize: '1.05rem',
          fontStyle: 'italic',
          color: colors.inkSoft,
          marginBottom: '2.5rem',
        }}>
          {t.sub}
        </p>

        {/* Filter buttons */}
        <div className="tl-filter-row" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button
              key={f.key}
              className={`tl-filter-btn${filter === f.key ? ' active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.key !== 'all' && (
                <span style={{
                  display: 'inline-block',
                  width: '7px', height: '7px',
                  borderRadius: '50%',
                  background: filter === f.key ? colors.cream : TYPE_COLORS[f.key],
                  marginRight: '0.5rem',
                  verticalAlign: 'middle',
                }} />
              )}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline body */}
      <div className="tl-body" style={{ padding: '5rem 4rem', maxWidth: '860px', margin: '0 auto' }}>
        {years.length === 0 ? (
          <p style={{ color: colors.inkSoft, fontFamily: fonts.mono, fontSize: '0.85rem' }}>—</p>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div className="tl-line" style={{
              position: 'absolute',
              left: '5.2rem',
              top: 0, bottom: 0,
              width: '1px',
              background: colors.creamDark,
            }} />

            {years.map((year) => {
              const items = filtered.filter(e => e.year === year);
              return (
                <div key={year} style={{ marginBottom: '3rem' }}>
                  {/* Year row */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div className="tl-year" style={{
                      fontFamily: fonts.mono,
                      fontSize: '0.72rem',
                      letterSpacing: '0.18em',
                      color: colors.accent,
                      width: '4rem',
                      flexShrink: 0,
                    }}>
                      {year}
                    </div>
                    <div className="tl-dot" style={{
                      width: '10px', height: '10px',
                      borderRadius: '50%',
                      background: colors.ink,
                      flexShrink: 0,
                      zIndex: 1,
                      marginLeft: '0.75rem',
                    }} />
                  </div>

                  {/* Cards */}
                  <div className="tl-items" style={{ paddingLeft: '6rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {items.map((item, ii) => (
                      <div
                        key={ii}
                        className="tl-card"
                        style={{
                          background: TYPE_BG[item.type],
                          borderLeft: `3px solid ${TYPE_COLORS[item.type]}`,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: fonts.mono,
                            fontSize: '0.62rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: TYPE_COLORS[item.type],
                            marginBottom: '0.35rem',
                            filter: 'brightness(0.72)',
                          }}>
                            {tp.journeyLegend[item.type]}
                          </div>
                          <div style={{
                            fontFamily: fonts.display,
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            color: colors.ink,
                            marginBottom: '0.25rem',
                          }}>
                            {item.title}
                          </div>
                          <div style={{
                            fontSize: '0.88rem',
                            lineHeight: 1.55,
                            color: colors.inkSoft,
                          }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '4rem',
        textAlign: 'center',
        borderTop: `1px solid ${colors.creamDark}`,
      }}>
        <button
          onClick={goBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: colors.ink,
            color: colors.cream,
            padding: '1rem 2.5rem',
            border: 'none',
            fontFamily: fonts.mono,
            fontSize: '0.78rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {t.backNav}
        </button>
      </div>
    </>
  );
}
