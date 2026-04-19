import { useEffect, useState } from "react";
import { getAllCookies, updateCookie, deleteCookie, createCookie } from "../../firebase/services";
import type { CookieDocument } from "../../firebase/services";
import type { Flavor } from "../../data/cookies";
import { Plus, Trash2, X, Check, ChevronDown } from "lucide-react";

export default function Menu() {
  const [cookies, setCookies] = useState<CookieDocument[]>([]);
  const [loading, setLoading] = useState(true);
  // const [editingCookie, setEditingCookie] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [expandedCookie, setExpandedCookie] = useState<string | null>(null);

  // New cookie form
  const [newCookie, setNewCookie] = useState({
    name: "",
    description: "",
    emoji: "🍪",
    color: "#D4A853",
    gradientFrom: "#D4A853",
    gradientTo: "#8B5E2A",
    flavors: [] as Flavor[]
  });

  useEffect(() => {
    loadCookies();
  }, []);

  async function loadCookies() {
    try {
      const data = await getAllCookies();
      setCookies(data);
    } catch (error) {
      console.error("Error loading cookies:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleAvailability(cookieId: string, flavorId: string) {
    const cookie = cookies.find(c => c.id === cookieId);
    if (!cookie) return;

    const updatedFlavors = cookie.flavors.map(f =>
      f.id === flavorId ? { ...f, available: !f.available } : f
    );

    try {
      await updateCookie(cookieId, { flavors: updatedFlavors });
      setCookies(cookies.map(c => 
        c.id === cookieId ? { ...c, flavors: updatedFlavors } : c
      ));
    } catch (error) {
      console.error("Error updating flavor:", error);
    }
  }

  async function handleDeleteCookie(cookieId: string) {
    if (!confirm("Are you sure you want to delete this cookie type?")) return;
    try {
      await deleteCookie(cookieId);
      setCookies(cookies.filter(c => c.id !== cookieId));
    } catch (error) {
      console.error("Error deleting cookie:", error);
    }
  }

  async function handleAddFlavor(cookieId: string) {
    const cookie = cookies.find(c => c.id === cookieId);
    if (!cookie) return;

    const newFlavor: Flavor = {
      id: `flavor-${Date.now()}`,
      name: "New Flavor",
      available: true,
      price: 1.0
    };

    const updatedFlavors = [...cookie.flavors, newFlavor];
    try {
      await updateCookie(cookieId, { flavors: updatedFlavors });
      setCookies(cookies.map(c => 
        c.id === cookieId ? { ...c, flavors: updatedFlavors } : c
      ));
    } catch (error) {
      console.error("Error adding flavor:", error);
    }
  }

  async function handleUpdateFlavor(cookieId: string, flavorId: string, updates: Partial<Flavor>) {
    const cookie = cookies.find(c => c.id === cookieId);
    if (!cookie) return;

    const updatedFlavors = cookie.flavors.map(f =>
      f.id === flavorId ? { ...f, ...updates } : f
    );

    try {
      await updateCookie(cookieId, { flavors: updatedFlavors });
      setCookies(cookies.map(c => 
        c.id === cookieId ? { ...c, flavors: updatedFlavors } : c
      ));
    } catch (error) {
      console.error("Error updating flavor:", error);
    }
  }

  async function handleDeleteFlavor(cookieId: string, flavorId: string) {
    const cookie = cookies.find(c => c.id === cookieId);
    if (!cookie) return;

    const updatedFlavors = cookie.flavors.filter(f => f.id !== flavorId);

    try {
      await updateCookie(cookieId, { flavors: updatedFlavors });
      setCookies(cookies.map(c => 
        c.id === cookieId ? { ...c, flavors: updatedFlavors } : c
      ));
    } catch (error) {
      console.error("Error deleting flavor:", error);
    }
  }

  async function handleCreateCookie() {
    if (!newCookie.name.trim()) return;

    try {
      await createCookie(newCookie);
      await loadCookies();
      setIsAddingNew(false);
      setNewCookie({
        name: "",
        description: "",
        emoji: "🍪",
        color: "#D4A853",
        gradientFrom: "#D4A853",
        gradientTo: "#8B5E2A",
        flavors: []
      });
    } catch (error) {
      console.error("Error creating cookie:", error);
    }
  }

  // async function handleUpdateCookieInfo(cookieId: string, updates: Partial<CookieDocument>) {
  //   try {
  //     await updateCookie(cookieId, updates);
  //     setCookies(cookies.map(c =>
  //       c.id === cookieId ? { ...c, ...updates } : c
  //     ));
  //     setEditingCookie(null);
  //   } catch (error) {
  //     console.error("Error updating cookie:", error);
  //   }
  // }

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
        <h1 className="text-2xl font-bold text-white">Menu Management</h1>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-medium px-4 py-2 rounded-xl"
        >
          <Plus size={20} />
          Add Cookie Type
        </button>
      </div>

      {/* Add New Cookie Form */}
      {isAddingNew && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Add New Cookie Type</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-amber-100/60 text-sm mb-1">Name</label>
              <input
                type="text"
                value={newCookie.name}
                onChange={(e) => setNewCookie({ ...newCookie, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                placeholder="Cookie name"
              />
            </div>
            <div>
              <label className="block text-amber-100/60 text-sm mb-1">Emoji</label>
              <input
                type="text"
                value={newCookie.emoji}
                onChange={(e) => setNewCookie({ ...newCookie, emoji: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                placeholder="🍪"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-amber-100/60 text-sm mb-1">Description</label>
              <textarea
                value={newCookie.description}
                onChange={(e) => setNewCookie({ ...newCookie, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-amber-100/60 text-sm mb-1">Color</label>
              <input
                type="color"
                value={newCookie.color}
                onChange={(e) => setNewCookie({ ...newCookie, color: e.target.value, gradientFrom: e.target.value })}
                className="w-full h-10 bg-white/5 border border-white/10 rounded-xl"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateCookie}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-medium px-4 py-2 rounded-xl"
            >
              <Check size={18} />
              Save
            </button>
            <button
              onClick={() => setIsAddingNew(false)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cookie List */}
      <div className="space-y-4">
        {cookies.map((cookie) => (
          <div key={cookie.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div 
              className="p-4 flex items-center gap-4 cursor-pointer"
              onClick={() => setExpandedCookie(expandedCookie === cookie.id ? null : cookie.id)}
            >
              <span className="text-3xl">{cookie.emoji}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{cookie.name}</h3>
                <p className="text-amber-100/60 text-sm">{cookie.flavors.length} flavors</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  cookie.flavors.some(f => f.available) 
                    ? "bg-green-500/20 text-green-300" 
                    : "bg-red-500/20 text-red-300"
                }`}>
                  {cookie.flavors.filter(f => f.available).length} available
                </span>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-white/40 transition-transform ${expandedCookie === cookie.id ? "rotate-180" : ""}`}
              />
            </div>

            {/* Expanded Flavors */}
            {expandedCookie === cookie.id && (
              <div className="px-4 pb-4 border-t border-white/10">
                <div className="py-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-amber-100/60 text-sm">Flavors</h4>
                    <button
                      onClick={() => handleAddFlavor(cookie.id)}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm"
                    >
                      <Plus size={16} />
                      Add Flavor
                    </button>
                  </div>

                  <div className="space-y-2">
                    {cookie.flavors.map((flavor) => (
                      <div 
                        key={flavor.id}
                        className="flex items-center gap-3 bg-white/5 rounded-xl p-3"
                      >
                        <button
                          onClick={() => handleToggleAvailability(cookie.id, flavor.id)}
                          className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                            flavor.available 
                              ? "bg-green-500 text-white" 
                              : "bg-white/10 text-white/30"
                          }`}
                        >
                          {flavor.available && <Check size={14} />}
                        </button>
                        
                        <input
                          type="text"
                          value={flavor.name}
                          onChange={(e) => handleUpdateFlavor(cookie.id, flavor.id, { name: e.target.value })}
                          className="flex-1 bg-transparent text-white border-b border-white/10 focus:border-amber-400 outline-none"
                        />
                        
                        <input
                          type="number"
                          step="0.1"
                          value={flavor.price}
                          onChange={(e) => handleUpdateFlavor(cookie.id, flavor.id, { price: parseFloat(e.target.value) || 0 })}
                          className="w-20 bg-transparent text-right text-amber-300 border-b border-white/10 focus:border-amber-400 outline-none"
                        />
                        <span className="text-amber-100/40 text-sm">TND</span>
                        
                        <button
                          onClick={() => handleDeleteFlavor(cookie.id, flavor.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Delete Cookie Type */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleDeleteCookie(cookie.id)}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
                    >
                      <Trash2 size={16} />
                      Delete Cookie Type
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
