import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getAllCookies } from "../firebase/services";
import type { Flavor } from "../data/cookies";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Plus, CheckCircle } from "lucide-react";
import RotatingCookie from "./RotatingCookie";

function FlavorBadge({ flavor, cookieType }: { flavor: Flavor; cookieType: CookieTypeWithFlavors }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!flavor.available) return;
    addItem({
      cookieId: cookieType.id,
      cookieName: cookieType.name,
      flavorId: flavor.id,
      flavorName: flavor.name,
      price: flavor.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={flavor.available ? { scale: 1.03, y: -2 } : {}}
      className={`relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all ${
        flavor.available
          ? "bg-white/5 border-white/10 hover:border-amber-400/40 hover:bg-white/10 cursor-pointer"
          : "opacity-40 bg-white/5 border-white/5 cursor-not-allowed"
      }`}
      onClick={handleAdd}
    >
      <div className="flex-1">
        <p className="text-white font-medium text-sm">{flavor.name}</p>
        <p className="text-amber-400 text-xs font-bold mt-0.5">{flavor.price.toFixed(2)} TND / pièce</p>
      </div>
      <div className="flex items-center gap-2">
        {!flavor.available && (
          <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Bientôt</span>
        )}
        {flavor.available && (
          <AnimatePresence mode="wait">
            {added ? (
              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-green-400">
                <CheckCircle size={20} />
              </motion.div>
            ) : (
              <motion.div key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-black">
                <Plus size={14} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

type CookieTypeWithFlavors = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  flavors: Flavor[];
};

function CookieCard({ cookie }: { cookie: CookieTypeWithFlavors }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="relative group rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm hover:border-white/20 transition-all"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${cookie.gradientFrom}22 0%, transparent 70%)` }}
      />

      <div className="p-6 pb-4" style={{ background: `linear-gradient(135deg, ${cookie.gradientFrom}30, ${cookie.gradientTo}15)` }}>
        <div className="flex items-start justify-between">
          <div>
            <motion.span
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-5xl inline-block mb-3"
            >
              {cookie.emoji}
            </motion.span>
            <h3 className="text-2xl font-bold text-white font-serif">{cookie.name}</h3>
            <p className="text-amber-100/60 text-sm mt-1.5 leading-relaxed">{cookie.description}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          <span className="text-xs bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full">
            {cookie.flavors.filter((f) => f.available).length} saveurs disponibles
          </span>
          <span className="text-xs bg-white/10 border border-white/10 text-white/60 px-3 py-1 rounded-full">
            À partir de {Math.min(...cookie.flavors.map((f) => f.price)).toFixed(2)} TND
          </span>
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-left text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center justify-between mt-2 mb-3"
        >
          <span>Sélectionner les Saveurs</span>
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>▾</motion.span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-2"
            >
              {cookie.flavors.map((flavor) => (
                <FlavorBadge key={flavor.id} flavor={flavor} cookieType={cookie} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!expanded && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {cookie.flavors.filter((f) => f.available).slice(0, 3).map((f) => (
              <span key={f.id} className="text-xs bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded-full">
                {f.name}
              </span>
            ))}
            {cookie.flavors.filter((f) => f.available).length > 3 && (
              <span className="text-xs text-amber-500/70">+more</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function MenuSection() {
  const [cookies, setCookies] = useState<CookieTypeWithFlavors[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadCookies() {
      console.log("Loading cookies... Auth user:", user?.email || "Not authenticated");
      try {
        const data = await getAllCookies();
        setCookies(data);
      } catch (error) {
        console.error("Error loading cookies:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCookies();
  }, [user]);

  if (loading) {
    return (
      <section id="menu" className="py-24 px-6 md:px-12 bg-[#0e0804] relative">
        <div className="max-w-6xl mx-auto text-center">
          <RotatingCookie size={64} />
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-24 px-6 md:px-12 bg-[#0e0804] relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm tracking-widest uppercase font-medium mb-3 block">
            Notre Collection Signature
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            {cookies.length} Types de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Cookies</span>
          </h2>
          <p className="text-amber-100/50 text-lg max-w-xl mx-auto">
            Chaque type existe en plusieurs saveurs — appuyez sur une carte pour voir ce qui est disponible aujourd'hui et ajoutez à votre commande instantanément.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cookies.map((cookie) => (
            <CookieCard key={cookie.id} cookie={cookie} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
          <a href="#order" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-medium">
            Voir votre panier et passer commande →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
