// src/components/common/MobileNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, UtensilsCrossed, Tag, Calendar, Grid } from 'lucide-react';

const navItems = [
  { to: '/',        Icon: Home,            label: 'Home'    },
  { to: '/menu',    Icon: UtensilsCrossed, label: 'Menu'    },
  { to: '/offers',  Icon: Tag,             label: 'Offers'  },
  { to: '/gallery', Icon: Grid,            label: 'Gallery' },
  { to: '/contact', Icon: Calendar,        label: 'Reserve' },
];

export default function MobileNav() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-dark border-t border-white/10 px-2 pb-1">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ to, Icon, label }) => {
            const active = location.pathname === to;
            const isReserve = to === '/contact';
            return (
              <Link key={to} to={to} className="flex flex-col items-center gap-0.5 px-3 py-2 relative">
                <AnimatePresence>
                  {active && (
                    <motion.div layoutId="mob-nav"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-accent to-gold"
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
                <motion.div
                  animate={{ scale: active ? 1.15 : 1, y: active ? -2 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {isReserve ? (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center shadow-lg shadow-accent/40 -mt-4">
                      <Icon size={18} className="text-white" />
                    </div>
                  ) : (
                    <Icon size={20} className={`transition-colors duration-200 ${active ? 'text-gold' : 'text-cream/40'}`} />
                  )}
                </motion.div>
                <span className={`text-[9px] font-medium transition-colors ${active ? 'text-gold' : 'text-cream/30'} ${isReserve ? 'mt-1' : ''}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
