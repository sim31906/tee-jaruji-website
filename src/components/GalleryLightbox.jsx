import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function GalleryLightbox({ images, startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const stateRef = useRef({ scale: 1, panX: 0, panY: 0 });
  const dragRef = useRef(null);
  const pinchRef = useRef(null);
  const zoomed = scale > 1;

  const resetZoom = () => { setScale(1); setPanX(0); setPanY(0); stateRef.current = { scale: 1, panX: 0, panY: 0 }; };
  const goTo = useCallback(i => { resetZoom(); setIdx(i); }, []);
  const prev = useCallback(() => goTo((idx - 1 + images.length) % images.length), [idx, images.length, goTo]);
  const next = useCallback(() => goTo((idx + 1) % images.length), [idx, images.length, goTo]);

  // keyboard
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') { if (zoomed) resetZoom(); else onClose(); }
      if (e.key === 'ArrowLeft' && !zoomed) prev();
      if (e.key === 'ArrowRight' && !zoomed) next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, prev, next, zoomed]);

  // touch handlers
  useEffect(() => {
    const el = document.getElementById('gl-img-area');
    if (!el) return;

    const dist = (a, b) => Math.hypot(a[0].clientX - b[0].clientX, a[0].clientY - b[0].clientY);
    const mid = (a, b) => [(a[0].clientX + b[0].clientX) / 2, (a[0].clientY + b[0].clientY) / 2];

    const onStart = e => {
      if (e.touches.length === 1) {
        dragRef.current = {
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          panX: stateRef.current.panX,
          panY: stateRef.current.panY,
          moved: false,
        };
      } else if (e.touches.length === 2) {
        pinchRef.current = {
          startDist: dist(e.touches, e.touches),
          startScale: stateRef.current.scale,
          startMid: mid(e.touches, e.touches),
          panX: stateRef.current.panX,
          panY: stateRef.current.panY,
        };
        dragRef.current = null;
      }
    };

    const onMove = e => {
      e.preventDefault();
      if (e.touches.length === 2 && pinchRef.current) {
        const newDist = dist(e.touches, e.touches);
        const newScale = Math.min(4, Math.max(1, pinchRef.current.startScale * (newDist / pinchRef.current.startDist)));
        stateRef.current.scale = newScale;
        setScale(newScale);
      } else if (e.touches.length === 1 && dragRef.current) {
        const dx = e.touches[0].clientX - dragRef.current.startX;
        const dy = e.touches[0].clientY - dragRef.current.startY;
        dragRef.current.moved = Math.abs(dx) > 5 || Math.abs(dy) > 5;
        if (stateRef.current.scale > 1) {
          const nx = dragRef.current.panX + dx;
          const ny = dragRef.current.panY + dy;
          stateRef.current.panX = nx;
          stateRef.current.panY = ny;
          setPanX(nx);
          setPanY(ny);
        }
      }
    };

    const onEnd = e => {
      if (pinchRef.current) {
        pinchRef.current = null;
        return;
      }
      if (dragRef.current) {
        const dx = (e.changedTouches[0]?.clientX ?? 0) - dragRef.current.startX;
        const moved = dragRef.current.moved;
        dragRef.current = null;
        if (stateRef.current.scale <= 1 && Math.abs(dx) > 50) {
          dx < 0 ? next() : prev();
        } else if (!moved && stateRef.current.scale <= 1) {
          // single tap — do nothing (don't close)
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
  }, [prev, next, idx]);

  // mouse drag for desktop
  const didDragRef = useRef(false);
  const onMouseDown = e => {
    if (!zoomed) return;
    e.preventDefault();
    didDragRef.current = false;
    const startX = e.clientX - panX;
    const startY = e.clientY - panY;
    const onMove = e => {
      didDragRef.current = true;
      const nx = e.clientX - startX;
      const ny = e.clientY - startY;
      stateRef.current.panX = nx;
      stateRef.current.panY = ny;
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

  const toggleZoom = e => {
    e.stopPropagation();
    if (didDragRef.current) { didDragRef.current = false; return; }
    if (zoomed) resetZoom();
    else { setScale(2); stateRef.current.scale = 2; }
  };

  const onWheel = e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    const newScale = Math.min(4, Math.max(1, stateRef.current.scale + delta));
    stateRef.current.scale = newScale;
    setScale(newScale);
    if (newScale === 1) { setPanX(0); setPanY(0); stateRef.current.panX = 0; stateRef.current.panY = 0; }
  };

  return createPortal(
    <div
      onClick={() => { if (zoomed) resetZoom(); else onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 19999, background: 'rgba(0,0,0,0.96)', display: 'flex', flexDirection: 'column' }}
    >
      {/* Top bar */}
      <div style={{ flexShrink: 0, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
          {idx + 1} / {images.length}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={toggleZoom} style={iconBtn} title={zoomed ? 'ย่อ' : 'ขยาย'}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {zoomed
                ? <><line x1="5" y1="12" x2="19" y2="12"/></>
                : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>
              }
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
          touchAction: 'none',
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
            <button key={i}
              onClick={() => goTo(i)}
              style={{
                flexShrink: 0, width: 62, height: 62, borderRadius: 6,
                overflow: 'hidden', border: 'none', padding: 0, cursor: 'pointer',
                outline: i === idx ? '2px solid #fff' : '2px solid transparent',
                outlineOffset: 1, opacity: i === idx ? 1 : 0.5,
                transition: 'opacity 0.15s, outline 0.15s',
              }}
            >
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
