import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { colors, fonts } from '../styles/theme';
import { useLang } from '../context/LanguageContext';
import { useGoogleDrivePhotos } from '../hooks/useGoogleDrivePhotos';
import { useR2Videos } from '../hooks/useR2Videos';
import SectionHeader from './SectionHeader';

const PR_FOLDER_ID = '1ZLopkVvnp4LJ_td3KPa8TDv4VXb_ORaU';

function Slider({ items, autoSec = 15 }) {
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [showUI, setShowUI] = useState(false);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const hideRef  = useRef(null);

  const isVideo = items[idx]?.type === 'video';

  const next = useCallback(() => setIdx(i => (i + 1) % items.length), [items.length]);
  const prev = useCallback(() => setIdx(i => (i - 1 + items.length) % items.length), [items.length]);
  const navTo = useCallback(fn => { clearInterval(timerRef.current); fn(); }, []);

  const showControls  = useCallback(() => { clearTimeout(hideRef.current); setShowUI(true); }, []);
  const hideControls  = useCallback(() => { hideRef.current = setTimeout(() => setShowUI(false), 400); }, []);
  const touchControls = useCallback(() => {
    setShowUI(true);
    clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => setShowUI(false), 2500);
  }, []);

  useEffect(() => {
    if (items.length < 2 || isVideo) return;
    timerRef.current = setInterval(next, autoSec * 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, items.length, isVideo, next, autoSec]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
  }, [idx]);

  if (items.length === 0) return null;

  const uiFade = { opacity: showUI ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: showUI ? 'auto' : 'none' };

  return (
    <div className="pr-slider-wrap" style={{ position: 'relative' }}
      onMouseEnter={showControls} onMouseLeave={hideControls} onTouchStart={touchControls}>
      <div className="pr-slide-box" style={{
        width: '100%', aspectRatio: '16/9',
        overflow: 'hidden', position: 'relative', background: colors.ink,
      }}>
        {items.map((item, i) =>
          item.type === 'video' ? (
            i === idx ? (
              <video key={item.id} ref={videoRef} muted={muted} playsInline autoPlay onEnded={next}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'contain' }}>
                <source src={item.src} type="video/mp4" />
              </video>
            ) : null
          ) : (
            <img key={item.id} src={item.src} alt={item.alt}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'contain', opacity: i === idx ? 1 : 0, transition: 'opacity 0.8s ease' }} />
          )
        )}

        {items.length > 1 && (
          <>
            <button className="pr-arrow" onClick={() => navTo(prev)} style={{ ...arrowStyle('left'), ...uiFade }}>‹</button>
            <button className="pr-arrow" onClick={() => navTo(next)} style={{ ...arrowStyle('right'), ...uiFade }}>›</button>
          </>
        )}

        {isVideo && (
          <button onClick={() => setMuted(m => !m)} style={{
            position: 'absolute', bottom: 16, right: 16, width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(0,0,0,0.55)', border: 'none', color: '#fff', fontSize: '1.1rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 3, backdropFilter: 'blur(4px)', ...uiFade,
          }}>{muted ? '🔇' : '🔊'}</button>
        )}

        {!isVideo && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.12)' }}>
            <div key={idx} style={{ height: '100%', background: colors.pink, animation: `pr-progress ${autoSec}s linear`, transformOrigin: 'left' }} />
          </div>
        )}
      </div>

      {items.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1.25rem', flexWrap: 'wrap', ...uiFade }}>
          {items.map((_, i) => (
            <button key={i} onClick={() => { clearInterval(timerRef.current); setIdx(i); }} style={{
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

export default function PRSlider() {
  const { lang } = useLang();
  const { photos }         = useGoogleDrivePhotos(PR_FOLDER_ID);
  const { videos, loading: videoLoading } = useR2Videos('pr');

  const imageItems = useMemo(() => photos.map(p => ({ ...p, type: 'image' })), [photos]);

  const numLabel  = lang === 'en' ? '02 / Media & Ads' : lang === 'zh' ? '02 / 媒体广告' : '02 / สื่อ & โฆษณา';
  const mainTitle = lang === 'en' ? 'Media & Ads' : lang === 'zh' ? '媒体广告' : 'สื่อ & โฆษณา';
  const adLabel   = lang === 'en' ? '— Commercial' : lang === 'zh' ? '— 广告' : '— โฆษณา';
  const prLabel   = lang === 'en' ? '— Announcement' : lang === 'zh' ? '— 宣传资讯' : '— ประชาสัมพันธ์';

  const subStyle = {
    fontFamily: fonts.mono, fontSize: '0.72rem',
    letterSpacing: '0.3em', textTransform: 'uppercase',
    color: 'rgba(253,246,236,0.45)', margin: '0 0 1.5rem',
  };

  return (
    <section id="pr" style={{ background: colors.ink, padding: '5rem 0 4rem', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
      <div className="pr-header-tj" style={{ padding: '0 3rem', marginBottom: '3rem' }}>
        <SectionHeader num={numLabel} title={mainTitle} dark mb="0" pb="2rem" />
      </div>

      {/* โฆษณา — videos from R2 */}
      {(videos.length > 0 || videoLoading) && (
        <div style={{ marginBottom: '4rem' }}>
          <div className="pr-header-tj" style={{ padding: '0 3rem' }}>
            <p style={subStyle}>{adLabel}</p>
          </div>
          {videoLoading
            ? <div style={{ width: '100%', aspectRatio: '16/9', background: colors.ink }} />
            : <Slider items={videos} />
          }
        </div>
      )}

      {/* ประชาสัมพันธ์ — photos from Google Drive */}
      {imageItems.length > 0 && (
        <div>
          <div className="pr-header-tj" style={{ padding: '0 3rem' }}>
            <p style={subStyle}>{prLabel}</p>
          </div>
          <Slider items={imageItems} />
        </div>
      )}

      <style>{`
        @keyframes pr-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .pr-slider-wrap .pr-arrow { opacity: 0.7; transition: opacity 0.25s; }
        .pr-slider-wrap .pr-arrow:hover { opacity: 1; }
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
    zIndex: 2, backdropFilter: 'blur(4px)', transition: 'background 0.2s',
  };
}
