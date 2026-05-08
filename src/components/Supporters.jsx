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
        @keyframes fan-scroll-down {
          0%   { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @keyframes fan-scroll-up {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .fan-col-inner { will-change: transform; }
        @media (max-width: 968px) {
          .fan-stats-tj { grid-template-columns: 1fr !important; }
          .stat-tj {
            border-right: none !important;
            border-bottom: 1px solid ${colors.ink} !important;
          }
          .stat-tj:last-child { border-bottom: none !important; }
          .fan-gallery-tj { grid-template-columns: repeat(2, 1fr) !important; height: 320px !important; }
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

        {(() => {
          const cols = [
            fanGradients.slice(0, 3),
            fanGradients.slice(3, 6),
            fanGradients.slice(6, 9),
            fanGradients.slice(9, 12),
          ];
          const speeds = [16, 22, 14, 20];
          return (
            <div className="fan-gallery-tj" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              height: '700px',
              overflow: 'hidden',
              marginBottom: '3rem',
              borderRadius: '12px',
            }}>
              {cols.map((col, ci) => {
                const goDown = ci % 2 === 0;
                return (
                  <div key={ci} style={{ overflow: 'hidden', height: '100%' }}>
                    <div
                      className="fan-col-inner"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        animation: `${goDown ? 'fan-scroll-down' : 'fan-scroll-up'} ${speeds[ci]}s linear infinite`,
                      }}
                    >
                      {[...col, ...col].map((grad, i) => (
                        <div
                          key={i}
                          style={{
                            flexShrink: 0,
                            aspectRatio: '1',
                            background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem',
                            color: 'rgba(255,255,255,0.8)',
                          }}
                        >
                          ♡
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

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
                fontSize: '0.8rem',
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
