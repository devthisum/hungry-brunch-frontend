// src/pages/OffersPage.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Clock, Percent, ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { promotionAPI } from '../utils/api';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

function OfferCard({ promo, index }) {
  const isExpiringSoon = promo.valid_until && 
    new Date(promo.valid_until) - new Date() < 3 * 24 * 60 * 60 * 1000;

  const imageUrl = promo.image_url
    ? promo.image_url.startsWith('http') ? promo.image_url : `${API_BASE}${promo.image_url}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="glass rounded-3xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={promo.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-gold/10 flex items-center justify-center">
            <Percent size={48} className="text-accent/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-accent to-gold text-white shadow-lg">
            {promo.badge_text || 'Special Offer'}
          </span>
          {isExpiringSoon && (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-500 text-white flex items-center gap-1">
              <Flame size={10} /> Ending Soon
            </span>
          )}
        </div>

        {/* Discount badge */}
        {promo.discount && (
          <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-accent to-gold flex flex-col items-center justify-center shadow-xl">
            <span className="text-white font-black text-sm leading-none">{promo.discount}</span>
            <span className="text-white/80 text-[9px]">OFF</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-cream mb-2 group-hover:text-gold transition-colors">
          {promo.title}
        </h3>
        {promo.description && (
          <p className="text-cream/50 text-sm leading-relaxed mb-4">{promo.description}</p>
        )}

        {/* Validity */}
        {(promo.valid_from || promo.valid_until) && (
          <div className="flex items-center gap-2 text-cream/40 text-xs mb-5">
            <Clock size={12} />
            <span>
              {promo.valid_from && `From ${new Date(promo.valid_from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              {promo.valid_from && promo.valid_until && ' — '}
              {promo.valid_until && `Until ${new Date(promo.valid_until).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            </span>
          </div>
        )}

        <Link to="/contact"
          className="inline-flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold group/btn">
          Reserve Now
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function OffersPage() {
  const [promos, setPromos]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    promotionAPI.getAll(true)
      .then(res => setPromos(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="py-16 px-4 text-center bg-gradient-to-b from-secondary/30 to-transparent mb-8 relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative">
          <span className="text-accent text-sm font-medium tracking-widest uppercase mb-3 block">Limited Time</span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-cream mb-4">
            Special <span className="text-gradient">Offers</span>
          </h1>
          <p className="text-cream/50 max-w-xl mx-auto text-lg">
            Exclusive deals and seasonal promotions — only at Hungry Brunch.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton rounded-3xl h-80" />
            ))}
          </div>
        ) : promos.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-24">
            <Tag size={56} className="text-cream/15 mx-auto mb-6" />
            <h2 className="font-display text-3xl font-bold text-cream mb-3">No Active Offers</h2>
            <p className="text-cream/40 text-lg mb-8">Check back soon — we regularly update our promotions!</p>
            <Link to="/menu" className="btn-primary px-8 py-4 rounded-full text-sm font-semibold inline-flex items-center gap-2">
              Explore Our Menu <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Promo count */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-cream/30 text-sm mb-8 text-center">
              {promos.length} active offer{promos.length !== 1 ? 's' : ''} available right now
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.map((promo, i) => (
                <OfferCard key={promo.id} promo={promo} index={i} />
              ))}
            </div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 glass rounded-3xl p-10 text-center border border-accent/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
              <div className="relative">
                <span className="text-4xl block mb-4">🎉</span>
                <h2 className="font-display text-3xl font-bold text-cream mb-3">Ready to Dine?</h2>
                <p className="text-cream/50 mb-6">Book your table now and enjoy these exclusive offers.</p>
                <Link to="/contact" className="btn-primary px-8 py-4 rounded-full text-base font-semibold inline-flex items-center gap-2">
                  Reserve a Table <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
