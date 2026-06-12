import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

function getTouchDist(touches) {
  return Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );
}

export default function GalleryLightbox({ images, startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const scaleRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const didDragRef = useRef(false);

  // touch gesture state
  const touchRef = useRef(null); // { type: 'swipe'|'pan'|'pinch', ... }

  const zoomed = scale > 1;

  const resetZoom = useCallback(() => {
    scaleRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    setScale(1);
    setPanX(0);
    setPanY(0);
  }, []);

  const goTo = useCallback(i => {
    resetZoom();
    setIdx(i);
  }, [resetZoom]);

  const idxRef = useRef(idx);
  idxRef.current = idx;
  const imagesRef = useRef(images);
  imagesRef.current = images;

  const prev = useCallback(() => {
    goTo((idxRef.current - 1 + imagesRef.current.length) % imagesRef.current.length);
  }, [goTo]);

  const next = useCallback(() => {
    goTo((idxRef.current + 1) % imagesRef.current.length);
  }, [goTo]);

  // keyboard
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') { if (scaleRef.current > 1) resetZoom(); else onClose(); }
      if (e.key === 'ArrowLeft' && scaleRef.current <= 1) prev();
      if (e.key === 'ArrowRight' && scaleRef.current <= 1) next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, prev, next, resetZoom]);

  // touch events
  useEffect(() => {
    const el = document.getElementById('gl-img-area');
    if (!el) return;

    const onStart = e => {
      if (e.touches.length === 1) {
        touchRef.current = {
          type: 'swipe',
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          panStartX: panRef.current.x,
          panStartY: panRef.current.y,
          moved: false,
        };
      } else if (e.touches.length === 2) {
        touchRef.current = {
          type: 'pinch',
          startDist: getTouchDist(e.touches),
          startScale: scaleRef.current,
          startPanX: panRef.current.x,
          startPanY: panRef.current.y,
        };
      }
    };

    const onMove = e => {
      if (!touchRef.current) return;
      // only preventDefault for pinch or pan (zoomed) — allows iOS long-press save
      if (e.touches.length >= 2 || scaleRef.current > 1) e.preventDefault();

      if (e.touches.length === 2) {
        // switch to pinch if two fingers appear mid-gesture
        if (touchRef.current.type !== 'pinch') {
          touchRef.current = {
            type: 'pinch',
            startDist: getTouchDist(e.touches),
            startScale: scaleRef.current,
            startPanX: panRef.current.x,
            startPanY: panRef.current.y,
          };
          return;
        }
        const newDist = getTouchDist(e.touches);
        const newScale = Math.min(5, Math.max(1, touchRef.current.startScale * (newDist / touchRef.current.startDist)));
        scaleRef.current = newScale;
        setScale(newScale);
        return;
      }

      if (e.touches.length === 1 && touchRef.current.type === 'swipe') {
        const dx = e.touches[0].clientX - touchRef.current.startX;
        const dy = e.touches[0].clientY - touchRef.current.startY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) touchRef.current.moved = true;

        if (scaleRef.current > 1) {
          // pan
          const nx = touchRef.current.panStartX + dx;
          const ny = touchRef.current.panStartY + dy;
          panRef.current = { x: nx, y: ny };
          setPanX(nx);
          setPanY(ny);
        }
      }
    };

    const onEnd = e => {
      if (!touchRef.current) return;

      if (touchRef.current.type === 'pinch') {
        if (scaleRef.current <= 1) resetZoom();
        touchRef.current = null;
        return;
      }

      if (touchRef.current.type === 'swipe') {
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchRef.current.startX;
        const moved = touchRef.current.moved;
        touchRef.current = null;

        if (scaleRef.current <= 1 && moved && Math.abs(dx) > 50) {
          dx < 0 ? next() : prev();
        }
      }
    };

    el.addEventListener('touchstart', onStart, { passive: false });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, [prev, next, resetZoom]);

  // mouse drag (desktop)
  const onMouseDown = e => {
    if (scaleRef.current <= 1) return;
    e.preventDefault();
    didDragRef.current = false;
    const startX = e.clientX - panRef.current.x;
    const startY = e.clientY - panRef.current.y;
    const onMove = e => {
      didDragRef.current = true;
      const nx = e.clientX - startX;
      const ny = e.clientY - startY;
      panRef.current = { x: nx, y: ny };
      setPanX(nx);
      setPanY(ny);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // scroll wheel zoom (desktop)
  const onWheel = e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    const newScale = Math.min(5, Math.max(1, scaleRef.current + delta));
    scaleRef.current = newScale;
    setScale(newScale);
    if (newScale <= 1) { panRef.current = { x: 0, y: 0 }; setPanX(0); setPanY(0); }
  };

  const toggleZoom = e => {
    e.stopPropagation();
    if (didDragRef.current) { didDragRef.current = false; return; }
    if (scaleRef.current > 1) resetZoom();
    else { scaleRef.current = 2; setScale(2); }
  };

  return createPortal(
    <div
      onClick={() => { if (scaleRef.current > 1) resetZoom(); else onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 19999, background: 'rgba(0,0,0,0.96)', display: 'flex', flexDirection: 'column' }}
    >
      {/* Top bar */}
      <div style={{ flexShrink: 0, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
          {idx + 1} / {images.length}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {zoomed && (
            <button onClick={e => { e.stopPropagation(); resetZoom(); }} style={{ ...iconBtn, fontSize: '0.65rem', fontFamily: 'monospace', letterSpacing: '0.05em', width: 'auto', padding: '0 10px', borderRadius: 12 }}>
              Reset
            </button>
          )}
          {/* Download */}
          <button
            onClick={async e => {
              e.stopPropagation();
              try {
                const res = await fetch(images[idx]);
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = images[idx].split('/').pop() || 'photo.jpg';
                a.click();
                URL.revokeObjectURL(url);
              } catch { window.open(images[idx], '_blank'); }
            }}
            style={iconBtn}
            title="บันทึกรูป"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
          <button onClick={e => { e.stopPropagation(); onClose(); }} style={{ ...iconBtn, fontSize: '1.3rem' }}>×</button>
        </div>
      </div>

      {/* Image area */}
      <div
        id="gl-img-area"
        onClick={e => e.stopPropagation()}
        onMouseDown={onMouseDown}
        onWheelCapture={onWheel}
        style={{
          flex: 1, minHeight: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          padding: '0 56px',
          cursor: zoomed ? 'grab' : 'zoom-in',
          touchAction: zoomed ? 'none' : 'manipulation',
        }}
      >
        <img
          key={idx}
          src={images[idx]}
          alt={`gallery ${idx + 1}`}
          onClick={toggleZoom}
          draggable={false}
          style={{
            maxWidth: '100%', maxHeight: '100%',
            objectFit: 'contain', borderRadius: zoomed ? 0 : 6,
            display: 'block', userSelect: 'none',
            WebkitTouchCallout: 'default',
            transform: `scale(${scale}) translate(${panX / scale}px, ${panY / scale}px)`,
            transition: scale === 1 ? 'transform 0.25s ease' : 'none',
            transformOrigin: 'center center',
          }}
        />
        {images.length > 1 && !zoomed && (
          <>
            <button onClick={e => { e.stopPropagation(); prev(); }} style={arrowStyle('left')}>‹</button>
            <button onClick={e => { e.stopPropagation(); next(); }} style={arrowStyle('right')}>›</button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            flexShrink: 0, height: 82,
            display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px',
            overflowX: 'auto', overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            background: 'rgba(0,0,0,0.5)',
          }}
        >
          {images.map((src, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              flexShrink: 0, width: 62, height: 62, borderRadius: 6,
              overflow: 'hidden', border: 'none', padding: 0, cursor: 'pointer',
              outline: i === idx ? '2px solid #fff' : '2px solid transparent',
              outlineOffset: 1, opacity: i === idx ? 1 : 0.5,
              transition: 'opacity 0.15s, outline 0.15s',
            }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}

const iconBtn = {
  width: 36, height: 36, borderRadius: '50%',
  background: 'rgba(255,255,255,0.1)', border: 'none',
  color: '#fff', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

function arrowStyle(side) {
  return {
    position: 'absolute', [side]: 8,
    top: '50%', transform: 'translateY(-50%)',
    width: 44, height: 44, borderRadius: '50%',
    background: 'rgba(255,255,255,0.12)', border: 'none',
    color: '#fff', fontSize: '2rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 3, lineHeight: 1,
  };
}
