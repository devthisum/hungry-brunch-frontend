// src/pages/ReviewsPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { reviewAPI } from '../utils/api';

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={size} className={i < rating ? 'text-gold fill-gold' : 'text-white/20 fill-white/10'} />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const initials = review.customer_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="glass rounded-2xl p-7 border border-white/5 h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-cream font-semibold">{review.customer_name}</p>
            <p className="text-cream/30 text-xs mt-0.5">
              {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-cream/60 text-sm leading-relaxed flex-1">"{review.comment}"</p>
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    reviewAPI.getAll()
      .then(res => setReviews(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const perPage = 3;
  const totalSlides = Math.ceil(reviews.length / perPage);
  const visible = reviews.slice(slide * perPage, (slide + 1) * perPage);

  const prev = () => setSlide(s => (s === 0 ? totalSlides - 1 : s - 1));
  const next = () => setSlide(s => (s === totalSlides - 1 ? 0 : s + 1));

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: reviews.filter(rv => rv.rating === r).length,
    pct: reviews.length ? Math.round(reviews.filter(rv => rv.rating === r).length / reviews.length * 100) : 0,
  }));

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="py-16 px-4 text-center bg-gradient-to-b from-secondary/30 to-transparent mb-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-accent text-sm font-medium tracking-widest uppercase mb-3 block">Testimonials</span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-cream mb-4">What Our Guests Say</h1>
          <p className="text-cream/50 max-w-xl mx-auto">Over 1,500 verified reviews — read what makes Hungry Brunch Kandy's most-loved restaurant.</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Rating overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-8 mb-16 border border-white/5 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div className="text-center">
              <div className="font-display text-7xl font-bold text-gradient mb-2">{avgRating}</div>
              <StarRating rating={5} size={20} />
              <p className="text-cream/40 text-sm mt-2">out of 5 — {reviews.length} reviews</p>
            </div>
            <div className="space-y-3">
              {ratingDist.map(({ rating, count, pct }) => (
                <div key={rating} className="flex items-center gap-3 text-sm">
                  <span className="text-cream/50 w-4">{rating}</span>
                  <Star size={12} className="text-gold fill-gold shrink-0" />
                  <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="h-full bg-gradient-to-r from-accent to-gold rounded-full"
                    />
                  </div>
                  <span className="text-cream/40 text-xs w-8">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Carousel */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton rounded-2xl h-48" />)}
          </div>
        ) : (
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {visible.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Nav */}
            {totalSlides > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button onClick={prev} className="w-10 h-10 glass rounded-full flex items-center justify-center text-cream/60 hover:text-gold border border-white/10 hover:border-gold/30 transition-all">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-2">
                  {[...Array(totalSlides)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlide(i)}
                      className={`transition-all rounded-full ${i === slide ? 'w-8 h-2 bg-gradient-to-r from-accent to-gold' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                    />
                  ))}
                </div>
                <button onClick={next} className="w-10 h-10 glass rounded-full flex items-center justify-center text-cream/60 hover:text-gold border border-white/10 hover:border-gold/30 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
