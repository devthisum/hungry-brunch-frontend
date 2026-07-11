// src/components/common/MagneticButton.jsx
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MagneticButton({ children, className = '', strength = 0.3, onClick, href }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ x: (e.clientX - rect.left - rect.width / 2) * strength, y: (e.clientY - rect.top - rect.height / 2) * strength });
  };

  return (
    <motion.div ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setPos({ x: 0, y: 0 }); setHovered(false); }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      <motion.span animate={{ scale: hovered ? 1.05 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="block">
        {children}
      </motion.span>
    </motion.div>
  );
}

export function MagneticCTA({ children, href, onClick, className = '', outline = false }) {
  const inner = (
    <span className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-shadow duration-300 hover:shadow-xl hover:shadow-accent/30 ${outline ? 'btn-outline' : 'btn-primary'} ${className}`}>
      {children}
    </span>
  );

  return (
    <MagneticButton strength={0.4} onClick={onClick}>
      {href ? <Link to={href}>{inner}</Link> : inner}
    </MagneticButton>
  );
}
