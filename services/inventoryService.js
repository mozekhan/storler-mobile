// import api from './api';
// import ENDPOINTS from '../constants/apiEndpoints';

// class InventoryService {
//   /**
//    * Get inventory with filters
//    */
//   async getInventory(params = {}) {
//     const response = await api.get(ENDPOINTS.INVENTORY.LIST, { params });
//     return response.data.data;
//   }

//   /**
//    * Adjust stock
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
//    * Bulk adjust stock
//    */
//   async bulkAdjustStock(adjustments) {
//     const response = await api.post(ENDPOINTS.INVENTORY.BULK_ADJUST, { adjustments });
//     return response.data.data;
//   }

//   /**
//    * Get low stock items
//    */
//   async getLowStockItems() {
//     const response = await api.get(ENDPOINTS.INVENTORY.LOW_STOCK);
//     return response.data.data;
//   }

//   /**
//    * Get inventory summary
//    */
//   async getInventorySummary() {
//     const response = await api.get(ENDPOINTS.INVENTORY.SUMMARY);
//     return response.data.data;
//   }

//   /**
//    * Get inventory by product
//    */
//   async getInventoryByProduct(productId) {
//     const response = await api.get(ENDPOINTS.INVENTORY.BY_PRODUCT(productId));
//     return response.data.data;
//   }
// }

// export default new InventoryService();























import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';

class InventoryService {
  /**
   * Get inventory with filters
   * Supports: page, limit, lowStock, outOfStock, search, category, sortBy, sortOrder
   */
  async getInventory(params = {}) {
    const response = await api.get(ENDPOINTS.INVENTORY.LIST, { params });
    return response.data.data;
  }

  /**
   * Adjust stock for a product
   * @param {string} productId - Product ID
   * @param {number} quantity - Positive to add, negative to remove
   * @param {string} reason - Reason for adjustment
   */
  async adjustStock(productId, quantity, reason) {
    const response = await api.post(ENDPOINTS.INVENTORY.ADJUST, {
      productId,
      quantity,
      reason,
    });
    return response.data.data;
  }

  /**
   * Bulk adjust stock for multiple products
   * @param {Array} adjustments - Array of { productId, quantity, reason }
   */
  async bulkAdjustStock(adjustments) {
    const response = await api.post(ENDPOINTS.INVENTORY.BULK_ADJUST, { adjustments });
    return response.data.data;
  }

  /**
   * Get low stock items for current store
   */
  async getLowStockItems() {
    const response = await api.get(ENDPOINTS.INVENTORY.LOW_STOCK);
    return response.data.data;
  }

  /**
   * Get inventory summary for current store
   */
  async getInventorySummary() {
    const response = await api.get(ENDPOINTS.INVENTORY.SUMMARY);
    return response.data.data;
  }

  /**
   * Get inventory by product ID
   * @param {string} productId - Product ID
   */
  async getInventoryByProduct(productId) {
    const response = await api.get(ENDPOINTS.INVENTORY.BY_PRODUCT(productId));
    return response.data.data;
  }
}

export default new InventoryService();