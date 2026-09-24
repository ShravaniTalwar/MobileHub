import { 
  FALLBACK_BANNERS, 
  FALLBACK_CATEGORIES, 
  FALLBACK_BRANDS, 
  FALLBACK_PRODUCTS 
} from '../data/mockFallbackProducts';

// In-memory or localStorage backed mock API handler for standalone static hosting (Netlify/Vercel)
export function handleMockFallback(url: string, method: string = 'GET', data?: any): any {
  const cleanUrl = url.replace(/^\/api/, '').split('?')[0];
  const queryStr = url.includes('?') ? url.split('?')[1] : '';
  const searchParams = new URLSearchParams(queryStr);

  // 1. Banners
  if (cleanUrl === '/banners') {
    return FALLBACK_BANNERS;
  }

  // 2. Categories
  if (cleanUrl === '/categories') {
    return FALLBACK_CATEGORIES;
  }

  // 3. Brands
  if (cleanUrl === '/brands') {
    return FALLBACK_BRANDS;
  }

  // 4. Products Featured / Trending / Latest
  if (cleanUrl === '/products/featured') {
    return FALLBACK_PRODUCTS.filter(p => p.isFeatured);
  }
  if (cleanUrl === '/products/trending') {
    return FALLBACK_PRODUCTS.filter(p => p.isTrending);
  }
  if (cleanUrl === '/products/latest') {
    return FALLBACK_PRODUCTS.filter(p => p.isLatest);
  }

  // 5. Single Product by slug or id
  if (cleanUrl.startsWith('/products/slug/')) {
    const slug = cleanUrl.replace('/products/slug/', '');
    const found = FALLBACK_PRODUCTS.find(p => p.slug === slug || String(p.id) === slug);
    return found || FALLBACK_PRODUCTS[0];
  }
  if (cleanUrl.match(/^\/products\/\d+$/)) {
    const id = cleanUrl.replace('/products/', '');
    const found = FALLBACK_PRODUCTS.find(p => String(p.id) === id);
    return found || FALLBACK_PRODUCTS[0];
  }
  if (cleanUrl.match(/^\/products\/\d+\/related$/)) {
    return FALLBACK_PRODUCTS.slice(0, 4);
  }

  // 6. Products Catalog List
  if (cleanUrl === '/products') {
    let result = [...FALLBACK_PRODUCTS];
    const cat = searchParams.get('category');
    const brand = searchParams.get('brand');
    const query = searchParams.get('query') || searchParams.get('search');
    const is5g = searchParams.get('is5g');

    if (cat) result = result.filter(p => p.categorySlug === cat || String(p.categoryId) === cat);
    if (brand) result = result.filter(p => p.brandSlug === brand || String(p.brandId) === brand);
    if (query) result = result.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    if (is5g === 'true') result = result.filter(p => p.is5g);

    return {
      content: result,
      pageNumber: 0,
      pageSize: 12,
      totalElements: result.length,
      totalPages: 1,
      last: true,
    };
  }

  // 7. Reviews
  if (cleanUrl.startsWith('/reviews/product/')) {
    return [
      {
        id: 1,
        userName: 'Vikram Mehta',
        rating: 5,
        title: 'Outstanding flagship smartphone!',
        comment: 'Camera quality and battery backup are phenomenal. Delivered in 2 days with authentic warranty.',
        verifiedPurchase: true,
        createdAt: '2026-09-10T10:00:00Z',
      },
      {
        id: 2,
        userName: 'Pooja Iyer',
        rating: 5,
        title: 'Super smooth display and premium finish',
        comment: 'Best phone in this segment. The titanium finish looks and feels very premium.',
        verifiedPurchase: true,
        createdAt: '2026-09-15T14:30:00Z',
      },
    ];
  }

  // 8. Auth
  if (cleanUrl === '/auth/login' || cleanUrl === '/auth/register') {
    const isAdmin = data?.email?.includes('admin');
    return {
      token: 'demo-jwt-token-mobilehub-static-deployment',
      type: 'Bearer',
      id: isAdmin ? 1 : 2,
      name: isAdmin ? 'MobileHub Admin' : (data?.name || 'Rahul Sharma'),
      email: data?.email || 'customer@mobilehub.com',
      phone: data?.phone || '9812345678',
      roles: isAdmin ? ['ROLE_ADMIN', 'ROLE_CUSTOMER'] : ['ROLE_CUSTOMER'],
    };
  }

  if (cleanUrl === '/auth/me') {
    const stored = localStorage.getItem('mobilehub_user');
    if (stored) return JSON.parse(stored);
    return {
      id: 2,
      name: 'Rahul Sharma',
      email: 'customer@mobilehub.com',
      phone: '9812345678',
      roles: ['ROLE_CUSTOMER'],
      active: true,
    };
  }

  // 9. Cart
  if (cleanUrl.startsWith('/cart')) {
    const saved = localStorage.getItem('mobilehub_cart');
    let cart = saved ? JSON.parse(saved) : { items: [], subtotal: 0, productDiscount: 0, finalTotal: 0 };
    return cart;
  }

  // 10. Orders
  if (cleanUrl === '/orders' && method.toUpperCase() === 'POST') {
    const newOrder = {
      id: Math.floor(Math.random() * 90000) + 10000,
      orderNumber: 'MH-' + Math.floor(Math.random() * 9000000 + 1000000),
      totalAmount: data?.totalAmount || 74900,
      subtotal: data?.subtotal || 74900,
      status: 'CONFIRMED',
      paymentMethod: data?.paymentMethod || 'UPI',
      shippingAddress: data?.shippingAddress || { addressLine1: '402, Sunset Heights', city: 'Mumbai', state: 'Maharashtra', pincode: '400053' },
      items: data?.items || [],
      createdAt: new Date().toISOString(),
    };
    const savedOrders = JSON.parse(localStorage.getItem('mobilehub_orders') || '[]');
    savedOrders.unshift(newOrder);
    localStorage.setItem('mobilehub_orders', JSON.stringify(savedOrders));
    return newOrder;
  }

  if (cleanUrl === '/orders' || cleanUrl.startsWith('/orders/my') || cleanUrl.startsWith('/orders/user/')) {
    return JSON.parse(localStorage.getItem('mobilehub_orders') || '[]');
  }

  if (cleanUrl.startsWith('/orders/number/')) {
    const num = cleanUrl.replace('/orders/number/', '');
    const savedOrders = JSON.parse(localStorage.getItem('mobilehub_orders') || '[]');
    const found = savedOrders.find((o: any) => o.orderNumber === num);
    if (found) return found;
    return {
      id: 101,
      orderNumber: num,
      totalAmount: 144900,
      subtotal: 144900,
      status: 'CONFIRMED',
      paymentMethod: 'UPI',
      items: [
        {
          id: 1,
          productName: 'Apple iPhone 16 Pro Max (Desert Titanium, 256GB)',
          productImageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
          quantity: 1,
          unitPrice: 144900,
          totalPrice: 144900,
        },
      ],
      createdAt: new Date().toISOString(),
    };
  }

  // 11. Coupons
  if (cleanUrl.startsWith('/coupons/validate') || cleanUrl.startsWith('/coupons/code/')) {
    const code = searchParams.get('code') || cleanUrl.split('/').pop() || 'WELCOME10';
    return {
      id: 1,
      code: code.toUpperCase(),
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 1000,
      maxDiscountAmount: 2000,
      active: true,
    };
  }

  return [];
}
