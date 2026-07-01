// src/pages/admin/AdminHours.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Save } from 'lucide-react';
import { hoursAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdminHours() {
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    hoursAPI.getAll()
      .then(res => {
        const sorted = res.data.data.sort((a, b) =>
          DAY_ORDER.indexOf(a.day_name) - DAY_ORDER.indexOf(b.day_name)
        );
        setHours(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (hour) => {
    setSaving(hour.id);
    try {
      await hoursAPI.update(hour.id, {
        open_time: hour.open_time,
        close_time: hour.close_time,
        is_closed: hour.is_closed,
      });
      toast.success(`${hour.day_name} hours updated!`);
    } catch {
      toast.error('Failed to update hours');
    } finally {
      setSaving(null);
    }
  };

  const updateHour = (id, field, value) => {
    setHours(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const isWeekend = (day) => ['Saturday', 'Sunday'].includes(day);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-cream">Opening Hours</h1>
        <p className="text-cream/40 text-sm">Manage your restaurant's weekly schedule</p>
      </div>

      {/* Preview card */}
      <div className="glass rounded-2xl p-6 border border-white/5 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={18} className="text-accent" />
          <h3 className="font-display font-semibold text-cream">Current Schedule Preview</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {hours.map(h => (
            <div
              key={h.id}
              className={`rounded-xl p-3 text-center border ${
                h.is_closed
                  ? 'border-red-500/20 bg-red-500/5'
                  : 'border-green-500/20 bg-green-500/5'
              }`}
            >
              <p className="text-cream/70 text-xs font-medium mb-1">{h.day_name.slice(0, 3)}</p>
              {h.is_closed ? (
                <p className="text-red-400 text-xs">Closed</p>
              ) : (
                <>
                  <p className="text-gold text-xs">{formatTime(h.open_time)}</p>
                  <p className="text-cream/30 text-[10px]">–</p>
                  <p className="text-gold text-xs">{formatTime(h.close_time)}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit rows */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(7)].map((_, i) => <div key={i} className="skeleton rounded-2xl h-20" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {hours.map((hour, i) => (
            <motion.div
              key={hour.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-2xl p-5 border transition-all ${
                hour.is_closed ? 'border-red-500/15 opacity-70' : 'border-white/5 hover:border-accent/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Day name */}
                <div className="w-28 shrink-0">
                  <p className="text-cream font-semibold text-sm">{hour.day_name}</p>
                  {isWeekend(hour.day_name) && (
                    <span className="text-[10px] text-gold/60">Weekend</span>
                  )}
                </div>

                {/* Closed toggle */}
                <label className="flex items-center gap-2 cursor-pointer shrink-0">
                  <div
                    onClick={() => updateHour(hour.id, 'is_closed', !hour.is_closed)}
                    className={`w-10 h-5 rounded-full transition-all ${hour.is_closed ? 'bg-red-500' : 'bg-white/20'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${hour.is_closed ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <span className={`text-xs ${hour.is_closed ? 'text-red-400' : 'text-cream/50'}`}>
                    {hour.is_closed ? 'Closed' : 'Open'}
                  </span>
                </label>

                {/* Time inputs */}
                {!hour.is_closed && (
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <label className="text-cream/40 text-[10px] mb-1 block">Opens</label>
                      <input
                        type="time"
                        value={hour.open_time || ''}
                        onChange={e => updateHour(hour.id, 'open_time', e.target.value)}
                        className="input-dark w-full px-3 py-2 rounded-lg text-sm"
                      />
                    </div>
                    <span className="text-cream/30 text-sm mt-4">—</span>
                    <div className="flex-1">
                      <label className="text-cream/40 text-[10px] mb-1 block">Closes</label>
                      <input
                        type="time"
                        value={hour.close_time || ''}
                        onChange={e => updateHour(hour.id, 'close_time', e.target.value)}
                        className="input-dark w-full px-3 py-2 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Save button */}
                <button
                  onClick={() => handleUpdate(hour)}
                  disabled={saving === hour.id}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 disabled:opacity-60"
                >
                  {saving === hour.id ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-3 h-3 border border-white/30 border-t-white rounded-full" />
                  ) : (
                    <Save size={13} />
                  )}
                  Save
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Info note */}
      <div className="mt-8 glass rounded-xl p-4 border border-accent/15 flex gap-3">
        <Clock size={16} className="text-accent mt-0.5 shrink-0" />
        <p className="text-cream/50 text-xs leading-relaxed">
          Changes are saved individually per day. The updated schedule will be reflected on your website immediately after saving.
        </p>
      </div>
    </AdminLayout>
  );
}
