'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GoogleAuthButton() {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError('');
        // Sends the Google access token to your backend auth handler
        await googleLogin(tokenResponse.access_token);
        router.push('/checkout');
      } catch (err) {
        setError(err.response?.data?.message || 'Google authentication failed.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google Sign-In popup was closed or unsuccessful.');
    },
  });

  return (
    <div className="w-full">
      <button
        type="button"
        disabled={loading}
        onClick={() => login()}
        className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-200 rounded-2xl shadow-sm text-xs font-extrabold text-gray-700 hover:bg-gray-50 transition"
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.14C3.15 21.32 7.22 24 12 24z"/>
          <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.62H1.18C.43 8.15 0 9.89 0 12s.43 3.85 1.18 5.38l4.09-3.14z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.15 2.68 1.18 6.62l4.09 3.14c.95-2.85 3.6-4.96 6.73-4.96z"/>
        </svg>
        {loading ? 'Authenticating...' : 'Continue with Google'}
      </button>
      {error && <p className="text-red-500 text-[10px] text-center mt-2 font-bold">{error}</p>}
    </div>
  );
}