
// import api from './api';
// import ENDPOINTS from '../constants/apiEndpoints';

// class InventoryService {
//   /**
//    * Get inventory with filters
//    * Supports: page, limit, lowStock, outOfStock, search, category, sortBy, sortOrder
//    */
//   async getInventory(params = {}) {
//     const response = await api.get(ENDPOINTS.INVENTORY.LIST, { params });
//     return response.data.data;
//   }

//   /**
//    * Adjust stock for a product
//    * @param {string} productId - Product ID
//    * @param {number} quantity - Positive to add, negative to remove
//    * @param {string} reason - Reason for adjustment
//    */
//   async adjustStock(productId, quantity, reason) {
//     const response = await api.post(ENDPOINTS.INVENTORY.ADJUST, {
//       productId,
//       quantity,
//       reason,
//     });
//     return response.data.data;
//   }

//   /**
//    * Bulk adjust stock for multiple products
//    * @param {Array} adjustments - Array of { productId, quantity, reason }
//    */
//   async bulkAdjustStock(adjustments) {
//     const response = await api.post(ENDPOINTS.INVENTORY.BULK_ADJUST, { adjustments });
//     return response.data.data;
//   }

//   /**
//    * Get low stock items for current store
//    */
//   async getLowStockItems() {
//     const response = await api.get(ENDPOINTS.INVENTORY.LOW_STOCK);
//     return response.data.data;
//   }

//   /**
//    * Get inventory summary for current store
//    */
//   async getInventorySummary() {
//     const response = await api.get(ENDPOINTS.INVENTORY.SUMMARY);
//     return response.data.data;
//   }

//   /**
//    * Get inventory by product ID
//    * @param {string} productId - Product ID
//    */
//   async getInventoryByProduct(productId) {
//     const response = await api.get(ENDPOINTS.INVENTORY.BY_PRODUCT(productId));
//     return response.data.data;
//   }
// }

// export default new InventoryService();





























// services/inventoryService.js
import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';
import AuthService from './authService';

class InventoryService {
  /**
   * Get inventory with filters
   * Supports: page, limit, lowStock, outOfStock, search, category, sortBy, sortOrder, storeId
   */
  async getInventory(params = {}) {
    const user = await AuthService.getCurrentUser();
    const queryParams = { ...params };

    // Super Admin must provide storeId
    if (user?.role === 'SUPER_ADMIN') {
      // If storeId is not provided, use the current store from context or return error
      if (!queryParams.storeId) {
        // Try to get from currentStoreId
        const currentStoreId = user.currentStoreId?._id || user.currentStoreId;
        if (currentStoreId) {
          queryParams.storeId = currentStoreId;
        }
        // If still no storeId, we'll let the API handle it
      }
    }

    const response = await api.get(ENDPOINTS.INVENTORY.LIST, { params: queryParams });
    return response.data.data;
  }

  /**
   * Adjust stock for a product
   * @param {string} productId - Product ID
   * @param {number} quantity - Positive to add, negative to remove
   * @param {string} reason - Reason for adjustment
   * @param {string} storeId - Store ID (required for Super Admin)
   */
  async adjustStock(productId, quantity, reason, storeId = null) {
    const user = await AuthService.getCurrentUser();
    const payload = {
      productId,
      quantity,
      reason,
    };

    // Super Admin must provide storeId
    if (user?.role === 'SUPER_ADMIN') {
      if (!storeId) {
        // Try to get from currentStoreId
        storeId = user.currentStoreId?._id || user.currentStoreId;
      }
      if (!storeId) {
        throw new Error('Store ID is required for Super Admin. Please select a store.');
      }
      payload.storeId = storeId;
    }

    const response = await api.post(ENDPOINTS.INVENTORY.ADJUST, payload);
    return response.data.data;
  }

  /**
   * Bulk adjust stock for multiple products
   * @param {Array} adjustments - Array of { productId, quantity, reason }
   * @param {string} storeId - Store ID (required for Super Admin)
   */
  async bulkAdjustStock(adjustments, storeId = null) {
    const user = await AuthService.getCurrentUser();
    const payload = { adjustments };

    // Super Admin must provide storeId
    if (user?.role === 'SUPER_ADMIN') {
      if (!storeId) {
        storeId = user.currentStoreId?._id || user.currentStoreId;
      }
      if (!storeId) {
        throw new Error('Store ID is required for Super Admin. Please select a store.');
      }
      payload.storeId = storeId;
    }

    const response = await api.post(ENDPOINTS.INVENTORY.BULK_ADJUST, payload);
    return response.data.data;
  }

  /**
   * Get low stock items for current store
   * @param {string} storeId - Store ID (required for Super Admin)
   */
  async getLowStockItems(storeId = null) {
    const user = await AuthService.getCurrentUser();
    const params = {};

    // Super Admin must provide storeId (optional - returns all stores if not provided)
    if (user?.role === 'SUPER_ADMIN') {
      if (storeId) {
        params.storeId = storeId;
      }
    }

    const response = await api.get(ENDPOINTS.INVENTORY.LOW_STOCK, { params });
    return response.data.data;
  }

  /**
   * Get inventory summary for current store
   * @param {string} storeId - Store ID (required for Super Admin)
   */
  async getInventorySummary(storeId = null) {
    const user = await AuthService.getCurrentUser();
    const params = {};

    // Super Admin must provide storeId
    if (user?.role === 'SUPER_ADMIN') {
      if (!storeId) {
        storeId = user.currentStoreId?._id || user.currentStoreId;
      }
      if (!storeId) {
        throw new Error('Store ID is required for Super Admin. Please select a store.');
      }
      params.storeId = storeId;
    }

    const response = await api.get(ENDPOINTS.INVENTORY.SUMMARY, { params });
    return response.data.data;
  }

  /**
   * Get inventory by product ID
   * @param {string} productId - Product ID
   * @param {string} storeId - Store ID (required for Super Admin)
   */
  async getInventoryByProduct(productId, storeId = null) {
    const user = await AuthService.getCurrentUser();
    const params = {};

    // Super Admin must provide storeId
    if (user?.role === 'SUPER_ADMIN') {
      if (!storeId) {
        storeId = user.currentStoreId?._id || user.currentStoreId;
      }
      if (!storeId) {
        throw new Error('Store ID is required for Super Admin. Please select a store.');
      }
      params.storeId = storeId;
    }

    const response = await api.get(ENDPOINTS.INVENTORY.BY_PRODUCT(productId), { params });
    return response.data.data;
  }
}

export default new InventoryService();