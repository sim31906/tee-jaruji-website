import { colors, fonts } from '../styles/theme';

export default function SectionHeader({ num, title, italic, dark = false }) {
  const textColor = dark ? colors.cream : colors.ink;
  const numColor = dark ? colors.pink : colors.accent;
  const accentColor = dark ? colors.pink : colors.accent;
  const borderColor = dark ? 'rgba(253, 246, 236, 0.2)' : colors.creamDark;

  return (
    <>
      <style>{`
        @media (max-width: 968px) {
          .section-header-tj { grid-template-columns: 1fr !important; gap: 1rem !important; }
        }
      `}</style>

      <div className="section-header-tj" style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '3rem',
        alignItems: 'end',
        marginBottom: '4rem',
        paddingBottom: '2rem',
        borderBottom: `1px solid ${borderColor}`,
      }}>
        <div style={{
          fontFamily: fonts.mono,
          fontSize: '0.8rem',
          letterSpacing: '0.3em',
          color: numColor,
        }}>
          {num}
        </div>
        <h2 style={{
          fontFamily: fonts.display,
          fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
          fontWeight: 400,
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
          color: textColor,
        }}>
          {title} <span style={{ fontStyle: 'italic', color: accentColor }}>{italic}</span>
        </h2>
      </div>
    </>
  );
}
