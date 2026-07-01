// src/pages/admin/AdminReviews.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import { reviewAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <Star
            size={24}
            className={n <= (hovered || value) ? 'text-gold fill-gold' : 'text-white/20'}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewModal({ review, onClose, onSave }) {
  const [form, setForm] = useState({
    customer_name: review?.customer_name || '',
    rating: review?.rating || 5,
    comment: review?.comment || '',
    is_featured: review?.is_featured || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.rating) {
      toast.error('Name and rating are required');
      return;
    }
    setSaving(true);
    try {
      if (review?.id) {
        await reviewAPI.update(review.id, form);
        toast.success('Review updated!');
      } else {
        await reviewAPI.create(form);
        toast.success('Review added!');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving review');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] modal-overlay flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        onClick={e => e.stopPropagation()}
        className="glass rounded-2xl p-8 border border-white/10 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-bold text-cream">
            {review?.id ? 'Edit Review' : 'Add Review'}
          </h2>
          <button onClick={onClose} className="text-cream/40 hover:text-cream"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-cream/60 text-xs font-medium mb-1.5 block">Customer Name *</label>
            <input
              type="text"
              value={form.customer_name}
              onChange={e => setForm({ ...form, customer_name: e.target.value })}
              placeholder="e.g. Amal Perera"
              className="input-dark w-full px-4 py-3 rounded-xl text-sm"
              autoFocus
            />
          </div>

          <div>
            <label className="text-cream/60 text-xs font-medium mb-2 block">Rating *</label>
            <StarInput value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
          </div>

          <div>
            <label className="text-cream/60 text-xs font-medium mb-1.5 block">Comment</label>
            <textarea
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              placeholder="What did they say?"
              rows={4}
              className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
              className={`w-10 h-5 rounded-full transition-all ${form.is_featured ? 'bg-gold' : 'bg-white/20'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_featured ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="text-cream/60 text-sm">Featured on homepage</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-outline py-3 rounded-xl text-sm font-semibold">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-60">
              {saving ? 'Saving…' : review?.id ? 'Update Review' : 'Add Review'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    reviewAPI.getAll()
      .then(res => setReviews(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    try {
      await reviewAPI.delete(id);
      toast.success('Review deleted');
      setDeleteConfirm(null);
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-cream">Reviews</h1>
          <p className="text-cream/40 text-sm">{reviews.length} reviews · Avg {avgRating} ★</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton rounded-2xl h-28" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center border border-white/5">
          <span className="text-5xl block mb-4">⭐</span>
          <p className="text-cream/40">No reviews yet. Add the first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, i) => {
            const initials = review.customer_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 border border-white/5 hover:border-accent/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1.5">
                      <span className="text-cream font-semibold text-sm">{review.customer_name}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={11} className={j < review.rating ? 'text-gold fill-gold' : 'text-white/20'} />
                        ))}
                      </div>
                      {review.is_featured && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 border border-gold/25 text-gold">Featured</span>
                      )}
                      <span className="text-cream/30 text-xs ml-auto">
                        {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-cream/60 text-sm line-clamp-2">{review.comment}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setModal(review)}
                      className="p-2 glass rounded-lg text-cream/40 hover:text-gold border border-transparent hover:border-gold/30 transition-all"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(review)}
                      className="p-2 glass rounded-lg text-cream/40 hover:text-red-400 border border-transparent hover:border-red-400/30 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <ReviewModal
            review={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSave={load}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[60] modal-overlay flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="glass rounded-2xl p-8 max-w-sm w-full border border-red-500/20 text-center"
            >
              <span className="text-5xl block mb-4">🗑️</span>
              <h3 className="font-display text-xl font-bold text-cream mb-2">Delete Review?</h3>
              <p className="text-cream/50 text-sm mb-6">
                Remove review by <strong className="text-cream">{deleteConfirm.customer_name}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-outline py-3 rounded-xl text-sm font-semibold">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
