// src/components/home/HorizontalScroll.jsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const DISHES = [
  { emoji:'🥚', name:'Eggs Benedict',   desc:'Poached perfection on toasted muffin', price:'LKR 1,850', category:'Breakfast', image:'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600' },
  { emoji:'☕', name:'Flat White',       desc:'Silky microfoam over double ristretto', price:'LKR 650',   category:'Coffee',    image:'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600' },
  { emoji:'🥞', name:'Pancake Tower',   desc:'Fluffy buttermilk stack with honey butter', price:'LKR 1,450', category:'Breakfast', image:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600' },
  { emoji:'🍔', name:'Gourmet Burger',  desc:'Wagyu beef with aged cheddar and truffle mayo', price:'LKR 2,600', category:'Lunch', image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600' },
  { emoji:'🍰', name:'Tiramisu',        desc:'Classic Italian with mascarpone and espresso', price:'LKR 1,200', category:'Desserts', image:'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600' },
  { emoji:'🐟', name:'Grilled Salmon',  desc:'Atlantic salmon with lemon butter sauce', price:'LKR 3,800', category:'Dinner', image:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600' },
  { emoji:'🍹', name:'Tropical Sunrise',desc:'Fresh mango, passionfruit and orange juice', price:'LKR 750', category:'Mocktails', image:'https://images.unsplash.com/photo-1546173159-315724a31696?w=600' },
];

function DishCard({ dish, index }) {
  return (
    <motion.div
      initial={{ opacity:0, x:60 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
      transition={{ duration:0.6, delay:index*0.1 }}
      whileHover={{ y:-10, scale:1.02 }}
      className="relative flex-shrink-0 w-72 sm:w-80 rounded-3xl overflow-hidden group cursor-pointer"
    >
      <div className="relative h-96">
        <img src={dish.image} alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow:'inset 0 0 60px rgba(217,119,6,0.2)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="text-xs px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-gold font-medium mb-3 inline-block">
            {dish.category}
          </span>
          <h3 className="font-display text-2xl font-bold text-white mb-1 group-hover:text-gold transition-colors">{dish.name}</h3>
          <p className="text-white/60 text-sm mb-3 line-clamp-1">{dish.desc}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gradient text-lg">{dish.price}</span>
            <motion.div initial={{ scale:0, rotate:-180 }} whileInView={{ scale:1, rotate:0 }} viewport={{ once:true }}
              transition={{ delay:0.3+index*0.1, type:'spring' }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center text-xl">
              {dish.emoji}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HorizontalScroll() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target:containerRef, offset:['start start','end end'] });
  const x = useTransform(scrollYProgress, [0,1], ['0%', `-${(DISHES.length - 2.5) * 22}%`]);

  return (
    <section ref={containerRef} className="relative" style={{ height:`${DISHES.length * 80}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="px-6 sm:px-12 mb-8">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <span className="text-accent text-sm font-medium tracking-widest uppercase mb-2 block">Scroll to Explore</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-cream">
              Our <span className="text-gradient">Signature</span> Dishes
            </h2>
          </motion.div>
        </div>
        <div className="overflow-hidden px-6 sm:px-12">
          <motion.div style={{ x }} className="flex gap-5 w-max">
            {DISHES.map((dish, i) => <DishCard key={dish.name} dish={dish} index={i} />)}
          </motion.div>
        </div>
        <div className="px-6 sm:px-12 mt-6 flex items-center gap-3">
          <div className="flex gap-1.5">
            {DISHES.map((_,i) => (
              <div key={i} className="h-1 w-4 rounded-full bg-accent/30" />
            ))}
          </div>
          <span className="text-cream/30 text-xs">Scroll down to explore all dishes</span>
        </div>
      </div>
    </section>
  );
}
