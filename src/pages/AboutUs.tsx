import About from "../components/About";

const AboutUs = () => {
  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-6 md:px-12 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-oxblood mb-6 tracking-tight">About Us</h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Our heritage, our mission, and what makes KAMOJAMAS an unforgettable experience.
        </p>
      </div>
      <About />
    </main>
  );
};

export default AboutUs;
