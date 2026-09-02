'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, ShieldCheck, MapPin, Sparkles, Check, Ruler, Scissors, Award } from 'lucide-react';

export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart, formatPrice } = useCart();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  if (!selectedProduct) return null;

  const allImages = [
    selectedProduct.image,
    ...(selectedProduct.secondaryImages || [])
  ];

  const handleAddToCart = () => {
    addToCart(selectedProduct);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setSelectedProduct(null);
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1615]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200"
      onClick={() => setSelectedProduct(null)}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#FDFBF7] border border-[#D8D0C5] rounded-xs shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1A1615]/70 hover:bg-[#1A1615] text-[#F9F6F0] transition-colors cursor-pointer"
          aria-label="Close artifact details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 bg-[#EAE4D9] flex flex-col p-4 sm:p-6 border-b md:border-b-0 md:border-r border-[#E2DAD0]">
          {/* Main Selected Image */}
          <div className="relative aspect-3/4 w-full rounded-xs overflow-hidden border border-[#D5CCC0] bg-[#DFD8CC]">
            <Image
              src={allImages[activeImageIdx] || selectedProduct.image}
              alt={selectedProduct.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 bg-[#1A1615]/85 text-[#C5A880] text-[10px] font-mono px-2.5 py-1 rounded-xs uppercase tracking-widest border border-[#C5A880]/30">
              {selectedProduct.era}
            </div>
          </div>

          {/* Thumbnail Strip (if multiple images) */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-14 h-14 rounded-xs overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'border-[#9E7B4F] scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Authenticity Certificate Box */}
          <div className="mt-4 p-3 bg-[#F2ECE1] border border-[#DDD5C7] rounded-xs text-[11px] text-[#5C524B] flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#9E7B4F] shrink-0" />
            <div>
              <span className="font-serif font-medium text-[#1A1615] block">Certified Archival Provenance</span>
              <span className="font-mono text-[10px] text-[#7A7067]">Includes physical deed signed by archival curator</span>
            </div>
          </div>
        </div>

        {/* Right: Details & Acquisition */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[80vh] md:max-h-[92vh]">
          <div className="space-y-4">
            
            {/* Top metadata */}
            <div className="flex items-center justify-between text-xs font-mono text-[#7A7067] border-b border-[#EDE7DD] pb-3">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#9E7B4F]" />
                {selectedProduct.origin}
              </span>
              <span className="text-[#23342B] font-semibold">{selectedProduct.condition}</span>
            </div>

            {/* Title & Subtitle */}
            <div>
              <span className="text-[11px] font-mono tracking-widest text-[#9E7B4F] uppercase">
                {selectedProduct.subtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1615] font-normal leading-snug mt-0.5">
                {selectedProduct.title}
              </h2>
            </div>

            {/* Price Tag */}
            <div className="flex items-baseline gap-2 py-2">
              <span className="text-2xl font-serif text-[#1A1615] font-semibold">
                {formatPrice(selectedProduct.priceUSD, selectedProduct.priceNGN, selectedProduct.priceKES)}
              </span>
              <span className="text-xs text-[#7A7067] font-mono">Single Edition • Tax & Preservation Included</span>
            </div>

            {/* Description */}
            <p className="text-sm text-[#4E443E] leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Provenance Historical Note */}
            <div className="p-3.5 bg-[#FAF7F2] border-l-2 border-[#9E7B4F] rounded-r-xs space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#9E7B4F] block">
                Provenance Record
              </span>
              <p className="text-xs text-[#5A5049] italic">
                &ldquo;{selectedProduct.provenance}&rdquo;
              </p>
            </div>

            {/* Garment Measurements */}
            <div className="pt-2 border-t border-[#EDE7DD]">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#1A1615] mb-2 font-medium">
                <Ruler className="w-3.5 h-3.5 text-[#9E7B4F]" />
                <span>Garment Dimensions</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#5C524B] bg-[#F4EFE6] p-3 rounded-xs">
                {selectedProduct.measurements.chest && (
                  <div><span className="text-[#8C8277]">Chest:</span> {selectedProduct.measurements.chest}</div>
                )}
                {selectedProduct.measurements.shoulders && (
                  <div><span className="text-[#8C8277]">Shoulders:</span> {selectedProduct.measurements.shoulders}</div>
                )}
                {selectedProduct.measurements.length && (
                  <div><span className="text-[#8C8277]">Length:</span> {selectedProduct.measurements.length}</div>
                )}
                {selectedProduct.measurements.sleeves && (
                  <div><span className="text-[#8C8277]">Sleeves:</span> {selectedProduct.measurements.sleeves}</div>
                )}
                {selectedProduct.measurements.dimensions && (
                  <div className="col-span-2"><span className="text-[#8C8277]">Size:</span> {selectedProduct.measurements.dimensions}</div>
                )}
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#7A7067] block">
                Preservation & Specifications
              </span>
              <ul className="text-xs text-[#5A5049] space-y-1 list-disc list-inside">
                {selectedProduct.details.map((det, i) => (
                  <li key={i}>{det}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Action button */}
          <div className="pt-6 mt-4 border-t border-[#EDE7DD]">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xs text-xs font-medium uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isAdded
                  ? 'bg-[#23342B] text-[#F9F6F0]'
                  : 'bg-[#1A1615] text-[#F9F6F0] hover:bg-[#9E7B4F] shadow-sm active:scale-98'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-[#C5A880]" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                  <span>Acquire This Piece • {formatPrice(selectedProduct.priceUSD, selectedProduct.priceNGN, selectedProduct.priceKES)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
