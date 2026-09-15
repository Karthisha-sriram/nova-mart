export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: 'customer' | 'admin';
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  icon_name?: string;
  product_count?: number;
}

export interface Review {
  id: number;
  product_id: number;
  user_id?: number;
  user_name: string;
  rating: number;
  comment: string;
  verified_purchase: number;
  created_at: string;
}

export interface Product {
  id: number;
  sku?: string;
  name: string;
  slug: string;
  description: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  price: number;
  discount_percent: number;
  discounted_price: number;
  stock: number;
  rating: number;
  review_count: number;
  image_url: string;
  additional_images?: string[];
  specifications?: Record<string, string>;
  featured: number;
  is_new: number;
  created_at?: string;
  reviews?: Review[];
  related?: Product[];
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  slug: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  quantity: number;
  stock: number;
  imageUrl: string;
  categoryName?: string;
  lineTotal: number;
}

export interface CartData {
  items: CartItem[];
  itemCount: number;
  originalTotal: number;
  subtotal: number;
  totalDiscount: number;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  freeShippingThreshold: number;
  freeShippingUnlocked: boolean;
  amountNeededForFreeShipping: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id?: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total_amount: number;
  order_status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  estimated_delivery: string;
  created_at: string;
  items?: OrderItem[];
}

export interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  slug: string;
  price: number;
  discountPercent: number;
  discountedPrice: number;
  stock: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  categoryName?: string;
  addedAt: string;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  failedTransactions: number;
  inventoryAlertCount: number;
}

export interface TestingStatusItem {
  id: string;
  name: string;
  status: string;
  passed: number;
  failed: number;
  duration: string;
  lastRun: string;
}
