import { useRef } from 'react';

export default function TiltCard({ children, style = {}, intensity = 8 }) {
  const ref = useRef();

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -intensity;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * intensity;
    ref.current.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
  };

  const onLeave = () => {
    ref.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: 'transform 0.2s ease', transformStyle: 'preserve-3d', ...style }}
    >
      {children}
    </div>
  );
}
