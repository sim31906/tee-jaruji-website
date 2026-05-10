import { colors, fonts } from '../styles/theme';
import { fanGradients } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import SectionHeader from './SectionHeader';
import { useGoogleDrivePhotos } from '../hooks/useGoogleDrivePhotos';

export default function Supporters() {
  const { lang } = useLang();
  const t = translations[lang].supporters;
  const { photos } = useGoogleDrivePhotos();

  return (
    <>
      <style>{`
        @keyframes fan-scroll-down {
          0%   { transform: translate3d(0, -50%, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes fan-scroll-up {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(0, -50%, 0); }
        }
        .fan-col-inner {
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        @media (max-width: 968px) {
          .fan-stats-tj { grid-template-columns: 1fr !important; }
          .stat-tj {
            border-right: none !important;
            border-bottom: 1px solid ${colors.ink} !important;
          }
          .stat-tj:last-child { border-bottom: none !important; }
          .fan-gallery-tj { grid-template-columns: repeat(2, 1fr) !important; height: 520px !important; }
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
          const speeds = [16, 22, 14, 20];

          /* split into 4 columns — use real photos if loaded, else gradients */
          let cols;
          const usePhotos = photos.length > 0;

          if (usePhotos) {
            /* repeat photos to fill all 4 columns */
            const pool = [...photos, ...photos, ...photos, ...photos].slice(0, Math.max(photos.length * 2, 8));
            const perCol = Math.ceil(pool.length / 4);
            cols = [0, 1, 2, 3].map(ci =>
              pool.slice(ci * perCol, ci * perCol + perCol)
            );
          } else {
            cols = [
              fanGradients.slice(0, 3),
              fanGradients.slice(3, 6),
              fanGradients.slice(6, 9),
              fanGradients.slice(9, 12),
            ];
          }

          return (
            <div className="fan-gallery-tj" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              height: '650px',
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
                      {[...col, ...col].map((item, i) => (
                        <div
                          key={i}
                          style={{
                            flexShrink: 0,
                            aspectRatio: '1',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            background: usePhotos
                              ? colors.creamDark
                              : `linear-gradient(135deg, ${item[0]}, ${item[1]})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem',
                            color: 'rgba(255,255,255,0.8)',
                          }}
                        >
                          {usePhotos ? (
                            <img
                              src={item.src}
                              alt={item.alt}
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : '♡'}
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
