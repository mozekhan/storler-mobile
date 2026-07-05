import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';

class UserService {
  /**
   * Get users
   */
  async getUsers(params = {}) {
    const response = await api.get(ENDPOINTS.USERS.LIST, { params });
    return response.data.data;
  }

  /**
   * Get user by ID
   */
  async getUser(id) {
    const response = await api.get(ENDPOINTS.USERS.GET(id));
    return response.data.data;
  }

  /**
   * Create user
   */
  async createUser(userData) {
    const response = await api.post(ENDPOINTS.USERS.CREATE, userData);
    return response.data.data;
  }

  /**
   * Update user
   */
  async updateUser(id, userData) {
    const response = await api.put(ENDPOINTS.USERS.UPDATE(id), userData);
    return response.data.data;
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    const response = await api.delete(ENDPOINTS.USERS.DELETE(id));
    return response.data;
  }
}

export default new UserService();