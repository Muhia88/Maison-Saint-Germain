'use client';

import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import BrandStory from '@/components/BrandStory';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import ProductDetailModal from '@/components/ProductDetailModal';
import OrderSuccessModal from '@/components/OrderSuccessModal';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F9F6F0]">
      {/* Navigation Header */}
      <Header />

      {/* Hero Showcase */}
      <Hero />

      {/* Product Catalog & Archival Filter */}
      <Catalog />

      {/* Brand Heritage & Provenance Charter */}
      <BrandStory />

      {/* Footer */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Checkout & Paystack Inline Trigger Modal */}
      <CheckoutModal />

      {/* Artifact Quick View & Dimensions Modal */}
      <ProductDetailModal />

      {/* Official Verified Order & Provenance Deed Modal */}
      <OrderSuccessModal />
    </main>
  );
}
