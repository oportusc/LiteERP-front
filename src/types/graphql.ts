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

export interface Company {
  id: string;
  name: string;
  owner: User | null;
  members: User[];
  maxMembers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface CreateCompanyInput {
  name: string;
  maxMembers?: number;
}
