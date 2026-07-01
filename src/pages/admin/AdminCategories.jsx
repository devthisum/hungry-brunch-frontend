// src/pages/admin/AdminCategories.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Tags } from 'lucide-react';
import { categoryAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

function CategoryModal({ category, onClose, onSave }) {
  const [form, setForm] = useState({ name: category?.name || '', display_order: category?.display_order || 0 });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    setSaving(true);
    try {
      if (category?.id) {
        await categoryAPI.update(category.id, form);
        toast.success('Category updated!');
      } else {
        await categoryAPI.create(form);
        toast.success('Category added!');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving category');
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
        className="glass rounded-2xl p-8 border border-white/10 w-full max-w-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-bold text-cream">
            {category?.id ? 'Edit Category' : 'Add Category'}
          </h2>
          <button onClick={onClose} className="text-cream/40 hover:text-cream"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-cream/60 text-xs font-medium mb-1.5 block">Category Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Breakfast"
              className="input-dark w-full px-4 py-3 rounded-xl text-sm"
              autoFocus
            />
          </div>
          <div>
            <label className="text-cream/60 text-xs font-medium mb-1.5 block">Display Order</label>
            <input
              type="number"
              value={form.display_order}
              onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="input-dark w-full px-4 py-3 rounded-xl text-sm"
              min="0"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-outline py-3 rounded-xl text-sm font-semibold">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-60">
              {saving ? 'Saving…' : category?.id ? 'Update' : 'Add Category'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    categoryAPI.getAll()
      .then(res => setCategories(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    try {
      await categoryAPI.delete(id);
      toast.success('Category deleted');
      setDeleteConfirm(null);
      load();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const categoryEmojis = {
    Breakfast: '🍳', Brunch: '🥞', Lunch: '🥗', Dinner: '🍽️',
    Coffee: '☕', Desserts: '🍰', Mocktails: '🍹', 'Special Items': '⭐'
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-cream">Categories</h1>
          <p className="text-cream/40 text-sm">{categories.length} categories</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton rounded-2xl h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 border border-white/5 hover:border-accent/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{categoryEmojis[cat.name] || '🏷️'}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setModal(cat)}
                    className="p-1.5 glass rounded-lg text-cream/40 hover:text-gold border border-transparent hover:border-gold/30 transition-all"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(cat)}
                    className="p-1.5 glass rounded-lg text-cream/40 hover:text-red-400 border border-transparent hover:border-red-400/30 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <p className="text-cream font-semibold text-sm">{cat.name}</p>
              <p className="text-cream/30 text-xs mt-1">Order: {cat.display_order}</p>
            </motion.div>
          ))}

          {/* Add new placeholder */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setModal('add')}
            className="glass rounded-2xl p-5 border border-dashed border-white/10 hover:border-accent/40 transition-all flex flex-col items-center justify-center gap-2 text-cream/30 hover:text-cream/60 min-h-[100px]"
          >
            <Plus size={20} />
            <span className="text-xs">New Category</span>
          </motion.button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <CategoryModal
            category={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSave={load}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
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
              <h3 className="font-display text-xl font-bold text-cream mb-2">Delete Category?</h3>
              <p className="text-cream/50 text-sm mb-6">
                Delete <strong className="text-cream">"{deleteConfirm.name}"</strong>?
                Menu items in this category won't be deleted but will have no category.
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
