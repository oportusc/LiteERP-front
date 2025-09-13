import { gql } from '@apollo/client';
import { USER_FRAGMENT, USER_WITH_COMPANIES_FRAGMENT } from './fragments';

// ==================== QUERIES ====================

export const ME_QUERY = gql`
  query Me {
    me {
      ...UserInfo
    }
  }
  ${USER_FRAGMENT}
`;

export const ME_WITH_COMPANIES_QUERY = gql`
  query MeWithCompanies {
    meWithCompanies {
      ...UserWithCompaniesInfo
      companiesDetails {
        id
        name
        owner {
          id
          name
          email
          role
        }
        members {
          id
          name
          email
          role
        }
        maxMembers
        isActive
        createdAt
        updatedAt
      }
    }
  }
  ${USER_WITH_COMPANIES_FRAGMENT}
`;

// ==================== MUTATIONS ====================

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      ...UserInfo
    }
  }
  ${USER_FRAGMENT}
`;

// ==================== TYPES (para TypeScript) ====================

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  companies?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}
