import { useEffect, useState } from "react";
import { getAllOrders, getAllCookies, seedInitialData } from "../../firebase/services";
import type { OrderDocument } from "../../firebase/services";
import type { CookieDocument } from "../../firebase/services";
import { ShoppingCart, Cookie, TrendingUp, Clock, Calendar, ChevronDown } from "lucide-react";
import RotatingCookie from "../../components/RotatingCookie";

export default function Overview() {
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [cookies, setCookies] = useState<CookieDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD format
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Date range helper functions
  const getToday = () => new Date().toISOString().split('T')[0];
  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };
  const getThisWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    return startOfWeek.toISOString().split('T')[0];
  };
  const getThisMonth = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
  };

  useEffect(() => {
    async function loadData() {
      try {
        // Seed initial data if needed
        await seedInitialData();

        const [ordersData, cookiesData] = await Promise.all([
          getAllOrders(),
          getAllCookies()
        ]);
        setOrders(ordersData);
        setCookies(cookiesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDatePicker && !(event.target as Element).closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

  // Filter orders by selected date/range
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt.toISOString().split('T')[0]);
    const selected = new Date(selectedDate);

    // For "This Week" and "This Month", we need range filtering
    if (selectedDate === getThisWeek()) {
      const startOfWeek = new Date(selected);
      const endOfWeek = new Date(selected);
      endOfWeek.setDate(selected.getDate() + 6);
      return orderDate >= startOfWeek && orderDate <= endOfWeek;
    }

    if (selectedDate === getThisMonth()) {
      const startOfMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
      const endOfMonth = new Date(selected.getFullYear(), selected.getMonth() + 1, 0);
      return orderDate >= startOfMonth && orderDate <= endOfMonth;
    }

    // Default: exact date match
    return orderDate.toISOString().split('T')[0] === selectedDate;
  });

  const pendingOrders = filteredOrders.filter(o => o.status === "pending").length;
  const preparingOrders = filteredOrders.filter(o => o.status === "preparing").length;
  const readyOrders = filteredOrders.filter(o => o.status === "ready").length;
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Total Orders", value: filteredOrders.length, icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Pending", value: pendingOrders, icon: Clock, color: "bg-yellow-500" },
    { label: "Preparing", value: preparingOrders, icon: TrendingUp, color: "bg-orange-500" },
    { label: "Ready", value: readyOrders, icon: ShoppingCart, color: "bg-green-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RotatingCookie size={64} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <div className="relative date-picker-container">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm hover:border-amber-400 transition-colors"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>
              {selectedDate === getToday() ? "Today" :
               selectedDate === getYesterday() ? "Yesterday" :
               selectedDate === getThisWeek() ? "This Week" :
               selectedDate === getThisMonth() ? "This Month" :
               new Date(selectedDate).toLocaleDateString()}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDatePicker && (
            <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-10 min-w-[200px]">
              <div className="p-2">
                {/* Quick Select Buttons */}
                <div className="grid grid-cols-2 gap-1 mb-3">
                  <button
                    onClick={() => {
                      setSelectedDate(getToday());
                      setShowDatePicker(false);
                    }}
                    className="px-3 py-2 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDate(getYesterday());
                      setShowDatePicker(false);
                    }}
                    className="px-3 py-2 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded transition-colors"
                  >
                    Yesterday
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDate(getThisWeek());
                      setShowDatePicker(false);
                    }}
                    className="px-3 py-2 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded transition-colors"
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDate(getThisMonth());
                      setShowDatePicker(false);
                    }}
                    className="px-3 py-2 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded transition-colors"
                  >
                    This Month
                  </button>
                </div>

                {/* Custom Date Input */}
                <div className="border-t border-gray-600 pt-3">
                  <label className="block text-xs text-gray-400 mb-2">Custom Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setShowDatePicker(false);
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date Info */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
        <p className="text-amber-100/60 text-sm">
          Showing stats for {
            selectedDate === getToday() ? "Today" :
            selectedDate === getYesterday() ? "Yesterday" :
            selectedDate === getThisWeek() ? `This Week (${new Date(getThisWeek()).toLocaleDateString()} - ${new Date(new Date(getThisWeek()).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()})` :
            selectedDate === getThisMonth() ? `This Month (${new Date(getThisMonth()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})` :
            new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          } • {filteredOrders.length} orders
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-amber-100/60 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 mb-8">
        <p className="text-amber-100/60 text-sm mb-1">Total Revenue</p>
        <p className="text-4xl font-bold text-amber-300">{totalRevenue.toFixed(2)} TND</p>
      </div>

      {/* Quick Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Menu Items</h2>
          </div>
          <p className="text-amber-100/60">
            {cookies.length} cookie types with {cookies.reduce((sum, c) => sum + c.flavors.length, 0)} total flavors
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold text-white">Order Stats</h2>
          </div>
          <p className="text-amber-100/60">
            Average order: {orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : "0"} TND
          </p>
        </div>
      </div>
    </div>
  );
}
