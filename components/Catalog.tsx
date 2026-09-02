'use client';

import React, { useState, useMemo } from 'react';
import { VINTAGE_PRODUCTS } from '@/data/products';
import { ProductCategory } from '@/types';
import ProductCard from './ProductCard';
import { SlidersHorizontal, Sparkles, Filter } from 'lucide-react';

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All Archives' },
  { id: 'outerwear', label: 'Coats & Outerwear' },
  { id: 'tailoring', label: 'Tailoring & Blazers' },
  { id: 'knitwear', label: 'Heritage Knitwear' },
  { id: 'leather', label: 'Saddlery & Leather' },
  { id: 'accessories', label: 'Fine Accessories' },
];

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'era'>('featured');

  const eras = useMemo(() => {
    return ['all', '1960s', '1970s', '1980s', '1990s'];
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...VINTAGE_PRODUCTS];

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (selectedEra !== 'all') {
      list = list.filter(p => p.era.includes(selectedEra.replace('s', '')));
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.priceUSD - b.priceUSD);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.priceUSD - a.priceUSD);
    } else if (sortBy === 'era') {
      list.sort((a, b) => a.era.localeCompare(b.era));
    }

    return list;
  }, [selectedCategory, selectedEra, sortBy]);

  return (
    <section id="catalog" className="py-16 sm:py-24 bg-[#F9F6F0] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-px bg-[#9E7B4F]"></span>
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#9E7B4F]">
              AUTHENTICATED VINTAGE REPOSITORY
            </span>
            <span className="w-6 h-px bg-[#9E7B4F]"></span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#1A1615] tracking-tight">
            The Archival Collection
          </h2>
          <p className="mt-3 text-base text-[#61574F] font-light">
            Individually sourced, conserved, and certified garments spanning European tailoring houses and heritage mills from 1968 to 1995.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#FDFBF7] p-4 sm:p-5 rounded-xs border border-[#E2DAD0] mb-10 shadow-2xs space-y-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap rounded-xs transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#1A1615] text-[#F9F6F0] shadow-xs'
                    : 'bg-[#F2ECE1] text-[#5A5049] hover:bg-[#E7DFCFC] hover:text-[#1A1615]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Secondary Filter & Sort Line */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#EDE7DD] text-xs">
            {/* Era Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#9E7B4F]" />
              <span className="text-[#7A7067] uppercase tracking-wider font-mono">Era:</span>
              <div className="flex items-center gap-1">
                {eras.map(era => (
                  <button
                    key={era}
                    type="button"
                    onClick={() => setSelectedEra(era)}
                    className={`px-2.5 py-1 rounded-xs font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                      selectedEra === era
                        ? 'bg-[#23342B] text-[#F9F6F0]'
                        : 'text-[#61574F] hover:bg-[#EAE4D9]'
                    }`}
                  >
                    {era === 'all' ? 'All Eras' : era}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#9E7B4F]" />
              <span className="text-[#7A7067] uppercase tracking-wider font-mono">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#F2ECE1] border border-[#DDD5C7] text-[#1A1615] text-xs rounded-xs px-2.5 py-1 focus:outline-hidden focus:border-[#9E7B4F] cursor-pointer"
              >
                <option value="featured">Curator&apos;s Selection</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="era">Chronological Era</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-[#FDFBF7] border border-[#E2DAD0] rounded-xs">
            <Sparkles className="w-8 h-8 text-[#9E7B4F] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl text-[#1A1615]">No archival pieces found in this curation</h3>
            <p className="text-xs text-[#7A7067] mt-1 font-mono">Try adjusting your era or category filter.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedEra('all');
              }}
              className="mt-4 px-4 py-2 bg-[#1A1615] text-[#F9F6F0] text-xs uppercase tracking-widest rounded-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
