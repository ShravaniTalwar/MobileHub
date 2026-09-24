import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const CustomerLayout: React.FC = () => {
  const location = useLocation();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      <Footer />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 shadow-lg flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-brand-blue font-bold' : 'text-slate-500'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>

        <Link
          to="/products"
          className={`flex flex-col items-center gap-1 ${isActive('/products') ? 'text-brand-blue font-bold' : 'text-slate-500'}`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </Link>

        <Link
          to="/wishlist"
          className={`flex flex-col items-center gap-1 relative ${isActive('/wishlist') ? 'text-brand-blue font-bold' : 'text-slate-500'}`}
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px]">Wishlist</span>
        </Link>

        <Link
          to="/cart"
          className={`flex flex-col items-center gap-1 relative ${isActive('/cart') ? 'text-brand-blue font-bold' : 'text-slate-500'}`}
        >
          <ShoppingBag className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 right-2 w-4 h-4 bg-brand-orange text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="text-[10px]">Cart</span>
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-brand-blue font-bold' : 'text-slate-500'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </Link>
      </nav>
    </div>
  );
};
