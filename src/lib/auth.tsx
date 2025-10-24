import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api, ApiUser } from './api'; // Import api instance and ApiUser type

// Define the User type based on ApiUser, adding any frontend-specific fields if needed
// Using ApiUser structure directly for simplicity for now
interface User extends ApiUser {
  // Add frontend-specific fields here if any, e.g., preferences
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Keep signup for potential future use, ensure userData matches API requirements
  signup: (userData: { name: string; email: string; password: string }) => Promise<void>;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading until auth check is done

  // Function to fetch user data using the stored token
  const fetchAndSetUser = useCallback(async () => {
      setIsLoading(true); // Set loading true when fetching user
      try {
          console.log("Fetching user data with stored token...");
          const userData = await api.getMe();
          console.log("User data fetched:", userData);
          // Combine first and last name if needed for display, or adjust UI
          const displayName = [userData.first_name, userData.last_name].filter(Boolean).join(' ') || userData.email;
          setUser({ ...userData, name: displayName }); // Adapt user data if needed
      } catch (error) {
          console.error('Failed to fetch user with token:', error);
          // If getMe fails (e.g., token expired/invalid), clear token and user state
          localStorage.removeItem('auth_token');
          setUser(null);
      } finally {
          setIsLoading(false); // Set loading false after fetching attempt
      }
  }, []); // No dependencies, it relies on token presence

  // Check authentication status on initial load
  useEffect(() => {
    console.log("AuthProvider mounted. Checking auth status...");
    const token = localStorage.getItem('auth_token');
    if (token) {
      console.log("Token found in localStorage. Fetching user...");
      fetchAndSetUser();
    } else {
      console.log("No token found. Setting isLoading to false.");
      setIsLoading(false); // No token, no user, stop loading
    }
    // fetchAndSetUser dependency is stable due to useCallback([])
  }, [fetchAndSetUser]);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login for:", email);
      const response = await api.login(email, password);
      console.log("Login successful, received token:", response.authToken);
      localStorage.setItem('auth_token', response.authToken);
      // After successful login and storing the token, fetch the user data
      await fetchAndSetUser(); // This will also set isLoading to false
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('auth_token'); // Clear token on login failure
      setUser(null);
      setIsLoading(false); // Stop loading on error
      throw error; // Re-throw error to be handled by the form
    }
  };

  // Logout function
  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem('auth_token');
    setUser(null);
    console.log("User logged out, state cleared.");
    // Optionally redirect user to login page here if using a router
  };

  // Signup function
  const signup = async (userData: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      console.log("Attempting signup for:", userData.email);
      // Use the name field as required by the signup endpoint spec
      const response = await api.signup(userData);
      console.log("Signup successful, received token:", response.authToken);
      localStorage.setItem('auth_token', response.authToken);
      // After successful signup and storing the token, fetch the user data
      await fetchAndSetUser(); // This will also set isLoading to false
    } catch (error) {
      console.error('Signup failed:', error);
      localStorage.removeItem('auth_token'); // Clear token on signup failure
      setUser(null);
      setIsLoading(false); // Stop loading on error
      throw error; // Re-throw error
    }
  };

  // Permission check function (adjust based on actual user object structure)
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    // Prioritize permissions array if it exists and is populated
    if (user.permissions && user.permissions.length > 0) {
        return user.permissions.includes(permission);
    }
    // Fallback: Check based on role if permissions array isn't available/used
    // This part needs specific logic based on how roles map to permissions
    if (user.role === 'system_admin') return true; // Example: system_admin has all permissions
    if (user.role === 'company_admin') {
      // Example: company_admin has most permissions except system-level ones
      return !permission.startsWith('system:');
    }
    if (user.role === 'technician') {
       // Example: technician has limited permissions
      return ['job:read', 'job:update', 'inventory:read'].includes(permission);
    }
    // Default deny
    return false;
  };

  // Provide the auth context value
  const value = {
      user,
      login,
      logout,
      signup,
      isLoading,
      hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
