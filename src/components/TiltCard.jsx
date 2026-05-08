import { useRef } from 'react';

export default function TiltCard({ children, style = {}, intensity = 8 }) {
  const ref = useRef();
  const rafRef = useRef();
  const rectRef = useRef(null);

  const onMove = (e) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!ref.current) return;
      if (!rectRef.current) rectRef.current = ref.current.getBoundingClientRect();
      const rect = rectRef.current;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -intensity;
      const ry = ((e.clientX - cx) / (rect.width / 2)) * intensity;
      ref.current.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    });
  };

  const onLeave = () => {
    rectRef.current = null;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (ref.current) ref.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: 'transform 0.2s ease', transformStyle: 'preserve-3d', willChange: 'transform', ...style }}
    >
      {children}
    </div>
  );
}
