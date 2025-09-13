import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCompaniesWithGraphQL } from '../../hooks/useCompanies';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { activeCompany, hasMultipleCompanies } = useCompaniesWithGraphQL();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Bienvenido a Frutos Secos!
              </h2>
              <p className="text-gray-600 mb-6">
                Has iniciado sesión correctamente. Aquí puedes ver la información de tu cuenta.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Información del Usuario */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Información del Usuario
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">ID:</span>
                      <span className="text-gray-900">{user?.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Nombre:</span>
                      <span className="text-gray-900">{user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="text-gray-900">{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Rol:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información de la Empresa Activa */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Empresa Activa
                  </h3>
                  {activeCompany ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Nombre:</span>
                        <span className="text-gray-900">{activeCompany.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Propietario:</span>
                        <span className="text-gray-900">
                          {activeCompany.owner?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Miembros:</span>
                        <span className="text-gray-900">
                          {activeCompany.members.length}
                          {activeCompany.maxMembers > 0 && (
                            <span className="text-gray-500"> / {activeCompany.maxMembers}</span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Estado:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activeCompany.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {activeCompany.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      {hasMultipleCompanies && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                          <p className="text-sm text-blue-700">
                            💡 Tienes múltiples empresas. Usa el selector en la parte superior para cambiar entre ellas.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">No hay empresa seleccionada</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Conexión exitosa con el backend
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          El sistema de autenticación está funcionando correctamente. 
                          Tu token JWT ha sido validado y estás autenticado.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;
