import { useAuthStore, useUser, useToken, useIsLoading, useHasCompanies } from '../stores/authStore';
import { graphqlService } from '../services/graphqlService';
import type { LoginRequest, RegisterRequest } from '../types/auth';

/**
 * Hook personalizado que combina Zustand con lógica de autenticación
 * Esta es una alternativa más directa al AuthContext si prefieres usar solo Zustand
 */
export const useDirectAuth = () => {
  const { 
    setUser, 
    setToken, 
    setLoading, 
    logout: zustandLogout, 
    initializeAuth,
    addCompanyToUser,
    removeCompanyFromUser,
    updateUser
  } = useAuthStore();

  const user = useUser();
  const token = useToken();
  const isLoading = useIsLoading();
  const hasCompanies = useHasCompanies();

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await graphqlService.login(credentials);
      const { access_token, user: userData } = response;
      initializeAuth(access_token, userData);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      const response = await graphqlService.register(userData);
      const { access_token, user: newUser } = response;
      initializeAuth(access_token, newUser);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    zustandLogout();
  };

  const refreshUserProfile = async () => {
    try {
      const updatedUser = await graphqlService.getProfile();
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      // Si falla, podría ser token expirado
      logout();
      throw error;
    }
  };

  return {
    // Estado
    user,
    token,
    isLoading,
    hasCompanies,
    
    // Acciones de autenticación
    login,
    register,
    logout,
    
    // Acciones de usuario
    updateUser,
    addCompanyToUser,
    removeCompanyFromUser,
    refreshUserProfile,
  };
};

/**
 * Selectores específicos para optimizar re-renders
 */
export const useUserCompanies = () => useUser()?.companies || [];
export const useUserRole = () => useUser()?.role;
export const useUserName = () => useUser()?.name;
export const useUserEmail = () => useUser()?.email;
