import { colors, fonts } from '../styles/theme';
import { hero } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function Hero() {
  const { lang } = useLang();
  const t = translations[lang].hero;

  const handleVideoClick = () => {
    if (!hero.videoUrl) {
      alert('วางลิงก์วิดีโอแนะนำตัวที่ src/data/siteData.js > hero.videoUrl');
    }
  };

  return (
    <>
      <style>{`
        .video-placeholder-tj:hover .play-icon-tj {
          transform: scale(1.15);
          background: ${colors.pink};
        }
        @media (max-width: 968px) {
          .hero-grid-tj {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
            padding: 6rem 1.5rem 4rem !important;
          }
        }
      `}</style>

      <section
        id="home"
        className="hero-grid-tj"
        style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          padding: '8rem 3rem 4rem',
          position: 'relative',
          zIndex: 2,
          gap: '3rem',
        }}
      >
        <div>
          <div style={{
            fontFamily: fonts.mono,
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '2rem',
            color: colors.accent,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            animation: 'hero-reveal 0.8s ease both',
            animationDelay: '0.1s',
          }}>
            <span style={{ display: 'inline-block', width: '40px', height: '1px', background: colors.accent }}></span>
            {t.tagline}
          </div>

          <h1 style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(4rem, 9vw, 9rem)',
            fontWeight: 400,
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
            animation: 'hero-reveal 0.9s ease both',
            animationDelay: '0.3s',
          }}>
            {hero.name}<br />
            <span style={{ fontStyle: 'italic', fontWeight: 300, color: colors.accent }}>
              {hero.surname}
            </span>
          </h1>

          <p style={{
            fontSize: '1rem',
            maxWidth: '420px',
            lineHeight: 1.7,
            color: colors.inkSoft,
            marginBottom: '2.5rem',
            animation: 'hero-reveal 0.9s ease both',
            animationDelay: '0.55s',
          }}>
            {t.description}
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', animation: 'hero-reveal 0.9s ease both', animationDelay: '0.75s' }}>
            {t.tags.map(tag => (
              <span key={tag} style={{
                padding: '0.5rem 1rem',
                border: `1px solid ${colors.ink}`,
                borderRadius: '100px',
                fontFamily: fonts.mono,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                background: colors.pinkSoft,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div style={{
          position: 'relative',
          aspectRatio: '9/12',
          maxWidth: '420px',
          margin: '0 auto',
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: `20px 20px 0 ${colors.pink}, 30px 30px 0 ${colors.blue}`,
          transform: 'rotate(-2deg)',
        }}>
          {hero.videoUrl ? (
            hero.videoUrl.includes('youtube.com') || hero.videoUrl.includes('youtu.be') ? (
              <iframe
                src={hero.videoUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Intro video"
              />
            ) : (
              <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                <source src={hero.videoUrl} type="video/mp4" />
              </video>
            )
          ) : (
            <div
              className="video-placeholder-tj"
              onClick={handleVideoClick}
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${colors.pink}, ${colors.blue})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.ink,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <div className="play-icon-tj" style={{
                width: '90px',
                height: '90px',
                border: `2px solid ${colors.ink}`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                transition: 'all 0.3s',
                background: 'rgba(253, 246, 236, 0.5)',
              }}>
                <div style={{
                  width: 0, height: 0,
                  borderLeft: `20px solid ${colors.ink}`,
                  borderTop: '14px solid transparent',
                  borderBottom: '14px solid transparent',
                  marginLeft: '5px',
                }}></div>
              </div>
              <div style={{ fontFamily: fonts.mono, fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                {t.watchIntro}
              </div>
            </div>
          )}
        </div>

      </section>
    </>
  );
}
