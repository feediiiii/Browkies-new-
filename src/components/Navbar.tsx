import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Our Cookies", href: "#menu" },
  { label: "Order", href: "#order" },
  { label: "Track Order", href: "#tracker" },
];

export default function Navbar() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-xl bg-[#0e0804]/70 border-b border-amber-800/20"
    >
      {/* Logo */}
      <a href="#hero" className="flex items-center gap-2 group">
        <motion.div whileHover={{ rotate: 20 }} className="text-3xl">
          🍪
        </motion.div>
        <span className="text-xl font-bold text-amber-300 tracking-wide font-serif">
          browkiezz<span className="text-white">by Hajer</span>
        </span>
      </a>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-8">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-amber-100/80 hover:text-amber-300 transition-colors text-sm font-medium tracking-wider uppercase"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Cart Button */}
      <div className="flex items-center gap-4">
        <a href="#order">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-full text-sm transition-colors"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
              >
                {count}
              </motion.span>
            )}
          </motion.button>
        </a>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-amber-300"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#0e0804]/95 backdrop-blur-xl border-b border-amber-800/30 md:hidden"
          >
            <ul className="flex flex-col py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-8 py-3 text-amber-100/80 hover:text-amber-300 hover:bg-amber-900/30 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
