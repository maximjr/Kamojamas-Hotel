import Contact from "../components/Contact";

const ContactUs = () => {
  return (
    <main className="pt-24 pb-16 bg-paper">
      <div className="container mx-auto px-6 md:px-12 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-serif text-oxblood mb-6 tracking-tight">Contact Us</h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          We are here to assist you with any inquiries or special requests.
        </p>
      </div>
      <Contact />
    </main>
  );
};

export default ContactUs;
