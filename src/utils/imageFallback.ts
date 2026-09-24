// SVG Data URIs for offline/fallback resilient graphics

export const FALLBACK_PHONE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="100%" stop-color="%231e293b"/></linearGradient><linearGradient id="screen" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%232563eb"/><stop offset="50%" stop-color="%234f46e5"/><stop offset="100%" stop-color="%237c3aed"/></linearGradient><linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.3"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></linearGradient></defs><rect width="400" height="500" fill="%23f8fafc" rx="24"/><rect x="80" y="30" width="240" height="440" rx="36" fill="%230f172a" stroke="%23334155" stroke-width="4"/><rect x="90" y="42" width="220" height="416" rx="28" fill="url(%23screen)"/><rect x="90" y="42" width="220" height="200" rx="28" fill="url(%23shine)"/><rect x="160" y="52" width="80" height="18" rx="9" fill="%23000000"/><circle cx="225" cy="61" r="4" fill="%231e293b"/><circle cx="175" cy="61" r="3" fill="%230284c7"/><g transform="translate(160, 200)" fill="white" opacity="0.9"><path d="M40 0 C17.9 0 0 17.9 0 40 C0 62.1 17.9 80 40 80 C62.1 80 80 62.1 80 40 C80 17.9 62.1 0 40 0 Z M40 12 C55.5 12 68 24.5 68 40 C68 55.5 55.5 68 40 68 C24.5 68 12 55.5 12 40 C12 24.5 24.5 12 40 12 Z" fill-opacity="0.2"/><path d="M35 25 L55 40 L35 55 Z" fill="white"/></g><text x="200" y="340" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="16" font-weight="700" fill="white" text-anchor="middle" letter-spacing="1">5G SMARTPHONE</text><text x="200" y="365" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" fill="%2393c5fd" text-anchor="middle">Flagship MobileHub Edition</text><rect x="160" y="446" width="80" height="4" rx="2" fill="%23ffffff" opacity="0.6"/></svg>`;

export const FALLBACK_ACCESSORY_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%"><defs><linearGradient id="accBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f1f5f9"/><stop offset="100%" stop-color="%23e2e8f0"/></linearGradient><linearGradient id="pod" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ffffff"/><stop offset="100%" stop-color="%23cbd5e1"/></linearGradient></defs><rect width="400" height="500" fill="url(%23accBg)" rx="24"/><ellipse cx="200" cy="240" rx="90" ry="70" fill="url(%23pod)" stroke="%2394a3b8" stroke-width="3"/><ellipse cx="200" cy="225" rx="80" ry="25" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="1.5"/><circle cx="200" cy="255" r="4" fill="%2322c55e"/><text x="200" y="370" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="16" font-weight="700" fill="%231e293b" text-anchor="middle" letter-spacing="1">PREMIUM ACCESSORY</text><text x="200" y="395" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">MobileHub Verified Hardware</text></svg>`;

export const FALLBACK_BANNER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 480" width="100%" height="100%"><defs><linearGradient id="ban" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="50%" stop-color="%231e1b4b"/><stop offset="100%" stop-color="%230284c7"/></linearGradient></defs><rect width="1200" height="480" fill="url(%23ban)"/><text x="200" y="220" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="48" font-weight="800" fill="white">MobileHub Flagship Store</text><text x="200" y="270" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="22" fill="%2338bdf8">Latest 5G Smartphones, Tablets &amp; Genuine Accessories</text></svg>`;

export const FALLBACK_BRAND_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%"><rect width="200" height="200" fill="%23f8fafc" rx="20"/><circle cx="100" cy="100" r="50" fill="%232563eb" opacity="0.1"/><text x="100" y="108" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="28" font-weight="800" fill="%231e293b" text-anchor="middle">MH</text></svg>`;

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackType: 'phone' | 'accessory' | 'banner' | 'brand' = 'phone'
) => {
  const target = e.currentTarget;
  target.onerror = null; // Prevent loop
  if (fallbackType === 'accessory') {
    target.src = FALLBACK_ACCESSORY_SVG;
  } else if (fallbackType === 'banner') {
    target.src = FALLBACK_BANNER_SVG;
  } else if (fallbackType === 'brand') {
    target.src = FALLBACK_BRAND_SVG;
  } else {
    target.src = FALLBACK_PHONE_SVG;
  }
};
