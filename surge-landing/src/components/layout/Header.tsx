import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";
import { Menu, X, ShoppingCart, LogOut, User, Store } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Features", href: "/#features" },
    { name: "Nutrition", href: "/#nutrition" },
    { name: "About", href: "/#about" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("/") && !href.startsWith("/#")) {
      navigate(href);
    } else if (href.startsWith("/#")) {
      // Navigate to landing page then scroll
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(href.replace("/", ""));
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-[0_0_15px_hsl(var(--primary)/0.5)] group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="font-display font-black text-2xl tracking-wider text-white">SURGE</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-medium text-white/70 hover:text-primary transition-colors"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* User Greeting */}
              <div className="flex items-center gap-2 text-sm text-white/70">
                <User className="w-4 h-4" />
                <span className="max-w-[100px] truncate">{user?.name}</span>
              </div>

              {/* Cart Icon → links to /cart */}
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 text-white/70 hover:text-primary transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              {/* Logout */}
              <Button size="sm" variant="ghost" onClick={logout} className="text-white/70 hover:text-white">
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <AuthModal>
                <Button size="sm" variant="ghost" className="text-white/70 hover:text-white font-bold">
                  Login
                </Button>
              </AuthModal>
              <Button size="sm" className="font-bold" onClick={() => navigate("/shop")}>
                <Store className="w-4 h-4 mr-1.5" />
                Shop Now
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white/80 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="text-lg font-medium text-white/90 p-2 hover:bg-white/5 rounded-lg text-left"
            >
              {link.name}
            </button>
          ))}

          {isAuthenticated ? (
            <>
              <div className="flex items-center justify-between p-2 text-white/70">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                </div>
                <button onClick={() => { navigate("/cart"); setMobileMenuOpen(false); }} className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm">{cartCount}</span>
                </button>
              </div>
              <Button variant="ghost" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full justify-start text-white/70">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <AuthModal>
                <Button variant="ghost" className="w-full mt-2 text-white/70">Login</Button>
              </AuthModal>
              <Button className="w-full" onClick={() => { navigate("/shop"); setMobileMenuOpen(false); }}>
                <Store className="w-4 h-4 mr-2" />
                Shop Now
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
