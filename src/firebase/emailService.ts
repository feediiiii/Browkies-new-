import emailjs from "@emailjs/browser";

// ============================================
// EMAILJS CONFIGURATION
// ============================================
// To enable email notifications:
// 1. Sign up at https://www.emailjs.com/
// 2. Create an email service (e.g., Gmail)
// 3. Create two email templates:
//    - Order Confirmation template
//    - Order Ready template
// 4. Replace the values below with your credentials
// ============================================

// Replace with your EmailJS public key
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

// Replace with your service ID
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";

// Replace with your order confirmation template ID
const EMAILJS_ORDER_CONFIRMED_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ORDER_CONFIRMED_TEMPLATE_ID || "";

// Replace with your order ready template ID
const EMAILJS_ORDER_READY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ORDER_READY_TEMPLATE_ID || "";

// Flag to check if email is configured
const IS_EMAIL_CONFIGURED = Boolean(EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_ORDER_CONFIRMED_TEMPLATE_ID && EMAILJS_ORDER_READY_TEMPLATE_ID);

// Initialize EmailJS only if configured
if (IS_EMAIL_CONFIGURED) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface EmailParams {
  orderId: string;
  customerName: string;
  email: string;
  total: string;
  items: string;
  deliveryType: string;
  address?: string;
}

export async function sendOrderConfirmedEmail(params: EmailParams): Promise<void> {
  if (!IS_EMAIL_CONFIGURED) {
    console.log("EmailJS not configured, skipping confirmation email. Configure in emailService.ts");
    return;
  }

  if (!params.email) {
    console.log("No email provided, skipping confirmation email");
    return;
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_ORDER_CONFIRMED_TEMPLATE_ID,
      {
        order_id: params.orderId,
        customer_name: params.customerName,
        to_email: params.email,
        total: params.total,
        items: params.items,
        delivery_type: params.deliveryType,
        address: params.address || "N/A",
      }
    );
    console.log("Order confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
}

export async function sendOrderReadyEmail(params: EmailParams): Promise<void> {
  if (!IS_EMAIL_CONFIGURED) {
    console.log("EmailJS not configured, skipping ready email. Configure in emailService.ts");
    return;
  }

  if (!params.email) {
    console.log("No email provided, skipping ready email");
    return;
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_ORDER_READY_TEMPLATE_ID,
      {
        order_id: params.orderId,
        customer_name: params.customerName,
        to_email: params.email,
        total: params.total,
        delivery_type: params.deliveryType,
        address: params.address || "N/A",
      }
    );
    console.log("Order ready email sent successfully");
  } catch (error) {
    console.error("Error sending order ready email:", error);
  }
}

// Helper function to format items for email
export function formatItemsForEmail(items: Array<{ cookieName: string; flavorName: string; quantity: number; price: number }>): string {
  return items
    .map((item) => `${item.cookieName} (${item.flavorName}) x${item.quantity} - ${(item.price * item.quantity).toFixed(2)} TND`)
    .join("\n");
}
