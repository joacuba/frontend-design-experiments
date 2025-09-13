import { useState, useEffect } from 'react';
import { User, LoginCredentials, AuthState } from '../types/auth';

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@inventorypro.com',
    name: 'John Admin',
    role: 'admin',
  },
  {
    id: '2',
    email: 'manager@inventorypro.com',
    name: 'Sarah Manager',
    role: 'manager',
  },
  {
    id: '3',
    email: 'demo@inventorypro.com',
    name: 'Demo User',
    role: 'employee',
  },
];

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored authentication on app load
    const storedUser = localStorage.getItem('inventoryUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem('inventoryUser');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication logic
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'User not found' };
    }

    // Simple password check (in real app, this would be handled securely on backend)
    if (credentials.password !== 'password123') {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Invalid password' };
    }

    // Store user in localStorage
    localStorage.setItem('inventoryUser', JSON.stringify(user));

    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('inventoryUser');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};