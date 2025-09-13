import api from './api';
import type { 
  CreateCompanyRequest, 
  UpdateCompanyRequest, 
  CompanyResponse 
} from '../types/company';

export const companyService = {
  async createCompany(companyData: CreateCompanyRequest): Promise<CompanyResponse> {
    const response = await api.post('/companies', companyData);
    return response.data;
  },

  async getMyCompanies(): Promise<CompanyResponse[]> {
    const response = await api.get('/companies/my-companies');
    return response.data;
  },

  async getOwnedCompanies(): Promise<CompanyResponse[]> {
    const response = await api.get('/companies/owned');
    return response.data;
  },

  async getMemberships(): Promise<CompanyResponse[]> {
    const response = await api.get('/companies/memberships');
    return response.data;
  },

  async getCompanyById(id: string): Promise<CompanyResponse> {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  async updateCompany(id: string, companyData: UpdateCompanyRequest): Promise<CompanyResponse> {
    const response = await api.patch(`/companies/${id}`, companyData);
    return response.data;
  },

  async deleteCompany(id: string): Promise<void> {
    await api.delete(`/companies/${id}`);
  },

  async leaveCompany(id: string): Promise<void> {
    await api.post(`/companies/${id}/leave`);
  },

  async removeMember(companyId: string, memberId: string): Promise<CompanyResponse> {
    const response = await api.delete(`/companies/${companyId}/members/${memberId}`);
    return response.data;
  }
};
