import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroScene = lazy(() => import("./HeroScene"));

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0e0804]"
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0" style={{ width: "100%", height: "100%" }}>
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 z-10 bg-radial-gradient pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase font-medium backdrop-blur-sm">
            🇹🇳 Authentic Tunisian Cookies
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight font-serif"
        >
          Taste the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500">
            Magic
          </span>
          <br />
          Cookies
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-amber-100/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Fresh bakes✨ . Daily craving🤤 . MADE WITH LOVE & HEAT🔥
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="#menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-full text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-400/50 transition-shadow"
          >
            Explore Menu 🍪
          </motion.a>
          <motion.a
            href="#order"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/20 transition-colors"
          >
            Order Now →
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-amber-400/60"
        >
          <ArrowDown size={24} />
        </motion.div>
      </motion.div>

      {/* Grain overlay for texture */}
      <div
        className="absolute inset-0 z-10 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />
    </section>
  );
}
