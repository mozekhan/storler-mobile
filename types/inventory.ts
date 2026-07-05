// /**
//  * @typedef {Object} Product
//  * @property {string} _id
//  * @property {string} sku
//  * @property {string} name
//  * @property {string} description
//  * @property {string} category
//  * @property {string} subCategory
//  * @property {string} brand
//  * @property {number} unitPrice
//  * @property {number} costPrice
//  * @property {number} taxRate
//  * @property {Object} warehouseLocation
//  * @property {string} warehouseLocation.aisle
//  * @property {string} warehouseLocation.shelf
//  * @property {string} warehouseLocation.bin
//  * @property {string} barcode
//  * @property {number} minStockLevel
//  * @property {number} maxStockLevel
//  * @property {string} unitOfMeasure
//  * @property {boolean} isActive
//  * @property {Date} createdAt
//  * @property {Date} updatedAt
//  */

// /**
//  * @typedef {Object} Inventory
//  * @property {string} _id
//  * @property {string} productId
//  * @property {string} storeId
//  * @property {number} quantity
//  * @property {number} reservedQuantity
//  * @property {Object} warehouseLocation
//  * @property {string} warehouseLocation.aisle
//  * @property {string} warehouseLocation.shelf
//  * @property {string} warehouseLocation.bin
//  * @property {number} reorderPoint
//  * @property {Date} lastCounted
//  * @property {Date} createdAt
//  * @property {Date} updatedAt
//  */

// /**
//  * @typedef {Object} InventoryMovement
//  * @property {string} _id
//  * @property {string} productId
//  * @property {string} storeId
//  * @property {number} quantity
//  * @property {string} type
//  * @property {string} reason
//  * @property {string} performedBy
//  * @property {Date} timestamp
//  */

// /**
//  * @typedef {Object} StockAdjustment
//  * @property {string} productId
//  * @property {number} quantity
//  * @property {string} reason
//  */

// export const InventoryTypes = {};























export interface Product {
  _id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  brand: string;
  unitPrice: number;
  costPrice: number;
  taxRate: number;
  warehouseLocation: {
    aisle: string;
    shelf: string;
    bin: string;
  };
  barcode: string;
  minStockLevel: number;
  maxStockLevel: number;
  unitOfMeasure: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inventory {
  _id: string;
  productId: string;
  storeId: string;
  quantity: number;
  reservedQuantity: number;
  warehouseLocation: {
    aisle: string;
    shelf: string;
    bin: string;
  };
  reorderPoint: number;
  lastCounted: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryMovement {
  _id: string;
  productId: string;
  storeId: string;
  quantity: number;
  type: string;
  reason: string;
  performedBy: string;
  timestamp: Date;
}

export interface StockAdjustment {
  productId: string;
  quantity: number;
  reason: string;
}