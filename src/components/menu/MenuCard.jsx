// src/components/menu/MenuCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function MenuCard({ item }) {
  const [imgError, setImgError] = useState(false);

  const imageUrl = item.image_url
    ? item.image_url.startsWith('http')
      ? item.image_url
      : `${API_BASE}${item.image_url}`
    : null;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass rounded-2xl overflow-hidden group border border-white/5 hover:border-accent/30 transition-all duration-300 card-3d"
      style={{ '--tw-shadow-color': 'rgba(217,119,6,0.2)' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={item.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-bg flex items-center justify-center">
            <span className="text-5xl">🍽️</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: 'inset 0 0 30px rgba(217,119,6,0.15)' }} />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.featured && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-accent to-gold text-white">
              ★ FEATURED
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
            item.available ? 'badge-available' : 'badge-unavailable'
          }`}>
            {item.available ? 'Available' : 'Sold Out'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="font-display text-lg font-semibold text-cream group-hover:text-gold transition-colors leading-tight">
            {item.name}
          </h3>
          <span className="font-bold text-gradient text-lg shrink-0">
            LKR {parseFloat(item.price).toLocaleString()}
          </span>
        </div>

        <p className="text-cream/50 text-sm leading-relaxed line-clamp-2 mb-3">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium">
            {item.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
