'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('nb_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse cached user:', err);
      }
    }
    setLoading(false);
  }, []);

  const persistAuth = ({ token, user }) => {
    localStorage.setItem('nb_token', token);
    localStorage.setItem('nb_user', JSON.stringify(user));
    setUser(user);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persistAuth(data.data);
    return data.data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persistAuth(data.data);
    return data.data;
  };

  const loginWithGoogle = async (idToken) => {
    const { data } = await api.post('/auth/google', { idToken });
    persistAuth(data.data);
    return data.data;
  };

  const logout = () => {
    localStorage.removeItem('nb_token');
    localStorage.removeItem('nb_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);