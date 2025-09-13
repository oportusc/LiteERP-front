import { gql } from '@apollo/client';
import { AUTH_RESPONSE_FRAGMENT } from './fragments';

// ==================== MUTATIONS ====================

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ...AuthResponseInfo
    }
  }
  ${AUTH_RESPONSE_FRAGMENT}
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ...AuthResponseInfo
    }
  }
  ${AUTH_RESPONSE_FRAGMENT}
`;

// ==================== TYPES (para TypeScript) ====================

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    companies?: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}
