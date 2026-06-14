'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  walletAddress: string | null;
  theme: 'light' | 'dark';
  notifications: Array<{ id: string; message: string; type: string; date: string; read: boolean }>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  toggleTheme: () => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: UserRole, wallet: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; isNewUser?: boolean; email?: string; name?: string; error?: string }>;
  registerGoogleUser: (name: string, email: string, role: UserRole, wallet: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addNotification: (message: string, type?: string) => void;
  markNotificationsAsRead: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState<AuthContextType['notifications']>([]);

  const router = useRouter();

  // Load User Profile on Mount
  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user.walletAddress) {
          setWalletAddress(data.user.walletAddress);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(activeTheme);
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Load Wallet state if remembered
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }

    // Seed mock notifications
    setNotifications([
      {
        id: '1',
        message: 'Welcome to MediChain! Verify your identity to get started.',
        type: 'info',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      },
      {
        id: '2',
        message: 'Polygon Testnet contract active at 0x71C...392A.',
        type: 'success',
        date: '10 mins ago',
        read: false
      }
    ]);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const connectWallet = async () => {
    try {
      // Mock Polygon Metamask connect
      const mockAddress = '0x71C4B4E839878a7f9c41b1B7596E7614d1487595';
      setWalletAddress(mockAddress);
      localStorage.setItem('walletAddress', mockAddress);
      addNotification('MetaMask connected to Polygon Amoy Testnet!', 'success');
    } catch (err) {
      console.error('Wallet connection failed', err);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem('walletAddress');
    addNotification('Wallet disconnected.', 'info');
  };

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        if (data.user.walletAddress) {
          setWalletAddress(data.user.walletAddress);
        }

        // Log notification
        addNotification(`Logged in successfully as ${data.user.name}`, 'success');

        // Role-based redirection mapping
        const roleRedirects: Record<string, string> = {
          CITIZEN: '/citizen',
          DOCTOR: '/doctor',
          PHARMACY: '/pharmacy',
          REGULATOR: '/regulator',
        };

        const redirectPath = roleRedirects[data.user.role] || '/';
        router.push(redirectPath);
        router.refresh();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole, walletAddressVal: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          walletAddress: walletAddressVal || null,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        if (data.user.walletAddress) {
          setWalletAddress(data.user.walletAddress);
        }

        addNotification(`Registration successful! Welcome, ${data.user.name}`, 'success');

        const roleRedirects: Record<string, string> = {
          CITIZEN: '/citizen',
          DOCTOR: '/doctor',
          PHARMACY: '/pharmacy',
          REGULATOR: '/regulator',
        };

        const redirectPath = roleRedirects[data.user.role] || '/';
        router.push(redirectPath);
        router.refresh();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Signup failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await response.json();

      if (response.ok) {
        if (data.isNewUser) {
          // New user -> return so UI can prompt for role selection
          return { success: true, isNewUser: true, email: data.email, name: data.name };
        }

        // Existing user -> set local context states and navigate
        setUser(data.user);
        if (data.user.walletAddress) {
          setWalletAddress(data.user.walletAddress);
        }

        addNotification(`Logged in successfully via Google as ${data.user.name}`, 'success');

        const roleRedirects: Record<string, string> = {
          CITIZEN: '/citizen',
          DOCTOR: '/doctor',
          PHARMACY: '/pharmacy',
          REGULATOR: '/regulator',
        };

        const redirectPath = roleRedirects[data.user.role] || '/';
        router.push(redirectPath);
        router.refresh();
        return { success: true, isNewUser: false };
      } else {
        return { success: false, error: data.error || 'Google Login failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred during Google Auth' };
    } finally {
      setLoading(false);
    }
  };

  const registerGoogleUser = async (name: string, email: string, role: UserRole, walletAddressVal: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/google/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          role,
          walletAddress: walletAddressVal || null,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        if (data.user.walletAddress) {
          setWalletAddress(data.user.walletAddress);
        }

        addNotification(`Google registration completed successfully! Welcome, ${data.user.name}`, 'success');

        const roleRedirects: Record<string, string> = {
          CITIZEN: '/citizen',
          DOCTOR: '/doctor',
          PHARMACY: '/pharmacy',
          REGULATOR: '/regulator',
        };

        const redirectPath = roleRedirects[data.user.role] || '/';
        router.push(redirectPath);
        router.refresh();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Google Registration failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred during Google Registration' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setWalletAddress(null);
      localStorage.removeItem('walletAddress');
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (message: string, type: string = 'info') => {
    const newNotif = {
      id: Math.random().toString(),
      message,
      type,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        walletAddress,
        theme,
        notifications,
        connectWallet,
        disconnectWallet,
        toggleTheme,
        login,
        signup,
        loginWithGoogle,
        registerGoogleUser,
        logout,
        addNotification,
        markNotificationsAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>

  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
