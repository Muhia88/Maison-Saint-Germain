'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, ArrowRight, Sparkles } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1A1615] text-[#E8E2D8] pt-16 pb-12 border-t border-[#2C2624]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Private Vault Access */}
        <div className="pb-12 border-b border-[#2C2624] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#C5A880] uppercase block">
              PRIVATE CONNOISSEUR DISPATCH
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#F9F6F0] font-normal">
              Receive private notices for upcoming estate vault releases.
            </h3>
            <p className="text-xs text-[#A89F95] font-light max-w-md">
              We notify our private circle 48 hours before new archival acquisitions are cataloged publicly.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-4 bg-[#23342B] border border-[#C5A880]/40 rounded-xs flex items-center gap-3 text-xs text-[#E8E2D8]">
                <Check className="w-4 h-4 text-[#C5A880]" />
                <span>Your address has been added to the Private Connoisseur Registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3.5 bg-[#25201E] border border-[#3D3532] text-sm text-[#F9F6F0] placeholder-[#8A8077] rounded-xs focus:outline-hidden focus:border-[#C5A880] flex-1 font-mono text-xs"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#C5A880] hover:bg-[#9E7B4F] text-[#1A1615] hover:text-[#F9F6F0] rounded-xs text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Request Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Navigation & Brand Directory */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono text-[#A89F95]">
          
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="font-serif text-lg text-[#F9F6F0] font-normal tracking-tight">
              Maison Saint-Germain
            </h4>
            <p className="text-[11px] leading-relaxed text-[#8A8077]">
              Preserving vintage quiet luxury, classic European tailoring, and certified archival garments.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#C5A880]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Certified Archival Repository</span>
            </div>
          </div>

          {/* Curations */}
          <div className="space-y-2.5">
            <span className="text-[#F9F6F0] uppercase tracking-wider font-semibold block text-[11px]">
              Archival Curations
            </span>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#catalog" className="hover:text-[#C5A880] transition-colors">100% Cashmere Coats</a></li>
              <li><a href="#catalog" className="hover:text-[#C5A880] transition-colors">Scottish Harris Tweed</a></li>
              <li><a href="#catalog" className="hover:text-[#C5A880] transition-colors">Cable-Knit Woolens</a></li>
              <li><a href="#catalog" className="hover:text-[#C5A880] transition-colors">Tuscan Bridle Leather</a></li>
              <li><a href="#catalog" className="hover:text-[#C5A880] transition-colors">Como Silk Foulards</a></li>
            </ul>
          </div>

          {/* Heritage & Care */}
          <div className="space-y-2.5">
            <span className="text-[#F9F6F0] uppercase tracking-wider font-semibold block text-[11px]">
              Heritage & Care
            </span>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#heritage" className="hover:text-[#C5A880] transition-colors">Provenance Charter</a></li>
              <li><a href="#heritage" className="hover:text-[#C5A880] transition-colors">Garment Conservation</a></li>
              <li><a href="#provenance" className="hover:text-[#C5A880] transition-colors">Authentication Deeds</a></li>
              <li><a href="#provenance" className="hover:text-[#C5A880] transition-colors">Cedar Preservation</a></li>
            </ul>
          </div>

          {/* Service & Security */}
          <div className="space-y-2.5">
            <span className="text-[#F9F6F0] uppercase tracking-wider font-semibold block text-[11px]">
              Security & Settlement
            </span>
            <ul className="space-y-1.5 text-[11px]">
              <li className="text-[#D3CBC0]">Paystack 256-bit Secure</li>
              <li className="text-[#D3CBC0]">Insured Courier Handover</li>
              <li className="text-[#D3CBC0]">Global Customs Cleared</li>
              <li className="text-[#D3CBC0]">Estate Consignment Concierge</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-[#2C2624] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[#7A7067]">
          <div>
            © {new Date().getFullYear()} MAISON SAINT-GERMAIN ARCHIVE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span>PARIS</span>
            <span>•</span>
            <span>LONDON</span>
            <span>•</span>
            <span>MILAN</span>
            <span>•</span>
            <span>GENEVA</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
