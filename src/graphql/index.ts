// ==================== FRAGMENTS ====================
export * from './fragments';

// ==================== AUTH ====================
export * from './auth';

// ==================== USER ====================
export * from './user';

// ==================== COMPANIES ====================
export * from './companies';

// ==================== RE-EXPORTS PARA COMPATIBILIDAD ====================
// Mantener las exports originales para no romper código existente

// Auth exports (mantener nombres originales)
export { LOGIN_MUTATION, REGISTER_MUTATION } from './auth';

// User exports (mantener nombres originales)
export { ME_QUERY, ME_WITH_COMPANIES_QUERY } from './user';

// Companies exports (mantener nombres originales)
export {
  CREATE_COMPANY_MUTATION,
  MY_COMPANIES_QUERY,
  OWNED_COMPANIES_QUERY,
  MEMBERSHIPS_QUERY,
} from './companies';

// ==================== TIPOS CENTRALIZADOS ====================
// Re-export de todos los tipos para facilitar imports
export type { LoginInput, RegisterInput, AuthResponse } from './auth';
export type { User, UpdateUserInput } from './user';
export type { Company, CreateCompanyInput, UpdateCompanyInput } from './companies';
