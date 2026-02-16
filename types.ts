
export enum OrderStatus {
  PENDING = 'Pending',
  PACKED = 'Packed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  discountPrice?: number;
  // Added oldPrice to match usage in components and mock data
  oldPrice?: number;
  stock: number;
  brand: string;
  tags: string[];
  images: string[];
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  deliveryCharge: number;
  status: 'Active' | 'Out of Stock';
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Admin';
  profileImage?: string;
  mobile?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  type: 'Home' | 'Work';
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  discount: number;
  shippingFee: number;
  status: OrderStatus;
  paymentStatus: 'Paid' | 'Unpaid';
  paymentMethod: string;
  addressId: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  expiryDate: string;
}
