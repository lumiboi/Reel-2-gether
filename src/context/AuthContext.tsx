// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Context'in tipini tanımlıyoruz
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Context'i oluşturuyoruz
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sağlayıcı (Provider) bileşenini oluşturuyoruz
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase'in kimlik durumu değişikliğini dinle
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Component kaldırıldığında dinleyiciyi temizle
    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Context'i kolayca kullanmak için özel bir hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};