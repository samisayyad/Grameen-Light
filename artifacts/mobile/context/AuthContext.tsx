import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type UserRole = 'villager' | 'admin' | 'worker';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  village: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Omit<User, 'id'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USERS: (User & { password: string })[] = [
  {
    id: 'u1', name: 'Ramesh Kumar', email: 'villager@demo.com', password: 'demo123',
    phone: '9876543210', role: 'villager', village: 'Kalhalli Village',
  },
  {
    id: 'u2', name: 'Sarpanch Mohan', email: 'admin@demo.com', password: 'demo123',
    phone: '9876543211', role: 'admin', village: 'Kalhalli Village',
  },
  {
    id: 'u3', name: 'Suresh Electrician', email: 'worker@demo.com', password: 'demo123',
    phone: '9876543212', role: 'worker', village: 'Kalhalli Village',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('grameen_user').then((raw) => {
      if (raw) {
        try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
      }
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) return { success: false, error: 'Invalid email or password' };
    const { password: _pw, ...userData } = found;
    await AsyncStorage.setItem('grameen_user', JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  }, []);

  const register = useCallback(async (data: Omit<User, 'id'> & { password: string }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const { password: _pw, ...userData } = { ...data, id };
    await AsyncStorage.setItem('grameen_user', JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('grameen_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
