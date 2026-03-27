import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Settings, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSection } from "@/hooks/useContent";
import { smoothScrollTo } from "@/lib/scroll";

const defaultBrand = { name: "Hanody1x", logoLetter: "H", logoImage: "" };

export function Navbar() {
  const brand = useSection("brand", defaultBrand as any);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsLightMode(true);
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    if (isLightMode) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setIsLightMode(false);
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsLightMode(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location === "/";

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    smoothScrollTo(id);
  };

  const navLinks = [
    { name: "الخدمات", id: "services" },
    { name: "قصص النجاح", id: "showcase" },
    { name: "معرض الأعمال", id: "portfolio" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-4" : "py-6"}`}>
      <div className="absolute inset-0 bg-background/50 backdrop-blur-xl border-b border-white/5 pointer-events-none" />
      <div className="container mx-auto px-6 relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tighter text-white hover:text-primary transition-colors flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center overflow-hidden">
              {brand.logoImage ? (
                <img src={brand.logoImage} alt={brand.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-sm font-black">{brand.logoLetter}</span>
              )}
            </div>
            {brand.name}
          </Link>
        </div>

        <div className="flex items-center gap-4 dir-ltr">
        <nav className="hidden md:flex items-center gap-8" dir="rtl">
          {navLinks.map((link) => (
            <button key={link.name} onClick={() => scrollTo(link.id)} className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              {link.name}
            </button>
          ))}
          <Button onClick={() => scrollTo("order")} className="bg-white text-black hover:bg-white/90 rounded-full px-6 font-semibold light-btn-blue">
            اطلب الآن
          </Button>
        </nav>

        <div className="flex items-center gap-3 md:mr-4">
          <motion.button 
            onClick={toggleTheme}
            whileTap={{ scale: 0.8, rotate: 180 }}
            animate={{ rotate: isLightMode ? 360 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition-all border border-white/10 flex items-center justify-center"
            title={isLightMode ? "تفعيل الوضع المظلم" : "تفعيل الوضع المضيء"}
          >
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>

          <Link href="/admin" className="text-sm font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all border border-white/10">
            لوحة التحكم
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-white mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-card border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl md:hidden"
          >
            {navLinks.map((link) => (
              <button key={link.name} onClick={() => scrollTo(link.id)} className="text-right text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                {link.name}
              </button>
            ))}
            <Button onClick={() => scrollTo("order")} className="bg-white text-black hover:bg-white/90 rounded-full font-semibold w-full light-btn-blue">
              اطلب الآن
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
