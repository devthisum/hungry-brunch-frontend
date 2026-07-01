// src/components/common/LoadingScreen.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] bg-bg flex flex-col items-center justify-center"
    >
      {/* Glow ring */}
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-accent/20 blur-xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-full border-2 border-transparent border-t-accent border-r-gold"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Coffee size={28} className="text-gold" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <p className="font-display text-2xl text-cream mb-1">Hungry Brunch</p>
        <p className="text-cream/40 text-xs tracking-widest uppercase">Loading the experience…</p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '200px' }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="mt-8 h-0.5 bg-gradient-to-r from-accent to-gold rounded-full"
      />
    </motion.div>
  );
}
