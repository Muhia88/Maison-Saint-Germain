'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2, ShieldCheck, ArrowRight, ShoppingBag, Sparkles, Package } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotalUSD,
    subtotalNGN,
    subtotalKES,
    formatPrice,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1615]/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] border-l border-[#E2DAD0] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8E2D8] flex items-center justify-between bg-[#F9F6F0]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#9E7B4F]" />
              <h2 className="font-serif text-xl text-[#1A1615] font-normal tracking-tight">
                Your Curated Acquisition
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#7A7067] hover:text-[#1A1615] rounded-full hover:bg-[#EDE7DD] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-[#EDE7DD]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EDE7DD] flex items-center justify-center text-[#9E7B4F]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#1A1615]">Your acquisition bag is empty</h3>
                  <p className="text-xs text-[#7A7067] mt-1 max-w-xs font-mono">
                    Discover rare European archival pieces preserved for discerning collectors.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 bg-[#1A1615] text-[#F9F6F0] text-xs font-medium uppercase tracking-widest rounded-xs hover:bg-[#9E7B4F] transition-colors cursor-pointer"
                >
                  Browse Archive
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="pt-6 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-[#EAE4D9] rounded-xs overflow-hidden border border-[#D5CCC0] shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.title}
                      fill
                      className="object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#9E7B4F]">
                          {item.product.era}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#9C9287] hover:text-[#8B261D] transition-colors p-0.5 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-serif text-sm font-medium text-[#1A1615] leading-snug">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-[#7A7067] italic line-clamp-1">
                        {item.product.material}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F2ECE1]">
                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-[#DDD5C7] rounded-xs bg-[#FDFBF7]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-[#5A5049] hover:bg-[#EAE4D9] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono text-[#1A1615] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-[#5A5049] hover:bg-[#EAE4D9] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-serif text-sm font-medium text-[#1A1615]">
                        {formatPrice(
                          item.product.priceUSD * item.quantity,
                          item.product.priceNGN * item.quantity,
                          item.product.priceKES * item.quantity,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#F9F6F0] border-t border-[#E8E2D8] space-y-4">
              
              {/* Complimentary preservation notice */}
              <div className="p-3 bg-[#EDE7DD] border border-[#DDD5C7] rounded-xs flex items-center gap-2.5 text-xs text-[#5C524B]">
                <Package className="w-4 h-4 text-[#9E7B4F] shrink-0" />
                <span className="font-mono text-[11px] leading-tight">
                  Complimentary museum cedar garment bag & verified provenance deed included.
                </span>
              </div>

              {/* Subtotal Calculation */}
              <div className="space-y-1.5 text-xs font-mono text-[#61574F]">
                <div className="flex justify-between">
                  <span>Archival Subtotal</span>
                  <span className="text-[#1A1615] font-medium">
                    {formatPrice(subtotalUSD, subtotalNGN, subtotalKES)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Global Transit</span>
                  <span className="text-[#23342B] font-medium uppercase text-[10px]">Complimentary</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#DDD5C7] text-sm font-serif font-medium text-[#1A1615]">
                  <span>Total Investment</span>
                  <span className="text-base font-semibold">
                    {formatPrice(subtotalUSD, subtotalNGN, subtotalKES)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                type="button"
                id="cart-checkout-button"
                onClick={handleCheckout}
                className="w-full py-4 bg-[#1A1615] hover:bg-[#23342B] text-[#F9F6F0] rounded-xs text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#7A7067] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9E7B4F]" />
                <span>Protected by Paystack 256-bit Encrypted Banking Gateway</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
