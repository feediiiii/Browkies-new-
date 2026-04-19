import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type CartItem = {
  cookieId: string;
  cookieName: string;
  flavorId: string;
  flavorName: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (cookieId: string, flavorId: string) => void;
  updateQty: (cookieId: string, flavorId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.cookieId === item.cookieId && i.flavorId === item.flavorId
      );
      if (existing) {
        return prev.map((i) =>
          i.cookieId === item.cookieId && i.flavorId === item.flavorId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (cookieId: string, flavorId: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.cookieId === cookieId && i.flavorId === flavorId))
    );
  };

  const updateQty = (cookieId: string, flavorId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(cookieId, flavorId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.cookieId === cookieId && i.flavorId === flavorId
          ? { ...i, quantity: qty }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
