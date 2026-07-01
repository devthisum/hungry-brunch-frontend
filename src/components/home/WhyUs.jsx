// src/components/home/WhyUs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Clock, Award, Heart, Utensils, Coffee } from 'lucide-react';

const features = [
  {
    Icon: Leaf,
    title: 'Farm Fresh Ingredients',
    desc: 'We source only the freshest produce from local farms around Kandy every single day.',
    color: 'from-green-500/20 to-green-500/5',
    border: 'border-green-500/20',
  },
  {
    Icon: Award,
    title: 'Award-Winning Cuisine',
    desc: 'Recognised as Kandy\'s best brunch destination, three years running.',
    color: 'from-gold/20 to-gold/5',
    border: 'border-gold/20',
  },
  {
    Icon: Clock,
    title: 'Open Every Day',
    desc: 'From 8 AM to 10 PM daily. Whether it\'s breakfast or a late dinner, we\'re here.',
    color: 'from-blue-500/20 to-blue-500/5',
    border: 'border-blue-500/20',
  },
  {
    Icon: Heart,
    title: 'Made with Passion',
    desc: 'Every dish is crafted with genuine love. You can taste the difference.',
    color: 'from-rose-500/20 to-rose-500/5',
    border: 'border-rose-500/20',
  },
  {
    Icon: Coffee,
    title: 'Specialty Coffee',
    desc: 'Single-origin beans, expert baristas, and coffee drinks that deserve a moment.',
    color: 'from-accent/20 to-accent/5',
    border: 'border-accent/20',
  },
  {
    Icon: Utensils,
    title: 'Global Flavours',
    desc: 'From Sri Lankan classics to international favourites — our menu spans the world.',
    color: 'from-purple-500/20 to-purple-500/5',
    border: 'border-purple-500/20',
  },
];

export default function WhyUs() {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-accent text-sm font-medium tracking-widest uppercase mb-3 block">
            Why Hungry Brunch
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-cream mb-4">
            What Makes Us Special
          </h2>
          <p className="text-cream/50 max-w-xl mx-auto">
            We're not just a restaurant — we're a Kandy institution. Here's why our guests keep coming back.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ Icon, title, desc, color, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`glass rounded-2xl p-6 border ${border} group transition-all duration-300 hover:glow-amber`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} className="text-cream" />
              </div>
              <h3 className="font-display text-lg font-semibold text-cream mb-2">{title}</h3>
              <p className="text-cream/50 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
