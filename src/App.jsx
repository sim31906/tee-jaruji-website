import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect } from 'react';
import { colors } from './styles/theme';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Profile from './components/Profile';
import About from './components/About';
import Contact from './components/Contact';
import Schedule from './components/Schedule';
import Supporters from './components/Supporters';
import Fanclub from './components/Fanclub';
import Footer from './components/Footer';
import CursorSparkle from './components/CursorSparkle';
import Reveal from './components/Reveal';
import WorkDetailPage from './pages/WorkDetailPage';
import TimelinePage from './pages/TimelinePage';
import PerformancePage from './pages/PerformancePage';

function MainPage() {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const target = location.state?.scrollTo;
    if (target) {
      const el = document.getElementById(target);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: 'instant' });
      }
    }
  }, []);
  return (
    <div style={{
      background: colors.cream,
      color: colors.ink,
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <div style={{
        position: 'fixed',
        top: '20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: `radial-gradient(circle, ${colors.pinkSoft}, transparent 70%)`,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'float 8s ease-in-out infinite',
        willChange: 'transform',
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        left: '-15%',
        width: '600px',
        height: '600px',
        background: `radial-gradient(circle, ${colors.blueSoft}, transparent 70%)`,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'float 10s ease-in-out infinite reverse',
        willChange: 'transform',
      }} />
      <CursorSparkle />
      <Navigation />
      <Hero />
      <Reveal><Profile /></Reveal>
      <Reveal><About /></Reveal>
      <Reveal><Contact /></Reveal>
      <Reveal><Schedule /></Reveal>
      <Reveal><Supporters /></Reveal>
      <Reveal><Fanclub /></Reveal>
      <Reveal><Footer /></Reveal>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/work/performance" element={<PerformancePage />} />
      <Route path="/work/:slug" element={<WorkDetailPage />} />
      <Route path="/timeline" element={<TimelinePage />} />
    </Routes>
  );
}
