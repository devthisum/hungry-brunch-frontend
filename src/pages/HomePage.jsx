// src/pages/HomePage.jsx
import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedMenu from '../components/home/FeaturedMenu';
import WhyUs from '../components/home/WhyUs';
import TestimonialStrip from '../components/home/TestimonialStrip';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function CTABanner() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative glass rounded-3xl p-12 text-center overflow-hidden border border-accent/20"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-gold/5 pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative">
            <span className="text-4xl block mb-4">🍽️</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-cream mb-4">
              Ready to Dine with Us?
            </h2>
            <p className="text-cream/60 text-lg mb-8 max-w-xl mx-auto">
              Book your table today and experience the finest brunch in Kandy. Walk-ins always welcome.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary px-8 py-4 rounded-full text-base font-semibold">
                Reserve a Table
              </Link>
              <Link to="/menu" className="btn-outline px-8 py-4 rounded-full text-base font-semibold">
                Explore Menu
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedMenu />
      <WhyUs />
      <TestimonialStrip />
      <CTABanner />
    </div>
  );
}
