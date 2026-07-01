// src/pages/admin/AdminGallery.jsx
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, X, Plus, Image } from 'lucide-react';
import { galleryAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

function UploadModal({ onClose, onSave }) {
  const [form, setForm] = useState({ caption: '', category: 'food', image_url: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !form.image_url) { toast.error('Please select an image or provide a URL'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      if (file) fd.append('image', file);
      if (form.image_url && !file) fd.append('image_url', form.image_url);
      fd.append('caption', form.caption);
      fd.append('category', form.category);
      await galleryAPI.create(fd);
      toast.success('Image added to gallery!');
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error uploading image');
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
          <h2 className="font-display text-xl font-bold text-cream">Add Gallery Image</h2>
          <button onClick={onClose} className="text-cream/40 hover:text-cream"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            className="relative"
          >
            {preview ? (
              <div className="relative group">
                <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-black"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label
                className="flex flex-col items-center gap-3 p-10 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-accent/40 transition-all group"
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                <Upload size={28} className="text-cream/20 group-hover:text-accent transition-colors" />
                <div className="text-center">
                  <p className="text-cream/50 text-sm">Drag & drop or <span className="text-accent">browse</span></p>
                  <p className="text-cream/30 text-xs mt-1">JPEG, PNG, WEBP up to 5MB</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            )}
          </div>

          {!file && (
            <div>
              <label className="text-cream/60 text-xs font-medium mb-1.5 block">Or paste image URL</label>
              <input
                type="url"
                value={form.image_url}
                onChange={e => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-cream/60 text-xs font-medium mb-1.5 block">Caption</label>
              <input
                type="text"
                value={form.caption}
                onChange={e => setForm({ ...form, caption: e.target.value })}
                placeholder="Brief description..."
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-cream/60 text-xs font-medium mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"
              >
                <option value="food">Food</option>
                <option value="interior">Interior</option>
                <option value="events">Events</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-outline py-3 rounded-xl text-sm font-semibold">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-60">
              {saving ? 'Uploading…' : 'Add to Gallery'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = () => {
    galleryAPI.getAll()
      .then(res => setImages(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    try {
      await galleryAPI.delete(id);
      toast.success('Image removed from gallery');
      setDeleteConfirm(null);
      load();
    } catch {
      toast.error('Failed to delete image');
    }
  };

  const filtered = filter === 'all' ? images : images.filter(i => i.category === filter);

  const getUrl = (img) => img.image_url.startsWith('http') ? img.image_url : `${API_BASE}${img.image_url}`;

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-cream">Gallery</h1>
          <p className="text-cream/40 text-sm">{images.length} images</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} /> Add Image
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'food', 'interior', 'events'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-accent to-gold text-white'
                : 'glass border border-white/10 text-cream/50 hover:text-cream'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton rounded-xl aspect-square" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center border border-white/5">
          <Image size={40} className="text-cream/20 mx-auto mb-4" />
          <p className="text-cream/40">No images yet. Upload your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="relative group rounded-xl overflow-hidden aspect-square bg-secondary"
            >
              <img
                src={getUrl(img)}
                alt={img.caption || 'Gallery'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <button
                    onClick={() => setDeleteConfirm(img)}
                    className="w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div>
                  {img.caption && <p className="text-white text-xs line-clamp-2">{img.caption}</p>}
                  <span className="text-white/50 text-[10px] capitalize">{img.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showUpload && (
          <UploadModal onClose={() => setShowUpload(false)} onSave={load} />
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
              <h3 className="font-display text-xl font-bold text-cream mb-2">Delete Image?</h3>
              <p className="text-cream/50 text-sm mb-6">This will permanently remove the image from your gallery.</p>
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
