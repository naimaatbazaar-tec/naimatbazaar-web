'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function GoogleAuthButton() {
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            await loginWithGoogle(response.credential);
          } catch (err) {
            console.error('Google Auth Error:', err);
          }
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }, [loginWithGoogle]);

  return <div id="google-btn" className="w-full flex justify-center my-2" />;
}