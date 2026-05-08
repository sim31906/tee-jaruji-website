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

export default function App() {
  return (
    <div style={{
      background: colors.cream,
      color: colors.ink,
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Grain overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        opacity: 0.08,
        zIndex: 1,
        mixBlendMode: 'multiply',
      }} />

      {/* Floating background blobs */}
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
