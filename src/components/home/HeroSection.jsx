// src/components/home/HeroSection.jsx
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Star } from 'lucide-react';
import { WordReveal } from '../common/TextReveal';
import { MagneticCTA } from '../common/MagneticButton';
import { SteamAnimation, PulseDot } from '../common/MicroInteractions';
import { Link } from 'react-router-dom';

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#D97706' : '#F4C26B',
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

function Counter({ target, suffix = '' }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const interval = setInterval(() => {
          start += step;
          if (start >= target) { setValue(target); clearInterval(interval); }
          else setValue(Math.floor(start));
        }, 25);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

function FloatingCard({ emoji, name, delay, position }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
      className={`absolute ${position} glass rounded-2xl px-4 py-3 hidden lg:flex items-center gap-3`}
      style={{ zIndex: 10 }}
    >
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className="text-cream text-xs font-semibold">{name}</p>
        <div className="flex gap-0.5 mt-0.5">
          {[...Array(5)].map((_, i) => <Star key={i} size={8} className="text-gold fill-gold" />)}
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const containerRef = useRef(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fn = (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--gx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty('--gy', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };
    el.addEventListener('mousemove', fn);
    return () => el.removeEventListener('mousemove', fn);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: `radial-gradient(ellipse at var(--gx,50%) var(--gy,50%), rgba(217,119,6,0.08) 0%, transparent 60%), #0F0F0F` }}
    >
      <ParticleCanvas />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <FloatingCard emoji="☕" name="Signature Coffee" delay={0}   position="top-32 left-8 xl:left-24" />
      <FloatingCard emoji="🥑" name="Avocado Toast"   delay={1}   position="top-48 right-8 xl:right-24" />
      <FloatingCard emoji="🥞" name="Pancake Stack"   delay={2}   position="bottom-48 left-8 xl:left-16" />
      <FloatingCard emoji="🍰" name="Daily Dessert"   delay={0.5} position="bottom-40 right-8 xl:right-20" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.2 }}
          className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-8 border border-gold/20">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_,i) => <Star key={i} size={12} className="text-gold fill-gold" />)}
          </div>
          <span className="text-gold font-semibold text-sm">4.9</span>
          <span className="text-cream/50 text-sm">·</span>
          <span className="text-cream/60 text-sm">1,500+ Reviews</span>
        </motion.div>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-cream leading-tight mb-6 text-glow">
          <WordReveal text="Experience the" delay={0.3} stagger={0.1} className="block" />
          <span className="block mt-1">
            <WordReveal text="Best Brunch" delay={0.55} stagger={0.12} className="text-gradient" />
          </span>
          <WordReveal text="in Kandy" delay={0.8} stagger={0.1} className="block mt-1" />
        </h1>

        <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:1.1 }}
          className="text-cream/60 text-lg sm:text-xl mb-4 max-w-2xl mx-auto leading-relaxed">
          Fresh food, cozy vibes, unforgettable moments.
        </motion.p>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
          className="flex items-center justify-center gap-4 mb-10">
          <SteamAnimation />
          <PulseDot color="green" label="Open Now — 8 AM to 10 PM" />
          <SteamAnimation />
        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <MagneticCTA href="/menu"><span>🍳</span> Explore Menu</MagneticCTA>
          <MagneticCTA href="/contact" outline><span>📅</span> Reserve Table</MagneticCTA>
        </motion.div>

        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:1.3 }}
          className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value:1500, suffix:'+', label:'Happy Customers' },
            { value:100,  suffix:'+', label:'Menu Items'      },
            { value:5,    suffix:'',  label:'Years Serving'   },
          ].map(({ value, suffix, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-bold text-gradient">
                <Counter target={value} suffix={suffix} />
              </div>
              <p className="text-cream/40 text-xs mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2, repeat:Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/30 flex flex-col items-center gap-1">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}
