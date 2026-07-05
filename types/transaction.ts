// /**
//  * @typedef {Object} TransactionItem
//  * @property {string} productId
//  * @property {string} sku
//  * @property {string} name
//  * @property {number} quantity
//  * @property {number} unitPrice
//  * @property {number} totalPrice
//  * @property {number} taxRate
//  * @property {number} taxAmount
//  * @property {Object} warehouseLocation
//  * @property {string} warehouseLocation.aisle
//  * @property {string} warehouseLocation.shelf
//  * @property {string} warehouseLocation.bin
//  */

// /**
//  * @typedef {Object} Transaction
//  * @property {string} _id
//  * @property {string} transactionNumber
//  * @property {string} storeId
//  * @property {string} salesAttendantId
//  * @property {TransactionItem[]} items
//  * @property {number} subtotal
//  * @property {number} taxTotal
//  * @property {number} totalAmount
//  * @property {string} status
//  * @property {string} salesStatus
//  * @property {string} paymentStatus
//  * @property {string} warehouseStatus
//  * @property {string} paymentMethod
//  * @property {number} paymentAmount
//  * @property {number} amountPaid
//  * @property {number} changeAmount
//  * @property {string} salesReceiptQR
//  * @property {string} paymentReceiptQR
//  * @property {string} finalInvoiceNumber
//  * @property {Date} salesTimestamp
//  * @property {Date} paymentTimestamp
//  * @property {Date} releaseTimestamp
//  * @property {Date} createdAt
//  * @property {Date} updatedAt
//  */

// /**
//  * @typedef {Object} TransactionFilter
//  * @property {string} [status]
//  * @property {string} [search]
//  * @property {Date} [startDate]
//  * @property {Date} [endDate]
//  * @property {number} [page]
//  * @property {number} [limit]
//  */

// /**
//  * @typedef {Object} QRPayload
//  * @property {string} version
//  * @property {string} type
//  * @property {string} transactionId
//  * @property {number} timestamp
//  * @property {string} storeId
//  * @property {string} checksum
//  */

// export const TransactionTypes = {};


























export interface TransactionItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  taxAmount: number;
  warehouseLocation?: {
    aisle: string;
    shelf: string;
    bin: string;
  };
}

export interface Transaction {
  _id: string;
  transactionNumber: string;
  storeId: string;
  salesAttendantId: string;
  items: TransactionItem[];
  subtotal: number;
  taxTotal: number;
  totalAmount: number;
  status: string;
  salesStatus: string;
  paymentStatus: string;
  warehouseStatus: string;
  paymentMethod: string;
  paymentAmount: number;
  amountPaid: number;
  changeAmount: number;
  salesReceiptQR: string;
  paymentReceiptQR: string;
  finalInvoiceNumber: string;
  salesTimestamp: Date;
  paymentTimestamp: Date;
  releaseTimestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFilter {
  status?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface QRPayload {
  version: string;
  type: string;
  transactionId: string;
  timestamp: number;
  storeId: string;
  checksum: string;
}