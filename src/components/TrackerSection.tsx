import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getAllOrders } from "../firebase/services";
import type { OrderDocument } from "../firebase/services";
import { orderStatuses } from "../data/cookies";
import { Search } from "lucide-react";

type Props = {
  latestOrder?: { orderId: string; customerName: string } | null;
};

export default function TrackerSection({ latestOrder }: Props) {
  const [searchId, setSearchId] = useState(latestOrder?.orderId || "");
  const [activeOrder, setActiveOrder] = useState<OrderDocument | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load latest order from Firebase on mount
  useEffect(() => {
    async function loadLatestOrder() {
      if (latestOrder?.orderId) {
        setLoading(true);
        try {
          const orders = await getAllOrders();
          const found = orders.find(o => o.orderId === latestOrder.orderId);
          if (found) {
            setActiveOrder(found);
          }
        } catch (error) {
          console.error("Error loading order:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadLatestOrder();
  }, [latestOrder]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = searchId.trim().toUpperCase();
    setNotFound(false);
    setLoading(true);

    try {
      // Try to find order in Firebase by custom orderId field
      const orders = await getAllOrders();
      const foundOrder = orders.find(o => o.orderId.toUpperCase() === id);
      
      if (foundOrder) {
        setActiveOrder(foundOrder);
      } else {
        setActiveOrder(null);
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error searching order:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const currentStatusIdx = activeOrder
    ? orderStatuses.findIndex((s) => s.key === activeOrder.status)
    : -1;

  return (
    <section id="tracker" className="py-24 px-6 md:px-12 bg-[#0e0804] relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-amber-400 text-sm tracking-widest uppercase font-medium mb-3 block">Live Status</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Track Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Order</span>
          </h2>
          <p className="text-amber-100/50 text-base">Enter your order ID to see real-time status updates.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSearch}
          className="flex gap-3 mb-10"
        >
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Order ID (e.g. TN3F8K2)"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Search size={18} />
            Track
          </motion.button>
        </motion.form>

        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {notFound && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 border border-white/10 rounded-2xl"
          >
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-white/60">Order not found. Please check your ID.</p>
          </motion.div>
        )}

        {activeOrder && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-amber-400 text-xs tracking-widest uppercase">Order ID</span>
                <h3 className="text-2xl font-bold text-white mt-1">#{activeOrder.orderId}</h3>
                <p className="text-white/50 text-sm">{activeOrder.customerName}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-full text-sm font-medium">
                  {orderStatuses[currentStatusIdx]?.icon} {orderStatuses[currentStatusIdx]?.label}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/10 hidden sm:block" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-amber-500 to-orange-400 hidden sm:block transition-all duration-700"
                style={{
                  width: currentStatusIdx === 0 ? "0%" : `${(currentStatusIdx / (orderStatuses.length - 1)) * 100}%`,
                  maxWidth: "calc(100% - 40px)",
                }}
              />

              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 relative">
                {orderStatuses.map((status, idx) => {
                  const isCompleted = idx <= currentStatusIdx;
                  const isCurrent = idx === currentStatusIdx;
                  return (
                    <div key={status.key} className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 sm:flex-1">
                      <motion.div
                        animate={
                          isCurrent
                            ? { scale: [1, 1.15, 1], boxShadow: ["0 0 0px #F59E0B", "0 0 20px #F59E0B", "0 0 0px #F59E0B"] }
                            : {}
                        }
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all z-10 relative ${
                          isCompleted
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/40"
                            : "bg-white/10 text-white/30"
                        }`}
                      >
                        {status.icon}
                      </motion.div>
                      <div className="sm:text-center">
                        <p className={`text-sm font-semibold ${isCompleted ? "text-white" : "text-white/30"}`}>
                          {status.label}
                        </p>
                        {isCurrent && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-amber-400 mt-0.5">
                            {status.description}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {activeOrder.items && activeOrder.items.length > 0 && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-white/50 text-sm mb-3">Order Items:</p>
                <ul className="space-y-1.5">
                  {activeOrder.items.map((item, i) => (
                    <li key={i} className="text-white/70 text-sm flex items-center gap-2">
                      <span className="text-amber-500">•</span>
                      {item.cookieName} × {item.quantity} ({item.flavorName})
                    </li>
                  ))}
                </ul>
                <div className="mt-2 text-right">
                  <span className="text-amber-300 font-bold">Total: {activeOrder.total.toFixed(2)} TND</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
