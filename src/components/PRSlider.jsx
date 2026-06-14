import { useState, useEffect, useRef, useCallback } from 'react';
import { colors, fonts } from '../styles/theme';
import { useLang } from '../context/LanguageContext';
import { useGoogleDrivePhotos } from '../hooks/useGoogleDrivePhotos';

const PR_FOLDER_ID = '1ZLopkVvnp4LJ_td3KPa8TDv4VXb_ORaU';

export default function PRSlider() {
  const { lang } = useLang();
  const { photos, loading } = useGoogleDrivePhotos(PR_FOLDER_ID);
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const next = useCallback(() => {
    setIdx(i => (i + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    setIdx(i => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const goTo = useCallback(i => setIdx(i), []);

  // reset timer helper
  const navTo = useCallback(fn => {
    clearInterval(timerRef.current);
    fn();
    timerRef.current = setInterval(next, 15000);
  }, [next]);

  // auto-advance every 15s
  useEffect(() => {
    if (photos.length < 2) return;
    timerRef.current = setInterval(next, 15000);
    return () => clearInterval(timerRef.current);
  }, [photos.length, next]);

  const label = lang === 'en' ? 'Press & PR' : lang === 'zh' ? '宣传资讯' : 'ประชาสัมพันธ์';

  return (
    <section style={{
      background: colors.ink,
      padding: '5rem 0 4rem',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 2,
    }}>
      {/* header */}
      <div style={{ padding: '0 3rem', marginBottom: photos.length > 0 ? '2rem' : 0, display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
        <span style={{
          fontFamily: fonts.mono, fontSize: '0.7rem',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: colors.pink, opacity: 0.8,
        }}>
          02.5 /
        </span>
        <h2 style={{
          fontFamily: fonts.display,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 400, color: colors.cream, margin: 0,
        }}>
          {label}
        </h2>
      </div>

      {/* slideshow — แสดงเมื่อมีรูป */}
      {photos.length > 0 && (
      <div style={{ position: 'relative' }}>
        <div style={{
          width: '100%',
          aspectRatio: '16 / 7',
          overflow: 'hidden',
          position: 'relative',
          background: '#111',
        }}>
          {photos.map((photo, i) => (
            <img
              key={photo.id}
              src={photo.src}
              alt={photo.alt}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'contain',
                opacity: i === idx ? 1 : 0,
                transition: 'opacity 0.8s ease',
                display: 'block',
              }}
            />
          ))}

          {photos.length > 1 && (
            <>
              <button onClick={() => navTo(prev)} style={arrowStyle('left')}>‹</button>
              <button onClick={() => navTo(next)} style={arrowStyle('right')}>›</button>
            </>
          )}

          {/* progress bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.12)' }}>
            <div
              key={idx}
              style={{
                height: '100%',
                background: colors.pink,
                animation: 'pr-progress 15s linear',
                transformOrigin: 'left',
              }}
            />
          </div>
        </div>

        {/* dots */}
        {photos.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1.25rem' }}>
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => navTo(() => goTo(i))}
                style={{
                  width: i === idx ? 24 : 8, height: 8,
                  borderRadius: 4,
                  background: i === idx ? colors.pink : 'rgba(253,246,236,0.25)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        )}
      </div>
      )}

      <style>{`
        @keyframes pr-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes pr-spin {
          to { transform: rotate(360deg); }
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
