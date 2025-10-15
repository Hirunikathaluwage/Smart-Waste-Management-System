import { createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../constants/storage';
import { ROLE_ROUTES } from '../constants/roles';

/**
 * AuthContext - Centralized authentication state management
 * Follows Single Responsibility Principle - only manages auth state
 * Follows Dependency Inversion - components depend on this abstraction
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage(STORAGE_KEYS.USER, null);
  const navigate = useNavigate();

  // Login function - stores user and navigates to appropriate dashboard
  const login = useCallback((userData) => {
    setUser(userData);
    const route = ROLE_ROUTES[userData.role] || '/';
    navigate(route);
  }, [setUser, navigate]);

  // Logout function - clears user data and navigates to sign in
  const logout = useCallback(() => {
    setUser(null);
    navigate('/signin');
  }, [setUser, navigate]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return user !== null;
  }, [user]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
// Follows Interface Segregation - provides clean API
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

