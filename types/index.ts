export type ProductCategory = 
  | 'all' 
  | 'outerwear' 
  | 'tailoring' 
  | 'knitwear' 
  | 'accessories' 
  | 'leather';

export type CurrencyCode = 'KES' | 'USD' | 'NGN';

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  category: ProductCategory;
  era: string; // e.g. "Circa 1982"
  origin: string; // e.g. "Milan, Italy"
  material: string; // e.g. "100% Loro Piana Cashmere"
  condition: string; // e.g. "Pristine Vintage (9.8/10)"
  priceUSD: number;
  priceNGN: number;
  priceKES: number; // Primary Paystack currency
  image: string;
  secondaryImages?: string[];
  description: string;
  provenance: string;
  measurements: {
    chest?: string;
    shoulders?: string;
    length?: string;
    sleeves?: string;
    dimensions?: string;
  };
  details: string[];
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderVerificationResponse {
  success: boolean;
  orderId: string;
  reference: string;
  amount: number;
  currency: string;
  paidAt: string;
  customer: CustomerDetails;
  items: {
    id: string;
    title: string;
    quantity: number;
    price: number;
  }[];
  certificateNumber: string;
  message?: string;
  verificationSource?: 'paystack_api' | 'verified_simulation';
  channel?: string; // payment channel used e.g. card, mobile_money, bank_transfer
}
