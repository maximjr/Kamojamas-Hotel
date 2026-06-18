/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";
import { VisitorTracker } from "./components/VisitorTracker";

import { useAuth } from "./contexts/AuthContext";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const RoomsSuites = lazy(() => import("./pages/RoomsSuites"));
const Restaurant = lazy(() => import("./pages/Restaurant"));
const VipBar = lazy(() => import("./pages/VipBar"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Booking = lazy(() => import("./pages/Booking"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));

// Global fallback loader
const PageSkeleton = () => (
  <div className="flex-grow w-full animate-pulse bg-white">
    {/* Page Header / Hero Skeleton */}
    <div className="h-[40vh] md:h-[50vh] w-full bg-gray-100"></div>
    {/* Content Skeleton */}
    <div className="container mx-auto px-6 md:px-12 py-16">
      <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
        <div className="h-8 md:h-12 w-3/4 mx-auto bg-gray-100 rounded"></div>
        <div className="h-4 w-full bg-gray-100 rounded"></div>
        <div className="h-4 w-5/6 mx-auto bg-gray-100 rounded"></div>
      </div>
      
      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col">
            <div className="aspect-[4/3] w-full bg-gray-100 rounded-t-sm"></div>
            <div className="p-6 bg-gray-50 space-y-4 rounded-b-sm border border-t-0 border-gray-100">
              <div className="h-6 w-2/3 bg-gray-100 rounded"></div>
              <div className="h-4 w-full bg-gray-100 rounded"></div>
              <div className="h-4 w-4/5 bg-gray-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

function AppContent() {
  const { loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      // Ensure the beautiful loader shows for at least a split second even if fast
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="relative overflow-hidden bg-white min-h-[100dvh] flex flex-col">
      <VisitorTracker />
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-oxblood flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center"
            >
              <div className="text-white font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl mb-4 tracking-tighter uppercase font-bold">
                KAMOJAMAS <br className="sm:hidden" /> <span className="text-gold font-light text-xl sm:text-2xl md:text-4xl">Villa Hotel & Suite</span>
              </div>
              <div className="w-48 h-px bg-white/20 mx-auto relative overflow-hidden">
                 <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-gold"
                 />
              </div>
              <p className="text-gold/60 text-[10px] uppercase tracking-[0.5em] mt-6 font-bold">
                Timeless Luxury Awaits
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex-grow flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Navbar />
        
        <div className="flex-grow">
          <Suspense fallback={<PageSkeleton />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/rooms" element={<RoomsSuites />} />
                  <Route path="/restaurant" element={<Restaurant />} />
                  <Route path="/vip-bar" element={<VipBar />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  } />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </div>

        <Footer />
        
        {/* Floating Book Now Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/booking')}
          className="fixed bottom-8 right-8 z-40 bg-gold text-white px-8 py-4 rounded-full shadow-2xl font-bold uppercase text-[10px] tracking-[0.2em] group flex items-center space-x-3 overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative">Book Now</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

