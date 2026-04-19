import { useState, useEffect } from "react";
import { getOrderById, subscribeToOrders } from "../firebase/services";
import type { OrderDocument } from "../firebase/services";
import { CheckCircle, Clock, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RotatingCookie from "./RotatingCookie";

const STORAGE_KEY = "trackedOrder";

interface TrackedOrder {
  orderId: string;
  customerName: string;
}

function OrderStatusBar() {
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);
  const [orderData, setOrderData] = useState<OrderDocument | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load tracked order from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: TrackedOrder = JSON.parse(stored);
        setTrackedOrder(parsed);
      } catch (error) {
        console.error("Error parsing tracked order:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (trackedOrder) {
      loadOrderData();
      // Subscribe to real-time order updates
      const unsubscribe = subscribeToOrders((orders) => {
        const updatedOrder = orders.find(o => o.orderId === trackedOrder.orderId);
        if (updatedOrder) {
          setOrderData(updatedOrder);
        }
      });
      return unsubscribe;
    }
  }, [trackedOrder]);

  const loadOrderData = async () => {
    if (!trackedOrder) return;

    setLoading(true);
    try {
      const order = await getOrderById(trackedOrder.orderId);
      setOrderData(order);
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearTrackedOrder = () => {
    setTrackedOrder(null);
    setOrderData(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
      case "preparing":
        return <ChefHat className="w-5 h-5 text-orange-400" />;
      case "ready":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Received";
      case "confirmed":
        return "Order Confirmed";
      case "preparing":
        return "Being Prepared";
      case "ready":
        return "Ready for Pickup/Delivery";
      default:
        return "Unknown Status";
    }
  };

  if (!trackedOrder || !orderData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-600 to-orange-600 border-t border-amber-500/30 shadow-2xl"
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {loading ? (
                <RotatingCookie size={20} />
              ) : (
                getStatusIcon(orderData.status)
              )}
              <div>
                <p className="text-white font-semibold">
                  Order #{orderData.orderId}
                </p>
                <p className="text-amber-100 text-sm">
                  {getStatusText(orderData.status)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white text-sm font-medium">
                  {orderData.customerName}
                </p>
                <p className="text-amber-100 text-xs">
                  {orderData.total.toFixed(2)} TND
                </p>
              </div>
              <button
                onClick={clearTrackedOrder}
                className="text-amber-200 hover:text-white text-sm underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Function to save order tracking (call this after successful order placement)
export function saveOrderTracking(orderId: string, customerName: string) {
  const trackedOrder: TrackedOrder = { orderId, customerName };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trackedOrder));
}

export default OrderStatusBar;