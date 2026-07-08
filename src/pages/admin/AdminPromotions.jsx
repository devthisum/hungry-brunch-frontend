// src/pages/admin/AdminPromotions.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, Upload, Tag } from 'lucide-react';
import { promotionAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
const EMPTY = { title: '', description: '', discount: '', valid_from: '', valid_until: '', badge_text: 'Special Offer', active: true, image_url: '' };

function PromoModal({ promo, onClose, onSave }) {
  const [form, setForm]     = useState(promo || EMPTY);
  const [file, setFile]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v !== null && v !== undefined && fd.append(k, v));
      if (file) fd.append('image', file);

      if (promo?.id) { await promotionAPI.update(promo.id, fd); toast.success('Promotion updated!'); }
      else           { await promotionAPI.create(fd);           toast.success('Promotion created!'); }
      onSave(); onClose();
    } catch { toast.error('Failed to save'); }
    finally   { setSaving(false); }
  };

  const currentImg = preview || (form.image_url ? (form.image_url.startsWith('http') ? form.image_url : `${API_BASE}${form.image_url}`) : null);

  return (
    <div className="fixed inset-0 z-[60] modal-overlay flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.92 }}
        onClick={e => e.stopPropagation()}
        className="glass rounded-3xl p-8 border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-bold text-cream">{promo?.id ? 'Edit Promotion' : 'New Promotion'}</h2>
          <button onClick={onClose} className="text-cream/40 hover:text-cream"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image */}
          <div>
            <label className="text-cream/60 text-xs font-medium mb-1.5 block">Promotion Image</label>
            {currentImg ? (
              <div className="relative group">
                <img src={currentImg} alt="" className="w-full h-40 object-cover rounded-xl" />
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl cursor-pointer transition-opacity">
                  <Upload size={20} className="text-white" />
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-accent/40 transition-all">
                <Upload size={24} className="text-cream/30" />
                <span className="text-cream/40 text-sm">Upload image</span>
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            )}
            <input type="url" placeholder="Or paste image URL..." value={form.image_url || ''}
              onChange={e => { setForm({ ...form, image_url: e.target.value }); setPreview(null); setFile(null); }}
              className="input-dark w-full px-4 py-2.5 rounded-xl text-xs mt-2" />
          </div>

          <div>
            <label className="text-cream/60 text-xs font-medium mb-1.5 block">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Weekend Brunch Special" className="input-dark w-full px-4 py-3 rounded-xl text-sm" required />
          </div>

          <div>
            <label className="text-cream/60 text-xs font-medium mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the offer..." rows={3} className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-cream/60 text-xs font-medium mb-1.5 block">Discount</label>
              <input type="text" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })}
                placeholder="e.g. 20% or LKR 500" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-cream/60 text-xs font-medium mb-1.5 block">Badge Text</label>
              <input type="text" value={form.badge_text} onChange={e => setForm({ ...form, badge_text: e.target.value })}
                placeholder="e.g. Hot Deal" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-cream/60 text-xs font-medium mb-1.5 block">Valid From</label>
              <input type="date" value={form.valid_from} onChange={e => setForm({ ...form, valid_from: e.target.value })}
                className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-cream/60 text-xs font-medium mb-1.5 block">Valid Until</label>
              <input type="date" value={form.valid_until} onChange={e => setForm({ ...form, valid_until: e.target.value })}
                className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setForm({ ...form, active: !form.active })}
              className={`w-10 h-5 rounded-full transition-all ${form.active ? 'bg-green-500' : 'bg-white/20'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.active ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-cream/60 text-sm">Active (visible on website)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-outline py-3 rounded-xl text-sm font-semibold">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-60">
              {saving ? 'Saving…' : promo?.id ? 'Update' : 'Create Promotion'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminPromotions() {
  const [promos, setPromos]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [deleteConfirm, setDel] = useState(null);

  const load = () => {
    promotionAPI.getAll()
      .then(res => setPromos(res.data.data))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id) => {
    try { await promotionAPI.delete(id); toast.success('Promotion deleted'); setDel(null); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (promo) => {
    try { await promotionAPI.toggle(promo.id); toast.success('Status updated'); load(); }
    catch { toast.error('Failed to update'); }
  };

  const getImg = (url) => url ? (url.startsWith('http') ? url : `${API_BASE}${url}`) : null;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-cream">Special Offers</h1>
          <p className="text-cream/40 text-sm">{promos.length} promotions · {promos.filter(p=>p.active).length} active</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> New Offer
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_,i) => <div key={i} className="skeleton rounded-2xl h-48" />)}
        </div>
      ) : promos.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center border border-white/5">
          <Tag size={48} className="text-cream/15 mx-auto mb-4" />
          <p className="text-cream/40 text-lg mb-2">No promotions yet</p>
          <p className="text-cream/25 text-sm">Create your first special offer to attract more customers!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {promos.map((promo, i) => (
            <motion.div key={promo.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
              className={`glass rounded-2xl overflow-hidden border transition-all ${promo.active ? 'border-accent/20' : 'border-white/5 opacity-60'}`}>
              {/* Image */}
              <div className="relative h-36 bg-secondary">
                {getImg(promo.image_url) ? (
                  <img src={getImg(promo.image_url)} alt={promo.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag size={32} className="text-accent/30" />
                  </div>
                )}
                {promo.discount && (
                  <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-gold flex flex-col items-center justify-center">
                    <span className="text-white font-black text-xs">{promo.discount}</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-bold text-cream text-sm">{promo.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${promo.active ? 'badge-available' : 'badge-unavailable'}`}>
                    {promo.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                {promo.description && <p className="text-cream/40 text-xs line-clamp-2 mb-3">{promo.description}</p>}
                {promo.valid_until && (
                  <p className="text-cream/30 text-xs mb-3">
                    Until {new Date(promo.valid_until).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggle(promo)} className="p-2 glass rounded-lg text-cream/40 hover:text-gold border border-transparent hover:border-gold/30 transition-all">
                    {promo.active ? <ToggleRight size={14} className="text-green-400" /> : <ToggleLeft size={14} />}
                  </button>
                  <button onClick={() => setModal(promo)} className="p-2 glass rounded-lg text-cream/40 hover:text-gold border border-transparent hover:border-gold/30 transition-all">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDel(promo)} className="p-2 glass rounded-lg text-cream/40 hover:text-red-400 border border-transparent hover:border-red-400/30 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && <PromoModal promo={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={load} />}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[60] modal-overlay flex items-center justify-center p-4" onClick={() => setDel(null)}>
            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }}
              onClick={e => e.stopPropagation()}
              className="glass rounded-2xl p-8 max-w-sm w-full border border-red-500/20 text-center">
              <span className="text-5xl block mb-4">🗑️</span>
              <h3 className="font-display text-xl font-bold text-cream mb-2">Delete Promotion?</h3>
              <p className="text-cream/50 text-sm mb-6">Remove <strong className="text-cream">"{deleteConfirm.title}"</strong>? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDel(null)} className="flex-1 btn-outline py-3 rounded-xl text-sm font-semibold">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
