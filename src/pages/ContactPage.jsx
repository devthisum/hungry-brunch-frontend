// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Mail, Send, CheckCircle, Loader, User, Users, Calendar, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { reservationAPI } from '../utils/api';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    occasion: '',
    seating: '',
    dietary: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill in name, email and phone number.');
      return;
    }
    if (!form.date || !form.time) {
      toast.error('Please select your preferred date and time.');
      return;
    }
    setLoading(true);
    try {
      // Build a detailed message with all extra info
      const fullMessage = [
        form.occasion    ? `Occasion: ${form.occasion}`       : '',
        form.seating     ? `Seating: ${form.seating}`         : '',
        form.dietary     ? `Dietary requirements: ${form.dietary}` : '',
        form.message     ? `Additional notes: ${form.message}` : '',
      ].filter(Boolean).join('\n');

      await reservationAPI.create({
        name:    form.name,
        email:   form.email,
        phone:   form.phone,
        date:    form.date,
        time:    form.time,
        guests:  form.guests,
        message: fullMessage || null,
      });
      setSubmitted(true);
      toast.success('Reservation request sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please call us directly on 077 605 7554.');
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

  const timeSlots = [
    '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
    '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30',
    '20:00','20:30','21:00'
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
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

            {/* Opening hours card */}
            <div className="mt-4 glass rounded-2xl p-5 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-accent" />
                <h3 className="text-cream font-semibold text-sm">Opening Hours</h3>
                <span className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs">Open Now</span>
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { day: 'Monday – Thursday', time: '8:00 AM – 10:00 PM' },
                  { day: 'Friday',            time: '8:00 AM – 11:00 PM' },
                  { day: 'Saturday',          time: '7:30 AM – 11:00 PM' },
                  { day: 'Sunday',            time: '7:30 AM – 10:00 PM' },
                ].map(({ day, time }) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-cream/50">{day}</span>
                    <span className="text-gold/80 font-medium">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Reservation form */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-3xl font-bold text-cream mb-2">Reserve a Table</h2>
            <p className="text-cream/40 text-sm mb-6">Fill in all details and we'll confirm within 2 hours.</p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-3xl p-12 text-center border border-green-500/20"
              >
                <CheckCircle size={56} className="text-green-400 mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-cream mb-3">Reservation Received! 🎉</h3>
                <p className="text-cream/60 mb-2">
                  Thank you, <span className="text-gold font-semibold">{form.name}</span>!
                </p>
                <p className="text-cream/50 text-sm mb-6">
                  We'll confirm your reservation at <span className="text-gold">{form.email}</span> and call <span className="text-gold">{form.phone}</span> within 2 hours.
                </p>
                <div className="glass rounded-xl p-4 border border-white/5 text-left mb-6 space-y-2">
                  <p className="text-cream/60 text-sm">📅 <span className="text-cream">{form.date}</span></p>
                  <p className="text-cream/60 text-sm">🕐 <span className="text-cream">{form.time}</span></p>
                  <p className="text-cream/60 text-sm">👥 <span className="text-cream">{form.guests} guests</span></p>
                  {form.occasion && <p className="text-cream/60 text-sm">🎉 <span className="text-cream">{form.occasion}</span></p>}
                </div>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name:'',email:'',phone:'',date:'',time:'',guests:'2',occasion:'',seating:'',dietary:'',message:'' }); }}
                  className="btn-outline px-6 py-3 rounded-full text-sm font-semibold"
                >
                  Make Another Reservation
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 border border-white/5 space-y-4">

                {/* Personal details */}
                <div className="pb-2 border-b border-white/5">
                  <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">Your Details</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-cream/60 text-xs font-medium mb-1.5 flex items-center gap-1">
                        <User size={10} /> Full Name *
                      </label>
                      <input type="text" placeholder="Your full name" value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm" required />
                    </div>
                    <div>
                      <label className="text-cream/60 text-xs font-medium mb-1.5 flex items-center gap-1">
                        <Phone size={10} /> Phone Number *
                      </label>
                      <input type="tel" placeholder="077 000 0000" value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm" required />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-cream/60 text-xs font-medium mb-1.5 flex items-center gap-1">
                      <Mail size={10} /> Email Address *
                    </label>
                    <input type="email" placeholder="your@email.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm" required />
                  </div>
                </div>

                {/* Booking details */}
                <div className="pb-2 border-b border-white/5">
                  <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">Booking Details</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-cream/60 text-xs font-medium mb-1.5 flex items-center gap-1">
                        <Calendar size={10} /> Date *
                      </label>
                      <input type="date" value={form.date}
                        onChange={e => setForm({ ...form, date: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                        min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div>
                      <label className="text-cream/60 text-xs font-medium mb-1.5 flex items-center gap-1">
                        <Clock size={10} /> Time *
                      </label>
                      <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm" required>
                        <option value="">Select time</option>
                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-cream/60 text-xs font-medium mb-1.5 flex items-center gap-1">
                        <Users size={10} /> Guests *
                      </label>
                      <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm">
                        {[1,2,3,4,5,6,7,8,9,10,'10+'].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Special requests */}
                <div>
                  <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">Special Requests</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-cream/60 text-xs font-medium mb-1.5 block">Occasion</label>
                      <select value={form.occasion} onChange={e => setForm({ ...form, occasion: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm">
                        <option value="">Select occasion</option>
                        <option>Birthday</option>
                        <option>Anniversary</option>
                        <option>Date Night</option>
                        <option>Business Lunch</option>
                        <option>Family Gathering</option>
                        <option>Celebration</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-cream/60 text-xs font-medium mb-1.5 block">Seating Preference</label>
                      <select value={form.seating} onChange={e => setForm({ ...form, seating: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm">
                        <option value="">No preference</option>
                        <option>Indoor</option>
                        <option>Outdoor</option>
                        <option>Window seat</option>
                        <option>Private area</option>
                        <option>Booth</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-cream/60 text-xs font-medium mb-1.5 block">Dietary Requirements</label>
                    <input type="text" placeholder="e.g. Vegetarian, Gluten-free, Nut allergy..."
                      value={form.dietary} onChange={e => setForm({ ...form, dietary: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                  </div>
                  <div className="mt-4">
                    <label className="text-cream/60 text-xs font-medium mb-1.5 flex items-center gap-1">
                      <MessageSquare size={10} /> Additional Notes
                    </label>
                    <textarea placeholder="Anything else we should know? Special decorations, cake request, etc..."
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      rows={3} className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary w-full py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? 'Sending your reservation…' : 'Send Reservation Request'}
                </button>

                <p className="text-center text-cream/30 text-xs">
                  We confirm within 2 hours · Or call us directly:
                  <a href="tel:0776057554" className="text-accent hover:text-gold ml-1">077 605 7554</a>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
