// src/pages/admin/AdminReservations.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Users, Phone, Mail, MessageSquare,
  CheckCircle, XCircle, Trash2, RefreshCw, X, Filter
} from 'lucide-react';
import { reservationAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

// Status badge colours
const STATUS_STYLES = {
  new:       'bg-blue-500/15 border-blue-500/30 text-blue-300',
  confirmed: 'bg-green-500/15 border-green-500/30 text-green-300',
  cancelled: 'bg-red-500/15 border-red-500/30 text-red-300',
};

const STATUS_LABELS = { new: '🔵 New', confirmed: '✅ Confirmed', cancelled: '❌ Cancelled' };

// Detail modal
function ReservationModal({ reservation: r, onClose, onStatusChange, onDelete }) {
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (status) => {
    setUpdating(true);
    await onStatusChange(r.id, status);
    setUpdating(false);
    onClose();
  };

  const handleDelete = async () => {
    await onDelete(r.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] modal-overlay flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        onClick={e => e.stopPropagation()}
        className="glass rounded-3xl p-8 border border-white/10 w-full max-w-lg"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-cream">{r.name}</h2>
            <span className={`text-xs px-3 py-1 rounded-full border font-medium mt-2 inline-block ${STATUS_STYLES[r.status]}`}>
              {STATUS_LABELS[r.status]}
            </span>
          </div>
          <button onClick={onClose} className="text-cream/40 hover:text-cream p-1">
            <X size={20} />
          </button>
        </div>

        {/* Details grid */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-cream/40 text-xs mb-1">
                <Mail size={12} /> Email
              </div>
              <p className="text-cream text-sm font-medium break-all">{r.email}</p>
            </div>
            <div className="glass rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-cream/40 text-xs mb-1">
                <Phone size={12} /> Phone
              </div>
              <p className="text-cream text-sm font-medium">{r.phone || '—'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="glass rounded-xl p-4 border border-white/5 text-center">
              <div className="flex items-center justify-center gap-1 text-cream/40 text-xs mb-1">
                <Calendar size={12} /> Date
              </div>
              <p className="text-cream text-sm font-semibold">
                {r.date ? new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
              </p>
            </div>
            <div className="glass rounded-xl p-4 border border-white/5 text-center">
              <div className="flex items-center justify-center gap-1 text-cream/40 text-xs mb-1">
                <Clock size={12} /> Time
              </div>
              <p className="text-cream text-sm font-semibold">{r.time ? r.time.slice(0, 5) : '—'}</p>
            </div>
            <div className="glass rounded-xl p-4 border border-white/5 text-center">
              <div className="flex items-center justify-center gap-1 text-cream/40 text-xs mb-1">
                <Users size={12} /> Guests
              </div>
              <p className="text-cream text-sm font-semibold">{r.guests}</p>
            </div>
          </div>

          {r.message && (
            <div className="glass rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-cream/40 text-xs mb-2">
                <MessageSquare size={12} /> Special Requests
              </div>
              <p className="text-cream/80 text-sm leading-relaxed">{r.message}</p>
            </div>
          )}

          <div className="text-cream/30 text-xs text-right">
            Received: {new Date(r.created_at).toLocaleString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {r.status !== 'confirmed' && (
            <button
              onClick={() => handleStatus('confirmed')}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            >
              <CheckCircle size={16} /> Confirm Reservation
            </button>
          )}
          {r.status !== 'cancelled' && (
            <button
              onClick={() => handleStatus('cancelled')}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            >
              <XCircle size={16} /> Cancel Reservation
            </button>
          )}
          {r.status === 'cancelled' && (
            <button
              onClick={() => handleStatus('new')}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 glass border border-white/10 text-cream/60 hover:text-cream py-3 rounded-xl text-sm font-semibold transition-all"
            >
              <RefreshCw size={16} /> Mark as New
            </button>
          )}
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 text-cream/30 hover:text-red-400 py-2 text-sm transition-colors"
          >
            <Trash2 size={14} /> Delete permanently
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Reservation row card
function ReservationCard({ reservation: r, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="glass rounded-2xl p-5 border border-white/5 hover:border-accent/25 transition-all cursor-pointer group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center text-white font-bold text-sm shrink-0">
          {r.name.charAt(0).toUpperCase()}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="text-cream font-semibold text-sm">{r.name}</p>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${STATUS_STYLES[r.status]}`}>
              {STATUS_LABELS[r.status]}
            </span>
            {r.status === 'new' && (
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" title="New request" />
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-cream/40 text-xs">
            <span className="flex items-center gap-1"><Mail size={10} /> {r.email}</span>
            {r.phone && <span className="flex items-center gap-1"><Phone size={10} /> {r.phone}</span>}
          </div>
        </div>

        {/* Booking details */}
        <div className="flex flex-wrap gap-3 shrink-0">
          {r.date && (
            <div className="glass rounded-xl px-3 py-2 border border-white/5 text-center min-w-[80px]">
              <p className="text-cream/40 text-[10px]">Date</p>
              <p className="text-cream text-xs font-semibold">
                {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          )}
          {r.time && (
            <div className="glass rounded-xl px-3 py-2 border border-white/5 text-center">
              <p className="text-cream/40 text-[10px]">Time</p>
              <p className="text-cream text-xs font-semibold">{r.time.slice(0, 5)}</p>
            </div>
          )}
          <div className="glass rounded-xl px-3 py-2 border border-white/5 text-center">
            <p className="text-cream/40 text-[10px]">Guests</p>
            <p className="text-cream text-xs font-semibold">{r.guests}</p>
          </div>
        </div>

        <div className="text-cream/20 text-xs shrink-0 hidden lg:block">
          {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [counts, setCounts] = useState({ new: 0, total: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [resData, countData] = await Promise.all([
        reservationAPI.getAll(activeFilter === 'all' ? null : activeFilter),
        reservationAPI.getCounts(),
      ]);
      setReservations(resData.data.data);
      setCounts(countData.data.data);
    } catch {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id, status) => {
    try {
      await reservationAPI.updateStatus(id, status);
      toast.success(`Reservation ${status}!`);
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await reservationAPI.delete(id);
      toast.success('Reservation deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filters = ['all', 'new', 'confirmed', 'cancelled'];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-cream">Reservations</h1>
            {counts.new > 0 && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                {counts.new} new
              </span>
            )}
          </div>
          <p className="text-cream/40 text-sm">{counts.total} total requests</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 glass border border-white/10 text-cream/60 hover:text-cream px-4 py-2.5 rounded-xl text-sm transition-all"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'New Requests', value: counts.new, color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20', dot: 'bg-blue-400' },
          { label: 'Confirmed', value: reservations.filter(r => r.status === 'confirmed').length, color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20', dot: 'bg-green-400' },
          { label: 'Total', value: counts.total, color: 'from-accent/20 to-accent/5', border: 'border-accent/20', dot: 'bg-accent' },
        ].map(({ label, value, color, border, dot }) => (
          <div key={label} className={`glass rounded-2xl p-5 border ${border} bg-gradient-to-br ${color}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              <span className="text-cream/50 text-xs">{label}</span>
            </div>
            <div className="font-display text-3xl font-bold text-cream">{value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
              activeFilter === f
                ? 'bg-gradient-to-r from-accent to-gold text-white shadow-lg shadow-accent/20'
                : 'glass border border-white/10 text-cream/50 hover:text-cream'
            }`}
          >
            {f === 'all' ? `All (${counts.total})` : f}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton rounded-2xl h-20" />)}
        </div>
      ) : reservations.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center border border-white/5">
          <Calendar size={48} className="text-cream/15 mx-auto mb-4" />
          <p className="text-cream/40 text-lg font-medium mb-2">No reservations yet</p>
          <p className="text-cream/25 text-sm">When customers fill out the reservation form on the website, they'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map(r => (
            <ReservationCard
              key={r.id}
              reservation={r}
              onClick={() => setSelected(r)}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <ReservationModal
            reservation={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
