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
          transform: scale(1.1);
          background: rgba(255,255,255,0.35);
        }
        .hero-tag-tj {
          transition: background 0.2s, color 0.2s;
        }
        .hero-tag-tj:hover {
          background: rgba(255,255,255,0.45) !important;
        }
        @media (max-width: 968px) {
          .hero-grid-tj {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
            padding: 6rem 1.5rem 4rem !important;
          }
          .hero-card-tj {
            max-width: 320px !important;
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
          background: 'linear-gradient(145deg, #FFFDE0 0%, #FFF5A0 60%, #FFF0A0 100%)',
          overflow: 'hidden',
        }}
      >
        {/* decorative circles */}
        <div style={{
          position: 'absolute', top: '-10%', right: '5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'rgba(0,0,0,0.06)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* tagline */}
          <div style={{
            fontFamily: fonts.mono,
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '2rem',
            color: colors.inkSoft,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            animation: 'hero-reveal 0.8s ease both',
            animationDelay: '0.1s',
          }}>
            <span style={{ display: 'inline-block', width: '40px', height: '1px', background: colors.inkSoft }} />
            {t.tagline}
          </div>

          {/* name */}
          <h1 style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(4rem, 9vw, 9rem)',
            fontWeight: 400,
            lineHeight: 0.88,
            letterSpacing: '-0.03em',
            marginBottom: '1.75rem',
            color: colors.ink,
            textShadow: 'none',
            animation: 'hero-reveal 0.9s ease both',
            animationDelay: '0.3s',
          }}>
            {hero.name}<br />
            <span style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: '#B8860B',
            }}>
              {hero.surname}
            </span>
          </h1>

          {/* description */}
          <p style={{
            fontSize: '1rem',
            maxWidth: '400px',
            lineHeight: 1.8,
            color: colors.inkSoft,
            marginBottom: '2.5rem',
            animation: 'hero-reveal 0.9s ease both',
            animationDelay: '0.55s',
          }}>
            {t.description}
          </p>

          {/* tags */}
          <div style={{
            display: 'flex', gap: '0.6rem', flexWrap: 'wrap',
            animation: 'hero-reveal 0.9s ease both',
            animationDelay: '0.75s',
          }}>
            {t.tags.map(tag => (
              <span key={tag} className="hero-tag-tj" style={{
                padding: '0.45rem 1.1rem',
                border: `1.5px solid ${colors.ink}`,
                borderRadius: '100px',
                fontFamily: fonts.mono,
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                background: 'rgba(255,255,255,0.35)',
                color: colors.ink,
                backdropFilter: 'blur(4px)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* video card */}
        <div className="hero-card-tj" style={{
          position: 'relative',
          aspectRatio: '9/12',
          maxWidth: '420px',
          margin: '0 auto',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '16px 16px 0 rgba(255,255,255,0.35), 28px 28px 0 rgba(0,0,0,0.12)',
          transform: 'rotate(-2deg)',
          zIndex: 1,
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
                position: 'absolute', inset: 0,
                background: 'linear-gradient(160deg, #FFE066 0%, #F5A623 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <div className="play-icon-tj" style={{
                width: '88px', height: '88px',
                border: '2px solid rgba(255,255,255,0.75)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                transition: 'all 0.3s',
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(6px)',
              }}>
                <div style={{
                  width: 0, height: 0,
                  borderLeft: '20px solid #fff',
                  borderTop: '13px solid transparent',
                  borderBottom: '13px solid transparent',
                  marginLeft: '6px',
                }} />
              </div>
              <div style={{
                fontFamily: fonts.mono,
                fontSize: '0.72rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.9)',
              }}>
                {t.watchIntro}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
