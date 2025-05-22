import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loginUser, logoutUser } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserData: (userData: { user: User; token: string }) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const setUserData = (userData: { user: User; token: string }) => {
    setUser(userData.user);
    setToken(userData.token);
    setIsAuthenticated(true);

    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('token', userData.token);
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await loginUser(email, password);
      setUserData({ user: data.user, token: data.token });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    setUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
