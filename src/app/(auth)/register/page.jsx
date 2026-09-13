'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      router.push('/checkout');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-200">
        
        <div className="text-center space-y-2 mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
            Naimat Bazaar | Har Dana Shifa Ka Khazana
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-2">Create Account</h2>
          <p className="text-xs text-gray-500">Sign up to complete your checkout and manage orders.</p>
        </div>

        <GoogleAuthButton />

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-3 text-xs font-semibold text-gray-400 uppercase">Or continue with email</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {error && <p className="text-red-500 text-xs font-bold mb-4 text-center bg-red-50 p-2.5 rounded-xl border border-red-100">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5c0000] text-gray-900 font-medium transition"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5c0000] text-gray-900 font-medium transition"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5c0000] text-gray-900 font-medium transition"
              placeholder="03XXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 pr-10 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5c0000] text-gray-900 font-medium transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#5c0000] text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl hover:bg-[#420000] transition shadow-md flex items-center justify-center mt-2"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-[#5c0000] font-extrabold hover:underline">
            Login Here
          </Link>
        </p>

      </div>
    </div>
  );
}