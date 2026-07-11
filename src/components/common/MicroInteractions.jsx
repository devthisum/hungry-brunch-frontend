// src/components/common/MicroInteractions.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedStars({ rating, size = 16, interactive = false, onChange }) {
  const [hovered, setHovered] = useState(0);
  const [clicked, setClicked] = useState(null);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(star => {
        const filled = star <= (hovered || rating);
        return (
          <motion.button key={star} type="button" disabled={!interactive}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => { if (!interactive) return; setClicked(star); onChange?.(star); setTimeout(() => setClicked(null), 600); }}
            whileHover={interactive ? { scale: 1.3, rotate: 10 } : {}}
            animate={clicked === star ? { scale:[1,1.6,0.8,1.2,1], rotate:[0,-20,20,-10,0] } : { scale:1, rotate:0 }}
            transition={{ duration: 0.4 }}
            className={`focus:outline-none ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#F4C26B' : 'none'}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                stroke={filled ? '#F4C26B' : '#ffffff30'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        );
      })}
    </div>
  );
}

export function SteamAnimation({ className = '' }) {
  return (
    <div className={`flex gap-1 items-end ${className}`}>
      {[0,1,2].map(i => (
        <motion.div key={i}
          animate={{ y:[-4,-12,-4], opacity:[0,0.6,0], scaleX:[1,1.5,0.8] }}
          transition={{ duration:2, delay:i*0.4, repeat:Infinity, ease:'easeInOut' }}
          className="w-0.5 h-4 bg-gradient-to-t from-transparent via-white/40 to-transparent rounded-full"
        />
      ))}
    </div>
  );
}

export function SpinPlate({ children, className = '' }) {
  return (
    <motion.div whileHover={{ rotate:[0,-5,5,-3,3,0] }} transition={{ duration:0.5 }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  );
}

export function AnimatedCheckmark({ size = 56 }) {
  return (
    <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
      transition={{ type:'spring', stiffness:200, damping:15, delay:0.1 }}
      className="mx-auto mb-4" style={{ width:size, height:size }}>
      <svg viewBox="0 0 56 56" fill="none" width={size} height={size}>
        <motion.circle cx="28" cy="28" r="26" stroke="#22c55e" strokeWidth="2.5" fill="rgba(34,197,94,0.1)"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.5 }} />
        <motion.path d="M16 28 L24 36 L40 20" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.4, delay:0.4 }} />
      </svg>
    </motion.div>
  );
}

export function RippleButton({ children, className = '', onClick, type = 'button' }) {
  const [ripples, setRipples] = useState([]);
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
    onClick?.(e);
  };
  return (
    <button type={type} onClick={handleClick} className={`relative overflow-hidden ${className}`}>
      {children}
      <AnimatePresence>
        {ripples.map(({ id, x, y }) => (
          <motion.span key={id} className="absolute rounded-full bg-white/20 pointer-events-none"
            style={{ left:x, top:y, transform:'translate(-50%,-50%)' }}
            initial={{ width:0, height:0, opacity:0.5 }}
            animate={{ width:200, height:200, opacity:0 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.6, ease:'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </button>
  );
}

export function GlowCard({ children, className = '' }) {
  const [mousePos, setMousePos] = useState({ x:0, y:0 });
  const [hovered, setHovered]   = useState(false);
  return (
    <div
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setMousePos({ x:e.clientX-r.left, y:e.clientY-r.top }); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative ${className}`} style={{ overflow:'hidden' }}
    >
      <div className="absolute pointer-events-none transition-opacity duration-300 rounded-full"
        style={{ width:200, height:200, left:mousePos.x-100, top:mousePos.y-100,
          background:'radial-gradient(circle, rgba(217,119,6,0.15) 0%, transparent 70%)',
          opacity: hovered ? 1 : 0, zIndex:1 }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function PulseDot({ color = 'green', label = 'Open Now' }) {
  const colors = {
    green: { dot:'bg-green-400', ring:'bg-green-400', text:'text-green-400' },
    amber: { dot:'bg-amber-400', ring:'bg-amber-400', text:'text-amber-400' },
    red:   { dot:'bg-red-400',   ring:'bg-red-400',   text:'text-red-400'   },
  };
  const c = colors[color] || colors.green;
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span className={`absolute inline-flex h-3 w-3 rounded-full ${c.ring} opacity-75 animate-ping`} />
        <span className={`relative inline-flex h-3 w-3 rounded-full ${c.dot}`} />
      </div>
      <span className={`text-xs font-medium ${c.text}`}>{label}</span>
    </div>
  );
}
