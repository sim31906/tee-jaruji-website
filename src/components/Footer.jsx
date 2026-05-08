import { colors, fonts } from '../styles/theme';

export default function Footer() {
  return (
    <footer style={{
      padding: '4rem 3rem 2rem',
      textAlign: 'center',
      borderTop: `1px solid ${colors.creamDark}`,
      position: 'relative',
      zIndex: 2,
      background: colors.cream,
    }}>
      <div style={{
        fontFamily: fonts.display,
        fontSize: 'clamp(2.5rem, 8vw, 6rem)',
        fontStyle: 'italic',
        fontWeight: 300,
        lineHeight: 1,
        marginBottom: '2rem',
        color: colors.accent,
        letterSpacing: '-0.02em',
      }}>
        Tee Jaruji
      </div>
      <div style={{
        fontFamily: fonts.mono,
        fontSize: '0.8rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: colors.inkSoft,
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
      }}>
        <span>© 2026 All Rights Reserved</span>
        <span>·</span>
        <span>Official Website</span>
        <span>·</span>
        <span>Made with ♡</span>
      </div>
    </footer>
  );
}
