import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_PRODUCT, GET_PRODUCTS, GET_MATERIAS_PRIMAS } from '../../graphql/products';
import type { Product, CreateProductInput } from '../../graphql/products';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface RecipeItem {
  productId: string;
  cantidad: number;
  unidad: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateProductInput>({
    name: '',
    description: '',
    currentStock: 0, // Siempre 0 por defecto
    // Campos de compra (siempre 1kg)
    purchaseQuantity: 1,
    purchaseUnit: 'kg',
    purchasePrice: 0,
    // Campos de venta (gramos predefinidos)
    saleQuantity: 250, // Valor por defecto
    saleUnit: 'gr',
    salePrice: 0,
    esMix: false,
    receta: []
  });

  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([]);

  // Queries y mutations
  const { data: materiasData } = useQuery(GET_MATERIAS_PRIMAS);
  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }, { query: GET_MATERIAS_PRIMAS }],
    onCompleted: () => {
      onSuccess?.();
      handleClose();
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      alert('Error al crear el producto: ' + error.message);
    }
  });

  const materiasPrimas = (materiasData as any)?.materiasPrimas || [];

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        name: '',
        description: '',
        currentStock: 0,
        // Campos de compra (siempre 1kg)
        purchaseQuantity: 1,
        purchaseUnit: 'kg',
        purchasePrice: 0,
        // Campos de venta (gramos predefinidos)
        saleQuantity: 250,
        saleUnit: 'gr',
        salePrice: 0,
        esMix: false,
        receta: []
      });
      setRecipeItems([]);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // No permitir cambios en purchaseQuantity ni purchaseUnit (siempre 1kg)
    if (name === 'purchaseQuantity' || name === 'purchaseUnit') {
      return;
    }
    
    // Convertir a número para campos numéricos específicos
    let newValue: any = value;
    if (type === 'number' || name === 'saleQuantity') {
      newValue = parseFloat(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      esMix: checked
    }));
    
    if (!checked) {
      setRecipeItems([]);
    }
  };

  const addRecipeItem = () => {
    setRecipeItems(prev => [...prev, { productId: '', cantidad: 0, unidad: 'g' }]);
  };

  const updateRecipeItem = (index: number, field: keyof RecipeItem, value: string | number) => {
    setRecipeItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeRecipeItem = (index: number) => {
    setRecipeItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name.trim()) {
      alert('El nombre del producto es requerido');
      return;
    }

    if (formData.esMix) {
      if (recipeItems.length === 0) {
        alert('Los productos mix deben tener al menos un ingrediente en la receta');
        return;
      }
      
      const hasInvalidRecipe = recipeItems.some(item => 
        !item.productId || item.cantidad <= 0
      );
      
      if (hasInvalidRecipe) {
        alert('Todos los ingredientes de la receta deben tener producto y cantidad válidos');
        return;
      }
    } else {
      // Validar información comercial para productos simples
      if (!formData.purchaseQuantity || !formData.purchasePrice || !formData.saleQuantity || !formData.salePrice) {
        alert('Para productos simples es necesario completar toda la información comercial (compra y venta)');
        return;
      }
    }

    const submitData: CreateProductInput = {
      ...formData,
      receta: formData.esMix ? recipeItems : undefined
    };

    console.log('Datos a enviar:', submitData);

    try {
      await createProduct({ variables: { input: submitData } });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Nuevo Producto</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Nueces Premium, Mix Deluxe 250g"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción opcional del producto"
              />
            </div>

          </div>

          {/* Información de Compra y Venta (solo para productos simples) */}
          {!formData.esMix && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900">Información Comercial</h3>
              
              {/* Información de Compra */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-blue-900 flex items-center">
                  <span className="mr-2">🛒</span>
                  Información de Compra
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Formato de Compra
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value="1"
                        disabled
                        className="w-16 border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 text-center"
                      />
                      <span className="text-gray-600 font-medium">Kilogramo</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Siempre compramos por kilogramo</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio por Kilogramo
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        name="purchasePrice"
                        value={formData.purchasePrice || ''}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="5000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de Venta */}
              <div className="bg-green-50 p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-green-900 flex items-center">
                  <span className="mr-2">💰</span>
                  Información de Venta
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Formato de Venta
                    </label>
                    <div className="flex items-center space-x-2">
                      <select
                        name="saleQuantity"
                        value={formData.saleQuantity || 250}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={50}>50gr</option>
                        <option value={80}>80gr</option>
                        <option value={100}>100gr</option>
                        <option value={150}>150gr</option>
                        <option value={200}>200gr</option>
                        <option value={250}>250gr</option>
                        <option value={500}>500gr</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Gramajes de venta disponibles</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio de Venta
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        name="salePrice"
                        value={formData.salePrice || ''}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="3500"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculadora de Margen (solo mostrar si hay datos) */}
                {formData.purchasePrice && formData.saleQuantity && formData.salePrice && (
                  <div className="bg-white p-3 rounded border border-green-200">
                    <h5 className="font-medium text-green-800 mb-2">📊 Análisis de Rentabilidad</h5>
                    {(() => {
                      // Calculamos basándonos en que compramos 1kg (1000g) y vendemos en gramos específicos
                      const purchaseQuantityInGrams = 1000; // Siempre 1kg = 1000g
                      const saleQuantityInGrams = formData.saleQuantity || 250; // Gramajes del dropdown
                      
                      // Costo por gramo (precio del kilo / 1000g)
                      const costPerGram = (formData.purchasePrice || 0) / purchaseQuantityInGrams;
                      
                      // Costo por unidad de venta
                      const costPerSaleUnit = costPerGram * saleQuantityInGrams;
                      
                      // Margen de ganancia
                      const profitMargin = (formData.salePrice || 0) - costPerSaleUnit;
                      
                      // Margen de ganancia real (utilidad / precio de venta × 100)
                      const profitPercentage = (formData.salePrice || 0) > 0 ? (profitMargin / (formData.salePrice || 0)) * 100 : 0;

                      return (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Costo por {saleQuantityInGrams}gr:</span>
                            <span className="font-medium">${costPerSaleUnit.toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ganancia:</span>
                            <span className={`font-medium ${profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${profitMargin.toFixed(0)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Margen %:</span>
                            <span className={`font-medium ${profitPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {Math.round(profitPercentage)}%
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Toggle para Mix */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="esMix"
                checked={formData.esMix}
                onChange={handleToggleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="esMix" className="text-sm font-medium text-gray-700">
                Este es un producto mix (compuesto por varias materias primas)
              </label>
            </div>
          </div>


          {/* Receta (solo para productos mix) */}
          {formData.esMix && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Receta del Mix</h3>
                <button
                  type="button"
                  onClick={addRecipeItem}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  + Agregar Ingrediente
                </button>
              </div>

              {recipeItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-4 gap-3 items-end">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Materia Prima
                      </label>
                      <select
                        value={item.productId}
                        onChange={(e) => updateRecipeItem(index, 'productId', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar...</option>
                        {materiasPrimas.map((product: Product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.saleUnit || 'gr'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => updateRecipeItem(index, 'cantidad', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <select
                        value={item.unidad}
                        onChange={(e) => updateRecipeItem(index, 'unidad', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="lb">lb</option>
                        <option value="oz">oz</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeRecipeItem(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {recipeItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay ingredientes en la receta.</p>
                  <p className="text-sm">Haz clic en "Agregar Ingrediente" para comenzar.</p>
                </div>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
            >
              {creating ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
