// src/pages/AboutPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Award, Leaf } from 'lucide-react';

const timeline = [
  { year: '2019', title: 'The Beginning', desc: 'Hungry Brunch opened its doors on DS Senanayake Veediya with just 10 tables and a dream to redefine brunch in Kandy.' },
  { year: '2020', title: 'Surviving & Thriving', desc: 'Even through the challenges of 2020, our loyal community kept us going. We introduced takeaway and new menu concepts.' },
  { year: '2021', title: 'Growing Family', desc: 'We expanded our kitchen, introduced our signature specialty coffee bar, and welcomed 500+ new regular customers.' },
  { year: '2022', title: 'Recognition', desc: 'Named Kandy\'s Best Brunch Spot by Sri Lanka Food Awards. Our Google rating hit 4.8 with over 800 reviews.' },
  { year: '2023', title: 'New Heights', desc: 'Launched our popular Weekend Brunch Box, introduced seasonal menus, and crossed 1,200 happy regulars.' },
  { year: '2024', title: 'Present Day', desc: 'Today we serve 200+ guests daily with a team of 25 passionate food lovers. The story continues.' },
];

const values = [
  { Icon: Leaf, title: 'Freshness First', desc: 'We partner with local farms and refuse to compromise on ingredient quality. Fresh daily, always.' },
  { Icon: Heart, title: 'Made with Love', desc: 'Every single dish that leaves our kitchen carries the care and passion of our dedicated team.' },
  { Icon: Users, title: 'Community', desc: 'We\'re more than a restaurant. We\'re a gathering place where friendships and memories are made.' },
  { Icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest standards in food, service, and the overall guest experience.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-4xl mx-auto"
        >
          <span className="text-accent text-sm font-medium tracking-widest uppercase mb-3 block">Our Story</span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-cream mb-6 leading-tight">
            A Café Born from <span className="text-gradient">Passion</span>
          </h1>
          <p className="text-cream/60 text-xl leading-relaxed max-w-2xl mx-auto">
            Hungry Brunch started as a simple idea: to create a place in Kandy where every meal felt like a warm embrace.
            Five years later, we're the city's most-loved dining destination.
          </p>
        </motion.div>
      </div>

      {/* Story section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-4xl font-bold text-cream mb-6">
              The Heart of Kandy's Food Scene
            </h2>
            <div className="space-y-4 text-cream/60 leading-relaxed">
              <p>
                Nestled on the vibrant DS Senanayake Veediya, Hungry Brunch Café & Restaurant was founded with
                one clear mission: to serve exceptional food in an atmosphere that feels like home.
              </p>
              <p>
                Our founders, who trained in Sri Lanka's finest kitchens and across Southeast Asia, returned to
                Kandy with a vision. They saw a city ready for something different — food that was creative,
                honest, and full of soul.
              </p>
              <p>
                Today, our team of 25 passionate individuals — from our chefs to our baristas — share that same
                commitment to excellence that opened our doors in 2019.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-10">
              {[
                { value: '25+', label: 'Team Members' },
                { value: '200+', label: 'Daily Guests' },
                { value: '4.9★', label: 'Google Rating' },
                { value: '5', label: 'Years Strong' },
              ].map(({ value, label }) => (
                <div key={label} className="glass rounded-2xl p-5 text-center border border-white/5">
                  <div className="font-display text-3xl font-bold text-gradient mb-1">{value}</div>
                  <div className="text-cream/50 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="glass rounded-3xl overflow-hidden border border-white/10 aspect-square max-w-md mx-auto">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"
                alt="Hungry Brunch interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 border border-gold/20"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">☕</span>
                <div>
                  <div className="text-cream font-semibold text-sm">Specialty Coffee</div>
                  <div className="text-gold/70 text-xs">Single origin · Expert brewed</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-accent text-sm font-medium tracking-widest uppercase mb-3 block">What We Stand For</span>
            <h2 className="font-display text-4xl font-bold text-cream">Our Values</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center border border-white/5 hover:border-accent/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={24} className="text-gold" />
                </div>
                <h3 className="font-display text-lg font-bold text-cream mb-2">{title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-accent text-sm font-medium tracking-widest uppercase mb-3 block">History</span>
            <h2 className="font-display text-4xl font-bold text-cream">Our Journey</h2>
          </motion.div>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-gold to-transparent hidden lg:block" />

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className={`${i % 2 !== 0 ? 'lg:text-right lg:order-2' : ''}`}>
                    <div className="glass rounded-2xl p-6 border border-white/5 hover:border-accent/20 transition-all">
                      <span className="text-accent font-bold text-sm tracking-wider">{item.year}</span>
                      <h3 className="font-display text-xl font-bold text-cream mt-1 mb-3">{item.title}</h3>
                      <p className="text-cream/50 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  {/* Center dot */}
                  <div className={`hidden lg:flex items-center justify-center ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-accent to-gold shadow-lg shadow-accent/30" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
