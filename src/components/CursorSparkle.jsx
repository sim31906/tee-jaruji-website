import { useEffect } from 'react';
import { colors } from '../styles/theme';

export default function CursorSparkle() {
  useEffect(() => {
    const palette = [colors.pink, colors.blue, colors.accent, colors.pinkDeep, colors.blueDeep, '#ffffff'];
    let lastTime = 0;

    const spawn = (x, y) => {
      for (let i = 0; i < 2; i++) {
        const el = document.createElement('div');
        const size = Math.random() * 7 + 3;
        const color = palette[Math.floor(Math.random() * palette.length)];
        const angle = Math.random() * 360;
        const dist = Math.random() * 45 + 15;
        const dx = Math.cos((angle * Math.PI) / 180) * dist;
        const dy = Math.sin((angle * Math.PI) / 180) * dist;

        el.style.cssText = `
          position:fixed;left:${x}px;top:${y}px;
          width:${size}px;height:${size}px;
          background:${color};border-radius:50%;
          pointer-events:none;z-index:9999;
          transform:translate(-50%,-50%);
        `;
        document.body.appendChild(el);
        el.animate(
          [
            { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' },
            { opacity: 0, transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0)` },
          ],
          { duration: 600 + Math.random() * 400, easing: 'ease-out', fill: 'forwards' }
        ).onfinish = () => el.remove();
      }
    };

    const onMove = (e) => {
      const now = Date.now();
      if (now - lastTime < 120) return;
      lastTime = now;
      spawn(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return null;
}
