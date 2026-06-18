import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, CheckCircle2, Loader2 } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', type: 'General Stay Inquiry', message: '' });
  const [botField, setBotField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot check for spam defense
    if (botField) return;

    // Basic Input Sanitization
    const sanitizedName = formData.name.trim();
    const sanitizedEmail = formData.email.trim();
    const sanitizedMessage = formData.message.trim();

    if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) return;

    // Length constraints (防长文本攻击)
    if (sanitizedName.length > 100 || sanitizedEmail.length > 150 || sanitizedMessage.length > 2000) return;
    
    setIsSubmitting(true);
    // Simulate API call and defensive rate limiting
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', type: 'General Stay Inquiry', message: '' });
      setBotField('');
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-paper overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-6">
                 <div className="w-8 h-px bg-gold/50" />
                 <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold block">Connect With Us</span>
            </div>
            
            <h2 className="text-oxblood font-serif text-4xl md:text-6xl lg:text-7xl mb-12 tracking-tight">
              Start Your <br />
              <span className="italic font-light text-oxblood/80">Journey</span>
            </h2>

            <div className="space-y-12 mb-16">
              <div className="flex items-start group cursor-pointer">
                <div className="p-4 bg-white border border-gray-100 shadow-xl shadow-oxblood/5 mr-6 text-gold group-hover:bg-oxblood group-hover:text-white transition-colors duration-500">
                  <MapPin size={24} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-oxblood font-serif font-bold text-xl mb-2 group-hover:text-gold transition-colors duration-500">Our Location</h4>
                  <p className="text-gray-500 font-light leading-relaxed">
                    No. 187 Ogoja Road, Onu Ebonyi Junction, <br />
                    Abakaliki Ebonyi State.
                  </p>
                </div>
              </div>

              <div className="flex items-start group cursor-pointer">
                <div className="p-4 bg-white border border-gray-100 shadow-xl shadow-oxblood/5 mr-6 text-gold group-hover:bg-oxblood group-hover:text-white transition-colors duration-500">
                  <Phone size={24} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-oxblood font-serif font-bold text-xl mb-2 group-hover:text-gold transition-colors duration-500">Phone Inquiries</h4>
                  <p className="text-gray-500 font-light mb-1">+234 907 225 9725  +234 904 652 5757</p>
                </div>
              </div>

              <div className="flex items-start group cursor-pointer">
                <div className="p-4 bg-white border border-gray-100 shadow-xl shadow-oxblood/5 mr-6 text-gold group-hover:bg-oxblood group-hover:text-white transition-colors duration-500">
                  <Mail size={24} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-oxblood font-serif font-bold text-xl mb-2 group-hover:text-gold transition-colors duration-500">Email Us</h4>
                  <p className="text-gray-500 font-light">reservation@kamojamasvilla.com</p>
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
                    <Icon size={20} strokeWidth={1.5} />
                  </motion.a>
               ))}
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white p-10 md:p-16 border border-gray-100 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] rounded-full pointer-events-none" />
            <form className="space-y-10 relative z-10" onSubmit={handleSubmit}>
              {/* Spam Defense Honeypot */}
              <div className="hidden" aria-hidden="true">
                <input type="text" name="bot-field" tabIndex={-1} value={botField} onChange={e => setBotField(e.target.value)} />
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-3 relative group">
                  <label htmlFor="contactName" className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold group-hover:text-gold transition-colors duration-300">Full Name</label>
                  <input id="contactName" type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-oxblood transition-colors font-serif text-lg bg-transparent" placeholder="Johnathan Doe" />
                </div>
                <div className="space-y-3 relative group">
                  <label htmlFor="contactEmail" className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold group-hover:text-gold transition-colors duration-300">Email Address</label>
                  <input id="contactEmail" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-oxblood transition-colors font-serif text-lg bg-transparent" placeholder="john@example.com" />
                </div>
              </div>
              
              <div className="space-y-3 relative group">
                <label htmlFor="contactType" className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold group-hover:text-gold transition-colors duration-300">Inquiry Type</label>
                <select id="contactType" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-oxblood transition-colors font-serif text-lg bg-transparent hover:cursor-pointer">
                  <option>General Stay Inquiry</option>
                  <option>Event Hosting</option>
                  <option>Wedding Packages</option>
                  <option>Corporate Retreat</option>
                </select>
              </div>

              <div className="space-y-3 relative group">
                <label htmlFor="contactMessage" className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold group-hover:text-gold transition-colors duration-300">Your Message</label>
                <textarea id="contactMessage" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={4} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-oxblood transition-colors font-serif text-lg bg-transparent resize-none leading-relaxed" placeholder="How can we assist you today?" />
              </div>

              {submitted && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-700 text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Thank you! Your inquiry has been sent.
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting || submitted}
                className="w-full bg-oxblood text-white py-6 uppercase tracking-[0.3em] text-xs font-bold hover:bg-gold transition-all duration-500 flex items-center justify-center space-x-4 group mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? "Sending..." : "Send Inquiry"}</span>
                {isSubmitting ? <Loader2 size={16} className="animate-spin text-white" /> : <Send size={16} className="text-white group-hover:translate-x-1 transition-transform duration-300" />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
