export interface Company {
  _id: string;
  name: string;
  owner: string;
  members: string[];
  maxMembers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  maxMembers?: number;
}

export interface UpdateCompanyRequest {
  name?: string;
  maxMembers?: number;
}

export interface CompanyResponse {
  _id: string;
  name: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  members: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  maxMembers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
