import { colors, fonts } from '../styles/theme';
import { fanGradients } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import SectionHeader from './SectionHeader';

export default function Supporters() {
  const { lang } = useLang();
  const t = translations[lang].supporters;

  return (
    <>
      <style>{`
        .fan-photo-tj {
          transition: all 0.4s ease;
        }
        .fan-photo-tj:hover {
          transform: scale(1.08) translateY(-5px) !important;
          z-index: 5;
          box-shadow: 0 15px 30px rgba(217, 122, 142, 0.3);
        }
        @media (max-width: 968px) {
          .fan-stats-tj { grid-template-columns: 1fr !important; }
          .stat-tj {
            border-right: none !important;
            border-bottom: 1px solid ${colors.ink} !important;
          }
          .stat-tj:last-child { border-bottom: none !important; }
          .fan-gallery-tj { grid-template-columns: repeat(3, 1fr) !important; }
          .supporters-section-tj { padding: 5rem 1.5rem !important; }
        }
      `}</style>

      <section
        id="supporters"
        className="supporters-section-tj"
        style={{
          padding: '8rem 3rem',
          overflow: 'hidden',
          background: colors.cream,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <SectionHeader num={t.sectionNum} title={t.sectionTitle} italic={t.sectionItalic} />

        <p style={{
          maxWidth: '600px',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: colors.inkSoft,
          marginBottom: '3rem',
        }}>
          {t.description}
        </p>

        <div className="fan-gallery-tj" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '0.5rem',
          marginBottom: '3rem',
        }}>
          {fanGradients.map((grad, i) => (
            <div
              key={i}
              className="fan-photo-tj"
              style={{
                aspectRatio: '1',
                background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
                position: 'relative',
                cursor: 'pointer',
                transform: i % 2 === 1 ? 'translateY(15px)' : 'translateY(0)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              ♡
            </div>
          ))}
        </div>

        <div className="fan-stats-tj" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          border: `1px solid ${colors.ink}`,
          marginTop: '4rem',
        }}>
          {t.stats.map((s, i) => (
            <div
              key={i}
              className="stat-tj"
              style={{
                padding: '2.5rem',
                textAlign: 'center',
                borderRight: i < t.stats.length - 1 ? `1px solid ${colors.ink}` : 'none',
                background: i === 1 ? colors.pinkSoft : colors.cream,
              }}
            >
              <div style={{
                fontFamily: fonts.display,
                fontSize: '4rem',
                fontWeight: 500,
                lineHeight: 1,
                color: colors.accent,
              }}>
                {s.num}
              </div>
              <div style={{
                fontFamily: fonts.mono,
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginTop: '0.5rem',
                color: colors.inkSoft,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
