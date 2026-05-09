import Hero from "../components/Hero";
import About from "../components/About";
import StatsBanner from "../components/StatsBanner";
import Rooms from "../components/Rooms";
import Amenities from "../components/Amenities";
import Experience from "../components/Experience";
import Testimonials from "../components/Testimonials";
import MapLocation from "../components/MapLocation";
import Gallery from "../components/Gallery";
import FAQ from "../components/FAQ";

const Home = () => {
  return (
    <main>
      <Hero />
      <About />
      <StatsBanner />
      <Rooms />
      <Amenities />
      <Experience />
      <Testimonials />
      <MapLocation />
      <Gallery />
      <FAQ />
    </main>
  );
};

export default Home;
