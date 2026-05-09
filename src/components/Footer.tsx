import { motion } from "motion/react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-oxblood text-white pt-24 pb-12 overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="lg:col-span-1">
             <span className="text-3xl font-serif font-bold tracking-tighter block mb-8 uppercase">
               KAMOJAMAS <span className="text-gold font-light">Villa and Suite</span>
             </span>
             <p className="text-white/40 font-light leading-relaxed mb-8">
               Our villas provide sanctuary where luxury knows no bounds. Discover a new standard of hospitality, where every moment is a masterpiece.
             </p>
             <div className="h-px w-full bg-white/10" />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-10">Discover</h4>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "Rooms & Suites", href: "/rooms" },
                { name: "Restaurant", href: "/restaurant" },
                { name: "VIP Bar", href: "/vip-bar" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-gold transition-colors text-sm font-light">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-10">Contact</h4>
            <ul className="space-y-4 text-white/60 text-sm font-light">
              <li>stay@kamojamsvilla.com</li>
              <li>+1 (800) LUX-KAMO</li>
              <li>42 Riviera Drive, Crystal Bay</li>
              <li>Luxury Island, LI 90210</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-10">Newsletter</h4>
            <p className="text-white/40 text-xs mb-6 italic">Subscribe for exclusive offers and updates.</p>
            <div className="flex">
               <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-gold w-full rounded-l-full" 
               />
               <button className="bg-gold px-6 py-3 text-oxblood font-bold text-xs uppercase tracking-tighter hover:bg-white transition-colors rounded-r-full">
                  Join
               </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[9px] uppercase tracking-[0.3em] font-bold text-white/40">
          <div>Discover True Elegance — Limited Seasonal Availability</div>
          <div className="flex gap-12">
            <a href="#" className="hover:text-gold transition-colors">Instagram</a>
            <a href="#" className="hover:text-gold transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-gold transition-colors">Privé Circle</a>
          </div>
        </div>
      </div>

      {/* Small Copyright */}
      <div className="container mx-auto px-6 md:px-12 mt-12">
         <p className="text-[8px] uppercase tracking-widest text-white/20 text-center md:text-left font-bold">
            © 2026 KAMOJAMAS Hospitality Group. All rights reserved.
         </p>
      </div>

      {/* Background Decorative Large Logo */}
      <div className="absolute -bottom-20 -right-40 text-[20rem] font-serif font-black text-white/[0.02] pointer-events-none select-none">
         KV
      </div>
    </footer>
  );
};

export default Footer;
