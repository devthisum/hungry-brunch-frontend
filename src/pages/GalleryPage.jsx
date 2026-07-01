// src/pages/GalleryPage.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { galleryAPI } from '../utils/api';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Fallback gallery images
const FALLBACK_GALLERY = [
  { id: 1, image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', caption: 'Our signature plates', category: 'food' },
  { id: 2, image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600', caption: 'Cozy interior', category: 'interior' },
  { id: 3, image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600', caption: 'Pancake perfection', category: 'food' },
  { id: 4, image_url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600', caption: 'Specialty coffee', category: 'food' },
  { id: 5, image_url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600', caption: 'Weekend brunch events', category: 'events' },
  { id: 6, image_url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600', caption: 'Morning toast', category: 'food' },
  { id: 7, image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600', caption: 'House tiramisu', category: 'food' },
  { id: 8, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', caption: 'Signature burger', category: 'food' },
  { id: 9, image_url: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600', caption: 'Fresh mocktails', category: 'food' },
  { id: 10, image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600', caption: 'Dining area', category: 'interior' },
  { id: 11, image_url: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600', caption: 'Matcha art', category: 'food' },
  { id: 12, image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', caption: 'Grilled salmon', category: 'food' },
];

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    galleryAPI.getAll()
      .then(res => {
        const data = res.data.data;
        setImages(data.length > 0 ? data : FALLBACK_GALLERY);
      })
      .catch(() => setImages(FALLBACK_GALLERY))
      .finally(() => setLoading(false));
  }, []);

  const filters = ['all', 'food', 'interior', 'events'];
  const filtered = activeFilter === 'all' ? images : images.filter(i => i.category === activeFilter);

  const getImageUrl = (img) => img.image_url.startsWith('http') ? img.image_url : `${API_BASE}${img.image_url}`;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="py-16 px-4 text-center bg-gradient-to-b from-secondary/30 to-transparent mb-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-accent text-sm font-medium tracking-widest uppercase mb-3 block">Gallery</span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-cream mb-4">Through Our Lens</h1>
          <p className="text-cream/50 max-w-xl mx-auto">A visual journey through our food, our space, and the moments that make Hungry Brunch special.</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-3 mb-10"
        >
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                activeFilter === f
                  ? 'bg-gradient-to-r from-accent to-gold text-white shadow-lg shadow-accent/20'
                  : 'glass border border-white/10 text-cream/60 hover:text-cream hover:border-accent/30'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Masonry grid */}
        {loading ? (
          <div className="masonry-grid">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="masonry-item skeleton rounded-2xl" style={{ height: `${200 + (i % 3) * 80}px` }} />
            ))}
          </div>
        ) : (
          <motion.div layout className="masonry-grid">
            <AnimatePresence>
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="masonry-item relative group cursor-pointer overflow-hidden rounded-2xl"
                  onClick={() => setLightbox(img)}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={img.caption || 'Gallery'}
                    className="w-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl flex flex-col items-center justify-center gap-2">
                    <ZoomIn size={28} className="text-white" />
                    {img.caption && (
                      <p className="text-white text-sm font-medium px-4 text-center">{img.caption}</p>
                    )}
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-black/60 text-cream capitalize">
                      {img.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={getImageUrl(lightbox)}
                alt={lightbox.caption}
                className="w-full h-full object-contain rounded-2xl max-h-[80vh]"
              />
              {lightbox.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
                  <p className="text-white font-medium">{lightbox.caption}</p>
                </div>
              )}
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
