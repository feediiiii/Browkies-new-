import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, deleteOrder, subscribeToOrders } from "../../firebase/services";
import type { OrderDocument } from "../../firebase/services";
import { orderStatuses, type OrderStatus } from "../../data/cookies";
import { Search, ChevronDown, Trash2, Bell, BellOff } from "lucide-react";
import { 
  requestNotificationPermission, 
  areNotificationsEnabled, 
  showNewOrderNotification,
  showOrderStatusNotification 
} from "../../firebase/notificationService";
import { sendOrderConfirmedEmail, sendOrderReadyEmail, formatItemsForEmail } from "../../firebase/emailService";

export default function Orders() {
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadOrders();
    checkNotificationPermission();
    
    // Set up real-time order listener
    const unsubscribe = subscribeToOrders(
      (updatedOrders) => {
        setOrders(updatedOrders);
        setLoading(false);
      },
      (newOrder) => {
        // Show notification for new order
        if (notificationsEnabled) {
          showNewOrderNotification(newOrder.orderId, newOrder.customerName, newOrder.total);
        }
      }
    );
    
    return () => unsubscribe();
  }, [notificationsEnabled]);

  async function checkNotificationPermission() {
    const enabled = areNotificationsEnabled();
    setNotificationsEnabled(enabled);
  }

  async function handleEnableNotifications() {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
  }

  async function loadOrders() {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ));

      // Send email notification based on status
      if (order.email) {
        const emailParams = {
          orderId: order.orderId,
          customerName: order.customerName,
          email: order.email,
          total: order.total.toFixed(2),
          items: formatItemsForEmail(order.items),
          deliveryType: order.deliveryType,
          address: order.address,
        };

        if (newStatus === "confirmed") {
          await sendOrderConfirmedEmail(emailParams);
        } else if (newStatus === "ready") {
          await sendOrderReadyEmail(emailParams);
        }
      }

      // Show status notification
      showOrderStatusNotification(order.orderId, newStatus, order.customerName);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  }

  async function handleDelete(orderId: string) {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.includes(search);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "confirmed": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "preparing": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "ready": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "delivered": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Orders Management</h1>
        
        {/* Notification Toggle */}
        <button
          onClick={notificationsEnabled ? undefined : handleEnableNotifications}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            notificationsEnabled
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
          }`}
        >
          {notificationsEnabled ? (
            <>
              <Bell size={18} />
              Notifications On
            </>
          ) : (
            <>
              <BellOff size={18} />
              Enable Notifications
            </>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, name, or phone..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/50"
        >
          <option value="all">All Status</option>
          {orderStatuses.map((status) => (
            <option key={status.key} value={status.key}>{status.label}</option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-amber-100/40">
            No orders found
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              <div 
                className="p-4 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-white">#{order.orderId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                      {orderStatuses.find(s => s.key === order.status)?.label}
                    </span>
                  </div>
                  <p className="text-amber-100/60 text-sm">{order.customerName}</p>
                  <p className="text-amber-100/40 text-xs">{order.phone}</p>
                  {order.email && <p className="text-amber-100/40 text-xs">{order.email}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-amber-300">{order.total.toFixed(2)} TND</p>
                  <p className="text-amber-100/40 text-xs">
                    {order.createdAt?.toLocaleDateString?.() || new Date().toLocaleDateString()}
                  </p>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-white/40 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`} 
                />
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="px-4 pb-4 border-t border-white/10">
                  <div className="py-4 space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="text-amber-100/60 text-sm mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-white">
                              {item.cookieName} × {item.quantity}
                            </span>
                            <span className="text-amber-100/60">{item.flavorName}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-amber-100/60 text-sm mb-1">Delivery Type</h4>
                        <p className="text-white capitalize">{order.deliveryType}</p>
                      </div>
                      {order.address && (
                        <div>
                          <h4 className="text-amber-100/60 text-sm mb-1">Address</h4>
                          <p className="text-white">{order.address}</p>
                        </div>
                      )}
                      {order.notes && (
                        <div className="md:col-span-2">
                          <h4 className="text-amber-100/60 text-sm mb-1">Notes</h4>
                          <p className="text-white">{order.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Status Update */}
                    <div>
                      <h4 className="text-amber-100/60 text-sm mb-2">Update Status</h4>
                      <div className="flex flex-wrap gap-2">
                        {orderStatuses.map((status) => (
                          <button
                            key={status.key}
                            onClick={() => handleStatusChange(order.id, status.key)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                              order.status === status.key
                                ? "bg-amber-500 text-black font-medium"
                                : "bg-white/10 text-white/60 hover:bg-white/20"
                            }`}
                          >
                            {status.icon} {status.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
                    >
                      <Trash2 size={16} />
                      Delete Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
