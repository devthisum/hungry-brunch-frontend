// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Mail, Send, CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { reservationAPI } from '../utils/api';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', time: '', guests: '2', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Please fill in your name and email.');
      return;
    }
    setLoading(true);
    try {
      await reservationAPI.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        date: form.date || null,
        time: form.time || null,
        guests: form.guests,
        message: form.message,
      });
      setSubmitted(true);
      toast.success('Reservation request sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const infoCards = [
    {
      Icon: MapPin,
      title: 'Find Us',
      lines: ['No 99, 2 DS Senanayake Veediya', 'Kandy, Sri Lanka'],
      action: { label: 'Get Directions', href: 'https://maps.google.com/?q=DS+Senanayake+Veediya+Kandy' },
    },
    {
      Icon: Phone,
      title: 'Call Us',
      lines: ['077 605 7554'],
      action: { label: 'Call Now', href: 'tel:0776057554' },
    },
    {
      Icon: Clock,
      title: 'Hours',
      lines: ['Mon–Thu: 8 AM – 10 PM', 'Fri: 8 AM – 11 PM', 'Sat–Sun: 7:30 AM – 10 PM'],
    },
    {
      Icon: Mail,
      title: 'Email',
      lines: ['hello@hungrybrunch.lk'],
      action: { label: 'Send Email', href: 'mailto:hello@hungrybrunch.lk' },
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="py-16 px-4 text-center bg-gradient-to-b from-secondary/30 to-transparent mb-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-accent text-sm font-medium tracking-widest uppercase mb-3 block">Get in Touch</span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-cream mb-4">Contact & Reservations</h1>
          <p className="text-cream/50 max-w-xl mx-auto">Have a question or want to book a table? We'd love to hear from you.</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {infoCards.map(({ Icon, title, lines, action }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/5 hover:border-accent/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon size={20} className="text-gold" />
              </div>
              <h3 className="font-display text-lg font-bold text-cream mb-2">{title}</h3>
              {lines.map((line, j) => <p key={j} className="text-cream/50 text-sm">{line}</p>)}
              {action && (
                <a href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  className="inline-block mt-4 text-accent text-sm font-medium hover:text-gold transition-colors">
                  {action.label} →
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-3xl font-bold text-cream mb-6">Find Us in Kandy</h2>
            <div className="glass rounded-3xl overflow-hidden border border-white/5 h-80">
              <iframe
                title="Hungry Brunch Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.0!2d80.6337!3d7.2908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae366266498acd3%3A0x411a3818a1a6afe0!2sKandy%2C%20Sri%20Lanka!5e0!3m2!1sen!2s!4v1700000000"
                width="100%" height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-4 glass rounded-2xl p-4 border border-white/5 flex items-start gap-3">
              <MapPin size={18} className="text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-cream font-medium text-sm">No 99, 2 DS Senanayake Veediya</p>
                <p className="text-cream/50 text-sm">Kandy, Sri Lanka · Near Kandy Lake</p>
                <a href="https://maps.google.com/?q=DS+Senanayake+Veediya+Kandy" target="_blank" rel="noreferrer"
                  className="text-accent text-sm hover:text-gold transition-colors mt-1 block">
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </motion.div>

          {/* Reservation form */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-3xl font-bold text-cream mb-6">Reserve a Table</h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-3xl p-12 text-center border border-green-500/20"
              >
                <CheckCircle size={56} className="text-green-400 mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-cream mb-3">Request Received!</h3>
                <p className="text-cream/60 mb-2">
                  Thank you, <span className="text-gold font-semibold">{form.name}</span>!
                </p>
                <p className="text-cream/50 text-sm mb-6">
                  We've saved your reservation request and will confirm at <span className="text-gold">{form.email}</span> within 24 hours.
                </p>
                <div className="glass rounded-xl p-4 border border-white/5 text-left mb-6 text-sm space-y-2">
                  {form.date && <p className="text-cream/60">📅 Date: <span className="text-cream">{form.date}</span></p>}
                  {form.time && <p className="text-cream/60">🕐 Time: <span className="text-cream">{form.time}</span></p>}
                  <p className="text-cream/60">👥 Guests: <span className="text-cream">{form.guests}</span></p>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', date: '', time: '', guests: '2', message: '' }); }}
                  className="btn-outline px-6 py-3 rounded-full text-sm font-semibold"
                >
                  Make Another Reservation
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 border border-white/5 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-cream/60 text-xs font-medium mb-1.5 block">Full Name *</label>
                    <input type="text" placeholder="Your name" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm" required />
                  </div>
                  <div>
                    <label className="text-cream/60 text-xs font-medium mb-1.5 block">Email *</label>
                    <input type="email" placeholder="your@email.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm" required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-cream/60 text-xs font-medium mb-1.5 block">Phone</label>
                    <input type="tel" placeholder="077 000 0000" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="text-cream/60 text-xs font-medium mb-1.5 block">Number of Guests</label>
                    <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm">
                      {[1,2,3,4,5,6,7,8,9,'10+'].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-cream/60 text-xs font-medium mb-1.5 block">Preferred Date</label>
                    <input type="date" value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                      min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="text-cream/60 text-xs font-medium mb-1.5 block">Preferred Time</label>
                    <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm">
                      <option value="">Select time</option>
                      {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-cream/60 text-xs font-medium mb-1.5 block">Special Requests</label>
                  <textarea placeholder="Dietary requirements, special occasions, seating preferences..."
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    rows={4} className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="btn-primary w-full py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? 'Sending…' : 'Send Reservation Request'}
                </button>
                <p className="text-center text-cream/30 text-xs">
                  Or call us directly: <a href="tel:0776057554" className="text-accent hover:text-gold">077 605 7554</a>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
