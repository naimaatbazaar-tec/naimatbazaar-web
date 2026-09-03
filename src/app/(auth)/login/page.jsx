'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      // Call the login function from AuthContext
      const responseData = await login(
        formData.email.trim().toLowerCase(),
        formData.password
      );

      const loggedInUser = responseData?.user;

      // Smart role routing upon successful login submit
      if (redirectTo) {
        router.replace(redirectTo);
      } else if (loggedInUser?.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Login</h1>
          <p className="text-sm text-gray-500">Enter your account details to continue</p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl text-center"
          >
            {errorMsg}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] focus:border-[#5c0000] outline-none transition"
              placeholder="admin@naimatbazaar.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] focus:border-[#5c0000] outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#5c0000] text-white font-bold rounded-2xl hover:bg-[#420000] transition shadow-md disabled:bg-gray-400 mt-2 cursor-pointer"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <p className="text-center text-xs text-gray-600 font-medium">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#5c0000] font-bold underline hover:text-[#420000]">
            Register Here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}