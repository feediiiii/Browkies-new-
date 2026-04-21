import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../firebase/services";
import { saveOrderTracking } from "./OrderStatusBar";
import { Minus, Plus, Trash2, ShoppingBag, CheckCircle2 } from "lucide-react";
import RotatingCookie from "./RotatingCookie";

type OrderData = {
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  deliveryType: "delivery" | "pickup";
  notes: string;
};

type Props = {
  onOrderPlaced: (order: OrderData) => void;
};

export default function OrderSection({ onOrderPlaced }: Props) {
  const { items, removeItem, updateQty, clearCart, total, count } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    deliveryType: "delivery" as "delivery" | "pickup",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    
    const id = "TN" + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    try {
      // Save order to Firebase
      await createOrder({
        orderId: id,
        customerName: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        deliveryType: form.deliveryType,
        notes: form.notes,
        items: items.map(item => ({
          cookieId: item.cookieId,
          cookieName: item.cookieName,
          flavorId: item.flavorId,
          flavorName: item.flavorName,
          price: item.price,
          quantity: item.quantity
        })),
        total: total,
        status: "pending"
      });
      
      setOrderId(id);
      setSubmitted(true);

      // Save order tracking for status bar
      saveOrderTracking(id, form.name);

      onOrderPlaced({
        orderId: id,
        customerName: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        deliveryType: form.deliveryType,
        notes: form.notes,
      });
      clearCart();
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="order" className="py-24 px-6 md:px-12 bg-[#0a0602] relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/3 w-[600px] h-[300px] bg-amber-600/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-amber-400 text-sm tracking-widest uppercase font-medium mb-3 block">Paiement Facile</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Passez Votre{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Commande</span>
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-7xl mb-6">
                🎉
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-3">Commande Confirmée !</h3>
              <p className="text-amber-100/60 mb-6 text-lg">
                Votre commande <span className="text-amber-400 font-bold">#{orderId}</span> a été reçue. Nous préparons vos cookies frais !
              </p>
              <a href="#tracker" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-full text-lg transition-colors">
                Suivre Votre Commande →
              </a>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cart */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag size={20} className="text-amber-400" />
                  Votre Panier ({count} articles)
                </h3>

                {items.length === 0 ? (
                  <div className="border border-white/10 rounded-2xl p-10 text-center text-amber-100/40">
                    <p className="text-4xl mb-3">🛒</p>
                    <p>Votre panier est vide.</p>
                    <a href="#menu" className="text-amber-400 hover:text-amber-300 text-sm mt-2 inline-block">Parcourez notre menu →</a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={`${item.cookieId}-${item.flavorId}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">{item.cookieName}</p>
                            <p className="text-amber-100/50 text-xs">{item.flavorName}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateQty(item.cookieId, item.flavorId, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-white font-bold text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.cookieId, item.flavorId, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-amber-500/30 hover:bg-amber-500/50 flex items-center justify-center text-amber-300 transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <span className="text-amber-400 font-bold text-sm w-16 text-right">
                            {(item.price * item.quantity).toFixed(2)} T
                          </span>
                          <button onClick={() => removeItem(item.cookieId, item.flavorId)} className="text-red-400/60 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                      <span className="text-amber-100/60 font-medium">Total</span>
                      <span className="text-2xl font-bold text-amber-400">{total.toFixed(2)} TND</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-white">Vos Coordonnées</h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-amber-100/60 text-sm mb-1.5 block">Nom Complet *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Votre nom"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-amber-100/60 text-sm mb-1.5 block">Numéro de Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+216 XX XXX XXX"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-amber-100/60 text-sm mb-1.5 block">Adresse Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="votre@email.com (optionnel)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-amber-100/60 text-sm mb-2 block">Option de Livraison</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["delivery", "pickup"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, deliveryType: type }))}
                          className={`py-3 rounded-xl font-medium text-sm capitalize transition-all border ${
                            form.deliveryType === type
                              ? "bg-amber-500 border-amber-500 text-black"
                              : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                          }`}
                        >
                          {type === "delivery" ? "🏠 Livraison" : "🛍️ Retrait"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.deliveryType === "delivery" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <label className="text-amber-100/60 text-sm mb-1.5 block">Adresse *</label>
                      <textarea
                        required={form.deliveryType === "delivery"}
                        value={form.address}
                        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                        placeholder="Votre adresse de livraison..."
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-all resize-none"
                      />
                    </motion.div>
                  )}

                  <div>
                    <label className="text-amber-100/60 text-sm mb-1.5 block">Notes (optionnel)</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                      placeholder="Des demandes spéciales ?"
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-all resize-none"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={items.length === 0 || loading}
                  whileHover={{ scale: items.length > 0 ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    items.length > 0
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/30 hover:shadow-amber-400/50"
                      : "bg-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <RotatingCookie size={24} />
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      Passer la Commande — {total.toFixed(2)} TND
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
