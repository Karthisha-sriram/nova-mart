import {
  Product,
  Category,
  CartData,
  Order,
  WishlistItem,
  AdminStats,
  TestingStatusItem,
  Review
} from '../types';

function getSessionId(): string {
  let sid = localStorage.getItem('novamart_session_id');
  if (!sid) {
    sid = 'novasess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('novamart_session_id', sid);
  }
  return sid;
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('novamart_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-session-id': getSessionId()
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    const message = data?.error?.message || 'An error occurred during request execution';
    throw new Error(message);
  }
  return data;
}

export const api = {
  // Products
  async getProducts(params: Record<string, any> = {}): Promise<{
    products: Product[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const res = await fetch(`/api/products?${query.toString()}`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async getProduct(idOrSlug: string | number): Promise<{ product: Product }> {
    const res = await fetch(`/api/products/${idOrSlug}`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    const res = await fetch('/api/categories', {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  // Cart
  async getCart(): Promise<{ cart: CartData }> {
    const res = await fetch('/api/cart', {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async addToCart(productId: number, quantity: number = 1): Promise<{ cart: CartData; message: string }> {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ productId, quantity })
    });
    return handleResponse(res);
  },

  async updateCartItem(itemId: number, quantity: number): Promise<{ cart: CartData }> {
    const res = await fetch(`/api/cart/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ quantity })
    });
    return handleResponse(res);
  },

  async removeCartItem(itemId: number): Promise<{ cart: CartData; message: string }> {
    const res = await fetch(`/api/cart/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  // Orders
  async createOrder(payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: string;
  }): Promise<{ order: Order; message: string }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async getOrders(): Promise<{ orders: Order[] }> {
    const res = await fetch('/api/orders', {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async getOrder(id: string): Promise<{ order: Order }> {
    const res = await fetch(`/api/orders/${id}`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  // Wishlist
  async getWishlist(): Promise<{ wishlist: WishlistItem[] }> {
    const res = await fetch('/api/wishlist', {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async addToWishlist(productId: number): Promise<{ message: string; productId: number }> {
    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ productId })
    });
    return handleResponse(res);
  },

  async removeFromWishlist(idOrProductId: number): Promise<{ message: string }> {
    const res = await fetch(`/api/wishlist/${idOrProductId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  // Reviews
  async getReviews(productId?: number): Promise<{ reviews: Review[] }> {
    const url = productId ? `/api/reviews?productId=${productId}` : '/api/reviews';
    const res = await fetch(url, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async addReview(payload: {
    productId: number;
    userName: string;
    rating: number;
    comment: string;
  }): Promise<{ review: Review; message: string }> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // Admin
  async getAdminStats(): Promise<{
    stats: AdminStats;
    lowStockProducts: any[];
    recentOrders: any[];
    salesByCategory: any[];
    testingStatus: TestingStatusItem[];
  }> {
    const res = await fetch('/api/admin/stats', {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async runAdminTests(): Promise<{
    summary: { totalExecuted: number; passed: number; failed: number; executionTime: string };
    results: Array<{ name: string; status: string; duration: string }>;
  }> {
    const res = await fetch('/api/admin/run-tests', {
      method: 'POST',
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  // Auth
  async login(email: string, password: string): Promise<any> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async register(fullName: string, email: string, password: string, phone?: string): Promise<any> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, phone })
    });
    return handleResponse(res);
  },

  async getCurrentUser(): Promise<any> {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  }
};
