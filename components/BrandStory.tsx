'use client';

import React from 'react';
import Image from 'next/image';
import { Award, Compass, Feather, History, ShieldCheck, Sparkles } from 'lucide-react';

export default function BrandStory() {
  return (
    <section id="heritage" className="py-20 sm:py-28 bg-[#FDFBF7] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Two-Column Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Collage & Visual Proof */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/5 w-full rounded-xs overflow-hidden border border-[#D5CCC0] shadow-xl bg-[#EAE4D9]">
              <Image
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85"
                alt="Archival Tailoring Inspection"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Inset archival stamp */}
            <div className="absolute -bottom-6 -right-6 bg-[#1A1615] text-[#F9F6F0] p-5 rounded-xs border border-[#C5A880]/50 shadow-2xl max-w-[260px] hidden sm:block">
              <div className="flex items-center gap-2 text-[#C5A880] mb-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-mono tracking-widest uppercase">The Heritage Seal</span>
              </div>
              <p className="text-xs font-serif leading-snug text-[#E8E2D8]">
                &ldquo;True luxury is quiet, singular, and carries the dignity of generations.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Narrative Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-[#9E7B4F]"></span>
              <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#9E7B4F]">
                THE SAINT-GERMAIN CHARTER
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1A1615] font-normal leading-tight">
              Preserving the mastercraft of <span className="italic text-[#23342B]">bygone European ateliers</span>.
            </h2>

            <p className="text-base text-[#5A5049] leading-relaxed font-light">
              Founded on the belief that the finest garments have already been created, Maison Saint-Germain operates as a private archival repository. We acquire singular pieces from European estates, noble tailoring vaults, and private family archives.
            </p>

            <p className="text-sm text-[#6B6158] leading-relaxed">
              Every wool coat, tweed jacket, and silk foulard undergoes rigorous authentication by textile historians, followed by delicate organic lanolin cleansing, cedar conditioning, and hand-restoration of seams using period-accurate threads.
            </p>

            {/* 3 Pillars of Old Money Craft */}
            <div id="provenance" className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#E8E2D8]">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xs bg-[#EDE7DD] flex items-center justify-center text-[#9E7B4F]">
                  <History className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-medium text-[#1A1615]">Historic Provenance</h4>
                <p className="text-xs text-[#6B6158] leading-normal">
                  Documented chain of ownership and certified period origins from 1968 to 1995.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xs bg-[#EDE7DD] flex items-center justify-center text-[#9E7B4F]">
                  <Feather className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-medium text-[#1A1615]">Master Conservation</h4>
                <p className="text-xs text-[#6B6158] leading-normal">
                  Preserved in museum-grade cedar chambers with organic lanolin conditioning.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xs bg-[#EDE7DD] flex items-center justify-center text-[#9E7B4F]">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-medium text-[#1A1615]">Singular 1 of 1</h4>
                <p className="text-xs text-[#6B6158] leading-normal">
                  Each piece is strictly unique. Once acquired, it enters the collector private archive.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
