'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { CustomerDetails } from '@/types';
import {
  X, Lock, ShieldCheck, CreditCard, Loader2, AlertCircle,
  CheckCircle2, Smartphone, Building2, Wallet,
} from 'lucide-react';

// ─── Paystack v2 Inline Popup types ───────────────────────────────────────────
declare global {
  interface Window {
    PaystackPop?: new () => {
      newTransaction: (options: PaystackTransactionOptions) => void;
    };
  }
}

interface PaystackTransactionOptions {
  key: string;
  email: string;
  amount: number; // in smallest currency unit (kobo / cents)
  currency: string;
  ref: string;
  channels?: ('card' | 'bank' | 'ussd' | 'qr' | 'mobile_money' | 'bank_transfer' | 'apple_pay' | 'eft')[];
  metadata?: {
    custom_fields?: { display_name: string; variable_name: string; value: string }[];
    cancel_action?: string;
    [key: string]: unknown;
  };
  label?: string;
  onSuccess: (transaction: { reference: string; status: string; trans?: string }) => void;
  onCancel: () => void;
  onLoad?: (response: { id: string }) => void;
}

// ─── Country list ─────────────────────────────────────────────────────────────
const COUNTRIES = [
  'Kenya', 'Nigeria', 'Ghana', 'United States', 'United Kingdom',
  'France', 'Switzerland', 'Germany', 'Canada', 'United Arab Emirates',
  'South Africa', 'Rwanda', 'Uganda', 'Tanzania', 'Ethiopia',
];

// ─── Payment channel display info ─────────────────────────────────────────────
const PAYMENT_CHANNELS = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'mobile_money', label: 'Mobile Money (M-Pesa, MTN, etc.)', icon: Smartphone },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2 },
  { id: 'apple_pay', label: 'Apple Pay', icon: Wallet },
] as const;

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotalUSD,
    subtotalNGN,
    subtotalKES,
    currency,
    formatPrice,
    clearCart,
    setCompletedOrder,
    getSubtotal,
  } = useCart();

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Kenya',
    postalCode: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paystackReady, setPaystackReady] = useState(false);

  // Poll for PaystackPop being available after lazy script load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.PaystackPop) { setPaystackReady(true); return; }
    const interval = setInterval(() => {
      if (window.PaystackPop) {
        setPaystackReady(true);
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  if (!isCheckoutOpen) return null;

  // ── Form Validation ──────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CustomerDetails, string>> = {};
    if (!customer.fullName.trim()) errors.fullName = 'Full name is required';
    if (!customer.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
      errors.email = 'A valid email address is required';
    if (!customer.phone.trim()) errors.phone = 'Phone number is required for courier contact';
    if (!customer.address.trim()) errors.address = 'Delivery address is required';
    if (!customer.city.trim()) errors.city = 'City is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof CustomerDetails]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // ── Server-side verification ─────────────────────────────────────────────────
  const verifyPaymentOnServer = async (reference: string) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const payload = {
        reference,
        cart: cart.map(item => ({
          product: {
            id: item.product.id,
            title: item.product.title,
            priceUSD: item.product.priceUSD,
            priceNGN: item.product.priceNGN,
            priceKES: item.product.priceKES,
          },
          quantity: item.quantity,
        })),
        customer,
        currency,
        totalAmount: getSubtotal(),
      };

      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Payment verification failed. Please contact support.');
      }

      setCompletedOrder(data);
      clearCart();
      setIsCheckoutOpen(false);
    } catch (err: unknown) {
      console.error('Verification error:', err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Payment verification could not be completed. Your bank may have been charged — please contact support.';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Launch Paystack Popup ────────────────────────────────────────────────────
  const handlePaystackPayment = () => {
    if (!validateForm()) return;

    const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    if (!paystackPublicKey || paystackPublicKey.includes('xxxx')) {
      setErrorMessage('Payment gateway is not configured. Please contact the store owner.');
      return;
    }

    if (!paystackReady || typeof window.PaystackPop === 'undefined') {
      setErrorMessage('Payment gateway is still loading. Please wait a moment and try again.');
      return;
    }

    // Amount must be in smallest currency unit (kobo / cents / sub-unit ×100)
    const subtotal = getSubtotal();
    const amountInSubunits = Math.round(subtotal * 100);

    const generatedRef = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const popup = new window.PaystackPop();
    popup.newTransaction({
      key: paystackPublicKey,
      email: customer.email,
      amount: amountInSubunits,
      currency, // KES, NGN, or USD — matches Paystack account channels
      ref: generatedRef,
      label: 'Maison Saint-Germain',
      // All channels enabled in your Paystack dashboard
      channels: ['card', 'mobile_money', 'bank_transfer', 'apple_pay'],
      metadata: {
        custom_fields: [
          {
            display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: customer.fullName,
          },
          {
            display_name: 'Delivery Address',
            variable_name: 'delivery_address',
            value: `${customer.address}, ${customer.city}${customer.postalCode ? ' ' + customer.postalCode : ''}, ${customer.country}`,
          },
          {
            display_name: 'Phone',
            variable_name: 'phone',
            value: customer.phone,
          },
          {
            display_name: 'Cart Items',
            variable_name: 'cart_count',
            value: `${cart.length} archive piece${cart.length !== 1 ? 's' : ''}`,
          },
        ],
      },
      onSuccess: (transaction) => {
        verifyPaymentOnServer(transaction.reference);
      },
      onCancel: () => {
        setIsProcessing(false);
      },
    });
  };

  // ── Price helpers ─────────────────────────────────────────────────────────────
  const displayTotal = formatPrice(subtotalUSD, subtotalNGN, subtotalKES);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1615]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#FDFBF7] border border-[#D5CCC0] rounded-xs shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#F9F6F0] border-b border-[#E8E2D8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1A1615] text-[#C5A880] flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#1A1615] font-normal tracking-tight">
                Secure Checkout
              </h2>
              <p className="text-[11px] text-[#7A7067] font-mono mt-0.5">
                256-bit encrypted · Powered by Paystack
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            disabled={isProcessing}
            className="p-2 text-[#7A7067] hover:text-[#1A1615] rounded-full hover:bg-[#EDE7DD] transition-colors cursor-pointer disabled:opacity-40"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 bg-[#FBEBEA] border border-[#E8A59E] rounded-xs text-xs text-[#8B261D] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Payment Error</p>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* ── Left: Customer Details Form ──────────────────────────────── */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDE7DD] pb-2">
                <span className="text-xs uppercase font-mono tracking-widest text-[#9E7B4F] font-semibold">
                  1. Delivery Details
                </span>
                <span className="text-[10px] text-[#7A7067] font-mono">* required</span>
              </div>

              {/* Full Name */}
              <Field label="Full Name *" error={formErrors.fullName}>
                <input
                  type="text"
                  name="fullName"
                  value={customer.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Jane Wambui"
                  className={inputClass(!!formErrors.fullName)}
                  autoComplete="name"
                />
              </Field>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email Address *" error={formErrors.email}>
                  <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={inputClass(!!formErrors.email)}
                    autoComplete="email"
                  />
                </Field>

                <Field label="Phone (Courier Contact) *" error={formErrors.phone}>
                  <input
                    type="tel"
                    name="phone"
                    value={customer.phone}
                    onChange={handleInputChange}
                    placeholder="+254 712 345 678"
                    className={inputClass(!!formErrors.phone)}
                    autoComplete="tel"
                  />
                </Field>
              </div>

              {/* Address */}
              <Field label="Delivery Address *" error={formErrors.address}>
                <input
                  type="text"
                  name="address"
                  value={customer.address}
                  onChange={handleInputChange}
                  placeholder="e.g. 14 Limuru Road, Karen"
                  className={inputClass(!!formErrors.address)}
                  autoComplete="street-address"
                />
              </Field>

              {/* City / Postal / Country */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="City *" error={formErrors.city}>
                  <input
                    type="text"
                    name="city"
                    value={customer.city}
                    onChange={handleInputChange}
                    placeholder="Nairobi"
                    className={inputClass(!!formErrors.city)}
                    autoComplete="address-level2"
                  />
                </Field>

                <Field label="Postal Code">
                  <input
                    type="text"
                    name="postalCode"
                    value={customer.postalCode ?? ''}
                    onChange={handleInputChange}
                    placeholder="00100"
                    className={inputClass(false)}
                    autoComplete="postal-code"
                  />
                </Field>

                <Field label="Country">
                  <select
                    name="country"
                    value={customer.country}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-[#F9F6F0] border border-[#DDD5C7] rounded-xs text-sm text-[#1A1615] focus:outline-hidden focus:border-[#9E7B4F] transition-colors cursor-pointer"
                    autoComplete="country-name"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-mono text-[#5C524B] mb-1">
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="notes"
                  value={customer.notes ?? ''}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Gate code, concierge handover instructions, preservation requests..."
                  className="w-full px-3.5 py-2 bg-[#F9F6F0] border border-[#DDD5C7] rounded-xs text-xs text-[#1A1615] focus:outline-hidden focus:border-[#9E7B4F] resize-none transition-colors"
                />
              </div>

              {/* Payment Methods Note */}
              <div className="p-3 bg-[#F4EFE6] border border-[#E2DAD0] rounded-xs">
                <p className="text-[10px] font-mono text-[#7A7067] uppercase tracking-wider mb-2 font-semibold">
                  Accepted Payment Methods
                </p>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_CHANNELS.map(({ id, label, icon: Icon }) => (
                    <span
                      key={id}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FDFBF7] border border-[#DDD5C7] rounded-xs text-[10px] font-mono text-[#5C524B]"
                    >
                      <Icon className="w-3 h-3 text-[#9E7B4F]" />
                      {label}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] font-mono text-[#9C9287] mt-2 leading-relaxed">
                  You will select your preferred payment method on the Paystack secure checkout page.
                </p>
              </div>
            </div>

            {/* ── Right: Order Summary ─────────────────────────────────────── */}
            <div className="md:col-span-5 bg-[#F9F6F0] p-5 rounded-xs border border-[#E2DAD0] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#9E7B4F] font-semibold block border-b border-[#EDE7DD] pb-2 mb-3">
                  2. Order Summary
                </span>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-xs">
                      <div className="pr-2">
                        <p className="font-serif text-[#1A1615] font-medium leading-tight">
                          {item.product.title}
                        </p>
                        <span className="text-[10px] text-[#7A7067] font-mono">
                          Qty: {item.quantity} · {item.product.era}
                        </span>
                      </div>
                      <span className="font-mono text-[#1A1615] shrink-0 font-medium">
                        {formatPrice(
                          item.product.priceUSD * item.quantity,
                          item.product.priceNGN * item.quantity,
                          item.product.priceKES * item.quantity,
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="pt-4 mt-4 border-t border-[#DDD5C7] space-y-1.5 text-xs font-mono text-[#5C524B]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{displayTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Provenance Deed</span>
                    <span className="text-[#23342B] text-[10px] uppercase">Complimentary</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insured Courier</span>
                    <span className="text-[#23342B] text-[10px] uppercase">Included</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#DDD5C7] text-sm font-serif font-semibold text-[#1A1615]">
                    <span>Total Due</span>
                    <span>{displayTotal}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  id="paystack-submit-button"
                  onClick={handlePaystackPayment}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#1A1615] hover:bg-[#23342B] text-[#F9F6F0] rounded-xs text-xs font-medium uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
                      <span>Verifying Payment…</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                      <span>Pay Securely · {displayTotal}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#9C9287] font-mono">
                  <CheckCircle2 className="w-3 h-3 text-[#9E7B4F]" />
                  <span>Secured by Paystack · Card, M-Pesa, Apple Pay, Bank Transfer</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function inputClass(hasError: boolean) {
  return `w-full px-3.5 py-2.5 bg-[#F9F6F0] border rounded-xs text-sm text-[#1A1615] focus:outline-hidden transition-colors ${
    hasError ? 'border-[#8B261D] bg-[#FFF8F7]' : 'border-[#DDD5C7] focus:border-[#9E7B4F]'
  }`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-mono text-[#5C524B] mb-1">{label}</label>
      {children}
      {error && <p className="text-[10px] text-[#8B261D] mt-1 font-mono">{error}</p>}
    </div>
  );
}
