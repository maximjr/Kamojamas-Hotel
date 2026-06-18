import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { Menu, X, User, ChevronDown, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = React.memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { user, userData, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#profile-dropdown-container")) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Rooms & Suites", href: "/rooms" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-700 flex flex-col justify-center ${
          isScrolled 
            ? "bg-oxblood/95 backdrop-blur-md shadow-2xl py-4 text-white" 
            : "bg-transparent py-8 text-white"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo - Left Side */}
          <div className="flex flex-col items-start lg:w-auto z-50 transition-all duration-300">
            <Link to="/" onClick={handleLinkClick}>
              <span className="text-xl md:text-2xl font-serif font-light tracking-[0.4em] uppercase block">
                KAMOJAMAS
              </span>
              <span className="text-[8px] tracking-[0.6em] text-gold uppercase mt-1 font-bold block">Villa Hotel & Suite</span>
            </Link>
          </div>

          {/* Links - Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-end gap-8 z-50"
          >
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-6 lg:space-x-8 text-[11px] lg:text-xs uppercase tracking-[0.15em] font-medium">
              {navLinks.map((link) => (
                <Link 
                   key={link.name} 
                   to={link.href} 
                   className={`hover:text-gold transition-colors ${location.pathname === link.href ? 'text-gold' : 'text-white/80'}`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Profile Dropdown Option */}
              {user ? (
                <div id="profile-dropdown-container" className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 focus:outline-none group py-1"
                    aria-label="User Profile Menu"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-serif text-xs font-semibold uppercase tracking-wider group-hover:bg-gold group-hover:text-oxblood transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                      {userData?.name ? userData.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2) : <User size={14} />}
                    </div>
                    <ChevronDown size={12} className={`text-white/60 group-hover:text-gold transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-64 bg-oxblood/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-4 text-white z-50 overflow-hidden"
                      >
                        {/* User Header Info */}
                        <div className="px-3 py-2 border-b border-white/10 mb-2">
                          <p className="text-[9px] uppercase tracking-widest text-gold font-bold">Logged In As</p>
                          <p className="font-serif text-sm text-white/95 truncate font-medium mt-1">{userData?.name || "Premium Guest"}</p>
                          <p className="text-[10px] text-white/50 truncate mt-0.5 font-mono">{user.email}</p>
                        </div>

                        <div className="space-y-1">
                          {(userData?.role === 'ADMIN' || userData?.role === 'SUPER_ADMIN') && (
                            <Link
                              to="/admin"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-gold text-white/80 transition-all text-[11px] uppercase tracking-wider font-semibold"
                            >
                              <ShieldCheck size={14} className="text-gold" />
                              Admin Panel
                            </Link>
                          )}

                          <Link
                            to="/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-gold text-white/80 transition-all text-[11px] uppercase tracking-wider font-semibold"
                          >
                            <LayoutDashboard size={14} className="text-gold" />
                            My Dashboard
                          </Link>

                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              signOut();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-white/80 transition-all text-[11px] uppercase tracking-wider font-semibold text-left"
                          >
                            <LogOut size={14} className="text-red-400" />
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  to="/auth" 
                  className={`hover:text-gold transition-colors ${location.pathname === '/auth' ? 'text-gold' : 'text-white/80'}`}
                >
                  Sign In
                </Link>
              )}

              <Link to="/booking">
                <button className="bg-gold text-oxblood px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-oxblood hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-500 rounded-full ml-4 lg:ml-6 shadow-[0_4px_20px_rgba(212,175,55,0.3)] relative overflow-hidden group">
                  <span className="relative z-10">Book Now</span>
                  <div className="absolute inset-0 bg-white/40 translate-x-[-150%] skew-x-[-45deg] group-hover:animate-[shine_1s_ease-in-out] z-0" />
                </button>
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden focus:outline-none ml-4 relative z-50 text-white"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:hidden fixed inset-0 z-30 bg-oxblood/95 backdrop-blur-xl text-white"
          >
            <div className="flex flex-col items-center justify-center min-h-[100dvh] space-y-6 pt-24 px-6 pb-24 overflow-y-auto w-full">
              
              {/* Profile Card inside Mobile Menu */}
              {user && (
                <div className="flex flex-col items-center pb-6 border-b border-white/10 w-full max-w-xs text-center mb-2">
                  <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-serif text-xl font-bold uppercase tracking-wider mb-2">
                    {userData?.name ? userData.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2) : <User size={20} />}
                  </div>
                  <p className="font-serif text-base text-white font-medium">{userData?.name || "Premium Guest"}</p>
                  <p className="text-[10px] text-white/50 font-mono mt-0.5">{user.email}</p>
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={handleLinkClick}
                  className={`text-xl uppercase tracking-[0.2em] font-serif transition-colors ${location.pathname === link.href ? 'text-gold' : 'hover:text-gold text-white/80'}`}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  {(userData?.role === 'ADMIN' || userData?.role === 'SUPER_ADMIN') && (
                    <Link
                      to="/admin"
                      onClick={handleLinkClick}
                      className={`text-lg uppercase tracking-[0.15em] font-semibold transition-colors flex items-center gap-2 ${location.pathname === '/admin' ? 'text-gold' : 'hover:text-gold text-white/80'}`}
                    >
                      <ShieldCheck size={16} className="text-gold" />
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className={`text-lg uppercase tracking-[0.15em] font-semibold transition-colors flex items-center gap-2 ${location.pathname === '/dashboard' ? 'text-gold' : 'hover:text-gold text-white/80'}`}
                  >
                    <LayoutDashboard size={16} className="text-gold" />
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => { signOut(); handleLinkClick(); }}
                    className="text-lg uppercase tracking-[0.15em] font-semibold transition-colors text-red-400 hover:text-red-300 flex items-center gap-2 mt-2"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={handleLinkClick}
                  className={`text-xl uppercase tracking-[0.2em] font-serif transition-colors ${location.pathname === '/auth' ? 'text-gold' : 'hover:text-gold text-white/80'}`}
                >
                  Sign In
                </Link>
              )}

              <Link to="/booking" onClick={handleLinkClick} className="w-full max-w-xs pt-4">
                <button className="w-full py-4 bg-gold text-oxblood uppercase tracking-[0.2em] font-bold text-xs rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  Reserve Suite
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default Navbar;
