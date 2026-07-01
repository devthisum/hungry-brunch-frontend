// src/pages/MenuPage.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { menuAPI, categoryAPI } from '../utils/api';
import MenuCard from '../components/menu/MenuCard';
import { SkeletonCard } from '../components/common/Skeleton';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      menuAPI.getAll(),
      categoryAPI.getAll(),
    ]).then(([menuRes, catRes]) => {
      setItems(menuRes.data.data);
      setFiltered(menuRes.data.data);
      setCategories(catRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = items;
    if (activeCategory !== 'All') result = result.filter(i => i.category === activeCategory);
    if (search) result = result.filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [activeCategory, search, items]);

  const allCategories = ['All', ...categories.map(c => c.name)];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-secondary/30 to-transparent py-16 px-4 text-center mb-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-accent text-sm font-medium tracking-widest uppercase mb-3 block">Our Menu</span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-cream mb-4">Explore Our Kitchen</h1>
          <p className="text-cream/50 max-w-xl mx-auto text-lg">
            From morning coffee to late-night desserts — there's always something to delight at Hungry Brunch.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Search + filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          {/* Search */}
          <div className="relative max-w-lg mx-auto mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" />
            <input
              type="text"
              placeholder="Search dishes, ingredients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-dark w-full pl-12 pr-10 py-3.5 rounded-2xl text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {allCategories.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-accent to-gold text-white shadow-lg shadow-accent/20'
                    : 'glass border border-white/10 text-cream/60 hover:text-cream hover:border-accent/30'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        {!loading && (
          <p className="text-cream/30 text-sm mb-6 text-center">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} {activeCategory !== 'All' ? `in ${activeCategory}` : ''}
          </p>
        )}

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + search}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.length === 0
              ? (
                <div className="col-span-full text-center py-20">
                  <span className="text-6xl block mb-4">🍽️</span>
                  <p className="text-cream/40 text-lg">No items found. Try a different search or category.</p>
                </div>
              )
              : filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <MenuCard item={item} />
                </motion.div>
              ))
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
