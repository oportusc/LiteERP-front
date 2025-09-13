import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, LoginRequest, RegisterRequest } from '../types/auth';
import { graphqlService } from '../services/graphqlService';
import { useAuthStore, useUser, useToken, useIsLoading, useHasCompanies } from '../stores/authStore';
import { useCompaniesStore } from '../stores/companiesStore';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { 
    setUser, 
    setToken, 
    setLoading, 
    logout: zustandLogout, 
    initializeAuth 
  } = useAuthStore();
  
  const { setCompanies, setActiveCompany } = useCompaniesStore();

  useEffect(() => {
    const initializeAuthAsync = async () => {
      const storedToken = localStorage.getItem('auth-storage');
      
      if (storedToken) {
        try {
          const authData = JSON.parse(storedToken);
          if (authData.state?.token && authData.state?.user) {
            // Restaurar estado desde localStorage
            setToken(authData.state.token);
            setUser(authData.state.user);
            
            // Verificar si el token sigue siendo válido y obtener datos actualizados con empresas
            try {
              const { user: updatedUser, companies } = await graphqlService.getProfileWithCompanies();
              
              // Actualizar el usuario con los datos más recientes del backend
              setUser(updatedUser);
              
              // 🏢 Cargar empresas en el store de companies
              if (companies && companies.length > 0) {
                setCompanies(companies);
                // Seleccionar la primera empresa como activa si no hay ninguna seleccionada
                setActiveCompany(companies[0].id);
              }
            } catch (error) {
              console.error('Error loading profile with companies, falling back to basic profile:', error);
              // Fallback al método básico si falla
              const updatedUser = await graphqlService.getProfile();
              setUser(updatedUser);
            }
          }
        } catch (error) {
          console.error('Error al inicializar auth:', error);
          // Token inválido, limpiar storage
          zustandLogout();
        }
      }
      setLoading(false);
    };

    initializeAuthAsync();
  }, [setUser, setToken, setLoading, zustandLogout, setCompanies, setActiveCompany]);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await graphqlService.login(credentials);
      const { access_token, user: userData } = response;

      
      // Inicializar auth básico primero
      initializeAuth(access_token, userData);
      
      // 🏢 Cargar empresas completas después del login si el usuario tiene empresas
      if (userData.companies && userData.companies.length > 0) {
        try {
          // Pequeña pausa para asegurar que el token se persista antes de la próxima llamada
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const { companies } = await graphqlService.getProfileWithCompanies();
          
          if (companies && companies.length > 0) {
            setCompanies(companies);
            setActiveCompany(companies[0].id);
          }
        } catch (error) {
          console.error('Error loading companies after login:', error);
          // No lanzar error, continuar con el login básico
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await graphqlService.register(userData);
      const { access_token, user: newUser } = response;

      initializeAuth(access_token, newUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    zustandLogout();
  };

  // Usar los selectores de Zustand
  const user = useUser();
  const token = useToken();
  const isLoading = useIsLoading();
  const hasCompanies = useHasCompanies();

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    hasCompanies: () => hasCompanies,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
