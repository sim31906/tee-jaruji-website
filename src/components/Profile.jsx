import { Link } from 'react-router-dom';
import { colors, fonts } from '../styles/theme';
import { works, education } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import SectionHeader from './SectionHeader';
import TiltCard from './TiltCard';
import Reveal from './Reveal';

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

export default function Profile() {
  const { lang } = useLang();
  const t = translations[lang].profile;

  return (
    <>
      <style>{`
        .work-card-tj:hover {
          box-shadow: 12px 12px 0 ${colors.ink} !important;
        }
        .work-card-tj:hover .work-bar {
          transform: scaleX(1) !important;
        }
        .timeline-cta-tj:hover {
          background: ${colors.ink} !important;
          color: ${colors.cream} !important;
        }
        .timeline-cta-tj:hover * {
          color: ${colors.cream} !important;
        }
        .edu-card-tj {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 2rem 0;
          border-bottom: 1px solid ${colors.creamDark};
          transition: background 0.3s;
        }
        .edu-logo-tj {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: ${fonts.mono};
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #fff;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .edu-logo-tj img { width: 100%; height: 100%; object-fit: cover; }
        @media (max-width: 968px) {
          .work-grid-tj { grid-template-columns: 1fr !important; }
          .profile-section-tj { padding: 5rem 1.5rem !important; }
          .edu-card-tj { gap: 1.25rem; }
          .edu-logo-tj { width: 60px; height: 60px; font-size: 0.65rem; }
        }
      `}</style>

      <section
        id="profile"
        className="profile-section-tj"
        style={{
          padding: '8rem 3rem',
          background: colors.creamDark,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <SectionHeader num={t.sectionNum} title={t.sectionTitle} italic={t.sectionItalic} />

        <h3 style={{
          fontFamily: fonts.mono,
          fontSize: '0.8rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: colors.accent,
          marginBottom: '1.5rem',
        }}>
          {t.educationLabel}
        </h3>

        <div style={{ marginBottom: '2rem' }}>
          {education.map((ed, i) => (
            <Reveal key={i} delay={i * 100}>
            <div className="edu-card-tj">
              {/* Logo */}
              <div
                className="edu-logo-tj"
                style={{ background: ed.logoColor }}
              >
                {ed.logoUrl
                  ? <img src={ed.logoUrl} alt={ed.abbr} />
                  : ed.abbr
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <h3 style={{
                    fontFamily: fonts.display,
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    lineHeight: 1.1,
                    color: colors.ink,
                  }}>
                    {t.education[i].school}
                  </h3>
                  <span style={{
                    fontFamily: fonts.mono,
                    fontSize: '0.75rem',
                    letterSpacing: '0.2em',
                    color: colors.accent,
                    whiteSpace: 'nowrap',
                  }}>
                    {t.education[i].date}
                  </span>
                </div>
                <div style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.78rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: colors.inkSoft,
                  marginTop: '0.4rem',
                }}>
                  {t.education[i].degree}
                </div>
                <div style={{
                  fontStyle: 'italic',
                  fontFamily: fonts.display,
                  fontSize: '1rem',
                  color: colors.accent,
                  marginTop: '0.25rem',
                }}>
                  {t.education[i].location}
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>

        <h3 id="selected-works" style={{
          fontFamily: fonts.mono,
          fontSize: '0.8rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: colors.accent,
          marginTop: '5rem',
          marginBottom: '2rem',
        }}>
          {t.worksLabel}
        </h3>

        <div className="work-grid-tj" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
          }}>
            {works.map((work, i) => (
              <Reveal key={i} delay={i * 120}>
              <TiltCard style={{ height: '100%' }}>
              <Link
                to={`/work/${work.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
              >
              <div
                className="work-card-tj"
                style={{
                  position: 'relative',
                  padding: '2.5rem 2rem',
                  background: colors.cream,
                  border: `1px solid ${colors.ink}`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
              >
                <div
                  className="work-bar"
                  style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '6px',
                    background: work.color,
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.4s',
                  }}
                />
                <div style={{
                  fontFamily: fonts.display,
                  fontSize: '4rem',
                  fontStyle: 'italic',
                  color: colors.accent,
                  marginBottom: '1.5rem',
                  lineHeight: 1,
                }}>
                  {work.icon}
                </div>
                <div style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.8rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  color: colors.inkSoft,
                }}>
                  {work.type}
                </div>
                <h3 style={{
                  fontFamily: fonts.display,
                  fontSize: '1.7rem',
                  fontWeight: 500,
                  marginBottom: '1rem',
                  lineHeight: 1.1,
                  whiteSpace: 'pre-line',
                }}>
                  {t.works[i].title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: colors.inkSoft,
                  marginBottom: '1rem',
                }}>
                  {t.works[i].desc}
                </p>
                <ul style={{ fontSize: '0.85rem' }}>
                  {work.items.map((item, j) => (
                    <li key={j} style={{
                      padding: '0.6rem 0',
                      borderBottom: j < work.items.length - 1 ? `1px dashed ${colors.creamDark}` : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}>
                      <span>{item.name}</span>
                      <span style={{ fontFamily: fonts.mono, fontSize: '0.8rem', color: colors.accent }}>
                        {item.year}
                      </span>
                    </li>
                  ))}
                </ul>

                <div style={{
                  marginTop: '1.5rem',
                  fontFamily: fonts.mono,
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: colors.accent,
                }}>
                  {t.viewAll}
                </div>
              </div>
              </Link>
              </TiltCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
          <Link
            to="/timeline"
            style={{ textDecoration: 'none' }}
          >
            <div
              className="timeline-cta-tj"
              style={{
                marginTop: '2rem',
                border: `1px solid ${colors.ink}`,
                padding: '3rem 2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: colors.cream,
                transition: 'all 0.3s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* watermark year */}
              <div style={{
                position: 'absolute',
                right: '4rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: fonts.display,
                fontSize: 'clamp(5rem, 12vw, 9rem)',
                fontStyle: 'italic',
                color: colors.ink,
                opacity: 0.04,
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
                letterSpacing: '-0.04em',
              }}>
                2554
              </div>

              <div>
                <div style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.72rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: colors.inkSoft,
                  marginBottom: '0.75rem',
                }}>
                  {t.ctaSub}
                </div>
                <div style={{
                  fontFamily: fonts.display,
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                  fontWeight: 500,
                  color: colors.ink,
                  lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                }}>
                  {t.ctaTitle}{' '}
                  <span style={{ fontStyle: 'italic', color: colors.accent }}>
                    {t.ctaYears}
                  </span>
                </div>
              </div>

              <div style={{
                fontFamily: fonts.mono,
                fontSize: '2rem',
                color: colors.ink,
                lineHeight: 1,
                flexShrink: 0,
                marginLeft: '2rem',
              }}>
                →
              </div>
            </div>
          </Link>
          </Reveal>
      </section>
    </>
  );
}
