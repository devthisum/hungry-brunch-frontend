// src/components/home/TestimonialStrip.jsx
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { reviewAPI } from '../../utils/api';

function ReviewCard({ review }) {
  return (
    <div className="glass rounded-2xl p-6 min-w-[300px] max-w-[300px] flex-shrink-0 border border-white/5">
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} className={i < review.rating ? 'text-gold fill-gold' : 'text-white/20'} />
        ))}
      </div>
      <p className="text-cream/70 text-sm leading-relaxed mb-4 line-clamp-3">
        "{review.comment}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center text-white text-xs font-bold">
          {review.customer_name.charAt(0)}
        </div>
        <span className="text-cream text-sm font-medium">{review.customer_name}</span>
      </div>
    </div>
  );
}

export default function TestimonialStrip() {
  const [reviews, setReviews] = useState([]);
  const trackRef = useRef(null);

  useEffect(() => {
    reviewAPI.getAll(true).then(res => setReviews(res.data.data)).catch(() => {});
  }, []);

  // Auto-scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track || reviews.length === 0) return;
    let pos = 0;
    const speed = 0.5;
    const animate = () => {
      pos += speed;
      if (pos >= track.scrollWidth / 2) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(animate);
    };
    let raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [reviews]);

  const doubled = [...reviews, ...reviews]; // duplicate for infinite loop

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-accent text-sm font-medium tracking-widest uppercase mb-3 block">
            What People Say
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-cream mb-4">
            Loved by Kandy
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-gold fill-gold" />)}
            </div>
            <span className="font-display text-2xl font-bold text-gradient">4.9/5</span>
            <span className="text-cream/40">· 1,500+ Google Reviews</span>
          </div>
        </motion.div>
      </div>

      {/* Scrolling track */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />
        <div className="overflow-hidden">
          <div ref={trackRef} className="flex gap-5 w-max">
            {doubled.map((review, i) => (
              <ReviewCard key={`${review.id}-${i}`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
