import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '../types/auth';

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isLoading: boolean;
  
  // Acciones
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  updateUser: (userData: Partial<User>) => void;
  addCompanyToUser: (companyId: string) => void;
  removeCompanyFromUser: (companyId: string) => void;
  logout: () => void;
  initializeAuth: (token: string, user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        user: null,
        token: null,
        isLoading: true,

        // Acciones
        setUser: (user) => set({ user }, false, 'setUser'),
        
        setToken: (token) => set({ token }, false, 'setToken'),
        
        setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),

        updateUser: (userData) => 
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...userData } : null,
            }),
            false,
            'updateUser'
          ),

        addCompanyToUser: (companyId) =>
          set(
            (state) => ({
              user: state.user
                ? {
                    ...state.user,
                    companies: [...(state.user.companies || []), companyId],
                  }
                : null,
            }),
            false,
            'addCompanyToUser'
          ),

        removeCompanyFromUser: (companyId) =>
          set(
            (state) => ({
              user: state.user
                ? {
                    ...state.user,
                    companies: (state.user.companies || []).filter(
                      (id) => id !== companyId
                    ),
                  }
                : null,
            }),
            false,
            'removeCompanyFromUser'
          ),

        logout: () => 
          set(
            { user: null, token: null },
            false,
            'logout'
          ),

        initializeAuth: (token, user) =>
          set(
            { token, user, isLoading: false },
            false,
            'initializeAuth'
          ),
      }),
      {
        name: 'auth-storage', // nombre del localStorage
        partialize: (state) => ({ 
          token: state.token, 
          user: state.user 
        }), // solo persiste token y user
      }
    ),
    {
      name: 'auth-store', // nombre en DevTools
    }
  )
);

// Selectores útiles (para optimizar re-renders)
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useHasCompanies = () => 
  useAuthStore((state) => !!(state.user?.companies && state.user.companies.length > 0));
