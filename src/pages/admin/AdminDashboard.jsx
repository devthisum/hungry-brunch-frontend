// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import {
  UtensilsCrossed, Star, Tags, Image,
  TrendingUp, CalendarCheck, Clock, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsAPI, reservationAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ Icon, label, value, sub, color, to, badge }) {
  const Inner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className={`glass rounded-2xl p-6 border border-white/5 hover:border-accent/20 transition-all group relative overflow-hidden ${to ? 'cursor-pointer' : ''}`}
    >
      {/* subtle bg glow */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br opacity-10 blur-2xl from-accent to-gold pointer-events-none" />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="flex items-center gap-2">
          {badge > 0 && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              {badge} new
            </span>
          )}
          <TrendingUp size={14} className="text-green-400/50" />
        </div>
      </div>
      <div className="font-display text-3xl font-bold text-cream mb-1">{value}</div>
      <p className="text-cream/60 text-sm">{label}</p>
      {sub && <p className="text-cream/30 text-xs mt-1">{sub}</p>}
      {to && (
        <div className="flex items-center gap-1 mt-3 text-accent text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          Manage <ArrowRight size={11} />
        </div>
      )}
    </motion.div>
  );

  return to ? <Link to={to}>{Inner}</Link> : Inner;
}

// ── Recent reservation row ─────────────────────────────────────────────────
function RecentRow({ r }) {
  const STATUS_STYLES = {
    new:       'bg-blue-500/15 border-blue-500/30 text-blue-300',
    confirmed: 'bg-green-500/15 border-green-500/30 text-green-300',
    cancelled: 'bg-red-500/15 border-red-500/30 text-red-300',
  };
  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center text-white font-bold text-xs shrink-0">
        {r.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-cream text-sm font-medium truncate">{r.name}</p>
        <p className="text-cream/40 text-xs truncate">{r.email}</p>
      </div>
      <div className="text-right shrink-0">
        {r.date && (
          <p className="text-cream/70 text-xs">
            {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {r.time && ` · ${r.time.slice(0, 5)}`}
          </p>
        )}
        <p className="text-cream/40 text-xs">{r.guests} guests</p>
      </div>
      <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium shrink-0 ${STATUS_STYLES[r.status]}`}>
        {r.status}
      </span>
    </div>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats]               = useState(null);
  const [recentRes, setRecentRes]       = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsAPI.get(),
      reservationAPI.getAll(),
    ]).then(([statsRes, resRes]) => {
      setStats(statsRes.data.data);
      // show latest 5
      setRecentRes(resRes.data.data.slice(0, 5));
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Chart config
  const chartOpts = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1C1C1C', titleColor: '#FFF8E7', bodyColor: '#a78050' },
    },
    scales: {
      x: { ticks: { color: '#FFF8E780' }, grid: { color: '#ffffff08' } },
      y: { ticks: { color: '#FFF8E780' }, grid: { color: '#ffffff08' } },
    },
  };

  const barData = stats ? {
    labels: stats.categoryBreakdown.map(c => c.category),
    datasets: [{
      label: 'Items',
      data: stats.categoryBreakdown.map(c => c.count),
      backgroundColor: 'rgba(217,119,6,0.6)',
      borderColor: '#D97706',
      borderWidth: 1,
      borderRadius: 6,
    }],
  } : null;

  const doughnutData = stats ? {
    labels: stats.ratingDistribution.map(r => `${r.rating} ★`),
    datasets: [{
      data: stats.ratingDistribution.map(r => r.count),
      backgroundColor: ['#D97706','#F4C26B','#92400e','#451a03','#1C1C1C'],
      borderWidth: 0,
    }],
  } : null;

  if (loading) return (
    <AdminLayout>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_,i) => <div key={i} className="skeleton rounded-2xl h-36" />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_,i) => <div key={i} className="skeleton rounded-2xl h-64" />)}
      </div>
    </AdminLayout>
  );

  const adminUser = (() => {
    try { return JSON.parse(localStorage.getItem('hb_admin'))?.username || 'Admin'; }
    catch { return 'Admin'; }
  })();

  return (
    <AdminLayout>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-cream">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {adminUser} 👋
        </h1>
        <p className="text-cream/40 text-sm mt-1">Here's what's happening at Hungry Brunch today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          Icon={CalendarCheck}
          label="Reservations"
          value={stats?.totalReservations ?? 0}
          sub={`${stats?.newReservations ?? 0} pending`}
          color="bg-gradient-to-br from-blue-500 to-blue-700"
          to="/admin/reservations"
          badge={stats?.newReservations ?? 0}
        />
        <StatCard
          Icon={UtensilsCrossed}
          label="Menu Items"
          value={stats?.menuTotal ?? 0}
          sub={`${stats?.menuAvailable ?? 0} available`}
          color="bg-gradient-to-br from-accent to-amber-700"
          to="/admin/menu"
        />
        <StatCard
          Icon={Star}
          label="Reviews"
          value={stats?.reviewTotal ?? 0}
          sub={`Avg ${stats?.averageRating ?? '—'} stars`}
          color="bg-gradient-to-br from-gold to-amber-600"
          to="/admin/reviews"
        />
        <StatCard
          Icon={Image}
          label="Gallery"
          value={stats?.galleryTotal ?? 0}
          color="bg-gradient-to-br from-purple-600 to-purple-900"
          to="/admin/gallery"
        />
      </div>

      {/* Charts + recent reservations */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Bar chart */}
        <div className="glass rounded-2xl p-6 border border-white/5 lg:col-span-1">
          <h3 className="font-display text-lg font-semibold text-cream mb-6">Menu by Category</h3>
          {barData
            ? <Bar data={barData} options={chartOpts} />
            : <p className="text-cream/30 text-sm text-center py-8">No data</p>
          }
        </div>

        {/* Recent reservations */}
        <div className="glass rounded-2xl p-6 border border-white/5 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-semibold text-cream">Recent Reservations</h3>
            <Link
              to="/admin/reservations"
              className="text-accent text-xs hover:text-gold transition-colors flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentRes.length === 0 ? (
            <div className="text-center py-12">
              <CalendarCheck size={36} className="text-cream/15 mx-auto mb-3" />
              <p className="text-cream/30 text-sm">No reservations yet</p>
              <p className="text-cream/20 text-xs mt-1">They'll appear here when customers book via the website</p>
            </div>
          ) : (
            <div>
              {recentRes.map(r => <RecentRow key={r.id} r={r} />)}
            </div>
          )}
        </div>
      </div>

      {/* Rating chart + quick actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Doughnut */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-display text-lg font-semibold text-cream mb-6">Rating Distribution</h3>
          {doughnutData ? (
            <div className="max-w-xs mx-auto">
              <Doughnut
                data={doughnutData}
                options={{
                  ...chartOpts,
                  plugins: {
                    ...chartOpts.plugins,
                    legend: {
                      display: true,
                      labels: { color: '#FFF8E7', font: { family: 'Poppins', size: 12 } },
                    },
                  },
                }}
              />
            </div>
          ) : <p className="text-cream/30 text-sm text-center py-8">No reviews yet</p>}
        </div>

        {/* Quick actions */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-display text-lg font-semibold text-cream mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'View Reservations', href: '/admin/reservations', emoji: '📅', highlight: (stats?.newReservations ?? 0) > 0 },
              { label: 'Add Menu Item',      href: '/admin/menu',         emoji: '🍽️', highlight: false },
              { label: 'Add Review',         href: '/admin/reviews',      emoji: '⭐', highlight: false },
              { label: 'Upload Photo',       href: '/admin/gallery',      emoji: '🖼️', highlight: false },
              { label: 'Manage Categories',  href: '/admin/categories',   emoji: '🏷️', highlight: false },
              { label: 'Edit Hours',         href: '/admin/hours',        emoji: '🕐', highlight: false },
            ].map(({ label, href, emoji, highlight }) => (
              <Link
                key={label}
                to={href}
                className={`glass rounded-xl p-4 text-center border transition-all group ${
                  highlight
                    ? 'border-blue-500/40 hover:border-blue-400/60 bg-blue-500/5'
                    : 'border-white/5 hover:border-accent/30'
                }`}
              >
                <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">
                  {emoji}
                </span>
                <span className="text-cream/60 group-hover:text-cream transition-colors text-xs">
                  {label}
                </span>
                {highlight && (
                  <span className="block mt-1 text-[10px] text-blue-300 font-medium">
                    {stats?.newReservations} pending
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
