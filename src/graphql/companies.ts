import { gql } from '@apollo/client';
import { COMPANY_FRAGMENT } from './fragments';

// ==================== QUERIES ====================

export const MY_COMPANIES_QUERY = gql`
  query MyCompanies {
    myCompanies {
      ...CompanyInfo
    }
  }
  ${COMPANY_FRAGMENT}
`;

export const OWNED_COMPANIES_QUERY = gql`
  query OwnedCompanies {
    ownedCompanies {
      ...CompanyInfo
    }
  }
  ${COMPANY_FRAGMENT}
`;

export const MEMBERSHIPS_QUERY = gql`
  query Memberships {
    memberships {
      ...CompanyInfo
    }
  }
  ${COMPANY_FRAGMENT}
`;

export const GET_COMPANY_QUERY = gql`
  query GetCompany($id: ID!) {
    company(id: $id) {
      ...CompanyInfo
    }
  }
  ${COMPANY_FRAGMENT}
`;

export const ALL_COMPANIES_QUERY = gql`
  query AllCompanies {
    companies {
      ...CompanyInfo
    }
  }
  ${COMPANY_FRAGMENT}
`;

// ==================== MUTATIONS ====================

export const CREATE_COMPANY_MUTATION = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      ...CompanyInfo
    }
  }
  ${COMPANY_FRAGMENT}
`;

export const UPDATE_COMPANY_MUTATION = gql`
  mutation UpdateCompany($id: ID!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input) {
      ...CompanyInfo
    }
  }
  ${COMPANY_FRAGMENT}
`;

export const DELETE_COMPANY_MUTATION = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id)
  }
`;

export const LEAVE_COMPANY_MUTATION = gql`
  mutation LeaveCompany($id: ID!) {
    leaveCompany(id: $id)
  }
`;

export const REMOVE_MEMBER_MUTATION = gql`
  mutation RemoveMember($companyId: ID!, $memberId: ID!) {
    removeMember(companyId: $companyId, memberId: $memberId) {
      ...CompanyInfo
    }
  }
  ${COMPANY_FRAGMENT}
`;

// ==================== TYPES (para TypeScript) ====================

export interface Company {
  id: string;
  name: string;
  owner: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  members: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
  maxMembers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyInput {
  name: string;
  maxMembers?: number;
}

export interface UpdateCompanyInput {
  name?: string;
  maxMembers?: number;
}
