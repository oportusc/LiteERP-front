import { gql } from '@apollo/client';

// Fragment para información básica del usuario
export const USER_FRAGMENT = gql`
  fragment UserInfo on User {
    id
    email
    name
    role
    companies
    isActive
    createdAt
    updatedAt
  }
`;

// Fragment para usuario con empresas completas
export const USER_WITH_COMPANIES_FRAGMENT = gql`
  fragment UserWithCompaniesInfo on UserWithCompanies {
    id
    email
    name
    role
    companies
    isActive
    createdAt
    updatedAt
  }
`;

// Fragment para información básica del usuario (sin companies para evitar circular refs)
export const USER_BASIC_FRAGMENT = gql`
  fragment UserBasicInfo on User {
    id
    name
    email
    role
  }
`;

// Fragment para información completa de la empresa
export const COMPANY_FRAGMENT = gql`
  fragment CompanyInfo on Company {
    id
    name
    owner {
      ...UserBasicInfo
    }
    members {
      ...UserBasicInfo
    }
    maxMembers
    isActive
    createdAt
    updatedAt
  }
  ${USER_BASIC_FRAGMENT}
`;

// Fragment para respuesta de autenticación
export const AUTH_RESPONSE_FRAGMENT = gql`
  fragment AuthResponseInfo on AuthResponse {
    access_token
    user {
      ...UserInfo
    }
  }
  ${USER_FRAGMENT}
`;
