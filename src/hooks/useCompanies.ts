import { useEffect, useCallback } from 'react';
import { 
  useCompaniesStore, 
  useActiveCompany, 
  useActiveCompanyId
} from '../stores/companiesStore';
import { useUser } from '../stores/authStore';
import { graphqlService } from '../services/graphqlService';

/**
 * Hook principal para manejar companies
 * Integra el store de Zustand con las queries de GraphQL
 */
export const useCompaniesWithGraphQL = () => {
  const user = useUser();
  const {
    companies,
    activeCompanyId,
    isLoading,
    setCompanies,
    addCompany,
    setActiveCompany,
    setLoading,
    clearCompanies,
    getActiveCompany,
    getCompanyById,
  } = useCompaniesStore();

  const loadUserCompanies = useCallback(async () => {
    if (!user || !user.companies || user.companies.length === 0) return;

    try {
      setLoading(true);
      
      // Crear companies mock basadas en user.companies (IDs)
      const mockCompanies = user.companies.map((companyId, index) => ({
        id: companyId,
        name: `Empresa ${index + 1}`, // Nombre temporal
        owner: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        members: [{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }],
        maxMembers: 10,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      
      setCompanies(mockCompanies);
      
      // Si no hay empresa activa, seleccionar la primera
      if (!activeCompanyId && mockCompanies.length > 0) {
        setActiveCompany(mockCompanies[0].id);
      }
    } catch (error) {
      console.error('Error loading user companies:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [user, activeCompanyId, setLoading, setCompanies, setActiveCompany]);

  // Las companies ahora se cargan desde el AuthContext automáticamente
  // Solo necesitamos limpiar si no hay usuario
  useEffect(() => {
    
    if (!user) {
      clearCompanies();
    } else {
    }
  }, [user, clearCompanies]);

  const createCompany = async (companyData: { name: string; maxMembers?: number }) => {
    try {
      setLoading(true);
      const newCompany = await graphqlService.createCompany(companyData);
      
      // Crear objeto mock temporal para el store
      const mockCompany = {
        id: newCompany.id,
        name: newCompany.name,
        owner: newCompany.owner,
        members: newCompany.members || [],
        maxMembers: newCompany.maxMembers || 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      addCompany(mockCompany);
      
      // Seleccionar automáticamente la nueva empresa
      setActiveCompany(newCompany.id);
      
      return newCompany;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const switchToCompany = (companyId: string) => {
    const company = getCompanyById(companyId);
    if (company) {
      setActiveCompany(companyId);
    }
  };

  const refreshActiveCompany = async () => {
    if (!activeCompanyId) return null;

    try {
      // Aquí podrías hacer una query específica para obtener datos frescos de la empresa
      // const updatedCompany = await graphqlService.getCompany(activeCompanyId);
      // updateCompany(activeCompanyId, updatedCompany);
      return getActiveCompany();
    } catch (error) {
      console.error('Error refreshing active company:', error);
      return null;
    }
  };

  return {
    // Estado - valores seguros para evitar errores
    companies: companies || [],
    activeCompany: getActiveCompany() || null,
    activeCompanyId: activeCompanyId || null,
    isLoading: isLoading || false,
    hasMultipleCompanies: (companies || []).length > 1,
    
    // Acciones
    loadUserCompanies,
    createCompany,
    switchToCompany,
    refreshActiveCompany,
    
    // Getters útiles - valores seguros
    getOwnedCompanies: () => [],
    getMemberCompanies: () => [],
    
    // Para debugging
    clearAllCompanies: clearCompanies,
  };
};

/**
 * Hook específico para el dropdown del topbar
 * Optimizado para mostrar solo la info necesaria
 */
export const useCompanyDropdown = () => {
  const user = useUser();
  const activeCompany = useActiveCompany();
  const activeCompanyId = useActiveCompanyId();
  const { companies, switchToCompany } = useCompaniesWithGraphQL();
  
  
  // Crear datos del dropdown basados en las companies actuales
  const dropdownCompanies = companies.map(company => ({
    id: company.id,
    name: company.name,
    isOwner: company.owner?.id === user?.id,
    memberCount: company.members?.length || 0,
  }));
  
  const hasMultipleCompanies = companies.length > 1;
  

  return {
    // Estado del dropdown
    activeCompany: activeCompany || null,
    activeCompanyId: activeCompanyId || null,
    companies: dropdownCompanies,
    hasMultipleCompanies,
    shouldShowDropdown: hasMultipleCompanies,
    
    // Acciones
    selectCompany: switchToCompany,
    
    // Para el UI del dropdown
    dropdownItems: dropdownCompanies.map(company => ({
      id: company.id,
      label: company.name,
      sublabel: company.isOwner ? 'Propietario' : 'Miembro',
      memberCount: company.memberCount,
      isActive: company.id === activeCompanyId,
    })),
  };
};

/**
 * Hook para obtener información de una empresa específica
 */
export const useCompanyById = (companyId: string | null) => {
  const { getCompanyById } = useCompaniesStore();
  
  if (!companyId) return null;
  return getCompanyById(companyId);
};
