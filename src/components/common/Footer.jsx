// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#080808] border-t border-white/5 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center">
                <Coffee size={20} className="text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-cream block">Hungry Brunch</span>
                <span className="text-[10px] text-gold/70 tracking-widest uppercase">Café & Restaurant</span>
              </div>
            </Link>
            <p className="text-cream/50 text-sm leading-relaxed mb-5">
              Kandy's finest dining destination. Fresh food, cozy vibes, and unforgettable moments since 2019.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  aria-label={label}
                  className="w-9 h-9 glass rounded-full flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold/30 transition-colors"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-cream font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/menu', label: 'Our Menu' },
                { to: '/about', label: 'About Us' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/reviews', label: 'Reviews' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-cream/50 hover:text-gold text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent group-hover:w-3 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-display text-cream font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={16} className="text-accent mt-0.5 shrink-0" />
                <span className="text-cream/50 text-sm">
                  No 99, 2 DS Senanayake Veediya,<br />Kandy, Sri Lanka
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={16} className="text-accent shrink-0" />
                <a href="tel:0776057554" className="text-cream/50 hover:text-gold text-sm transition-colors">
                  077 605 7554
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Clock size={16} className="text-accent shrink-0" />
                <span className="text-cream/50 text-sm">8:00 AM – 10:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Opening hours */}
          <div>
            <h4 className="font-display text-cream font-semibold mb-4">Hours</h4>
            <ul className="space-y-2">
              {[
                { day: 'Mon – Thu', time: '8:00 AM – 10:00 PM' },
                { day: 'Fri', time: '8:00 AM – 11:00 PM' },
                { day: 'Sat', time: '7:30 AM – 11:00 PM' },
                { day: 'Sun', time: '7:30 AM – 10:00 PM' },
              ].map(({ day, time }) => (
                <li key={day} className="flex justify-between text-sm">
                  <span className="text-cream/40">{day}</span>
                  <span className="text-gold/80">{time}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs">Open Now</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-cream/30 text-xs">
            © {year} Hungry Brunch Café & Restaurant. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link to="/admin/login" className="text-cream/20 hover:text-cream/40 text-xs transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
