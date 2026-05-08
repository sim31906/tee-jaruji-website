import { Link } from 'react-router-dom';
import { colors, fonts } from '../styles/theme';
import { works } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import SectionHeader from './SectionHeader';
import TiltCard from './TiltCard';
import Reveal from './Reveal';

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
        @media (max-width: 968px) {
          .work-grid-tj { grid-template-columns: 1fr !important; }
          .study-block-tj { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .profile-section-tj { padding: 5rem 1.5rem !important; }
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
        }}>
          {t.educationLabel}
        </h3>

        {t.education.map((s, i) => (
          <div
            key={i}
            className="study-block-tj"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '4rem',
              alignItems: 'start',
              padding: '3rem 0',
              borderTop: `1px solid ${colors.creamDark}`,
            }}
          >
            <div style={{
              fontFamily: fonts.mono,
              fontSize: '0.8rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: colors.accent,
            }}>
              {s.date}
            </div>
            <div>
              <h3 style={{
                fontFamily: fonts.display,
                fontSize: '1.9rem',
                fontWeight: 500,
                marginBottom: '0.5rem',
                lineHeight: 1.1,
              }}>
                {s.degree}
              </h3>
              <div style={{
                fontStyle: 'italic',
                color: colors.inkSoft,
                marginBottom: '1rem',
                fontFamily: fonts.display,
                fontSize: '1.2rem',
              }}>
                {s.school}
              </div>
              <p style={{
                fontSize: '1rem',
                lineHeight: 1.7,
                color: colors.inkSoft,
                maxWidth: '600px',
              }}>
                {s.desc}
              </p>
            </div>
          </div>
        ))}

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
      </section>
    </>
  );
}
