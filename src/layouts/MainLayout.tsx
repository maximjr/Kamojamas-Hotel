import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { VisitorTracker } from '../components/VisitorTracker';

// A beautifully structured main layout that encapsulates repeating components.
export function MainLayout() {
  return (
    <div className="relative overflow-hidden bg-white min-h-[100dvh] flex flex-col">
      <VisitorTracker />
      <Navbar />
      <div className="flex-grow">
        <Suspense fallback={<div className="min-h-screen bg-oxblood flex items-center justify-center"><div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div></div>}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
