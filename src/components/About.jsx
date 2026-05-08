import { colors, fonts } from '../styles/theme';
import { socials, aboutQuote } from '../data/siteData';
import SectionHeader from './SectionHeader';

export default function About() {
  return (
    <>
      <style>{`
        .social-link-tj {
          position: relative;
          overflow: hidden;
        }
        .social-link-tj::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${colors.pink};
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
        }
        .social-link-tj:hover::before { transform: translateY(0); }
        .social-link-tj:hover { color: ${colors.ink} !important; }
        .social-link-tj > * { position: relative; z-index: 1; }

        @media (max-width: 968px) {
          .about-grid-tj { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .about-section-tj { padding: 5rem 1.5rem !important; }
        }
      `}</style>

      <section
        id="about"
        className="about-section-tj"
        style={{
          padding: '8rem 3rem',
          background: `linear-gradient(135deg, ${colors.pinkSoft}, ${colors.blueSoft})`,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <SectionHeader num="02 / About" title="Find Me" italic="Online" />

        <div className="about-grid-tj" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '5rem',
          alignItems: 'center',
        }}>
          <div style={{
            fontFamily: fonts.display,
            fontSize: '2rem',
            fontStyle: 'italic',
            fontWeight: 300,
            lineHeight: 1.4,
            color: colors.ink,
            position: 'relative',
            paddingLeft: '3rem',
          }}>
            <span style={{
              position: 'absolute',
              left: 0,
              top: '-1.5rem',
              fontSize: '6rem',
              color: colors.accent,
              fontFamily: fonts.display,
              lineHeight: 1,
            }}>"</span>
            {aboutQuote.text}
            <span style={{
              display: 'block',
              fontSize: '0.85rem',
              fontStyle: 'normal',
              fontFamily: fonts.mono,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: colors.accent,
              marginTop: '2rem',
            }}>
              {aboutQuote.signature}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1px',
            background: colors.ink,
            border: `1px solid ${colors.ink}`,
          }}>
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link-tj"
                style={{
                  background: colors.cream,
                  padding: '1.75rem 1.5rem',
                  color: colors.ink,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  gridColumn: i === 6 ? 'span 2' : 'auto',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.65rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  opacity: 0.6,
                }}>
                  {s.platform}
                </div>
                <div style={{
                  fontFamily: fonts.display,
                  fontSize: '1.5rem',
                  fontWeight: 500,
                }}>
                  {s.handle}
                </div>
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  fontSize: '1rem',
                }}>
                  ↗
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
