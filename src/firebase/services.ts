import { db } from "./config";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp,
  onSnapshot 
} from "firebase/firestore";
import type { CookieType, Flavor, OrderStatus } from "../data/cookies";

// Collections
const COOKIES_COLLECTION = "cookies";
const ORDERS_COLLECTION = "orders";

// ============ COOKIES ============

export interface CookieDocument extends Omit<CookieType, "flavors"> {
  flavors: Flavor[];
}

export async function getAllCookies(): Promise<CookieDocument[]> {
  const q = query(collection(db, COOKIES_COLLECTION), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CookieDocument));
}

export async function getCookieById(id: string): Promise<CookieDocument | null> {
  const docRef = doc(db, COOKIES_COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as CookieDocument;
}

export async function createCookie(cookie: Omit<CookieDocument, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, COOKIES_COLLECTION), cookie);
  return docRef.id;
}

export async function updateCookie(id: string, cookie: Partial<CookieDocument>): Promise<void> {
  const docRef = doc(db, COOKIES_COLLECTION, id);
  await updateDoc(docRef, cookie);
}

export async function deleteCookie(id: string): Promise<void> {
  const docRef = doc(db, COOKIES_COLLECTION, id);
  await deleteDoc(docRef);
}

// ============ ORDERS ============

export interface OrderDocument {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  deliveryType: "delivery" | "pickup";
  notes: string;
  items: Array<{
    cookieId: string;
    cookieName: string;
    flavorId: string;
    flavorName: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export async function getAllOrders(): Promise<OrderDocument[]> {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date()
    } as OrderDocument;
  });
}

export async function getOrderById(id: string): Promise<OrderDocument | null> {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date()
  } as OrderDocument;
}

export async function createOrder(order: Omit<OrderDocument, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...order,
    createdAt: Timestamp.fromDate(new Date())
  });
  return docRef.id;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  await updateDoc(docRef, { status });
}

export async function deleteOrder(id: string): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  await deleteDoc(docRef);
}

// Real-time order listener for admin dashboard
export function subscribeToOrders(
  callback: (orders: OrderDocument[]) => void,
  onNewOrder?: (order: OrderDocument) => void
): () => void {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
  
  let previousOrderCount = 0;
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date()
      } as OrderDocument;
    });
    
    // Check if there's a new order
    if (onNewOrder && orders.length > previousOrderCount && previousOrderCount > 0) {
      const newOrder = orders[0]; // Most recent order
      onNewOrder(newOrder);
    }
    
    previousOrderCount = orders.length;
    callback(orders);
  });
  
  return unsubscribe;
}

// ============ SEED DATA ============

export async function seedInitialData(): Promise<void> {
  // Delete all existing cookies
  const cookies = await getAllCookies();
  for (const cookie of cookies) {
    await deleteCookie(cookie.id);
  }

  const initialCookies = [
    {
      name: "Prestige Luxe Collection",
      description: "Our premium collection of luxurious chocolate cookies, crafted with the finest ingredients for an indulgent experience.",
      emoji: "👑",
      color: "#FFD700",
      gradientFrom: "#FFD700",
      gradientTo: "#B8860B",
      flavors: [
        { id: "pistachio-lover", name: "Pistachio Lover", available: true, price: 10 },
        { id: "raffa-magic", name: "Raffa Magic", available: true, price: 10 },
        { id: "ferrero-bomb", name: "Ferrero Bomb", available: true, price: 10 },
      ],
    },
    {
      name: "Choco Brand Collection",
      description: "Delicious cookies inspired by popular chocolate brands, combining crunch and flavor in every bite.",
      emoji: "🍫",
      color: "#8B4513",
      gradientFrom: "#8B4513",
      gradientTo: "#654321",
      flavors: [
        { id: "choco-rush", name: "Choco Rush (3 chocolats)", available: true, price: 9.5 },
        { id: "smores-heaven", name: "S'mores Heaven", available: true, price: 9.5 },
        { id: "peanut-pop", name: "Peanut Pop (M&M's Peanut)", available: true, price: 9.5 },
        { id: "snickers-craze", name: "Snickers Craze", available: true, price: 9.5 },
        { id: "crispy-choco", name: "Crispy Choco (M&M's Crispy)", available: true, price: 9.5 },
      ],
    },
  ] as const;

  for (const cookie of initialCookies) {
    await createCookie(JSON.parse(JSON.stringify(cookie)));
  }
}
