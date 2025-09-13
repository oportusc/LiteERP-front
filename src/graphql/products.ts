import { gql } from '@apollo/client';

// Fragments
export const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    name
    description
    currentStock
    supplierId
    purchaseQuantity
    purchaseUnit
    purchasePrice
    saleQuantity
    saleUnit
    salePrice
    esMix
      receta {
        productId
        cantidad
        unidad
        product {
          id
          name
        }
      }
    isActive
    calculatedCost
    availableStock
    costPerSaleUnit
    profitMargin
    profitPercentage
    createdAt
    updatedAt
  }
`;

// Queries
export const GET_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  query GetProducts {
    products {
      ...ProductFragment
    }
  }
`;

export const GET_MATERIAS_PRIMAS = gql`
  ${PRODUCT_FRAGMENT}
  query GetMateriasPrimas {
    materiasPrimas {
      ...ProductFragment
    }
  }
`;

export const GET_MIXES = gql`
  ${PRODUCT_FRAGMENT}
  query GetMixes {
    mixes {
      ...ProductFragment
    }
  }
`;

export const GET_PRODUCT = gql`
  ${PRODUCT_FRAGMENT}
  query GetProduct($id: ID!) {
    product(id: $id) {
      ...ProductFragment
    }
  }
`;

// Mutations
export const CREATE_PRODUCT = gql`
  ${PRODUCT_FRAGMENT}
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ...ProductFragment
    }
  }
`;

// Types
export interface ProductRecipe {
  productId: string;
  cantidad: number;
  unidad: string;
  product?: {
    id: string;
    name: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  currentStock: number;
  supplierId?: string;
  // Campos de compra
  purchaseQuantity?: number;
  purchaseUnit?: string;
  purchasePrice?: number;
  // Campos de venta
  saleQuantity?: number;
  saleUnit?: string;
  salePrice?: number;
  esMix: boolean;
  receta?: ProductRecipe[];
  isActive: boolean;
  calculatedCost?: number;
  availableStock?: number;
  // Campos calculados de rentabilidad
  costPerSaleUnit?: number;
  profitMargin?: number;
  profitPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  currentStock?: number;
  supplierId?: string;
  // Campos de compra
  purchaseQuantity?: number;
  purchaseUnit?: string;
  purchasePrice?: number;
  // Campos de venta
  saleQuantity?: number;
  saleUnit?: string;
  salePrice?: number;
  esMix?: boolean;
  receta?: {
    productId: string;
    cantidad: number;
    unidad: string;
  }[];
}
