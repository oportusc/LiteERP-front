import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS, GET_MATERIAS_PRIMAS, GET_MIXES } from '../../graphql/products';
import ProductList from './ProductList';
import ProductModal from './ProductModal';

const ProductsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'simples' | 'mixes'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Queries basadas en el tab activo
  const { data: allData, loading: allLoading, error: allError, refetch: refetchAll } = useQuery(GET_PRODUCTS, {
    skip: activeTab !== 'all'
  });
  
  const { data: simplesData, loading: simplesLoading, error: simplesError, refetch: refetchSimples } = useQuery(GET_MATERIAS_PRIMAS, {
    skip: activeTab !== 'simples'
  });
  
  const { data: mixesData, loading: mixesLoading, error: mixesError, refetch: refetchMixes } = useQuery(GET_MIXES, {
    skip: activeTab !== 'mixes'
  });

  const handleModalSuccess = () => {
    // Refetch data after successful creation
    switch (activeTab) {
      case 'all':
        refetchAll();
        break;
      case 'simples':
        refetchSimples();
        break;
      case 'mixes':
        refetchMixes();
        break;
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'all':
        return { data: (allData as any)?.products || [], loading: allLoading, error: allError };
      case 'simples':
        return { data: (simplesData as any)?.materiasPrimas || [], loading: simplesLoading, error: simplesError };
      case 'mixes':
        return { data: (mixesData as any)?.mixes || [], loading: mixesLoading, error: mixesError };
      default:
        return { data: [], loading: false, error: null };
    }
  };

  const { data, loading, error } = getCurrentData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-2">Gestión de materias primas y productos mix</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', label: 'Todos los Productos', icon: '📦' },
            { id: 'simples', label: 'Materias Primas', icon: '🥜' },
            { id: 'mixes', label: 'Productos Mix', icon: '🎯' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        <ProductList products={data} loading={loading} error={error} />
      </div>

      {/* Modal */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default ProductsPage;
