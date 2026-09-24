import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Smartphone,
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../api/client';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, demoLogin } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced Search Suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get<string[]>(`/products/suggestions?query=${encodeURIComponent(searchQuery.trim())}`);
        setSuggestions(res.data);
      } catch (e) {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside search to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    setShowSuggestions(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/products?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/products?query=${encodeURIComponent(suggestion)}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-navy-900 text-white shadow-md">
      {/* Top Banner Bar */}
      <div className="bg-navy-800 text-slate-300 text-xs py-1.5 px-4 border-b border-navy-700/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Free Express Delivery across India on orders over ₹999</span>
          </div>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Quick Demo:</span>
                <button
                  type="button"
                  onClick={() => demoLogin('customer')}
                  className="text-[11px] font-semibold text-brand-orange hover:underline"
                >
                  Customer Demo
                </button>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={() => demoLogin('admin')}
                  className="text-[11px] font-semibold text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  <Sparkles className="w-3 h-3" />
                  Admin Demo
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Welcome, {user?.name.split(' ')[0]}</span>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider"
                  >
                    Admin Portal
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Mobile<span className="text-brand-orange">Hub</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                India's Smartphone Shop
              </span>
            </div>
          </Link>
        </div>

        {/* Global Live Search Bar */}
        <div ref={searchContainerRef} className="flex-1 max-w-xl relative hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search smartphones, iPhone 16, Samsung Galaxy, chargers..."
              className="w-full bg-navy-800 text-white placeholder-slate-400 text-sm pl-11 pr-24 py-2.5 rounded-full border border-navy-700 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand-orange hover:bg-brand-darkOrange text-white text-xs font-bold rounded-full transition-all"
            >
              Search
            </button>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
              <div className="p-2 border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4">
                Suggested Products
              </div>
              <ul className="py-1">
                {suggestions.map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-brand-blue transition"
                    >
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Navigation Actions: Wishlist, Cart, Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 text-slate-300 hover:text-white transition flex flex-col items-center"
            title="Wishlist"
          >
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-xs font-extrabold flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
            <span className="text-[10px] hidden lg:block font-medium mt-0.5">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-slate-300 hover:text-white transition flex flex-col items-center"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange text-white rounded-full text-xs font-extrabold flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            )}
            <span className="text-[10px] hidden lg:block font-medium mt-0.5">Cart</span>
          </Link>

          {/* User Account / Profile Dropdown */}
          <div className="relative">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-navy-800 transition text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-blue text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold leading-none text-white">{user?.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-400 leading-none mt-1">My Account</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                </button>

                {/* Profile Popup Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                      <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <div className="py-2 text-sm">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-blue-600 hover:bg-blue-50 font-bold"
                        >
                          <LayoutDashboard className="w-4 h-4 text-blue-600" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        My Orders
                      </Link>
                      <Link
                        to="/addresses"
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700"
                      >
                        <MapPin className="w-4 h-4 text-slate-400" />
                        Saved Addresses
                      </Link>
                    </div>

                    <div className="p-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-semibold transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop) */}
      <nav className="hidden md:block bg-navy-800/80 backdrop-blur-sm border-t border-navy-700/60 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium text-slate-300">
          <div className="flex items-center gap-6 py-2.5 overflow-x-auto scrollbar-none">
            <Link to="/products" className="hover:text-white font-bold text-brand-orange whitespace-nowrap">
              All Smartphones
            </Link>
            <Link to="/products?category=flagship-phones" className="hover:text-white whitespace-nowrap">
              Flagship Phones
            </Link>
            <Link to="/products?category=5g-phones" className="hover:text-white whitespace-nowrap">
              5G Phones
            </Link>
            <Link to="/products?category=foldable-phones" className="hover:text-white whitespace-nowrap">
              Foldable Phones
            </Link>
            <Link to="/products?category=budget-phones" className="hover:text-white whitespace-nowrap">
              Budget Phones
            </Link>
            <Link to="/products?category=tablets" className="hover:text-white whitespace-nowrap">
              Tablets
            </Link>
            <Link to="/products?category=smartwatches" className="hover:text-white whitespace-nowrap">
              Smartwatches
            </Link>
            <Link to="/products?category=audio-accessories" className="hover:text-white whitespace-nowrap">
              Audio & Accessories
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-4 text-[11px] text-slate-400">
            <Link to="/brands" className="hover:text-white">Top Brands</Link>
            <Link to="/contact" className="hover:text-white">Store Locator</Link>
            <Link to="/faq" className="hover:text-white">Support</Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-navy-900 border-t border-navy-800 px-4 pt-3 pb-6 animate-fade-in">
          {/* Mobile Search input */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phones, brands..."
                className="w-full bg-navy-800 text-white placeholder-slate-400 text-sm pl-10 pr-4 py-2 rounded-xl border border-navy-700"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          <div className="space-y-2 text-sm">
            <Link to="/products" className="block py-2 text-brand-orange font-bold">
              All Products
            </Link>
            <Link to="/products?category=flagship-phones" className="block py-2 text-slate-200">
              Flagship Phones
            </Link>
            <Link to="/products?category=5g-phones" className="block py-2 text-slate-200">
              5G Phones
            </Link>
            <Link to="/products?category=foldable-phones" className="block py-2 text-slate-200">
              Foldable Phones
            </Link>
            <Link to="/products?category=budget-phones" className="block py-2 text-slate-200">
              Budget Smartphones
            </Link>
            <Link to="/products?category=audio-accessories" className="block py-2 text-slate-200">
              Audio & Accessories
            </Link>
            <div className="border-t border-navy-800 pt-3 flex flex-col gap-2 text-xs text-slate-400">
              <Link to="/brands">Top Brands</Link>
              <Link to="/about">About MobileHub</Link>
              <Link to="/contact">Contact Support</Link>
              <Link to="/faq">Frequently Asked Questions</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
