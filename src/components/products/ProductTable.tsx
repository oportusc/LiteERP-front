import React from 'react';

interface Product {
  id: string;
  name: string;
  description?: string;
  esMix?: boolean;
  purchasePrice?: number;
  saleQuantity?: number;
  saleUnit?: string;
  salePrice?: number;
  profitPercentage?: number;
  profitMargin?: number;
}

interface ProductTableProps {
  products: Product[];
  loading: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, loading }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Cargando productos...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos registrados</h3>
            <p className="text-gray-600 mb-4">Comienza creando tu primer producto.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formato Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margen de Utilidad
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {product.name}
                          {product.esMix && (
                            <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              Mix
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!product.esMix && product.purchasePrice ? (
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{formatCurrency(product.purchasePrice)}</div>
                        <div className="text-xs text-gray-500">por 1kg</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        {product.esMix ? 'Calculado por receta' : 'No definido'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!product.esMix && product.saleQuantity && product.saleUnit ? (
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">{product.saleQuantity}</span>
                        <span className="text-gray-500">{product.saleUnit}</span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        {product.esMix ? 'Por unidad' : 'No definido'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!product.esMix && product.salePrice ? (
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.salePrice)}
                      </div>
                    ) : product.esMix ? (
                      <div className="text-sm text-gray-500 italic">Calculado por receta</div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">No definido</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!product.esMix && product.profitPercentage !== undefined ? (
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.profitPercentage > 50 
                            ? 'bg-green-100 text-green-800'
                            : product.profitPercentage > 20
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {Math.round(product.profitPercentage)}%
                        </span>
                        {product.profitMargin !== undefined && (
                          <div className="ml-2 text-xs text-gray-500">
                            ({formatCurrency(product.profitMargin)})
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        {product.esMix ? 'Variable' : 'No calculado'}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
