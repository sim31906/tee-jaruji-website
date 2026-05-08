import { colors, fonts } from '../styles/theme';
import { googleCalendarUrl } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import SectionHeader from './SectionHeader';

export default function Schedule() {
  const { lang } = useLang();
  const t = translations[lang].schedule;

  return (
    <>
      <style>{`
        @media (max-width: 968px) {
          .schedule-section-tj { padding: 5rem 1.5rem !important; }
        }
      `}</style>

      <section
        id="schedule"
        className="schedule-section-tj"
        style={{
          padding: '8rem 3rem',
          background: colors.blueSoft,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <SectionHeader num={t.sectionNum} title={t.sectionTitle} italic={t.sectionItalic} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          {t.events.map((e, i) => (
            <div key={i} style={{
              background: colors.cream,
              borderLeft: `4px solid ${colors.accent}`,
              padding: '1.5rem',
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',
            }}>
              <div style={{
                textAlign: 'center',
                borderRight: `1px solid ${colors.creamDark}`,
                paddingRight: '1.5rem',
                flexShrink: 0,
              }}>
                <div style={{ fontFamily: fonts.display, fontSize: '2.5rem', fontWeight: 500, lineHeight: 1 }}>
                  {e.day}
                </div>
                <div style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: colors.accent,
                  marginTop: '0.25rem',
                }}>
                  {e.month}
                </div>
              </div>
              <div>
                <h4 style={{ fontFamily: fonts.display, fontSize: '1.3rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                  {e.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: colors.inkSoft }}>{e.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: colors.cream,
          border: `1px solid ${colors.ink}`,
          padding: '1rem',
          boxShadow: `12px 12px 0 ${colors.pink}`,
        }}>
          <iframe
            src={googleCalendarUrl}
            style={{ width: '100%', height: '600px', border: 'none', display: 'block' }}
            loading="lazy"
            title="Tee Jaruji Calendar"
          />
        </div>
      </section>
    </>
  );
}
