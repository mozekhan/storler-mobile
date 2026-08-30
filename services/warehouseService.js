// import api from './api';
// import ENDPOINTS from '../constants/apiEndpoints';

// class WarehouseService {
//   /**
//    * Get warehouse dashboard stats
//    * Returns: pendingReleases, totalProducts, totalInventory, lowStockItems, recentTransactions
//    */
//   async getStats() {
//     const response = await api.get(ENDPOINTS.WAREHOUSE.STATS);
//     return response.data.data;
//   }

//   /**
//    * Get warehouse transactions with filters
//    * Supports: page, limit, status, startDate, endDate
//    */
//   async getTransactions(params = {}) {
//     const response = await api.get(ENDPOINTS.WAREHOUSE.TRANSACTIONS, { params });
//     return response.data.data;
//   }

//   /**
//    * Get transaction details for warehouse processing
//    * @param {string} id - Transaction ID
//    */
//   async getTransactionForWarehouse(id) {
//     const response = await api.get(ENDPOINTS.WAREHOUSE.GET_TRANSACTION(id));
//     return response.data.data;
//   }

//   /**
//    * Release stock for a transaction
//    * @param {string} transactionId - Transaction ID
//    * @param {Array} releasedItems - Array of { productId, quantity }
//    */
//   async releaseStock(transactionId, releasedItems) {
//     const response = await api.post(ENDPOINTS.WAREHOUSE.RELEASE(transactionId), {
//       releasedItems,
//     });
//     return response.data.data;
//   }

//   /**
//    * Complete a transaction (mark as completed)
//    * @param {string} transactionId - Transaction ID
//    */
//   async completeTransaction(transactionId) {
//     const response = await api.post(ENDPOINTS.WAREHOUSE.COMPLETE(transactionId));
//     return response.data.data;
//   }

//   /**
//    * Get inventory item details for warehouse
//    * @param {string} productId - Product ID
//    */
//   async getInventoryItem(productId) {
//     const response = await api.get(ENDPOINTS.WAREHOUSE.INVENTORY_ITEM(productId));
//     return response.data.data;
//   }

//   /**
//    * Bulk update inventory warehouse locations
//    * @param {Array} updates - Array of { productId, location: { aisle, shelf, bin } }
//    */
//   async bulkUpdateLocations(updates) {
//     const response = await api.put(ENDPOINTS.WAREHOUSE.BULK_LOCATIONS, { updates });
//     return response.data.data;
//   }

//   /**
//    * Get release queue (transactions ready for release)
//    * Uses transactions endpoint with PAYMENT_QR status
//    */
//   async getReleaseQueue() {
//     const response = await api.get(ENDPOINTS.TRANSACTIONS.LIST, {
//       params: { status: 'PAYMENT_QR', limit: 20 },
//     });
//     return response.data.data;
//   }
// }

// export default new WarehouseService();
































// services/warehouseService.js
import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';
import AuthService from './authService';

class WarehouseService {
  /**
   * Get warehouse dashboard stats
   * @param {string} storeId - Store ID (required for Super Admin)
   */
  async getStats(storeId = null) {
    const user = await AuthService.getCurrentUser();
    const params = {};
    
    if (user?.role === 'SUPER_ADMIN') {
      if (!storeId) {
        storeId = user.currentStoreId?._id || user.currentStoreId;
      }
      if (storeId) {
        params.storeId = storeId;
      }
    }
    
    const response = await api.get(ENDPOINTS.WAREHOUSE.STATS, { params });
    return response.data.data;
  }

  /**
   * Get warehouse transactions with filters
   * Supports: page, limit, status, startDate, endDate, storeId
   */
  async getTransactions(params = {}) {
    const user = await AuthService.getCurrentUser();
    const queryParams = { ...params };

    if (user?.role === 'SUPER_ADMIN') {
      if (!queryParams.storeId) {
        const storeId = user.currentStoreId?._id || user.currentStoreId;
        if (storeId) {
          queryParams.storeId = storeId;
        }
      }
    }

    const response = await api.get(ENDPOINTS.WAREHOUSE.TRANSACTIONS, { params: queryParams });
    return response.data.data;
  }

  /**
   * Get transaction details for warehouse processing
   * @param {string} id - Transaction ID
   */
  async getTransactionForWarehouse(id) {
    const response = await api.get(ENDPOINTS.WAREHOUSE.GET_TRANSACTION(id));
    return response.data.data;
  }

  /**
   * Release stock for a transaction
   * @param {string} transactionId - Transaction ID
   * @param {Array} releasedItems - Array of { productId, quantity }
   */
  async releaseStock(transactionId, releasedItems) {
    const response = await api.post(ENDPOINTS.WAREHOUSE.RELEASE(transactionId), {
      releasedItems,
    });
    return response.data.data;
  }

  /**
   * Complete a transaction (mark as completed)
   * @param {string} transactionId - Transaction ID
   */
  async completeTransaction(transactionId) {
    const response = await api.post(ENDPOINTS.WAREHOUSE.COMPLETE(transactionId));
    return response.data.data;
  }

  /**
   * Get inventory item details for warehouse
   * @param {string} productId - Product ID
   * @param {string} storeId - Store ID (required for Super Admin)
   */
  async getInventoryItem(productId, storeId = null) {
    const user = await AuthService.getCurrentUser();
    const params = {};
    
    if (user?.role === 'SUPER_ADMIN') {
      if (!storeId) {
        storeId = user.currentStoreId?._id || user.currentStoreId;
      }
      if (storeId) {
        params.storeId = storeId;
      }
    }
    
    const response = await api.get(ENDPOINTS.WAREHOUSE.INVENTORY_ITEM(productId), { params });
    return response.data.data;
  }

  /**
   * Bulk update inventory warehouse locations
   * @param {Array} updates - Array of { productId, location: { aisle, shelf, bin } }
   */
  async bulkUpdateLocations(updates) {
    const response = await api.put(ENDPOINTS.WAREHOUSE.BULK_LOCATIONS, { updates });
    return response.data.data;
  }

  /**
   * Get release queue (transactions ready for release)
   * @param {string} storeId - Store ID (required for Super Admin)
   */
  async getReleaseQueue(storeId = null) {
    const user = await AuthService.getCurrentUser();
    const params = { status: 'PAYMENT_QR', limit: 20 };
    
    if (user?.role === 'SUPER_ADMIN') {
      if (!storeId) {
        storeId = user.currentStoreId?._id || user.currentStoreId;
      }
      if (storeId) {
        params.storeId = storeId;
      }
    }
    
    const response = await api.get(ENDPOINTS.TRANSACTIONS.LIST, { params });
    return response.data.data;
  }
}

export default new WarehouseService();