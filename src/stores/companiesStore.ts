import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Company } from '../graphql';

interface CompaniesState {
  // Estado
  companies: Company[];
  activeCompanyId: string | null;
  isLoading: boolean;
  
  // Acciones
  setCompanies: (companies: Company[]) => void;
  addCompany: (company: Company) => void;
  updateCompany: (companyId: string, updates: Partial<Company>) => void;
  removeCompany: (companyId: string) => void;
  setActiveCompany: (companyId: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearCompanies: () => void;
  
  // Getters computados
  getActiveCompany: () => Company | null;
  getCompanyById: (id: string) => Company | null;
  getUserOwnedCompanies: (userId: string) => Company[];
  getUserMemberCompanies: (userId: string) => Company[];
}

export const useCompaniesStore = create<CompaniesState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        companies: [],
        activeCompanyId: null,
        isLoading: false,

        // Acciones básicas
        setCompanies: (companies) => 
          set({ companies }, false, 'setCompanies'),

        addCompany: (company) =>
          set(
            (state) => ({
              companies: [...state.companies, company],
              // Si es la primera empresa, la hacemos activa automáticamente
              activeCompanyId: state.companies.length === 0 ? company.id : state.activeCompanyId,
            }),
            false,
            'addCompany'
          ),

        updateCompany: (companyId, updates) =>
          set(
            (state) => ({
              companies: state.companies.map((company) =>
                company.id === companyId ? { ...company, ...updates } : company
              ),
            }),
            false,
            'updateCompany'
          ),

        removeCompany: (companyId) =>
          set(
            (state) => ({
              companies: state.companies.filter((company) => company.id !== companyId),
              // Si eliminamos la empresa activa, seleccionar la primera disponible
              activeCompanyId: 
                state.activeCompanyId === companyId 
                  ? state.companies.find(c => c.id !== companyId)?.id || null
                  : state.activeCompanyId,
            }),
            false,
            'removeCompany'
          ),

        setActiveCompany: (companyId) =>
          set({ activeCompanyId: companyId }, false, 'setActiveCompany'),

        setLoading: (isLoading) =>
          set({ isLoading }, false, 'setLoading'),

        clearCompanies: () =>
          set(
            { companies: [], activeCompanyId: null },
            false,
            'clearCompanies'
          ),

        // Getters computados
        getActiveCompany: () => {
          const state = get();
          return state.companies.find((company) => company.id === state.activeCompanyId) || null;
        },

        getCompanyById: (id) => {
          const state = get();
          return state.companies.find((company) => company.id === id) || null;
        },

        getUserOwnedCompanies: (userId) => {
          const state = get();
          return state.companies.filter((company) => company.owner?.id === userId);
        },

        getUserMemberCompanies: (userId) => {
          const state = get();
          return state.companies.filter((company) => 
            company.members.some((member) => member.id === userId) && company.owner?.id !== userId
          );
        },
      }),
      {
        name: 'companies-storage',
        partialize: (state) => ({ 
          activeCompanyId: state.activeCompanyId 
        }), // Solo persiste la empresa activa, las companies se cargan del servidor
      }
    ),
    {
      name: 'companies-store',
    }
  )
);

// Selectores útiles para optimizar re-renders
export const useCompaniesState = () => useCompaniesStore((state) => state.companies);
export const useActiveCompany = () => useCompaniesStore((state) => state.getActiveCompany());
export const useActiveCompanyId = () => useCompaniesStore((state) => state.activeCompanyId);
export const useCompaniesLoading = () => useCompaniesStore((state) => state.isLoading);

// Selector para dropdown - solo las companies necesarias
export const useUserCompaniesForDropdown = (userId: string) => 
  useCompaniesStore((state) => 
    state.companies.map(company => ({
      id: company.id,
      name: company.name,
      isOwner: company.owner?.id === userId,
      memberCount: company.members.length,
    }))
  );
