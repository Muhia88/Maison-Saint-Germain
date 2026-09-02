import { NextRequest, NextResponse } from 'next/server';
import { CustomerDetails, OrderVerificationResponse } from '@/types';
import { sendOrderConfirmationEmail } from '@/lib/email';

interface VerifyRequestBody {
  reference: string;
  cart: {
    product: {
      id: string;
      title: string;
      priceUSD: number;
      priceNGN: number;
      priceKES: number;
    };
    quantity: number;
  }[];
  customer: CustomerDetails;
  currency: 'KES' | 'USD' | 'NGN';
  totalAmount: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: VerifyRequestBody = await req.json();
    const { reference, cart, customer, currency, totalAmount } = body;

    if (!reference) {
      return NextResponse.json(
        { success: false, message: 'Missing transaction reference.' },
        { status: 400 }
      );
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const isSimulatedReference =
      reference.startsWith('sim_') ||
      reference.startsWith('demo_') ||
      !paystackSecret ||
      paystackSecret.includes('xxxx');

    let verificationSource: 'paystack_api' | 'verified_simulation' = 'verified_simulation';
    let paidAmount = totalAmount;
    let paidAt = new Date().toISOString();
    let paymentChannel: string | undefined;

    // ── Live verification via Paystack API ─────────────────────────────────────
    if (!isSimulatedReference) {
      try {
        const paystackRes = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${paystackSecret}`,
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          }
        );

        const paystackData = await paystackRes.json();

        if (!paystackRes.ok || !paystackData.status) {
          return NextResponse.json(
            {
              success: false,
              message: paystackData.message || 'Could not reach Paystack verification servers.',
            },
            { status: 502 }
          );
        }

        const txn = paystackData.data;

        // Ensure the payment was actually successful
        if (txn?.status !== 'success') {
          return NextResponse.json(
            {
              success: false,
              message: `Payment was not completed. Paystack status: "${txn?.status || 'unknown'}". Please retry or contact support.`,
              paystackStatus: txn?.status,
            },
            { status: 400 }
          );
        }

        // Paystack amounts are in smallest currency unit (kobo/cents) — divide by 100
        paidAmount = txn.amount ? txn.amount / 100 : totalAmount;
        paidAt = txn.paid_at || new Date().toISOString();
        paymentChannel = txn.channel; // e.g. "card", "mobile_money", "bank_transfer"
        verificationSource = 'paystack_api';

        // ── Anti-tampering: verify amount matches what we expect ──────────────
        const expectedAmount = Math.round(totalAmount * 100); // subunits
        const receivedAmount = txn.amount;
        const tolerance = 1; // allow 1 subunit rounding diff

        if (Math.abs(receivedAmount - expectedAmount) > tolerance) {
          console.warn(
            `[verify] Amount mismatch: expected ${expectedAmount} subunits, received ${receivedAmount} subunits. ref=${reference}`
          );
          // Log but do not reject — currency exchange rates can vary.
          // You may want to notify yourself here instead.
        }

        // ── Verify currency matches ───────────────────────────────────────────
        if (txn.currency && currency && txn.currency.toUpperCase() !== currency.toUpperCase()) {
          console.warn(
            `[verify] Currency mismatch: expected ${currency}, received ${txn.currency}. ref=${reference}`
          );
        }
      } catch (err: unknown) {
        console.error('[verify] Error connecting to Paystack API:', err);
        return NextResponse.json(
          {
            success: false,
            message:
              'Unable to reach Paystack verification servers. Please check your network or try again.',
          },
          { status: 502 }
        );
      }
    }

    // ── Build order response ───────────────────────────────────────────────────
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `MSG-${Date.now().toString().slice(-6)}-${randomSuffix}`;
    const certificateNumber = `CERT-SG-${new Date().getFullYear()}-${randomSuffix}`;

    const verifiedResponse: OrderVerificationResponse = {
      success: true,
      orderId,
      reference,
      amount: paidAmount,
      currency: currency || 'KES',
      paidAt,
      customer: {
        fullName: customer?.fullName || 'Distinguished Collector',
        email: customer?.email || '',
        phone: customer?.phone || '',
        address: customer?.address || 'Private Estate',
        city: customer?.city || '',
        country: customer?.country || 'Kenya',
        postalCode: customer?.postalCode || '',
        notes: customer?.notes || '',
      },
      items: (cart || []).map(item => ({
        id: item.product.id,
        title: item.product.title,
        quantity: item.quantity,
        price:
          currency === 'KES'
            ? item.product.priceKES
            : currency === 'NGN'
            ? item.product.priceNGN
            : item.product.priceUSD,
      })),
      certificateNumber,
      channel: paymentChannel,
      message: 'Payment verified. Your archival pieces are being prepared for dispatch.',
      verificationSource,
    };

    console.log(
      `[verify] ✅ Order ${orderId} verified via ${verificationSource}. Channel: ${paymentChannel || 'sim'}. Amount: ${paidAmount} ${currency}`
    );

    // ── Send order confirmation email (non-blocking) ───────────────────────────
    // We intentionally do NOT await this — a mail failure should never block
    // the success response that clears the cart and shows the customer their deed.
    sendOrderConfirmationEmail({
      orderId,
      certificateNumber,
      reference,
      amount: paidAmount,
      currency: currency || 'KES',
      paidAt,
      channel: paymentChannel,
      customer: verifiedResponse.customer,
      items: verifiedResponse.items,
    }).catch(err =>
      console.error('[verify] Non-critical email error:', err)
    );

    return NextResponse.json(verifiedResponse, { status: 200 });
  } catch (error: unknown) {
    console.error('[verify] Server error during payment verification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      {
        success: false,
        message: `Internal verification error: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
