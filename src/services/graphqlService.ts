import { apolloClient } from '../lib/apollo-client';
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  ME_QUERY,
  ME_WITH_COMPANIES_QUERY,
  CREATE_COMPANY_MUTATION,
  MY_COMPANIES_QUERY,
  OWNED_COMPANIES_QUERY,
  MEMBERSHIPS_QUERY,
} from '../graphql';
import type {
  LoginInput,
  RegisterInput,
  CreateCompanyInput,
  AuthResponse,
  User,
  Company,
} from '../graphql';

export const graphqlService = {
  // Auth
  async login(credentials: LoginInput): Promise<AuthResponse> {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN_MUTATION,
      variables: { input: credentials },
    });
    return (data as any).login;
  },

  async register(userData: RegisterInput): Promise<AuthResponse> {
    const { data } = await apolloClient.mutate({
      mutation: REGISTER_MUTATION,
      variables: { input: userData },
    });
    return (data as any).register;
  },

  async getProfile(): Promise<User> {
    const { data } = await apolloClient.query({
      query: ME_QUERY,
      fetchPolicy: 'network-only',
    });
    return (data as any).me;
  },

  async getProfileWithCompanies(): Promise<{ user: User; companies: Company[] }> {
    const { data } = await apolloClient.query({
      query: ME_WITH_COMPANIES_QUERY,
      fetchPolicy: 'network-only',
    });
    
    const userWithCompanies = (data as any).meWithCompanies;
    
    return {
      user: {
        id: userWithCompanies.id,
        email: userWithCompanies.email,
        name: userWithCompanies.name,
        role: userWithCompanies.role,
        companies: userWithCompanies.companies,
        isActive: userWithCompanies.isActive,
        createdAt: userWithCompanies.createdAt,
        updatedAt: userWithCompanies.updatedAt,
      },
      companies: userWithCompanies.companiesDetails || [],
    };
  },

  // Companies
  async createCompany(companyData: CreateCompanyInput): Promise<Company> {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_COMPANY_MUTATION,
      variables: { input: companyData },
    });
    return (data as any).createCompany;
  },

  async getMyCompanies(): Promise<Company[]> {
    const { data } = await apolloClient.query({
      query: MY_COMPANIES_QUERY,
      fetchPolicy: 'network-only',
    });
    return (data as any).myCompanies;
  },

  async getOwnedCompanies(): Promise<Company[]> {
    const { data } = await apolloClient.query({
      query: OWNED_COMPANIES_QUERY,
      fetchPolicy: 'network-only',
    });
    return (data as any).ownedCompanies;
  },

  async getMemberCompanies(): Promise<Company[]> {
    const { data } = await apolloClient.query({
      query: MEMBERSHIPS_QUERY,
      fetchPolicy: 'network-only',
    });
    return (data as any).memberships;
  },
};
