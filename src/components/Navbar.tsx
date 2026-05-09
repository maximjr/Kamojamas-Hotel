import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Rooms & Suites", href: "/rooms" },
    { name: "Restaurant", href: "/restaurant" },
    { name: "VIP Bar", href: "/vip-bar" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // A helper function to close the mobile menu
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 flex flex-col justify-center bg-white shadow-lg text-oxblood ${
        isScrolled || location.pathname !== "/" ? "py-4" : "py-8"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo - Left Side */}
        <div
          className="flex flex-col items-start lg:w-auto z-50 transition-all duration-300"
        >
          <Link to="/" onClick={handleLinkClick}>
            <span className="text-xl md:text-2xl font-serif font-light tracking-[0.4em] uppercase block">
              KAMOJAMAS
            </span>
            <span className="text-[8px] tracking-[0.6em] text-gold uppercase mt-1 font-bold block">Villa and Suite</span>
          </Link>
        </div>

        {/* Links - Right Side */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-end gap-8"
        >
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6 lg:space-x-8 text-[11px] lg:text-xs uppercase tracking-[0.15em] font-medium">
            {navLinks.map((link) => (
              <Link 
                 key={link.name} 
                 to={link.href} 
                 className={`hover:text-gold transition-colors ${location.pathname === link.href ? 'text-gold' : ''}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/contact">
              <button className="bg-gold text-white px-7 py-2.5 text-[11px] uppercase tracking-widest font-semibold hover:bg-gold-dark hover:shadow-lg transition-all duration-300 rounded-full ml-4 lg:ml-6">
                Book Now
              </button>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden focus:outline-none ml-4 relative z-50"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: "100vh", opacity: 1 } : { height: 0, opacity: 0 }}
        className="lg:hidden fixed inset-0 bg-oxblood text-white overflow-y-auto"
        style={{ pointerEvents: isMobileMenuOpen ? 'auto' : 'none' }}
      >
        <div className="flex flex-col items-center justify-center min-h-screen space-y-8 pt-20">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={handleLinkClick}
              className={`text-xl uppercase tracking-[0.15em] font-light transition-colors ${location.pathname === link.href ? 'text-gold' : 'hover:text-gold'}`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/contact">
            <button className="px-10 py-4 mt-8 bg-gold text-white uppercase tracking-[0.15em] font-medium text-xs rounded-full">
              Book Your Stay
            </button>
          </Link>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
