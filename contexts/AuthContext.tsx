import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { tokenUtils, User } from '../services/api';

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = tokenUtils.getToken();
    if (token) {
      try {
        // Decode the JWT token to get user data
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          // Token is expired, clear it
          tokenUtils.removeToken();
          return;
        }
        
        // Set user data from token
        const userData = {
          id: tokenPayload.id,
          email: tokenPayload.email,
          username: tokenPayload.email?.split('@')[0] || 'user'
        };
        
        setIsAuthenticated(true);
        setUser(userData);
      } catch (error) {
        // Invalid token, clear it
        console.error('Invalid token:', error);
        tokenUtils.removeToken();
      }
    }
  }, []);

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    tokenUtils.removeToken();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
