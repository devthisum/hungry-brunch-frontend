// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Common
import Navbar          from './components/common/Navbar';
import Footer          from './components/common/Footer';
import LoadingScreen   from './components/common/LoadingScreen';
import ProtectedRoute  from './components/common/ProtectedRoute';
import ScrollProgress  from './components/common/ScrollProgress';
import MobileNav       from './components/common/MobileNav';

// Public pages
import HomePage     from './pages/HomePage';
import MenuPage     from './pages/MenuPage';
import AboutPage    from './pages/AboutPage';
import GalleryPage  from './pages/GalleryPage';
import ReviewsPage  from './pages/ReviewsPage';
import ContactPage  from './pages/ContactPage';
import OffersPage   from './pages/OffersPage';

// Admin pages
import AdminLogin        from './pages/admin/AdminLogin';
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminMenu         from './pages/admin/AdminMenu';
import AdminCategories   from './pages/admin/AdminCategories';
import AdminReviews      from './pages/admin/AdminReviews';
import AdminGallery      from './pages/admin/AdminGallery';
import AdminHours        from './pages/admin/AdminHours';
import AdminReservations from './pages/admin/AdminReservations';
import AdminPromotions   from './pages/admin/AdminPromotions';
import AdminQRCode       from './pages/admin/AdminQRCode';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity:0, y:12 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:-8 }}
      transition={{ duration:0.35, ease:'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/"        element={<PublicLayout><PageTransition><HomePage    /></PageTransition></PublicLayout>} />
        <Route path="/menu"    element={<PublicLayout><PageTransition><MenuPage    /></PageTransition></PublicLayout>} />
        <Route path="/offers"  element={<PublicLayout><PageTransition><OffersPage  /></PageTransition></PublicLayout>} />
        <Route path="/about"   element={<PublicLayout><PageTransition><AboutPage   /></PageTransition></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><PageTransition><GalleryPage /></PageTransition></PublicLayout>} />
        <Route path="/reviews" element={<PublicLayout><PageTransition><ReviewsPage /></PageTransition></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><PageTransition><ContactPage /></PageTransition></PublicLayout>} />

        {/* Admin */}
        <Route path="/admin/login"        element={<AdminLogin />} />
        <Route path="/admin"              element={<ProtectedRoute><PageTransition><AdminDashboard    /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/dashboard"    element={<ProtectedRoute><PageTransition><AdminDashboard    /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/reservations" element={<ProtectedRoute><PageTransition><AdminReservations /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/menu"         element={<ProtectedRoute><PageTransition><AdminMenu         /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/categories"   element={<ProtectedRoute><PageTransition><AdminCategories   /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/promotions"   element={<ProtectedRoute><PageTransition><AdminPromotions   /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/reviews"      element={<ProtectedRoute><PageTransition><AdminReviews      /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/gallery"      element={<ProtectedRoute><PageTransition><AdminGallery      /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/hours"        element={<ProtectedRoute><PageTransition><AdminHours        /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/qrcode"       element={<ProtectedRoute><PageTransition><AdminQRCode       /></PageTransition></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <PublicLayout>
            <div className="min-h-screen flex items-center justify-center text-center px-4 pt-24">
              <div>
                <span className="text-8xl block mb-6">🍽️</span>
                <h1 className="font-display text-6xl font-bold text-cream mb-4">404</h1>
                <p className="text-cream/50 text-lg mb-8">This page left the menu.</p>
                <a href="/" className="btn-primary px-8 py-4 rounded-full text-sm font-semibold">Go Back Home</a>
              </div>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function AppWithLoader() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1800); return () => clearTimeout(t); }, []);
  return (
    <>
      <ScrollProgress />
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
      {!loading && <AnimatedRoutes />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppWithLoader />
        <Toaster position="top-right" toastOptions={{
          style: { background:'#1C1C1C', color:'#FFF8E7', border:'1px solid rgba(217,119,6,0.2)', fontFamily:'Poppins,sans-serif', fontSize:'13px' },
          success: { iconTheme: { primary:'#D97706', secondary:'#FFF8E7' } },
          error:   { iconTheme: { primary:'#ef4444', secondary:'#FFF8E7' } },
        }} />
      </AuthProvider>
    </Router>
  );
}
