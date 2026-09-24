import api from './client';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User, 
  Product, 
  Category, 
  Brand, 
  Cart, 
  Wishlist, 
  Address, 
  Order, 
  OrderRequest, 
  Review, 
  Coupon, 
  Banner, 
  PaginatedResponse,
  DashboardStats 
} from '../types';

// ==================== AUTH SERVICE ====================
export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },
  getCurrentUser: async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.put<User>('/users/profile', data);
    return res.data;
  },
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.post('/users/change-password', data);
  }
};

// ==================== PRODUCT SERVICE ====================
export const productService = {
  getProducts: async (params?: {
    page?: number;
    size?: number;
    categoryId?: number;
    brandId?: number;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    is5G?: boolean;
    sortBy?: string;
    direction?: string;
  }): Promise<PaginatedResponse<Product>> => {
    const res = await api.get<PaginatedResponse<Product>>('/products', { params });
    return res.data;
  },
  getProductById: async (id: number): Promise<Product> => {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
  },
  getProductBySlug: async (slug: string): Promise<Product> => {
    const res = await api.get<Product>(`/products/slug/${slug}`);
    return res.data;
  },
  searchProducts: async (query: string, page = 0, size = 12): Promise<PaginatedResponse<Product>> => {
    const res = await api.get<PaginatedResponse<Product>>('/products/search', {
      params: { query, page, size }
    });
    return res.data;
  },
  getFeaturedProducts: async (): Promise<Product[]> => {
    const res = await api.get<Product[]>('/products/featured');
    return res.data;
  },
  getNewArrivals: async (): Promise<Product[]> => {
    const res = await api.get<Product[]>('/products/new-arrivals');
    return res.data;
  },
  getBestSellers: async (): Promise<Product[]> => {
    const res = await api.get<Product[]>('/products/best-sellers');
    return res.data;
  },
  getRelatedProducts: async (id: number): Promise<Product[]> => {
    const res = await api.get<Product[]>(`/products/${id}/related`);
    return res.data;
  }
};

// ==================== CATEGORY & BRAND SERVICE ====================
export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get<Category[]>('/categories');
    return res.data;
  },
  getById: async (id: number): Promise<Category> => {
    const res = await api.get<Category>(`/categories/${id}`);
    return res.data;
  }
};

export const brandService = {
  getAll: async (): Promise<Brand[]> => {
    const res = await api.get<Brand[]>('/brands');
    return res.data;
  },
  getById: async (id: number): Promise<Brand> => {
    const res = await api.get<Brand>(`/brands/${id}`);
    return res.data;
  }
};

// ==================== CART SERVICE ====================
export const cartService = {
  getCart: async (): Promise<Cart> => {
    const res = await api.get<Cart>('/cart');
    return res.data;
  },
  addItem: async (productId: number, quantity: number): Promise<Cart> => {
    const res = await api.post<Cart>('/cart/items', { productId, quantity });
    return res.data;
  },
  updateQuantity: async (itemId: number, quantity: number): Promise<Cart> => {
    const res = await api.put<Cart>(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },
  removeItem: async (itemId: number): Promise<Cart> => {
    const res = await api.delete<Cart>(`/cart/items/${itemId}`);
    return res.data;
  },
  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  }
};

// ==================== WISHLIST SERVICE ====================
export const wishlistService = {
  getWishlist: async (): Promise<Wishlist> => {
    const res = await api.get<Wishlist>('/wishlist');
    return res.data;
  },
  addItem: async (productId: number): Promise<Wishlist> => {
    const res = await api.post<Wishlist>(`/wishlist/items/${productId}`);
    return res.data;
  },
  removeItem: async (productId: number): Promise<Wishlist> => {
    const res = await api.delete<Wishlist>(`/wishlist/items/${productId}`);
    return res.data;
  },
  clearWishlist: async (): Promise<void> => {
    await api.delete('/wishlist');
  }
};

// ==================== ADDRESS SERVICE ====================
export const addressService = {
  getAll: async (): Promise<Address[]> => {
    const res = await api.get<Address[]>('/addresses');
    return res.data;
  },
  create: async (data: Omit<Address, 'id'>): Promise<Address> => {
    const res = await api.post<Address>('/addresses', data);
    return res.data;
  },
  update: async (id: number, data: Partial<Address>): Promise<Address> => {
    const res = await api.put<Address>(`/addresses/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },
  setDefault: async (id: number): Promise<void> => {
    await api.patch(`/addresses/${id}/default`);
  }
};

// ==================== ORDER SERVICE ====================
export const orderService = {
  createOrder: async (data: OrderRequest): Promise<Order> => {
    const res = await api.post<Order>('/orders', data);
    return res.data;
  },
  getMyOrders: async (page = 0, size = 10): Promise<PaginatedResponse<Order>> => {
    const res = await api.get<PaginatedResponse<Order>>('/orders/my-orders', { params: { page, size } });
    return res.data;
  },
  getOrderById: async (id: number): Promise<Order> => {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
  },
  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const res = await api.get<Order>(`/orders/number/${orderNumber}`);
    return res.data;
  },
  cancelOrder: async (id: number, reason: string): Promise<Order> => {
    const res = await api.post<Order>(`/orders/${id}/cancel`, { reason });
    return res.data;
  }
};

// ==================== PAYMENT SERVICE ====================
export const paymentService = {
  processPayment: async (orderId: number, paymentMethod: string, transactionId?: string): Promise<any> => {
    const res = await api.post('/payments/process', {
      orderId,
      paymentMethod,
      transactionId: transactionId || `TXN_${Date.now()}`
    });
    return res.data;
  }
};

// ==================== REVIEW SERVICE ====================
export const reviewService = {
  getProductReviews: async (productId: number, page = 0, size = 10): Promise<PaginatedResponse<Review>> => {
    const res = await api.get<PaginatedResponse<Review>>(`/reviews/product/${productId}`, {
      params: { page, size }
    });
    return res.data;
  },
  addReview: async (productId: number, data: { rating: number; title: string; comment: string }): Promise<Review> => {
    const res = await api.post<Review>(`/reviews/product/${productId}`, data);
    return res.data;
  }
};

// ==================== COUPON SERVICE ====================
export const couponService = {
  validateCoupon: async (code: string, cartTotal: number): Promise<Coupon> => {
    const res = await api.post<Coupon>('/coupons/validate', { code, cartTotal });
    return res.data;
  },
  getAllActive: async (): Promise<Coupon[]> => {
    const res = await api.get<Coupon[]>('/coupons/active');
    return res.data;
  }
};

// ==================== BANNER SERVICE ====================
export const bannerService = {
  getActiveBanners: async (): Promise<Banner[]> => {
    const res = await api.get<Banner[]>('/banners/active');
    return res.data;
  }
};

// ==================== ENQUIRY SERVICE ====================
export const enquiryService = {
  submit: async (data: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<any> => {
    const res = await api.post('/enquiries', data);
    return res.data;
  }
};

// ==================== ADMIN SERVICE ====================
export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await api.get<DashboardStats>('/admin/dashboard/stats');
    return res.data;
  },
  // Orders
  getAllOrders: async (params?: { page?: number; size?: number; status?: string; search?: string }): Promise<PaginatedResponse<Order>> => {
    const res = await api.get<PaginatedResponse<Order>>('/admin/orders', { params });
    return res.data;
  },
  updateOrderStatus: async (orderId: number, status: string, trackingNumber?: string): Promise<Order> => {
    const res = await api.patch<Order>(`/admin/orders/${orderId}/status`, { status, trackingNumber });
    return res.data;
  },
  // Products
  getAllProducts: async (params?: { page?: number; size?: number; search?: string; categoryId?: number; brandId?: number }): Promise<PaginatedResponse<Product>> => {
    const res = await api.get<PaginatedResponse<Product>>('/admin/products', { params });
    return res.data;
  },
  createProduct: async (productData: any): Promise<Product> => {
    const res = await api.post<Product>('/admin/products', productData);
    return res.data;
  },
  updateProduct: async (id: number, productData: any): Promise<Product> => {
    const res = await api.put<Product>(`/admin/products/${id}`, productData);
    return res.data;
  },
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },
  // Inventory
  getInventory: async (params?: { page?: number; size?: number; lowStock?: boolean }): Promise<any> => {
    const res = await api.get('/admin/inventory', { params });
    return res.data;
  },
  updateStock: async (productId: number, quantity: number, lowStockThreshold?: number): Promise<any> => {
    const res = await api.patch(`/admin/inventory/${productId}`, { quantity, lowStockThreshold });
    return res.data;
  },
  // Categories
  createCategory: async (data: any): Promise<Category> => {
    const res = await api.post<Category>('/admin/categories', data);
    return res.data;
  },
  updateCategory: async (id: number, data: any): Promise<Category> => {
    const res = await api.put<Category>(`/admin/categories/${id}`, data);
    return res.data;
  },
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },
  // Brands
  createBrand: async (data: any): Promise<Brand> => {
    const res = await api.post<Brand>('/admin/brands', data);
    return res.data;
  },
  updateBrand: async (id: number, data: any): Promise<Brand> => {
    const res = await api.put<Brand>(`/admin/brands/${id}`, data);
    return res.data;
  },
  deleteBrand: async (id: number): Promise<void> => {
    await api.delete(`/admin/brands/${id}`);
  },
  // Customers
  getAllCustomers: async (params?: { page?: number; size?: number; search?: string }): Promise<PaginatedResponse<User>> => {
    const res = await api.get<PaginatedResponse<User>>('/admin/customers', { params });
    return res.data;
  },
  toggleCustomerStatus: async (userId: number, enabled: boolean): Promise<User> => {
    const res = await api.patch<User>(`/admin/customers/${userId}/status`, { enabled });
    return res.data;
  },
  // Reviews
  getAllReviews: async (params?: { page?: number; size?: number; status?: string }): Promise<PaginatedResponse<Review>> => {
    const res = await api.get<PaginatedResponse<Review>>('/admin/reviews', { params });
    return res.data;
  },
  moderateReview: async (reviewId: number, status: 'APPROVED' | 'REJECTED'): Promise<Review> => {
    const res = await api.patch<Review>(`/admin/reviews/${reviewId}/status`, { status });
    return res.data;
  },
  deleteReview: async (reviewId: number): Promise<void> => {
    await api.delete(`/admin/reviews/${reviewId}`);
  },
  // Coupons
  getAllCoupons: async (): Promise<Coupon[]> => {
    const res = await api.get<Coupon[]>('/admin/coupons');
    return res.data;
  },
  createCoupon: async (data: any): Promise<Coupon> => {
    const res = await api.post<Coupon>('/admin/coupons', data);
    return res.data;
  },
  deleteCoupon: async (id: number): Promise<void> => {
    await api.delete(`/admin/coupons/${id}`);
  },
  // Banners
  getAllBanners: async (): Promise<Banner[]> => {
    const res = await api.get<Banner[]>('/admin/banners');
    return res.data;
  },
  createBanner: async (data: any): Promise<Banner> => {
    const res = await api.post<Banner>('/admin/banners', data);
    return res.data;
  },
  deleteBanner: async (id: number): Promise<void> => {
    await api.delete(`/admin/banners/${id}`);
  }
};
