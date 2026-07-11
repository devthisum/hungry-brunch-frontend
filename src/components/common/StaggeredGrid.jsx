// src/components/common/StaggeredGrid.jsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function WaveGrid({ children, className = '', cols = 3 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const childArray = React.Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const delay = row * 0.1 + col * 0.08;
        return (
          <motion.div key={i}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}

export function StaggeredGrid({ children, className = '', staggerDelay = 0.08, initialDelay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: staggerDelay, delayChildren: initialDelay } },
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };
  return (
    <motion.div ref={ref} variants={container} initial="hidden" animate={inView ? 'show' : 'hidden'} className={className}>
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  );
}

export function CascadeList({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, i) => (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.5, delay: i * 0.07, ease: 'easeOut' }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

export default StaggeredGrid;
