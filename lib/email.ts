import { Resend } from 'resend';
import { render } from '@react-email/render';
import OrderConfirmation, { OrderConfirmationProps } from '@/emails/OrderConfirmation';

// Lazily initialise Resend so we don't throw at build-time if key is missing
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key || key.includes('xxxx')) {
      throw new Error('RESEND_API_KEY is not configured.');
    }
    _resend = new Resend(key);
  }
  return _resend;
}

export interface SendOrderEmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

/**
 * Sends the order confirmation email to the customer via Resend.
 * Safe to call — errors are caught and returned rather than thrown,
 * so a mail failure never blocks the payment success response.
 */
export async function sendOrderConfirmationEmail(
  props: OrderConfirmationProps
): Promise<SendOrderEmailResult> {
  try {
    const resend = getResend();

    const fromAddress = process.env.RESEND_FROM_EMAIL ?? 'orders@resend.dev';
    const fromName = 'Maison Saint-Germain';

    const html = await render(OrderConfirmation(props));

    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to: [props.customer.email],
      subject: `Your Archival Acquisition is Confirmed — Order ${props.orderId}`,
      html,
      // Plain-text fallback
      text: [
        `Maison Saint-Germain — Archival Acquisition Confirmed`,
        ``,
        `Dear ${props.customer.fullName},`,
        ``,
        `Your order ${props.orderId} has been confirmed and payment verified.`,
        `Certificate: ${props.certificateNumber}`,
        `Reference:   ${props.reference}`,
        ``,
        `Items:`,
        ...props.items.map(
          (i) => `  • ${i.title} (Qty: ${i.quantity})`
        ),
        ``,
        `Delivery to: ${props.customer.address}, ${props.customer.city}, ${props.customer.country}`,
        ``,
        `Thank you for your acquisition. Your pieces are being prepared for dispatch.`,
        `— The Maison Saint-Germain Archival House`,
      ].join('\n'),
      // Reply-to so customers can respond directly
      replyTo: fromAddress,
    });

    if (error) {
      console.error('[email] Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log(`[email] ✅ Confirmation sent to ${props.customer.email} — id: ${data?.id}`);
    return { success: true, emailId: data?.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[email] Failed to send order confirmation:', msg);
    return { success: false, error: msg };
  }
}
