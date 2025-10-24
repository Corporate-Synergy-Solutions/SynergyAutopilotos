import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';
import { mockUser, mockUsers } from './mockData';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: any) => Promise<void>;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // In production, fetch from API
          // const response = await api.getMe();
          // setUser(response.data);
          
          // For demo, restore user based on stored email
          const storedEmail = localStorage.getItem('user_email');
          let selectedUser = mockUser;
          
          if (storedEmail === 'tech@company.com') {
            selectedUser = mockUsers.technician;
          } else if (storedEmail === 'sysadmin@autopilot.com') {
            selectedUser = mockUsers.system_admin;
          } else if (storedEmail === 'admin@company.com') {
            selectedUser = mockUsers.company_admin;
          }
          
          setUser(selectedUser);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_email');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In production, use real API
      // const response = await api.login(email, password);
      // localStorage.setItem('auth_token', response.data.token);
      // setUser(response.data.user);

      // For demo, simulate login with different user roles
      if (email && password) {
        localStorage.setItem('auth_token', 'demo_token_' + Date.now());
        
        // Select user based on email
        let selectedUser = mockUser;
        if (email === 'tech@company.com') {
          selectedUser = mockUsers.technician;
        } else if (email === 'sysadmin@autopilot.com') {
          selectedUser = mockUsers.system_admin;
        } else if (email === 'admin@company.com') {
          selectedUser = mockUsers.company_admin;
        }
        
        // Store the user role in localStorage for session persistence
        localStorage.setItem('user_email', email);
        setUser(selectedUser);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    setUser(null);
  };

  const signup = async (userData: any) => {
    try {
      // In production, use real API
      // const response = await api.signup(userData);
      // localStorage.setItem('auth_token', response.data.token);
      // setUser(response.data.user);

      // For demo
      localStorage.setItem('auth_token', 'demo_token_' + Date.now());
      setUser(mockUser);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isLoading, hasPermission }}>
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
