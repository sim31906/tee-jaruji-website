import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { colors, fonts } from '../styles/theme';
import { useLang } from '../context/LanguageContext';
import { useGoogleDrivePhotos } from '../hooks/useGoogleDrivePhotos';
import SectionHeader from './SectionHeader';

const PR_FOLDER_ID = '1ZLopkVvnp4LJ_td3KPa8TDv4VXb_ORaU';
const PR_VIDEO_URL = 'https://pub-46fa3f6d65804c9ea240d7ff9b16d7bc.r2.dev/pr/ais.mp4';

// ── image-only slider ─────────────────────────────────────────────────────────
function ImageSlider({ photos }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const next = useCallback(() => setIdx(i => (i + 1) % photos.length), [photos.length]);
  const prev = useCallback(() => setIdx(i => (i - 1 + photos.length) % photos.length), [photos.length]);
  const goTo = useCallback(i => setIdx(i), []);
  const navTo = useCallback(fn => { clearInterval(timerRef.current); fn(); }, []);

  useEffect(() => {
    if (photos.length < 2) return;
    timerRef.current = setInterval(next, 15000);
    return () => clearInterval(timerRef.current);
  }, [idx, photos.length, next]);

  if (photos.length === 0) return null;

  return (
    <div className="pr-slider-wrap">
      <div className="pr-slide-box" style={{
        width: '100%', aspectRatio: '16 / 9',
        overflow: 'hidden', position: 'relative', background: colors.ink,
      }}>
        {photos.map((item, i) => (
          <img key={item.id} src={item.src} alt={item.alt}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'contain',
              opacity: i === idx ? 1 : 0,
              transition: 'opacity 0.8s ease',
            }}
          />
        ))}
        {photos.length > 1 && (
          <>
            <button className="pr-arrow" onClick={() => navTo(prev)} style={arrowStyle('left')}>‹</button>
            <button className="pr-arrow" onClick={() => navTo(next)} style={arrowStyle('right')}>›</button>
          </>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.12)' }}>
          <div key={idx} style={{
            height: '100%', background: colors.pink,
            animation: 'pr-progress 15s linear', transformOrigin: 'left',
          }} />
        </div>
      </div>
      {photos.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1.25rem' }}>
          {photos.map((_, i) => (
            <button key={i} onClick={() => navTo(() => goTo(i))} style={{
              width: i === idx ? 24 : 8, height: 8, borderRadius: 4,
              background: i === idx ? colors.pink : 'rgba(253,246,236,0.25)',
              border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function PRSlider() {
  const { lang } = useLang();
  const { photos } = useGoogleDrivePhotos(PR_FOLDER_ID);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  const imageItems = useMemo(() => photos.map(p => ({ ...p, type: 'image' })), [photos]);

  const adLabel   = lang === 'en' ? 'Commercial' : lang === 'zh' ? '广告' : 'โฆษณา';
  const prLabel   = lang === 'en' ? 'Announcement' : lang === 'zh' ? '宣传资讯' : 'ประชาสัมพันธ์';
  const numLabel  = lang === 'en' ? '02 / PR' : lang === 'zh' ? '02 / 宣传' : '02 / ประชาสัมพันธ์';

  return (
    <section id="pr" style={{
      background: colors.ink,
      padding: '5rem 0 4rem',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 2,
    }}>
      <div className="pr-header-tj" style={{ padding: '0 3rem', marginBottom: '3rem' }}>
        <SectionHeader num={numLabel} title={prLabel} dark mb="0" pb="2rem" />
      </div>

      {/* ── โฆษณา ── */}
      <div style={{ marginBottom: '4rem' }}>
        <div className="pr-header-tj" style={{ padding: '0 3rem', marginBottom: '1.5rem' }}>
          <p style={{
            fontFamily: fonts.mono, fontSize: '0.72rem',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(253,246,236,0.45)', margin: 0,
          }}>— {adLabel}</p>
        </div>
        {PR_VIDEO_URL && (
          <div className="pr-slider-wrap" style={{ position: 'relative' }}>
            <div className="pr-slide-box" style={{
              width: '100%', aspectRatio: '16 / 9',
              overflow: 'hidden', position: 'relative', background: colors.ink,
            }}>
              <video
                ref={videoRef}
                muted={muted}
                playsInline
                autoPlay
                loop
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              >
                <source src={PR_VIDEO_URL} type="video/mp4" />
              </video>
              <button onClick={() => setMuted(m => !m)} style={{
                position: 'absolute', bottom: 16, right: 16,
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(0,0,0,0.55)', border: 'none',
                color: '#fff', fontSize: '1.1rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 3, backdropFilter: 'blur(4px)',
              }}>
                {muted ? '🔇' : '🔊'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── ประชาสัมพันธ์ ── */}
      {imageItems.length > 0 && (
        <div>
          <div className="pr-header-tj" style={{ padding: '0 3rem', marginBottom: '1.5rem' }}>
            <p style={{
              fontFamily: fonts.mono, fontSize: '0.72rem',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(253,246,236,0.45)', margin: 0,
            }}>— {prLabel}</p>
          </div>
          <ImageSlider photos={imageItems} />
        </div>
      )}

      <style>{`
        @keyframes pr-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .pr-slider-wrap .pr-arrow { opacity: 0; transition: opacity 0.25s; }
        .pr-slider-wrap:hover .pr-arrow { opacity: 1; }
        @media (max-width: 768px) {
          .pr-header-tj { padding: 0 1.5rem !important; }
          .pr-slide-box { aspect-ratio: 4 / 3 !important; }
        }
      `}</style>
    </section>
  );
}

function arrowStyle(side) {
  return {
    position: 'absolute', [side]: 16,
    top: '50%', transform: 'translateY(-50%)',
    width: 48, height: 48, borderRadius: '50%',
    background: 'rgba(0,0,0,0.45)', border: 'none',
    color: '#fff', fontSize: '2rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2, backdropFilter: 'blur(4px)',
    transition: 'background 0.2s',
  };
}
