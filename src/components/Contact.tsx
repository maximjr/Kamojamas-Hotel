import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold block mb-4">Connect With Us</span>
            <h2 className="text-oxblood font-serif text-4xl md:text-6xl mb-12">
              Start Your <span className="italic luxury-text-gradient">Journey</span>
            </h2>

            <div className="space-y-12 mb-16">
              <div className="flex items-start">
                <div className="p-4 bg-white shadow-xl rounded-2xl mr-6 text-gold">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-oxblood font-serif font-bold text-xl mb-2">Our Location</h4>
                  <p className="text-gray-500 font-light">
                    42 Riviera Drive, Crystal Bay, <br />
                    Luxury Island, LI 90210
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-4 bg-white shadow-xl rounded-2xl mr-6 text-gold">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-oxblood font-serif font-bold text-xl mb-2">Phone Inquiries</h4>
                  <p className="text-gray-500 font-light mb-1">Reception: +1 (800) LUX-KAMO</p>
                  <p className="text-gray-500 font-light">Concierge: +1 (888) VILLA-VIP</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-4 bg-white shadow-xl rounded-2xl mr-6 text-gold">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-oxblood font-serif font-bold text-xl mb-2">Email Us</h4>
                  <p className="text-gray-500 font-light">stay@kamojamsvilla.com</p>
                  <p className="text-gray-500 font-light">events@kamojamsvilla.com</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-6">
               {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.1, backgroundColor: "#C8A96B", color: "#FFFFFF" }}
                    className="w-12 h-12 border border-gold/30 flex items-center justify-center rounded-full text-gold transition-colors duration-300"
                  >
                    <Icon size={20} />
                  </motion.a>
               ))}
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 md:p-16 rounded-3xl shadow-2xl border border-gray-100"
          >
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Full Name</label>
                  <input type="text" className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-gold transition-colors font-light" placeholder="Johnathan Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Email Address</label>
                  <input type="email" className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-gold transition-colors font-light" placeholder="john@example.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Inquiry Type</label>
                <select className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-gold transition-colors font-light bg-transparent">
                  <option>General Stay Inquiry</option>
                  <option>Event Hosting</option>
                  <option>Wedding Packages</option>
                  <option>Corporate Retreat</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Your Message</label>
                <textarea rows={4} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-gold transition-colors font-light resize-none" placeholder="How can we assist you today?" />
              </div>

              <button className="w-full bg-oxblood text-white py-5 uppercase tracking-[0.3em] text-xs font-bold hover:bg-black transition-all duration-300 flex items-center justify-center space-x-4 rounded-full">
                <span>Send Inquiry</span>
                <Send size={16} className="text-gold" />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map Location Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full h-[300px] md:h-[400px] lg:h-[500px] mt-20 rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100"
        >
          <iframe
            src="https://maps.google.com/maps?q=Kamojama%20Villa,%20Abakaliki,%20Nigeria&t=&z=17&ie=UTF8&iwloc=&output=embed"
            className="absolute top-0 left-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
