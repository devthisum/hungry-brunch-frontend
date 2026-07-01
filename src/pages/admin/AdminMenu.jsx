// src/pages/admin/AdminMenu.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search, X, Upload } from 'lucide-react';
import { menuAPI, categoryAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
const EMPTY_FORM = { name: '', description: '', price: '', category: '', image_url: '', available: true, featured: false };

function MenuModal({ item, categories, onClose, onSave }) {
  const [form, setForm] = useState(item || EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      toast.error('Name, price, and category are required');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('image', file);

      if (item?.id) {
        await menuAPI.update(item.id, fd);
        toast.success('Menu item updated!');
      } else {
        await menuAPI.create(fd);
        toast.success('Menu item added!');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving item');
    } finally {
      setSaving(false);
    }
  };

  const currentImage = preview || (form.image_url ? (form.image_url.startsWith('http') ? form.image_url : `${API_BASE}${form.image_url}`) : null);

  return (
    <div className="fixed inset-0 z-[60] modal-overlay flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', damping: 20 }}
        onClick={e => e.stopPropagation()}
        className="glass rounded-3xl p-8 border border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-bold text-cream">{item?.id ? 'Edit Item' : 'Add Menu Item'}</h2>
          <button onClick={onClose} className="text-cream/40 hover:text-cream"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image upload */}
          <div>
            <label className="text-cream/60 text-xs font-medium mb-1.5 block">Food Image</label>
            <div className="relative">
              {currentImage ? (
                <div className="relative group">
                  <img src={currentImage} alt="" className="w-full h-40 object-cover rounded-xl" onError={() => setPreview(null)} />
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl cursor-pointer transition-opacity">
                    <Upload size={20} className="text-white" />
                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-accent/40 transition-all">
                  <Upload size={24} className="text-cream/30" />
                  <span className="text-cream/40 text-sm">Click to upload image</span>
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              )}
            </div>
            <div className="mt-2">
              <input
                type="url"
                placeholder="Or paste image URL..."
                value={form.image_url || ''}
                onChange={e => { setForm({ ...form, image_url: e.target.value }); setPreview(null); setFile(null); }}
                className="input-dark w-full px-4 py-2.5 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-cream/60 text-xs font-medium mb-1.5 block">Item Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Eggs Benedict" className="input-dark w-full px-4 py-3 rounded-xl text-sm" required />
            </div>
            <div>
              <label className="text-cream/60 text-xs font-medium mb-1.5 block">Price (LKR) *</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="1500" className="input-dark w-full px-4 py-3 rounded-xl text-sm" required min="0" step="0.01" />
            </div>
            <div>
              <label className="text-cream/60 text-xs font-medium mb-1.5 block">Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-dark w-full px-4 py-3 rounded-xl text-sm" required>
                <option value="">Select...</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-cream/60 text-xs font-medium mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe this dish..." rows={3} className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} className="hidden" />
              <div className={`w-10 h-5 rounded-full transition-all ${form.available ? 'bg-green-500' : 'bg-white/20'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.available ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="text-cream/60 text-sm">Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="hidden" />
              <div className={`w-10 h-5 rounded-full transition-all ${form.featured ? 'bg-gold' : 'bg-white/20'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.featured ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="text-cream/60 text-sm">Featured</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-outline py-3 rounded-xl text-sm font-semibold">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-60">
              {saving ? 'Saving…' : item?.id ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | item object
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    Promise.all([menuAPI.getAll(), categoryAPI.getAll()])
      .then(([m, c]) => { setItems(m.data.data); setCategories(c.data.data); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = items.filter(i => {
    const matchCat = catFilter === 'All' || i.category === catFilter;
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDelete = async (id) => {
    try {
      await menuAPI.delete(id);
      toast.success('Item deleted');
      setDeleteConfirm(null);
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (item) => {
    try {
      await menuAPI.toggle(item.id);
      toast.success(`${item.name} ${item.available ? 'marked unavailable' : 'marked available'}`);
      load();
    } catch { toast.error('Failed to update'); }
  };

  const API_IMG = (url) => url ? (url.startsWith('http') ? url : `${API_BASE}${url}`) : null;

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-cream">Menu Items</h1>
          <p className="text-cream/40 text-sm">{items.length} items total</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
          <input type="text" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} className="input-dark w-full pl-9 pr-4 py-2.5 rounded-xl text-sm" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-dark px-4 py-2.5 rounded-xl text-sm">
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-cream/30">
            <span className="text-4xl block mb-3">🍽️</span>
            No items found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-cream/40 text-xs font-medium">Item</th>
                  <th className="text-left px-4 py-4 text-cream/40 text-xs font-medium hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-4 text-cream/40 text-xs font-medium">Price</th>
                  <th className="text-left px-4 py-4 text-cream/40 text-xs font-medium hidden md:table-cell">Status</th>
                  <th className="text-right px-6 py-4 text-cream/40 text-xs font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary shrink-0">
                          {API_IMG(item.image_url)
                            ? <img src={API_IMG(item.image_url)} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                            : <span className="w-full h-full flex items-center justify-center text-lg">🍽️</span>
                          }
                        </div>
                        <div>
                          <p className="text-cream text-sm font-medium">{item.name}</p>
                          {item.featured && <span className="text-[10px] text-gold">★ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent">{item.category}</span>
                    </td>
                    <td className="px-4 py-4 text-cream/80 text-sm">LKR {parseFloat(item.price).toLocaleString()}</td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <button onClick={() => handleToggle(item)} className="flex items-center gap-1.5 text-sm">
                        {item.available
                          ? <><ToggleRight size={18} className="text-green-400" /><span className="text-green-400 text-xs">Available</span></>
                          : <><ToggleLeft size={18} className="text-red-400" /><span className="text-red-400 text-xs">Unavailable</span></>
                        }
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setModal(item)} className="p-2 glass rounded-lg text-cream/40 hover:text-gold hover:border-gold/30 border border-transparent transition-all">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirm(item)} className="p-2 glass rounded-lg text-cream/40 hover:text-red-400 hover:border-red-400/30 border border-transparent transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      <AnimatePresence>
        {modal && (
          <MenuModal
            item={modal === 'add' ? null : modal}
            categories={categories}
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
              <h3 className="font-display text-xl font-bold text-cream mb-2">Delete Item?</h3>
              <p className="text-cream/50 text-sm mb-6">Are you sure you want to delete <strong className="text-cream">{deleteConfirm.name}</strong>? This cannot be undone.</p>
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
