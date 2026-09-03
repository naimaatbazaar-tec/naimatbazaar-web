'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import Link from 'next/link';

export default function Header({ cartCount = 0, setIsCartOpen }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Ensure hydration matches by marking component as mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home', id: 'home' },
    { name: 'Deals', href: '/#deals', id: 'deals' },
    { name: 'Products', href: '/#products', id: 'products' },
    { name: 'Reviews', href: '/#reviews', id: 'reviews' },
    { name: 'FAQ', href: '/#faq', id: 'faq' },
  ];

  // IntersectionObserver to dynamically highlight section on scroll
  useEffect(() => {
    // If not on the homepage, clear active section completely
    if (!isHomePage) {
      setActiveSection('');
      return;
    }

    const sectionIds = ['home', 'deals', 'products', 'reviews', 'faq'];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHomePage, pathname]);

  const handleNavClick = (id) => {
    if (isHomePage) {
      setActiveSection(id);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/#home" onClick={() => handleNavClick('home')}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
          >
            <img
              src="/images/nblogo.svg"
              alt="Naimat Bazaar Logo"
              className="h-9 sm:h-11 w-auto rounded-full object-contain border border-gray-200 shadow-xs group-hover:border-[#8B0000] transition-colors"
            />
            <span className="text-base sm:text-xl font-black text-[#8B0000] tracking-tight">
              Naimat Bazaar
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex list-none gap-6 font-bold text-xs sm:text-sm text-gray-700 items-center">
          {navLinks.map((link) => {
            const isActive = isHomePage && activeSection === link.id;
            return (
              <motion.li key={link.id} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link
                  href={link.href}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 transition-colors ${
                    isActive ? 'text-[#8B0000]' : 'hover:text-[#8B0000]'
                  }`}
                >
                  {link.name}
                  {/* Active Link Indicator Bar */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-[#8B0000] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                </Link>
              </motion.li>
            );
          })}
        </ul>

        {/* Right Actions: Account, Cart & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Account Button (Desktop Only) */}
          <Link href="/login" className="hidden md:block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 rounded-full border border-gray-200 text-gray-700 hover:text-[#8B0000] hover:border-[#8B0000]/30 hover:bg-[#8B0000]/5 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              aria-label="Account"
            >
              <User className="w-4 h-4 text-[#8B0000]" />
              <span>Account</span>
            </motion.div>
          </Link>

          {/* Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="bg-[#8B0000] hover:bg-[#a30000] text-white border-none p-2.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {isMounted && cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="bg-white text-[#8B0000] px-1.5 py-0.5 rounded-full text-[10px] font-black shadow-inner"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          {/* Mobile Hamburger Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#8B0000]" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden shadow-lg"
          >
            <ul className="flex flex-col px-6 py-4 space-y-3 font-bold text-sm text-gray-800">
              {navLinks.map((link, index) => {
                const isActive = isHomePage && activeSection === link.id;
                return (
                  <motion.li
                    key={link.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => handleNavClick(link.id)}
                      className={`block py-2 border-b border-gray-100 transition-colors ${
                        isActive ? 'text-[#8B0000] font-black' : 'hover:text-[#8B0000]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                );
              })}

              {/* Mobile Account Link inside Drawer */}
              <motion.li
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-[#8B0000] font-extrabold transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Login / Register Account</span>
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}