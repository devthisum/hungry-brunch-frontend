// src/pages/admin/AdminQRCode.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, QrCode, RefreshCw, Printer } from 'lucide-react';
import { qrAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

export default function AdminQRCode() {
  const [qrData, setQrData]   = useState(null);
  const [loading, setLoading] = useState(true);

  const loadQR = () => {
    setLoading(true);
    qrAPI.getMenu()
      .then(res => setQrData(res.data.data))
      .catch(() => toast.error('Failed to generate QR code'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadQR(); }, []);

  const downloadQR = () => {
    if (!qrData?.qr) return;
    const link = document.createElement('a');
    link.download = 'hungry-brunch-menu-qr.png';
    link.href = qrData.qr;
    link.click();
    toast.success('QR code downloaded!');
  };

  const printQR = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hungry Brunch — Menu QR Code</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; }
          .card { text-align: center; padding: 40px; border: 2px solid #D97706; border-radius: 20px; max-width: 400px; }
          .logo { font-size: 28px; font-weight: 900; color: #D97706; margin-bottom: 4px; }
          .sub { font-size: 12px; color: #888; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px; }
          img { width: 250px; height: 250px; margin-bottom: 20px; }
          .title { font-size: 18px; font-weight: 700; color: #1C1C1C; margin-bottom: 8px; }
          .desc { font-size: 13px; color: #666; margin-bottom: 16px; }
          .url { font-size: 11px; color: #D97706; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">Hungry Brunch</div>
          <div class="sub">Café & Restaurant · Kandy</div>
          <img src="${qrData.qr}" alt="Menu QR Code" />
          <div class="title">📱 Scan to View Our Menu</div>
          <div class="desc">Point your phone camera at this code to explore our full menu</div>
          <div class="url">${qrData.url}</div>
        </div>
        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-cream">QR Code Menu</h1>
        <p className="text-cream/40 text-sm">Generate and print QR codes for table cards</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* QR Code display */}
        <div className="glass rounded-3xl p-8 border border-white/5 text-center">
          <h2 className="font-display text-xl font-semibold text-cream mb-6">Menu QR Code</h2>

          {loading ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-2 border-accent/30 border-t-accent rounded-full" />
              <p className="text-cream/40 text-sm">Generating QR code…</p>
            </div>
          ) : qrData ? (
            <div className="flex flex-col items-center">
              {/* QR frame */}
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="relative p-4 bg-white rounded-2xl shadow-2xl shadow-accent/20 mb-6 inline-block">
                <img src={qrData.qr} alt="Menu QR Code" className="w-56 h-56" />
                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent rounded-tl" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-accent rounded-tr" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-accent rounded-bl" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-accent rounded-br" />
              </motion.div>

              {/* URL */}
              <p className="text-cream/40 text-xs mb-1">Points to:</p>
              <a href={qrData.url} target="_blank" rel="noreferrer"
                className="text-accent text-sm hover:text-gold transition-colors break-all mb-8">
                {qrData.url}
              </a>

              {/* Action buttons */}
              <div className="flex gap-3 flex-wrap justify-center">
                <button onClick={downloadQR}
                  className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <Download size={15} /> Download PNG
                </button>
                <button onClick={printQR}
                  className="btn-outline px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <Printer size={15} /> Print Card
                </button>
                <button onClick={loadQR}
                  className="glass border border-white/10 px-4 py-3 rounded-xl text-sm text-cream/50 hover:text-cream flex items-center gap-2 transition-all">
                  <RefreshCw size={15} /> Refresh
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <QrCode size={48} className="text-cream/20 mx-auto mb-4" />
              <p className="text-cream/40">Failed to generate QR code</p>
              <button onClick={loadQR} className="btn-primary mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold">
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* How to use */}
        <div className="space-y-5">
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h3 className="font-display text-lg font-semibold text-cream mb-4">📱 How to Use</h3>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Download or Print', desc: 'Click "Download PNG" to save the QR code image, or "Print Card" to print a ready-to-use table card.' },
                { step: '2', title: 'Place on Tables', desc: 'Put the printed QR code on each table in a small stand or laminated card.' },
                { step: '3', title: 'Customers Scan', desc: 'Customers point their phone camera at the code — no app needed. Opens your full menu instantly.' },
                { step: '4', title: 'Browse & Order', desc: 'Customers see the full menu with photos, prices, and descriptions on their phone.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {step}
                  </div>
                  <div>
                    <p className="text-cream font-semibold text-sm mb-1">{title}</p>
                    <p className="text-cream/50 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-accent/15">
            <h3 className="font-display text-lg font-semibold text-cream mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2.5">
              {[
                'Laminate the printed card to make it waterproof',
                'Use a small acrylic stand for a premium look',
                'Print in color for best scanning results',
                'Place on every table and at the entrance',
                'Update your menu in admin — QR always shows latest items',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-cream/60 text-sm">
                  <span className="text-accent mt-0.5">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5">
            <h3 className="font-display text-lg font-semibold text-cream mb-3">🎨 Print Preview</h3>
            <p className="text-cream/50 text-sm mb-4">The printed card will look like this:</p>
            <div className="border-2 border-accent/30 rounded-xl p-4 text-center">
              <p className="font-display text-base font-bold text-accent">Hungry Brunch</p>
              <p className="text-cream/40 text-[10px] tracking-widest uppercase mb-3">Café & Restaurant · Kandy</p>
              {qrData && <img src={qrData.qr} alt="" className="w-24 h-24 mx-auto mb-3" />}
              <p className="text-cream/70 text-xs font-bold">📱 Scan to View Our Menu</p>
              <p className="text-cream/30 text-[10px] mt-1">Point your phone camera at this code</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
