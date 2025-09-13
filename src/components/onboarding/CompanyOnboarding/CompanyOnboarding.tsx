import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
// import { useCompaniesWithGraphQL } from '../../../hooks/useCompanies';
import { graphqlService } from '../../../services/graphqlService';
import { useAuthStore } from '../../../stores/authStore';
import type { CreateCompanyInput } from '../../../graphql';

const CompanyOnboarding: React.FC = () => {
  const [formData, setFormData] = useState<CreateCompanyInput>({
    name: '',
    maxMembers: 0,
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { addCompanyToUser } = useAuthStore();
  // const { createCompany, isLoading } = useCompaniesWithGraphQL();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxMembers' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const newCompany = await graphqlService.createCompany(formData);
      
      // 🎉 Actualización reactiva usando AuthStore directamente
      addCompanyToUser(newCompany.id);
      
      // El App.tsx detectará automáticamente el cambio y redirigirá al dashboard
    } catch (err: any) {
      console.error('Error creating company:', err);
      setError(err.message || err.graphQLErrors?.[0]?.message || 'Error al crear la empresa');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ¡Bienvenido, {user?.name}!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Para comenzar, necesitas crear tu empresa de Frutos Secos
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre de la Empresa
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Ej: Frutos Secos del Norte"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700">
                Límite de Miembros (opcional)
              </label>
              <input
                id="maxMembers"
                name="maxMembers"
                type="number"
                min="1"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="10"
                value={formData.maxMembers}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-gray-500">
                Deja en 0 para límite ilimitado
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando empresa...' : 'Crear Mi Empresa'}
            </button>
          </div>

          <div className="text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    ¿Qué es esto?
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Tu empresa será tu espacio privado para gestionar tu negocio de frutos secos. 
                      Solo tú y las personas que invites podrán acceder a esta información.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyOnboarding;
