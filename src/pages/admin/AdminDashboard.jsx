// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend, ArcElement
} from 'chart.js';
import { UtensilsCrossed, Star, Tags, Image, TrendingUp, CheckCircle } from 'lucide-react';
import { analyticsAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function StatCard({ Icon, label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-white/5 hover:border-accent/20 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <TrendingUp size={14} className="text-green-400/60" />
      </div>
      <div className="font-display text-3xl font-bold text-cream mb-1">{value}</div>
      <p className="text-cream/60 text-sm">{label}</p>
      {sub && <p className="text-cream/30 text-xs mt-1">{sub}</p>}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.get()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chartOpts = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1C1C1C', titleColor: '#FFF8E7', bodyColor: '#a78050' } },
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
      backgroundColor: 'rgba(217, 119, 6, 0.6)',
      borderColor: '#D97706',
      borderWidth: 1,
      borderRadius: 6,
    }],
  } : null;

  const doughnutData = stats ? {
    labels: stats.ratingDistribution.map(r => `${r.rating} Stars`),
    datasets: [{
      data: stats.ratingDistribution.map(r => r.count),
      backgroundColor: ['#D97706', '#F4C26B', '#92400e', '#451a03', '#1C1C1C'],
      borderWidth: 0,
    }],
  } : null;

  if (loading) return (
    <AdminLayout>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton rounded-2xl h-32" />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => <div key={i} className="skeleton rounded-2xl h-64" />)}
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-cream">Dashboard Overview</h1>
        <p className="text-cream/40 text-sm mt-1">Welcome back, {localStorage.getItem('hb_admin') ? JSON.parse(localStorage.getItem('hb_admin')).username : 'Admin'}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard Icon={UtensilsCrossed} label="Total Menu Items" value={stats?.menuTotal ?? 0} sub={`${stats?.menuAvailable ?? 0} available`} color="bg-gradient-to-br from-accent to-amber-700" />
        <StatCard Icon={Star} label="Reviews" value={stats?.reviewTotal ?? 0} sub={`Avg ${stats?.averageRating ?? '—'} stars`} color="bg-gradient-to-br from-gold to-amber-600" />
        <StatCard Icon={Tags} label="Categories" value={stats?.categoryTotal ?? 0} color="bg-gradient-to-br from-purple-600 to-purple-900" />
        <StatCard Icon={Image} label="Gallery Images" value={stats?.galleryTotal ?? 0} color="bg-gradient-to-br from-blue-600 to-blue-900" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-display text-lg font-semibold text-cream mb-6">Menu by Category</h3>
          {barData ? <Bar data={barData} options={chartOpts} /> : <div className="text-cream/30 text-sm text-center py-8">No data</div>}
        </div>
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-display text-lg font-semibold text-cream mb-6">Rating Distribution</h3>
          {doughnutData ? (
            <div className="max-w-xs mx-auto">
              <Doughnut
                data={doughnutData}
                options={{ ...chartOpts, plugins: { ...chartOpts.plugins, legend: { display: true, labels: { color: '#FFF8E7', font: { family: 'Poppins', size: 12 } } } } }}
              />
            </div>
          ) : <div className="text-cream/30 text-sm text-center py-8">No data</div>}
        </div>
      </div>

      {/* Quick actions */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <h3 className="font-display text-lg font-semibold text-cream mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Menu Item', href: '/admin/menu', emoji: '🍽️' },
            { label: 'Manage Categories', href: '/admin/categories', emoji: '🏷️' },
            { label: 'Add Review', href: '/admin/reviews', emoji: '⭐' },
            { label: 'Upload to Gallery', href: '/admin/gallery', emoji: '🖼️' },
          ].map(({ label, href, emoji }) => (
            <a
              key={label}
              href={href}
              className="glass rounded-xl p-4 text-center border border-white/5 hover:border-accent/30 transition-all group text-sm"
            >
              <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">{emoji}</span>
              <span className="text-cream/60 group-hover:text-cream transition-colors text-xs">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
