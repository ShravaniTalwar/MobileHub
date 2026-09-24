export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  active: boolean;
  roles: string[];
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  active: boolean;
  productCount?: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  websiteUrl?: string;
  active: boolean;
  productCount?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  originalPrice?: number;
  productImage?: string;
  addedAt?: string;
}

export interface Wishlist {
  id?: number;
  userId?: number;
  items: WishlistItem[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  brandId: number;
  brandName: string;
  brandSlug: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  featured?: boolean;
  isTrending: boolean;
  isLatest: boolean;
  newArrival?: boolean;
  is5g: boolean;
  is5G?: boolean;
  active?: boolean;
  ram?: string;
  storage?: string;
  color?: string;
  battery?: string;
  display?: string;
  screenSize?: string;
  resolution?: string;
  processor?: string;
  camera?: string;
  rearCamera?: string;
  frontCamera?: string;
  os?: string;
  operatingSystem?: string;
  warranty?: string;
  mainImageUrl: string;
  images: any[];
  createdAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productSku: string;
  productImageUrl: string;
  productImage?: string;
  price: number;
  originalPrice: number;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
  selectedRam?: string;
  subtotal: number;
  availableStock: number;
  stockQuantity?: number;
  inStock: boolean;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  productDiscount: number;
  couponCode?: string;
  couponDiscount: number;
  estimatedTax: number;
  shippingFee: number;
  grandTotal: number;
  totalAmount?: number;
  totalItems: number;
}

export interface Address {
  id?: number;
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
  addressType: 'HOME' | 'WORK' | 'OTHER' | string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  productImageUrl: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedColor?: string;
  selectedStorage?: string;
  selectedRam?: string;
}

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED';

export type PaymentMethod = 'COD' | 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'RAZORPAY';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  shippingFullName: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  customerNotes?: string;
  estimatedDeliveryDate?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface Review {
  id: number;
  productId: number;
  productName?: string;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
}

export interface Coupon {
  id: number;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  expiryDate?: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl: string;
  ctaText?: string;
  displayOrder: number;
  active: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  salesOverview: { date: string; sales: number; orders: number }[];
  ordersByStatus: Record<string, number>;
  topProducts: { productId: number; productName: string; unitsSold: number; totalRevenue: number }[];
  recentOrders: Order[];
}

export interface InventoryItem {
  id: number;
  product: Product;
  currentStock: number;
  lowStockThreshold: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  lastRestockedAt?: string;
  updatedAt?: string;
}

export interface Enquiry {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: string;
  createdAt?: string;
}

export interface CheckoutRequest {
  addressId?: number;
  newAddress?: Address;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  customerNotes?: string;
}

export type OrderRequest = CheckoutRequest;
export type PaginatedResponse<T> = PageResponse<T>;
