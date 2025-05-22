import { createContext } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserData: (userData: { user: User; token: string }) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
