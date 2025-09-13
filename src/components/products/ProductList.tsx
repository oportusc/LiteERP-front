import React from 'react';
import type { Product } from '../../graphql/products';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error?: any;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="text-red-400">⚠️</div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al cargar productos</h3>
              <p className="text-sm text-red-700 mt-1">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos registrados</h3>
          <p className="text-gray-600 mb-4">Comienza creando tu primer producto o materia prima.</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatStock = (stock: number, unit: string) => {
    return `${stock.toLocaleString()} ${unit}`;
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900 flex-1 mr-2">{product.name}</h3>
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap
                ${product.esMix 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-green-100 text-green-800'
                }
              `}>
                {product.esMix ? '🎯 Mix' : '🥜 Materia Prima'}
              </span>
            </div>

            {/* Descripción */}
            {product.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
            )}

            {/* Información principal */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Stock:</span>
                <span className={`font-medium ${
                  (product.availableStock || product.currentStock) > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {product.esMix 
                    ? `${product.availableStock || 0} unidades`
                    : formatStock(product.currentStock, product.saleUnit || 'gr')
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Costo:</span>
                <span className="font-medium text-gray-900">
                  {product.esMix 
                    ? formatCurrency(product.calculatedCost || 0)
                    : formatCurrency(product.costPerSaleUnit || 0)
                  }
                  <span className="text-xs text-gray-500 ml-1">
                    /{product.esMix ? 'unidad' : `${product.saleQuantity || 0}${product.saleUnit || 'gr'}`}
                  </span>
                </span>
              </div>

              {product.esMix && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Ingredientes:</span>
                  <span className="font-medium text-gray-900">
                    {product.receta?.length || 0} items
                  </span>
                </div>
              )}

              {!product.esMix && product.profitPercentage !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Margen:</span>
                  <span className={`font-medium ${
                    product.profitPercentage > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.round(product.profitPercentage)}%
                  </span>
                </div>
              )}
            </div>

            {/* Información de venta (para productos simples) */}
            {!product.esMix && product.saleQuantity && product.salePrice && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Formato de Venta:</h4>
                <div className="text-xs text-gray-600 flex justify-between">
                  <span>{product.saleQuantity}{product.saleUnit}</span>
                  <span className="font-medium">{formatCurrency(product.salePrice)}</span>
                </div>
                {product.profitMargin !== undefined && (
                  <div className="text-xs text-gray-600 flex justify-between mt-1">
                    <span>Ganancia por unidad:</span>
                    <span className={`font-medium ${
                      product.profitMargin > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(product.profitMargin)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Receta (para productos mix) */}
            {product.esMix && product.receta && product.receta.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Receta:</h4>
                <div className="space-y-1">
                  {product.receta.slice(0, 3).map((item, index) => (
                    <div key={index} className="text-xs text-gray-600 flex justify-between">
                      <span className="truncate mr-2">
                        {item.product?.name || `Producto ${item.productId}`}
                      </span>
                      <span className="whitespace-nowrap">
                        {item.cantidad}{item.unidad}
                      </span>
                    </div>
                  ))}
                  {product.receta.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{product.receta.length - 3} más...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Estados */}
            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-1">
                {(product.availableStock || product.currentStock) === 0 && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    Sin Stock
                  </span>
                )}
                {product.esMix && (product.availableStock || 0) < (product.currentStock || 0) && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Stock Limitado
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-500">
                {new Date(product.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded text-sm font-medium hover:bg-blue-100 transition-colors">
                Ver Detalles
              </button>
              <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
