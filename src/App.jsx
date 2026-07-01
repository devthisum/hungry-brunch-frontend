// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/AuthContext';

// Common
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import ReviewsPage from './pages/ReviewsPage';
import ContactPage from './pages/ContactPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminCategories from './pages/admin/AdminCategories';
import AdminReviews from './pages/admin/AdminReviews';
import AdminGallery from './pages/admin/AdminGallery';
import AdminHours from './pages/admin/AdminHours';

// Page transition wrapper
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// Public layout with nav + footer
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// Animated routes
function AnimatedRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={
          <PublicLayout>
            <PageTransition><HomePage /></PageTransition>
          </PublicLayout>
        } />
        <Route path="/menu" element={
          <PublicLayout>
            <PageTransition><MenuPage /></PageTransition>
          </PublicLayout>
        } />
        <Route path="/about" element={
          <PublicLayout>
            <PageTransition><AboutPage /></PageTransition>
          </PublicLayout>
        } />
        <Route path="/gallery" element={
          <PublicLayout>
            <PageTransition><GalleryPage /></PageTransition>
          </PublicLayout>
        } />
        <Route path="/reviews" element={
          <PublicLayout>
            <PageTransition><ReviewsPage /></PageTransition>
          </PublicLayout>
        } />
        <Route path="/contact" element={
          <PublicLayout>
            <PageTransition><ContactPage /></PageTransition>
          </PublicLayout>
        } />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>
        } />
        <Route path="/admin/menu" element={
          <ProtectedRoute><PageTransition><AdminMenu /></PageTransition></ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute><PageTransition><AdminCategories /></PageTransition></ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute><PageTransition><AdminReviews /></PageTransition></ProtectedRoute>
        } />
        <Route path="/admin/gallery" element={
          <ProtectedRoute><PageTransition><AdminGallery /></PageTransition></ProtectedRoute>
        } />
        <Route path="/admin/hours" element={
          <ProtectedRoute><PageTransition><AdminHours /></PageTransition></ProtectedRoute>
        } />

        {/* Redirect /admin → /admin/dashboard */}
        <Route path="/admin" element={
          <ProtectedRoute><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <PublicLayout>
            <div className="min-h-screen flex items-center justify-center text-center px-4">
              <div>
                <span className="text-8xl block mb-6">🍽️</span>
                <h1 className="font-display text-5xl font-bold text-cream mb-4">404</h1>
                <p className="text-cream/50 mb-8">Oops! This page seems to have left the menu.</p>
                <a href="/" className="btn-primary px-8 py-3 rounded-full text-sm font-semibold">
                  Go Back Home
                </a>
              </div>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </AnimatePresence>
  );
}

// Initial loading screen
function AppWithLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>
      {!loading && <AnimatedRoutes />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppWithLoader />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1C1C1C',
              color: '#FFF8E7',
              border: '1px solid rgba(217,119,6,0.2)',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#D97706', secondary: '#FFF8E7' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#FFF8E7' } },
          }}
        />
      </AuthProvider>
    </Router>
  );
}
