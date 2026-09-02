'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Eye, Check, Sparkles, MapPin } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, formatPrice, setSelectedProduct } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div 
      className="group flex flex-col bg-[#FDFBF7] border border-[#E2DAD0] hover:border-[#C5A880] transition-all duration-300 rounded-xs overflow-hidden shadow-xs hover:shadow-md cursor-pointer"
      onClick={() => setSelectedProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-3/4 w-full bg-[#EAE4D9] overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Top badges */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-2 pointer-events-none">
          <span className="bg-[#1A1615]/85 backdrop-blur-xs text-[#E8E2D8] text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-xs border border-[#C5A880]/30 shadow-xs">
            {product.era}
          </span>
          <span className="bg-[#FDFBF7]/90 backdrop-blur-xs text-[#23342B] text-[10px] font-mono px-2 py-1 rounded-xs border border-[#DDD5C7] shadow-xs">
            {product.condition}
          </span>
        </div>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#1A1615]/70 via-[#1A1615]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="w-full py-2 bg-[#F9F6F0]/95 hover:bg-[#F9F6F0] text-[#1A1615] text-[11px] font-medium uppercase tracking-widest rounded-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#9E7B4F]" />
            <span>Examine Artifact</span>
          </button>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-[#FDFBF7]">
        <div>
          {/* Origin & Material */}
          <div className="flex items-center justify-between text-[11px] text-[#7A7067] font-mono mb-1.5">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-[#9E7B4F] shrink-0" />
              {product.origin}
            </span>
            <span className="text-[#9E7B4F] text-[10px] uppercase tracking-wider font-semibold">1 OF 1</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-medium text-[#1A1615] group-hover:text-[#23342B] transition-colors leading-snug line-clamp-2">
            {product.title}
          </h3>

          {/* Material Tag */}
          <p className="text-xs text-[#5C524B] mt-1 line-clamp-1 italic">
            {product.material}
          </p>
        </div>

        {/* Price & Add to Cart Section */}
        <div className="pt-4 mt-3 border-t border-[#EDE7DD] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#7A7067] block font-mono">
              Preserved Price
            </span>
            <span className="font-serif text-lg font-medium text-[#1A1615]">
              {formatPrice(product.priceUSD, product.priceNGN, product.priceKES)}
            </span>
          </div>

          <button
            type="button"
            id={`add-to-cart-${product.id}`}
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xs text-[11px] font-medium uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              isAdded
                ? 'bg-[#23342B] text-[#F9F6F0]'
                : 'bg-[#1A1615] text-[#F9F6F0] hover:bg-[#9E7B4F] active:scale-95'
            }`}
            aria-label={`Add ${product.title} to cart`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Reserved</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Acquire</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
