import { motion } from "motion/react";
import { Link } from "react-router-dom";
import React from "react";

const Footer = React.memo(() => {
  return (
    <footer className="bg-oxblood text-white pt-32 pb-16 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
             <span className="text-3xl font-serif font-bold tracking-tighter block mb-8 uppercase drop-shadow-md">
               KAMOJAMAS <br /> <span className="text-gold font-light">Villa Hotel & Suite</span>
             </span>
             <p className="text-white/40 font-light leading-relaxed mb-8 text-sm">
               Our villas provide sanctuary where luxury knows no bounds. Discover a new standard of hospitality, where every moment is a masterpiece.
             </p>
             <div className="h-px w-full bg-white/10" />
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h4 className="text-gold uppercase tracking-widest text-[10px] font-bold mb-10">Discover</h4>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "Rooms & Suites", href: "/rooms" },
                { name: "Restaurant", href: "/restaurant" },
                { name: "VIP Bar", href: "/vip-bar" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" }
              ].map((link, idx) => (
                <li key={link.name} className="group flex items-center gap-3 cursor-pointer">
                  <div className="w-4 h-px bg-white/10 group-hover:bg-gold group-hover:w-8 transition-all duration-300" />
                  <Link to={link.href} className="text-white/60 group-hover:text-gold transition-colors text-xs font-medium tracking-wide uppercase">{link.name}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="text-gold uppercase tracking-widest text-[10px] font-bold mb-10">Contact</h4>
            <ul className="space-y-6 text-white/70 text-sm font-light">
              <li>
                 <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">Email</p>
                 <a href="mailto:reservation@kamojamasvilla.com" className="hover:text-gold transition-colors">reservation@kamojamasvilla.com</a>
              </li>
              <li>
                 <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">Phone</p>
                 <a href="tel:+2349072259725" className="hover:text-gold transition-colors">+234 907 225 9725</a>  <a href="tel:+2349046525757" className="hover:text-gold transition-colors">+234 904 652 5757</a>
              </li>
              <li>
                 <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">Address</p>
                 <p>No. 187 Ogoja Road, Onu Ebonyi Junction,<br/>Abakaliki Ebonyi State.</p>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h4 className="text-gold uppercase tracking-widest text-[10px] font-bold mb-10">Newsletter</h4>
            <p className="text-white/50 text-xs mb-6 font-light leading-relaxed">Subscribe for exclusive seasonal offers and private estate updates.</p>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row items-stretch shadow-xl gap-4 sm:gap-0">
               <input 
                  type="email" 
                  aria-label="Email address for newsletter"
                  required
                  placeholder="Your Email" 
                  className="bg-white/5 border border-white/10 px-5 py-4 text-sm focus:outline-none focus:border-gold w-full min-w-0 transition-colors font-light placeholder:text-white/20" 
               />
               <button type="submit" aria-label="Subscribe to newsletter" className="bg-gold px-8 py-4 text-oxblood font-bold text-xs uppercase tracking-tighter hover:bg-white transition-colors w-full sm:w-auto">
                  Join
               </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pt-12 border-t border-white/10 flex flex-col xl:flex-row justify-between items-center space-y-6 xl:space-y-0 text-[10px] uppercase tracking-[0.3em] font-medium text-white/40 text-center xl:text-left relative z-20"
        >
          <div>Discover True Elegance — Limited Seasonal Availability</div>
          <div className="flex flex-wrap gap-6 xl:gap-12 justify-center">
            <a href="#" className="hover:text-gold transition-colors">Instagram</a>
            <a href="#" className="hover:text-gold transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-gold transition-colors">Privé Circle</a>
          </div>
        </motion.div>
      </div>

      {/* Small Copyright */}
      <div className="container mx-auto px-6 md:px-12 mt-12 relative z-20">
         <p className="text-[10px] uppercase tracking-widest text-white/20 text-center xl:text-left font-medium">
            © 2026 KAMOJAMAS Hospitality Group. All rights reserved.
         </p>
      </div>

      {/* Background Decorative Large Logo */}
      <div className="absolute -bottom-20 -right-20 text-[25rem] font-serif font-black text-white/[0.02] pointer-events-none select-none drop-shadow-2xl z-0 leading-none">
         KV
      </div>
    </footer>
  );
});

export default Footer;
