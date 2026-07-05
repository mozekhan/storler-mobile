// export const ENDPOINTS = {
//   AUTH: {
//     LOGIN: '/auth/login',
//     REFRESH: '/auth/refresh',
//     LOGOUT: '/auth/logout',
//     ME: '/auth/me',
//     CHANGE_PASSWORD: '/auth/change-password',
//     RESET_PASSWORD: '/auth/reset-password',
//   },

//   USERS: {
//     LIST: '/users',
//     CREATE: '/users',
//     GET: id => `/users/${id}`,
//     UPDATE: id => `/users/${id}`,
//     DELETE: id => `/users/${id}`,
//     ME: '/users/me',
//     STORES: '/users/stores',
//     SWITCH_STORE: '/users/switch-store',
//   },

//   STORES: {
//     LIST: '/stores',
//     CREATE: '/stores',
//     GET: id => `/stores/${id}`,
//     UPDATE: id => `/stores/${id}`,
//     DELETE: id => `/stores/${id}`,
//     STATS: id => `/stores/${id}/stats`,
//     OPTIONS: '/stores/options',
//     BY_CODE: code => `/stores/by-code/${code}`,
//   },

//   PRODUCTS: {
//     LIST: '/products',
//     CREATE: '/products',
//     BULK_CREATE: '/products/bulk',
//     GET: id => `/products/${id}`,
//     UPDATE: id => `/products/${id}`,
//     DELETE: id => `/products/${id}`,
//     CATEGORIES: '/products/categories',
//   },

//   INVENTORY: {
//     LIST: '/inventory',
//     ADJUST: '/inventory/adjust',
//     BULK_ADJUST: '/inventory/bulk-adjust',
//     LOW_STOCK: '/inventory/low-stock',
//     SUMMARY: '/inventory/summary',
//     BY_PRODUCT: productId => `/inventory/product/${productId}`,
//   },

//   TRANSACTIONS: {
//     LIST: '/transactions',
//     CREATE: '/transactions',
//     GET: id => `/transactions/${id}`,
//     ADD_ITEM: id => `/transactions/${id}/items`,
//     GENERATE_SALES_QR: id => `/transactions/${id}/sales-qr`,
//     PROCESS_PAYMENT: id => `/transactions/${id}/payment`,
//     RELEASE_STOCK: id => `/transactions/${id}/release`,
//     COMPLETE: id => `/transactions/${id}/complete`,
//     VALIDATE_QR: '/transactions/validate-qr',
//   },

//   PAYMENTS: {
//     PAYMENTS: '/payments',
//     PROCESS: id => `/payments/process/${id}`,
//     REFUND: id => `/payments/refund/${id}`,
//     BY_TRANSACTION: id => `/payments/transaction/${id}`,
//     STATS: '/payments/stats',
//   },

//   WAREHOUSE: {
//     STATS: '/warehouse/stats',
//     TRANSACTIONS: '/warehouse/transactions',
//     GET_TRANSACTION: id => `/warehouse/transactions/${id}`,
//     RELEASE: id => `/warehouse/transactions/${id}/release`,
//     COMPLETE: id => `/warehouse/transactions/${id}/complete`,
//     INVENTORY_ITEM: id => `/warehouse/inventory/${id}`,
//     BULK_LOCATIONS: '/warehouse/inventory/locations',
//   },

//   REPORTS: {
//     SALES: '/reports/sales',
//     INVENTORY: '/reports/inventory',
//     FINANCIAL: '/reports/financial',
//     USER_PERFORMANCE: '/reports/user-performance',
//     PRODUCT_PERFORMANCE: '/reports/product-performance',
//     STORE_COMPARISON: '/reports/store-comparison',
//   },

//   RECEIPTS: {
//     GET: id => `/receipts/${id}`,
//     BY_TRANSACTION: id => `/receipts/transaction/${id}`,
//     GENERATE: id => `/receipts/${id}/generate`,
//     PRINT: id => `/receipts/${id}/print`,
//     DOWNLOAD: id => `/receipts/${id}/download`,
//   },

//   NOTIFICATIONS: {
//     LIST: '/notifications',
//     UNREAD_COUNT: '/notifications/unread-count',
//     MARK_READ: id => `/notifications/${id}/read`,
//     MARK_ALL_READ: '/notifications/read-all',
//     DELETE: id => `/notifications/${id}`,
//     DELETE_ALL: '/notifications',
//   },

//   ADMIN: {
//     STATS: '/admin/stats',
//     STORE_STATS: id => `/admin/stats/store/${id}`,
//     LOGS: '/admin/logs',
//     INTEGRITY: '/admin/integrity',
//     USER_ACTIVITY: id => `/admin/user/${id}/activity`,
//   },
// };

// export default ENDPOINTS;


























// // constants/apiEndpoints.js
// export const ENDPOINTS = {
//   AUTH: {
//     LOGIN: '/auth/login',
//     REFRESH: '/auth/refresh',
//     LOGOUT: '/auth/logout',
//     ME: '/auth/me',
//     CHANGE_PASSWORD: '/auth/change-password',
//     RESET_PASSWORD: '/auth/reset-password',
//   },

//   USERS: {
//     LIST: '/users',
//     CREATE: '/users',
//     GET: id => `/users/${id}`,
//     UPDATE: id => `/users/${id}`,
//     DELETE: id => `/users/${id}`,
//     ME: '/users/me',
//     STORES: '/users/stores',
//     SWITCH_STORE: '/users/switch-store',
//   },

//   STORES: {
//     LIST: '/stores',
//     CREATE: '/stores',
//     GET: id => `/stores/${id}`,
//     UPDATE: id => `/stores/${id}`,
//     DELETE: id => `/stores/${id}`,
//     STATS: id => `/stores/${id}/stats`,
//     OPTIONS: '/stores/options',
//     BY_CODE: code => `/stores/by-code/${code}`,
//   },

//   PRODUCTS: {
//     LIST: '/products',
//     CREATE: '/products',
//     BULK_CREATE: '/products/bulk',
//     GET: id => `/products/${id}`,
//     UPDATE: id => `/products/${id}`,
//     DELETE: id => `/products/${id}`,
//     CATEGORIES: '/products/categories',
//   },

//   INVENTORY: {
//     LIST: '/inventory',
//     ADJUST: '/inventory/adjust',
//     BULK_ADJUST: '/inventory/bulk-adjust',
//     LOW_STOCK: '/inventory/low-stock',
//     SUMMARY: '/inventory/summary',
//     BY_PRODUCT: productId => `/inventory/product/${productId}`,
//   },

//   TRANSACTIONS: {
//     LIST: '/transactions',
//     CREATE: '/transactions',
//     GET: id => `/transactions/${id}`,
//     GET_QR: id => `/transactions/${id}/qrs`,
//     GET_RECEIPT: id => `/transactions/${id}/receipt`,
//     PRINT_RECEIPT: id => `/transactions/${id}/receipt/print`,
//     ADD_ITEM: id => `/transactions/${id}/items`,
//     GENERATE_SALES_QR: id => `/transactions/${id}/sales-qr`,
//     PROCESS_PAYMENT: id => `/transactions/${id}/payment`,
//     RELEASE_STOCK: id => `/transactions/${id}/release`,
//     COMPLETE: id => `/transactions/${id}/complete`,
//     VALIDATE_QR: '/transactions/validate-qr',
//   },

//   PAYMENTS: {
//     PAYMENTS: '/payments',
//     PROCESS: id => `/payments/process/${id}`,
//     REFUND: id => `/payments/refund/${id}`,
//     BY_TRANSACTION: id => `/payments/transaction/${id}`,
//     STATS: '/payments/stats',
//   },

//   WAREHOUSE: {
//     STATS: '/warehouse/stats',
//     TRANSACTIONS: '/warehouse/transactions',
//     GET_TRANSACTION: id => `/warehouse/transactions/${id}`,
//     RELEASE: id => `/warehouse/transactions/${id}/release`,
//     COMPLETE: id => `/warehouse/transactions/${id}/complete`,
//     INVENTORY_ITEM: id => `/warehouse/inventory/${id}`,
//     BULK_LOCATIONS: '/warehouse/inventory/locations',
//   },

//   REPORTS: {
//     SALES: '/reports/sales',
//     INVENTORY: '/reports/inventory',
//     FINANCIAL: '/reports/financial',
//     USER_PERFORMANCE: '/reports/user-performance',
//     PRODUCT_PERFORMANCE: '/reports/product-performance',
//     STORE_COMPARISON: '/reports/store-comparison',
//   },

//   RECEIPTS: {
//     GET: id => `/receipts/${id}`,
//     BY_TRANSACTION: id => `/receipts/transaction/${id}`,
//     GENERATE: id => `/receipts/${id}/generate`,
//     PRINT: id => `/receipts/${id}/print`,
//     DOWNLOAD: id => `/receipts/${id}/download`,
//   },

//   NOTIFICATIONS: {
//     LIST: '/notifications',
//     UNREAD_COUNT: '/notifications/unread-count',
//     MARK_READ: id => `/notifications/${id}/read`,
//     MARK_ALL_READ: '/notifications/read-all',
//     DELETE: id => `/notifications/${id}`,
//     DELETE_ALL: '/notifications',
//   },

//   ADMIN: {
//     STATS: '/admin/stats',
//     STORE_STATS: id => `/admin/stats/store/${id}`,
//     LOGS: '/admin/logs',
//     INTEGRITY: '/admin/integrity',
//     USER_ACTIVITY: id => `/admin/user/${id}/activity`,
//   },
// };

// export default ENDPOINTS;



























// constants/apiEndpoints.js
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: id => `/users/${id}`,
    UPDATE: id => `/users/${id}`,
    DELETE: id => `/users/${id}`,
    ME: '/users/me',
    STORES: '/users/stores',
    SWITCH_STORE: '/users/switch-store',
  },

  STORES: {
    LIST: '/stores',
    CREATE: '/stores',
    GET: id => `/stores/${id}`,
    UPDATE: id => `/stores/${id}`,
    DELETE: id => `/stores/${id}`,
    STATS: id => `/stores/${id}/stats`,
    OPTIONS: '/stores/options',
    BY_CODE: code => `/stores/by-code/${code}`,
  },

  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    BULK_CREATE: '/products/bulk',
    GET: id => `/products/${id}`,
    UPDATE: id => `/products/${id}`,
    DELETE: id => `/products/${id}`,
    CATEGORIES: '/products/categories',
  },

  INVENTORY: {
    LIST: '/inventory',
    ADJUST: '/inventory/adjust',
    BULK_ADJUST: '/inventory/bulk-adjust',
    LOW_STOCK: '/inventory/low-stock',
    SUMMARY: '/inventory/summary',
    BY_PRODUCT: productId => `/inventory/product/${productId}`,
  },

  // TRANSACTIONS: {
  //   LIST: '/transactions',
  //   CREATE: '/transactions',
  //   // NEW: Create transaction with items in one call
  //   CREATE_WITH_ITEMS: '/transactions/with-items',
  //   GET: id => `/transactions/${id}`,
  //   GET_QR: id => `/transactions/${id}/qrs`,
  //   GET_RECEIPT: id => `/transactions/${id}/receipt`,
  //   PRINT_RECEIPT: id => `/transactions/${id}/receipt/print`,
  //   ADD_ITEM: id => `/transactions/${id}/items`,
  //   // NEW: Batch add items
  //   ADD_BATCH_ITEMS: id => `/transactions/${id}/items/batch`,
  //   GENERATE_SALES_QR: id => `/transactions/${id}/sales-qr`,
  //   PROCESS_PAYMENT: id => `/transactions/${id}/payment`,
  //   RELEASE_STOCK: id => `/transactions/${id}/release`,
  //   COMPLETE: id => `/transactions/${id}/complete`,
  //   VALIDATE_QR: '/transactions/validate-qr',
  // },

  TRANSACTIONS: {
    LIST: '/transactions',
    CREATE: '/transactions',
    CREATE_WITH_ITEMS: '/transactions/with-items',
    GET: id => `/transactions/${id}`,
    GET_QR: id => `/transactions/${id}/qrs`,
    ADD_ITEM: id => `/transactions/${id}/items`,
    GENERATE_SALES_QR: id => `/transactions/${id}/sales-qr`,
    PROCESS_PAYMENT: id => `/transactions/${id}/payment`,
    RELEASE_STOCK: id => `/transactions/${id}/release`,
    COMPLETE: id => `/transactions/${id}/complete`,
    VALIDATE_QR: '/transactions/validate-qr',
    SCAN_SALES: '/transactions/scan/sales',
    SCAN_PAYMENT: '/transactions/scan/payment',
    SCAN_RELEASE: '/transactions/scan/release',
    SCAN_INVOICE: '/transactions/scan/invoice',
    GET_RECEIPT: id => `/transactions/${id}/receipt`,
    PRINT_RECEIPT: id => `/transactions/${id}/receipt/print`,
  },

  PAYMENTS: {
    PAYMENTS: '/payments',
    PROCESS: id => `/payments/process/${id}`,
    REFUND: id => `/payments/refund/${id}`,
    BY_TRANSACTION: id => `/payments/transaction/${id}`,
    STATS: '/payments/stats',
  },

  WAREHOUSE: {
    STATS: '/warehouse/stats',
    TRANSACTIONS: '/warehouse/transactions',
    GET_TRANSACTION: id => `/warehouse/transactions/${id}`,
    RELEASE: id => `/warehouse/transactions/${id}/release`,
    COMPLETE: id => `/warehouse/transactions/${id}/complete`,
    INVENTORY_ITEM: id => `/warehouse/inventory/${id}`,
    BULK_LOCATIONS: '/warehouse/inventory/locations',
  },

  REPORTS: {
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
    FINANCIAL: '/reports/financial',
    USER_PERFORMANCE: '/reports/user-performance',
    PRODUCT_PERFORMANCE: '/reports/product-performance',
    STORE_COMPARISON: '/reports/store-comparison',
  },

  RECEIPTS: {
    LIST: '/receipts',
    GET: id => `/receipts/${id}`,
    PREVIEW: id => `/receipts/${id}/preview`,
    BY_TRANSACTION: id => `/receipts/transaction/${id}`,
    GENERATE: '/receipts/generate',
    PRINT: id => `/receipts/${id}/print`,
    DOWNLOAD: id => `/receipts/${id}/download`,
  },

  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: id => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: id => `/notifications/${id}`,
    DELETE_ALL: '/notifications',
  },

  ADMIN: {
    STATS: '/admin/stats',
    STORE_STATS: id => `/admin/stats/store/${id}`,
    LOGS: '/admin/logs',
    INTEGRITY: '/admin/integrity',
    USER_ACTIVITY: id => `/admin/user/${id}/activity`,
  },
};

export default ENDPOINTS;