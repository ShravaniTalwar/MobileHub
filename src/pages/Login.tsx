import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Smartphone, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      showToast('Logged in successfully! Welcome back.', 'success');
      navigate(redirectPath);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid credentials. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'customer' | 'admin') => {
    setLoading(true);
    try {
      await demoLogin(role);
      showToast(`Logged in as ${role === 'admin' ? 'Administrator' : 'Customer'}!`, 'success');
      navigate(role === 'admin' ? '/admin' : redirectPath);
    } catch (err: any) {
      showToast('Demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <Smartphone className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Sign in to MobileHub</h2>
          <p className="text-xs text-gray-500 mt-1">Access orders, wishlist, saved addresses & exclusive offers</p>
        </div>

        {/* 1-Click Quick Demo Sign-ins */}
        <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
          <span className="text-[11px] font-bold text-blue-900 block uppercase tracking-wider mb-2 text-center">
            ⚡ Quick 1-Click Demo Login
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('customer')}
              className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold py-2 px-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-2 px-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700 uppercase">Password</label>
              <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition shadow flex items-center justify-center gap-2 text-sm"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to={`/register?redirect=${encodeURIComponent(redirectPath)}`} className="text-blue-600 font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
