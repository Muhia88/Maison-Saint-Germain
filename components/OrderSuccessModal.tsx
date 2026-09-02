'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, Award, Printer, ArrowRight, ShieldCheck, Sparkles, MapPin, Calendar, Hash } from 'lucide-react';

export default function OrderSuccessModal() {
  const { completedOrder, setCompletedOrder, formatPrice } = useCart();

  if (!completedOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setCompletedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1615]/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-2xl bg-[#FDFBF7] border-2 border-[#C5A880]/60 rounded-xs shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate Watermark Header */}
        <div className="bg-[#1A1615] text-[#F9F6F0] p-6 text-center relative overflow-hidden border-b border-[#C5A880]/40">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-[#C5A880]/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="w-12 h-12 rounded-full bg-[#23342B] border border-[#C5A880] text-[#C5A880] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Award className="w-6 h-6" />
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5A880]">
            <span>MAISON SAINT-GERMAIN</span>
            <span>•</span>
            <span>OFFICIAL DEED</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#F9F6F0] mt-1">
            Archival Acquisition Confirmed
          </h2>
          <p className="text-xs text-[#D3CBC0] font-mono mt-1">
            Payment verified via serverless Paystack security protocol
          </p>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-[#FDFBF7]">
          
          {/* Certificate Number & Transaction Banner */}
          <div className="bg-[#F4EFE6] border border-[#DDD5C7] p-4 rounded-xs flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-[#7A7067] uppercase block text-[10px]">Deed of Provenance</span>
              <span className="text-[#1A1615] font-semibold text-sm tracking-wider">
                {completedOrder.certificateNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#7A7067] uppercase block text-[10px]">Paystack Reference</span>
              <span className="text-[#23342B] font-medium">
                {completedOrder.reference}
              </span>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="p-3 bg-[#EBF3EE] border border-[#BDD9C6] rounded-xs flex items-center gap-3 text-xs text-[#1E452C]">
            <CheckCircle2 className="w-5 h-5 text-[#2B7744] shrink-0" />
            <div>
              <p className="font-semibold">Ownership Transferred & Preserved</p>
              <p className="text-[11px] text-[#2F5E3D]">
                Your single-edition pieces are now reserved in temperature-controlled cedar archival wrapping.
              </p>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-[#FAF7F2] p-4 rounded-xs border border-[#E2DAD0]">
            <div>
              <span className="text-[#8C8277] uppercase text-[10px] block">Collector</span>
              <p className="font-medium text-[#1A1615] text-sm font-serif mt-0.5">
                {completedOrder.customer.fullName}
              </p>
              <p className="text-[#5C524B] mt-0.5">{completedOrder.customer.email}</p>
              <p className="text-[#5C524B]">{completedOrder.customer.phone}</p>
            </div>

            <div>
              <span className="text-[#8C8277] uppercase text-[10px] block">Courier Destination</span>
              <p className="font-medium text-[#1A1615] mt-0.5">
                {completedOrder.customer.address}
              </p>
              <p className="text-[#5C524B]">
                {completedOrder.customer.city}, {completedOrder.customer.country}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-[#EDE7DD] rounded-xs text-[10px] text-[#23342B]">
                Insured Armored Courier
              </span>
            </div>
          </div>

          {/* Line Items Receipt */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A7067] block">
              Itemized Provenance Manifest
            </span>
            <div className="border border-[#DDD5C7] rounded-xs divide-y divide-[#EDE7DD] bg-[#FDFBF7]">
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-serif font-medium text-[#1A1615] block text-sm">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[#7A7067] font-mono">
                      Quantity: {item.quantity} • Certified Authentic
                    </span>
                  </div>
                  <span className="font-mono font-medium text-[#1A1615]">
                    {completedOrder.currency === 'NGN' ? `₦${item.price.toLocaleString()}` : `$${item.price.toLocaleString()}`}
                  </span>
                </div>
              ))}

              <div className="p-3 bg-[#F4EFE6] flex items-center justify-between font-mono text-xs">
                <span className="font-medium text-[#1A1615]">Total Verified Settlement</span>
                <span className="text-sm font-semibold text-[#1A1615]">
                  {completedOrder.currency === 'NGN' 
                    ? `₦${completedOrder.amount.toLocaleString()}` 
                    : `$${completedOrder.amount.toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-5 bg-[#F9F6F0] border-t border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 border border-[#DDD5C7] hover:border-[#1A1615] rounded-xs text-xs font-mono uppercase tracking-wider text-[#4A423E] hover:text-[#1A1615] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Deed</span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-3 bg-[#1A1615] hover:bg-[#23342B] text-[#F9F6F0] rounded-xs text-xs font-medium uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Return to The Archive</span>
            <ArrowRight className="w-4 h-4 text-[#C5A880]" />
          </button>
        </div>

      </div>
    </div>
  );
}
