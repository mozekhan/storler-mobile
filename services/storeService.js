import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';

class StoreService {
  /**
   * Get stores
   */
  async getStores(params = {}) {
    const response = await api.get(ENDPOINTS.STORES.LIST, { params });
    return response.data.data;
  }

  /**
   * Get store by ID
   */
  async getStore(id) {
    const response = await api.get(ENDPOINTS.STORES.GET(id));
    return response.data.data;
  }

  /**
   * Create store
   */
  async createStore(storeData) {
    const response = await api.post(ENDPOINTS.STORES.CREATE, storeData);
    return response.data.data;
  }

  /**
   * Update store
   */
  async updateStore(id, storeData) {
    const response = await api.put(ENDPOINTS.STORES.UPDATE(id), storeData);
    return response.data.data;
  }

  /**
   * Delete store
   */
  async deleteStore(id) {
    const response = await api.delete(ENDPOINTS.STORES.DELETE(id));
    return response.data;
  }

  /**
   * Get store stats
   */
  async getStoreStats(id) {
    const response = await api.get(ENDPOINTS.STORES.STATS(id));
    return response.data.data;
  }

  /**
   * Get store options
   */
  async getStoreOptions() {
    const response = await api.get(ENDPOINTS.STORES.OPTIONS);
    return response.data.data;
  }

  /**
   * Get store by code
   */
  async getStoreByCode(code) {
    const response = await api.get(ENDPOINTS.STORES.BY_CODE(code));
    return response.data.data;
  }
}

export default new StoreService();