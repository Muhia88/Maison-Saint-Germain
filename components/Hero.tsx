'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowDownRight, Award, Sparkles, Feather } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#E8E2D8] bg-[#F9F6F0]">
      {/* Editorial layout container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        
        {/* Top Header Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8E2D8]/80 text-xs tracking-widest uppercase text-[#7A7067]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#9E7B4F]"></span>
            <span className="font-mono text-[#1A1615]">AUTUMN/WINTER ARCHIVAL EDITION</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>NO. 042 // VOL. IX</span>
            <span className="hidden sm:inline text-[#C5A880]">•</span>
            <span className="hidden sm:inline">SINGLE-EDITION ACQUISITIONS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Manifesto Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EDE7DD] border border-[#DDD5C7] rounded-full text-xs text-[#5C524B] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#9E7B4F]" />
              <span>Estate Provenance • 1968–1995</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#1A1615] leading-[1.12] tracking-tight font-normal">
              Rare tailored garments with <span className="italic font-light text-[#23342B]">timeless provenance</span>.
            </h1>

            <p className="text-base sm:text-lg text-[#5A5049] leading-relaxed max-w-xl font-light">
              Maison Saint-Germain curates preserved European tailoring, pure Mongolian cashmere coats, and historic saddlery leather. Each artifact is singular, restored by master conservators, and cataloged with a deed of authenticity.
            </p>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#catalog"
                id="hero-explore-button"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1A1615] text-[#F9F6F0] hover:bg-[#23342B] transition-all duration-300 rounded-sm text-xs uppercase tracking-[0.2em] font-medium group shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>Explore The Archive</span>
                <ArrowDownRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#provenance"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-[#D5CCC0] hover:border-[#1A1615] text-[#3A332E] hover:text-[#1A1615] transition-all duration-300 rounded-sm text-xs uppercase tracking-[0.2em] font-medium bg-[#FAF7F2] hover:bg-[#F3EDE2]"
              >
                <span>Provenance Standard</span>
              </a>
            </div>

            {/* Trust Pillars */}
            <div className="pt-8 border-t border-[#E8E2D8] grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block font-serif text-2xl text-[#1A1615] font-medium">100%</span>
                <span className="text-[11px] uppercase tracking-wider text-[#7A7067]">Authenticity Deed</span>
              </div>
              <div>
                <span className="block font-serif text-2xl text-[#1A1615] font-medium">Single</span>
                <span className="text-[11px] uppercase tracking-wider text-[#7A7067]">Edition Garments</span>
              </div>
              <div>
                <span className="block font-serif text-2xl text-[#1A1615] font-medium">Global</span>
                <span className="text-[11px] uppercase tracking-wider text-[#7A7067]">Insured Transit</span>
              </div>
            </div>
          </div>

          {/* Right Image Editorial Vignette */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-xs border border-[#D8D0C5] bg-[#EAE4D9] shadow-lg group">
              <Image
                src="https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=1200&q=85"
                alt="1982 Cashmere Double-Breasted Trench"
                fill
                priority
                className="object-cover object-top filter grayscale-15 group-hover:scale-103 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                referrerPolicy="no-referrer"
              />

              {/* Archival seal overlay */}
              <div className="absolute top-4 right-4 bg-[#1A1615]/90 backdrop-blur-xs text-[#E8E2D8] px-3 py-1.5 rounded-xs border border-[#C5A880]/40 text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 shadow-md">
                <Award className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>ARCHIVE PIECE • 1982</span>
              </div>

              {/* Bottom detail plaque */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1A1615]/95 via-[#1A1615]/80 to-transparent p-5 text-[#F9F6F0]">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#C5A880] block font-mono mb-1">
                  HIGHLIGHT ACQUISITION
                </span>
                <h3 className="font-serif text-xl font-normal leading-snug">
                  Double-Breasted Mongolian Cashmere Trench
                </h3>
                <div className="flex items-center justify-between text-xs text-[#D3CBC0] mt-2 font-mono">
                  <span>Parisian Estate Archive</span>
                  <span className="text-[#C5A880]">Edition 1 of 1</span>
                </div>
              </div>
            </div>

            {/* Aesthetic offset badge */}
            <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-[#FDFBF7] border border-[#DDD5C7] p-3.5 rounded-xs shadow-md items-center gap-3 max-w-[240px]">
              <div className="w-10 h-10 rounded-full bg-[#EDE7DD] border border-[#C5A880]/50 flex items-center justify-center text-[#9E7B4F] shrink-0">
                <Feather className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-serif font-medium text-[#1A1615] leading-tight">Master Conservator Verified</p>
                <p className="text-[10px] text-[#7A7067] font-mono mt-0.5">Lanolin & Cedar Conditioned</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
