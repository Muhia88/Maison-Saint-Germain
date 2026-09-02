'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ShieldCheck, Sparkles, Menu, X, Compass, Globe } from 'lucide-react';

export default function Header() {
  const { totalCount, setIsCartOpen, currency, setCurrency } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-[#1A1615] text-[#E8E2D8] py-2 px-4 text-xs tracking-widest uppercase border-b border-[#2C2624]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse"></span>
            <span className="hidden sm:inline text-[#C5A880] font-medium">Archival Acquisition:</span>
            <span className="text-[#D3CBC0]">Rare European Autumn Releases</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 text-[#D3CBC0] hover:text-[#F9F6F0] transition-colors cursor-default">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden md:inline">100% Authenticity Deed</span>
            </div>

            {/* Currency Selector — cycles KES → USD → NGN */}
            <div className="flex items-center gap-1 border-l border-[#3D3532] pl-4">
              <Globe className="w-3 h-3 text-[#A89F95]" />
              <button
                type="button"
                onClick={() => {
                  if (currency === 'KES') setCurrency('USD');
                  else if (currency === 'USD') setCurrency('NGN');
                  else setCurrency('KES');
                }}
                className="text-xs font-mono text-[#E8E2D8] hover:text-[#C5A880] transition-colors flex items-center gap-1 cursor-pointer"
                title="Switch currency: KES / USD / NGN"
              >
                <span>{currency}</span>
                <span className="text-[10px] text-[#A89F95] font-sans">
                  ({currency === 'KES' ? 'KSh' : currency === 'USD' ? '$' : '₦'})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#F9F6F0]/95 backdrop-blur-md shadow-xs border-b border-[#E8E2D8]/80 py-3' 
          : 'bg-[#F9F6F0] border-b border-[#E8E2D8] py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-[#1A1615] hover:text-[#9E7B4F] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm tracking-wider uppercase font-medium text-[#4A423E]">
            <a 
              href="#catalog" 
              className="hover:text-[#1A1615] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#1A1615] hover:after:w-full after:transition-all"
            >
              The Archive
            </a>
            <a 
              href="#curations" 
              className="hover:text-[#1A1615] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#1A1615] hover:after:w-full after:transition-all"
            >
              Curations
            </a>
            <a 
              href="#heritage" 
              className="hover:text-[#1A1615] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#1A1615] hover:after:w-full after:transition-all"
            >
              Heritage & Care
            </a>
          </nav>

          {/* Centered Brand Monogram & Logo */}
          <a href="#" className="flex flex-col items-center group text-center select-none">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-5 h-px bg-[#C5A880]"></span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#9E7B4F] font-medium font-mono">
                PARIS • 1984
              </span>
              <span className="w-5 h-px bg-[#C5A880]"></span>
            </div>
            <span className="text-2xl sm:text-3xl font-serif tracking-tight text-[#1A1615] group-hover:text-[#23342B] transition-colors font-normal">
              Maison Saint-Germain
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#7A7067] -mt-0.5">
              Archive & Quiet Luxury
            </span>
          </a>

          {/* Right Actions: Search / Authentication / Cart */}
          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="#provenance"
              className="hidden md:flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#5C524B] hover:text-[#1A1615] transition-colors px-3 py-1.5 rounded-full border border-[#E8E2D8] hover:border-[#C5A880]"
            >
              <Compass className="w-3.5 h-3.5 text-[#9E7B4F]" />
              <span>Provenance</span>
            </a>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              id="header-cart-button"
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-sm bg-[#1A1615] text-[#F9F6F0] hover:bg-[#2C2624] transition-all group shadow-xs cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#C5A880] group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline text-xs tracking-widest uppercase font-medium">Cart</span>
              <span suppressHydrationWarning className="inline-flex items-center justify-center bg-[#C5A880] text-[#1A1615] text-[11px] font-bold h-4.5 min-w-4.5 px-1 rounded-full">
                {totalCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8E2D8] bg-[#FDFBF7] px-6 py-5 mt-3 space-y-4 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-3 text-sm tracking-wider uppercase font-medium text-[#4A423E]">
              <a 
                href="#catalog" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#1A1615] py-1 border-b border-[#F0EBE1]"
              >
                The Archive
              </a>
              <a 
                href="#curations" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#1A1615] py-1 border-b border-[#F0EBE1]"
              >
                Curations
              </a>
              <a 
                href="#heritage" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#1A1615] py-1 border-b border-[#F0EBE1]"
              >
                Heritage & Care
              </a>
              <a 
                href="#provenance" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#1A1615] py-1"
              >
                Provenance Guarantee
              </a>
            </nav>
            <div className="pt-2 flex items-center justify-between border-t border-[#E8E2D8]">
              <span className="text-xs text-[#7A7067] uppercase tracking-wider">Currency</span>
              <button
                type="button"
                onClick={() => {
                  if (currency === 'KES') setCurrency('USD');
                  else if (currency === 'USD') setCurrency('NGN');
                  else setCurrency('KES');
                }}
                className="text-xs font-mono font-medium px-3 py-1 bg-[#EDE7DD] rounded-sm text-[#1A1615]"
              >
                {currency} ({currency === 'KES' ? 'KSh' : currency === 'USD' ? '$' : '₦'})
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
