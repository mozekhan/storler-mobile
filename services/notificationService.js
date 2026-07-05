import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';

class NotificationService {
  /**
   * Get notifications
   */
  async getNotifications(params = {}) {
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.LIST, { params });
    return response.data.data;
  }

  /**
   * Get unread count
   */
  async getUnreadCount() {
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return response.data.data;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    const response = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId));
    return response.data.data;
  }

  /**
   * Mark all as read
   */
  async markAllAsRead() {
    const response = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    return response.data.data;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId) {
    const response = await api.delete(ENDPOINTS.NOTIFICATIONS.DELETE(notificationId));
    return response.data.data;
  }

  /**
   * Delete all notifications
   */
  async deleteAllNotifications() {
    const response = await api.delete(ENDPOINTS.NOTIFICATIONS.DELETE_ALL);
    return response.data.data;
  }
}

export default new NotificationService();