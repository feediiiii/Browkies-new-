// Web Notification Service for new orders

// Request permission for notifications
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

// Check if notifications are enabled
export function areNotificationsEnabled(): boolean {
  return "Notification" in window && Notification.permission === "granted";
}

// Show a notification for a new order
export function showNewOrderNotification(orderId: string, customerName: string, total: number): void {
  if (!areNotificationsEnabled()) {
    console.log("Notifications not enabled, skipping");
    return;
  }

  const notification = new Notification("🍪 New Order Received!", {
    body: `Order #${orderId} from ${customerName}\nTotal: ${total.toFixed(2)} TND`,
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: "new-order",
    requireInteraction: true,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  // Auto close after 10 seconds
  setTimeout(() => {
    notification.close();
  }, 10000);
}

// Show a notification for order status change
export function showOrderStatusNotification(
  orderId: string,
  status: string,
  customerName: string
): void {
  if (!areNotificationsEnabled()) {
    return;
  }

  const statusMessages: Record<string, string> = {
    confirmed: `Order #${orderId} has been confirmed`,
    preparing: `Order #${orderId} is being prepared`,
    ready: `Order #${orderId} is ready for pickup/delivery`,
    delivered: `Order #${orderId} has been delivered`,
  };

  const message = statusMessages[status] || `Order #${orderId} status updated`;

  new Notification(`🍪 ${message}`, {
    body: customerName,
    icon: "/favicon.svg",
    tag: "order-status",
  });
}
