export type Flavor = {
  id: string;
  name: string;
  available: boolean;
  price: number;
};

export type CookieType = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  flavors: Flavor[];
};

export const cookieTypes: CookieType[] = [
  {
    id: "makroudh",
    name: "Makroudh",
    description: "Traditional Tunisian semolina pastry filled with date paste, drizzled with honey — a timeless classic.",
    emoji: "🍯",
    color: "#D4A853",
    gradientFrom: "#D4A853",
    gradientTo: "#8B5E2A",
    flavors: [
      { id: "dates", name: "Date & Honey", available: true, price: 1.5 },
      { id: "almond-dates", name: "Almond & Date Mix", available: true, price: 1.8 },
      { id: "pistachio-honey", name: "Pistachio & Honey", available: true, price: 2.0 },
      { id: "fig-honey", name: "Fig & Honey", available: false, price: 1.7 },
    ],
  },
  {
    id: "ghraiba",
    name: "Ghraïba",
    description: "Melt-in-your-mouth shortbread cookies made with semolina, butter, and sugar — delicate crispy bites.",
    emoji: "✨",
    color: "#F5CBA7",
    gradientFrom: "#F5CBA7",
    gradientTo: "#E59866",
    flavors: [
      { id: "plain", name: "Classic Plain", available: true, price: 1.2 },
      { id: "almond", name: "Almond", available: true, price: 1.5 },
      { id: "sesame", name: "Sesame", available: true, price: 1.3 },
      { id: "lemon-zest", name: "Lemon Zest", available: true, price: 1.4 },
    ],
  },
  {
    id: "baklawa",
    name: "Baklawa Cookies",
    description: "Crispy layered pastry bites packed with nuts and soaked in fragrant rose-water syrup.",
    emoji: "🌹",
    color: "#A8D5A2",
    gradientFrom: "#A8D5A2",
    gradientTo: "#5D8A57",
    flavors: [
      { id: "pistachio-rose", name: "Pistachio & Rose Water", available: true, price: 2.5 },
      { id: "walnut-cinnamon", name: "Walnut & Cinnamon", available: true, price: 2.2 },
      { id: "almond-orange", name: "Almond & Orange Blossom", available: true, price: 2.4 },
      { id: "hazelnut", name: "Hazelnut Crunch", available: false, price: 2.6 },
    ],
  },
  {
    id: "kaak",
    name: "Kaak Warka",
    description: "Ring-shaped cookies infused with anise, sesame, and floral water — crunchy bites of Tunisian heritage.",
    emoji: "💍",
    color: "#B39DDB",
    gradientFrom: "#B39DDB",
    gradientTo: "#7E57C2",
    flavors: [
      { id: "anise-sesame", name: "Anise & Sesame", available: true, price: 1.3 },
      { id: "orange-blossom", name: "Orange Blossom", available: true, price: 1.4 },
      { id: "vanilla", name: "Vanilla Butter", available: true, price: 1.4 },
      { id: "chocolate-dipped", name: "Chocolate Dipped", available: false, price: 1.8 },
    ],
  },
];

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered";

export const orderStatuses: {
  key: OrderStatus;
  label: string;
  icon: string;
  description: string;
}[] = [
  { key: "pending", label: "Order Received", icon: "📋", description: "We received your order!" },
  { key: "confirmed", label: "Confirmed", icon: "✅", description: "Your order is confirmed." },
  { key: "preparing", label: "Baking", icon: "👩‍🍳", description: "Freshly baking your cookies." },
  { key: "ready", label: "Ready", icon: "📦", description: "Packed and ready for pickup/delivery!" },
  { key: "delivered", label: "Delivered", icon: "🎉", description: "Enjoy your cookies!" },
];
