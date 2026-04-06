import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [location] = useLocation();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const isHome = location === "/";

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { name: "الخدمات", id: "services" },
    { name: "قصص النجاح", id: "showcase" },
    { name: "معرض الأعمال", id: "portfolio" },
    { name: "لوحة التحكم", href: "/admin" },
  ];

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      
      {/* Desktop Pill */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:flex pointer-events-auto items-center p-1.5 rounded-full bg-[#1c1c1e]/95 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-xl"
        dir="rtl"
      >
        <div className="flex items-center gap-1">
          {/* Close/Icon on the right side in RTL (start) */}
          <Link href="/">
            <div className="w-10 h-10 rounded-full bg-[#2c2c2e] border border-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </div>
          </Link>

          <div className="flex items-center gap-1 mx-2 relative" onMouseLeave={() => setHoveredIdx(null)}>
            {navLinks.map((link, idx) => (
              <div 
                key={link.name}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => {
                  if (link.href) window.location.href = link.href;
                  else scrollTo(link.id!);
                }}
                className="relative px-5 py-2.5 rounded-full cursor-pointer z-10"
              >
                {hoveredIdx === idx && (
                  <motion.div
                    layoutId="pill-hover"
                    className="absolute inset-0 bg-white/10 rounded-full z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  />
                )}
                <span className={`relative z-10 text-[14px] font-semibold transition-colors duration-200 ${hoveredIdx === idx ? 'text-white' : 'text-gray-400'}`}>
                  {link.name}
                </span>
              </div>
            ))}
          </div>

          <label className="theme-toggle cursor-pointer m-0 ml-3 scale-75 origin-right" aria-label="تبديل المظهر">
            <span className="sun"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="#ffd43b"><circle r="5" cy="12" cx="12"></circle><path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path></g></svg></span>
            <span className="moon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path></svg></span>
            <input type="checkbox" className="theme-toggle-input" checked={isDark} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
          <button 
            onClick={() => scrollTo("order")} 
            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform duration-200 ml-1"
          >
            اطلب الآن
          </button>
        </div>
      </motion.nav>

      {/* Mobile Pill */}
      <motion.nav 
        className="md:hidden pointer-events-auto flex items-center justify-between w-full max-w-sm p-1.5 rounded-full bg-[#1c1c1e]/95 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-xl"
        dir="rtl"
      >
        <Link href="/">
          <div className="w-10 h-10 rounded-full bg-[#2c2c2e] border border-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer mr-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <label className="theme-toggle cursor-pointer m-0 scale-75 origin-right" aria-label="تبديل المظهر">
            <span className="sun"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="#ffd43b"><circle r="5" cy="12" cx="12"></circle><path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path></g></svg></span>
            <span className="moon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path></svg></span>
            <input type="checkbox" className="theme-toggle-input" checked={isDark} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center ml-0.5"
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-20 left-4 right-4 bg-[#1c1c1e]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl md:hidden pointer-events-auto origin-top"
            dir="rtl"
          >
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => {
                  if (link.href) window.location.href = link.href;
                  else scrollTo(link.id!);
                }} 
                className="text-right text-base font-bold text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => scrollTo("order")} 
              className="text-center text-base font-bold text-black bg-white rounded-full py-3 hover:scale-105 transition-transform"
            >
              اطلب الآن
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
