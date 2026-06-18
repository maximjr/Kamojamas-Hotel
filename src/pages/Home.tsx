import { lazy, Suspense } from "react";
import { AnimatedPage } from "../components/AnimatedPage";
import Hero from "../components/Hero";
import TrustBanner from "../components/TrustBanner";
import SEO from "../components/SEO";

// Lazy loading heavy components that appear below the fold
const About = lazy(() => import("../components/About"));
const StatsBanner = lazy(() => import("../components/StatsBanner"));
const Rooms = lazy(() => import("../components/Rooms"));
const RestaurantSection = lazy(() => import("../components/RestaurantSection"));
const VipSection = lazy(() => import("../components/VipSection"));
const Amenities = lazy(() => import("../components/Amenities"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const MapLocation = lazy(() => import("../components/MapLocation"));
const Gallery = lazy(() => import("../components/Gallery"));
const FAQ = lazy(() => import("../components/FAQ"));

const SectionLoader = () => (
  <div className="w-full h-32 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin"></div>
  </div>
);

const Home = () => {
  return (
    <AnimatedPage>
      <SEO 
        title="Luxury Accommodation in Abakaliki"
        description="Welcome to Kamojamas Villa Hotel & Suite. Experience unparalleled luxury, dining, and VIP experiences in the heart of Ebonyi State."
        url="https://kamojamas.com/"
      />
      <Hero />
      <TrustBanner />
      <Suspense fallback={<SectionLoader />}>
        <About />
        <StatsBanner />
        <Rooms />
        <RestaurantSection />
        <VipSection />
        <Amenities />
        <Testimonials />
        <MapLocation />
        <Gallery />
        <FAQ />
      </Suspense>
    </AnimatedPage>
  );
};

export default Home;
