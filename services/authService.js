import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';

class AuthService {
  async login(email, password) {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data.data;
  }

  async refreshToken(refreshToken) {
    const response = await api.post(ENDPOINTS.AUTH.REFRESH, { refreshToken });
    return response.data.data;
  }

  async logout() {
    const response = await api.post(ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  }

  async getCurrentUser() {
    const response = await api.get(ENDPOINTS.AUTH.ME);
    return response.data.data;
  }

  async changePassword(currentPassword, newPassword) {
    const response = await api.put(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  async resetPassword(email) {
    const response = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, { email });
    return response.data;
  }
}

export default new AuthService();