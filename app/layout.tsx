import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Maison Saint-Germain | Vintage & Quiet Luxury Archive',
  description: 'An archival vintage boutique curating authenticated luxury coats, tailoring, cashmere knitwear, and heritage accessories.',
  openGraph: {
    title: 'Maison Saint-Germain | Vintage & Quiet Luxury Archive',
    description: 'Curated European vintage pieces preserved with authenticated provenance.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maison Saint-Germain | Vintage & Quiet Luxury Archive',
    description: 'Curated European vintage pieces preserved with authenticated provenance.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <head>
        {/* Paystack v2 Inline JS — loads after page is interactive */}
        <Script
          src="https://js.paystack.co/v2/inline.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-[#F9F6F0] text-[#1A1615] min-h-screen selection:bg-[#C5A880]/30 selection:text-[#1A1615] antialiased" suppressHydrationWarning>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
