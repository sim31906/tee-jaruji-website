import { colors, fonts } from '../styles/theme';
import { contacts } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import SectionHeader from './SectionHeader';

export default function Contact() {
  const { lang } = useLang();
  const t = translations[lang].contact;

  return (
    <>
      <style>{`
        .contact-item-tj { transition: background 0.3s; }
        .contact-item-tj:hover { background: ${colors.pinkSoft}; }
        @media (max-width: 968px) {
          .contact-grid-tj { grid-template-columns: 1fr !important; }
          .contact-item-tj {
            border-right: none !important;
            border-bottom: 1px solid ${colors.ink} !important;
          }
          .contact-item-tj:last-child { border-bottom: none !important; }
          .contact-section-tj { padding: 5rem 1.5rem !important; }
        }
      `}</style>

      <section
        id="contact"
        className="contact-section-tj"
        style={{
          padding: '8rem 3rem',
          position: 'relative',
          zIndex: 2,
          background: colors.cream,
        }}
      >
        <SectionHeader num={t.sectionNum} title={t.sectionTitle} italic={t.sectionItalic} />

        <div className="contact-grid-tj" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          border: `1px solid ${colors.ink}`,
          background: colors.cream,
        }}>
          {t.items.map((c, i) => (
            <div
              key={i}
              className="contact-item-tj"
              style={{
                padding: '3rem 2.5rem',
                borderRight: i < t.items.length - 1 ? `1px solid ${colors.ink}` : 'none',
              }}
            >
              <div style={{
                fontFamily: fonts.mono,
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: colors.accent,
                marginBottom: '1rem',
              }}>
                {c.label}
              </div>
              <div style={{
                fontFamily: fonts.display,
                fontSize: '1.6rem',
                fontWeight: 500,
                wordBreak: 'break-all',
              }}>
                {c.value}
              </div>
              <a
                href={contacts[i].href}
                target={contacts[i].href.startsWith('http') ? '_blank' : undefined}
                rel={contacts[i].href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{
                  display: 'inline-block',
                  marginTop: '1.5rem',
                  fontFamily: fonts.mono,
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: colors.ink,
                  borderBottom: `1px solid ${colors.ink}`,
                  paddingBottom: '0.25rem',
                }}
              >
                {c.action} ↗
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
