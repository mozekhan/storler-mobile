import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';

class AdminService {
  /**
   * Get system stats
   */
  async getSystemStats() {
    const response = await api.get(ENDPOINTS.ADMIN.STATS);
    return response.data.data;
  }

  /**
   * Get store stats
   */
  async getStoreStats(storeId) {
    const response = await api.get(ENDPOINTS.ADMIN.STORE_STATS(storeId));
    return response.data.data;
  }

  /**
   * Get activity logs
   */
  async getActivityLogs(params = {}) {
    const response = await api.get(ENDPOINTS.ADMIN.LOGS, { params });
    return response.data.data;
  }

  /**
   * Verify system integrity
   */
  async verifySystemIntegrity() {
    const response = await api.get(ENDPOINTS.ADMIN.INTEGRITY);
    return response.data.data;
  }

  /**
   * Get user activity
   */
  async getUserActivity(userId, days = 30) {
    const response = await api.get(ENDPOINTS.ADMIN.USER_ACTIVITY(userId), {
      params: { days },
    });
    return response.data.data;
  }
}

export default new AdminService();