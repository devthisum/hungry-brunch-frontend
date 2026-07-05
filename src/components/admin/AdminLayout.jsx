// src/components/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee, LayoutDashboard, UtensilsCrossed, Tags, Star, Image,
  Clock, Menu, X, LogOut, ChevronRight, CalendarCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { reservationAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newReservations, setNewReservations] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  // Poll for new reservations every 30 seconds
  useEffect(() => {
    const fetchCounts = () => {
      reservationAPI.getCounts()
        .then(res => setNewReservations(res.data.data.new))
        .catch(() => {});
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { to: '/admin/dashboard',    Icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/reservations', Icon: CalendarCheck,   label: 'Reservations', badge: newReservations },
    { to: '/admin/menu',         Icon: UtensilsCrossed, label: 'Menu Items' },
    { to: '/admin/categories',   Icon: Tags,            label: 'Categories' },
    { to: '/admin/reviews',      Icon: Star,            label: 'Reviews' },
    { to: '/admin/gallery',      Icon: Image,           label: 'Gallery' },
    { to: '/admin/hours',        Icon: Clock,           label: 'Opening Hours' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-gold flex items-center justify-center shadow-lg shadow-accent/30">
            <Coffee size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-cream text-sm">Hungry Brunch</p>
            <p className="text-[10px] text-gold/60 tracking-wider uppercase">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, Icon, label, badge }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-gradient-to-r from-accent/20 to-gold/10 text-gold border border-accent/20'
                  : 'text-cream/50 hover:text-cream hover:bg-white/5'
              }`}
            >
              <Icon size={17} className={active ? 'text-gold' : 'text-cream/40 group-hover:text-cream/70'} />
              <span className="flex-1">{label}</span>
              {/* New reservations badge */}
              {badge > 0 && (
                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {badge}
                </span>
              )}
              {active && !badge && <ChevronRight size={14} className="text-gold/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-white/5">
        <div className="glass rounded-xl p-3 mb-3 flex items-center gap-3 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center text-white text-xs font-bold">
            {admin?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-cream text-sm font-medium truncate">{admin?.username}</p>
            <p className="text-cream/40 text-xs">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-cream/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );

  const pageLabel = navItems.find(n => n.to === location.pathname)?.label || 'Admin';

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed top-0 left-0 bottom-0 admin-sidebar z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 admin-sidebar lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-dark border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-cream/60 hover:text-cream p-1"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display font-bold text-cream text-lg">{pageLabel}</h2>
                {/* Show new badge in header too when on other pages */}
                {newReservations > 0 && location.pathname !== '/admin/reservations' && (
                  <Link to="/admin/reservations">
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse hover:bg-blue-400 transition-colors">
                      {newReservations} new reservation{newReservations > 1 ? 's' : ''}
                    </span>
                  </Link>
                )}
              </div>
              <p className="text-cream/30 text-xs">Hungry Brunch Management</p>
            </div>
          </div>
          <Link to="/" className="text-xs text-cream/40 hover:text-cream transition-colors flex items-center gap-1">
            View Site →
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
