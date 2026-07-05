import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';

class ReportService {
  /**
   * Generate sales report
   */
  async getSalesReport(startDate, endDate, storeId) {
    const response = await api.get(ENDPOINTS.REPORTS.SALES, {
      params: { startDate, endDate, storeId },
    });
    return response.data.data;
  }

  /**
   * Generate inventory report
   */
  async getInventoryReport(storeId) {
    const response = await api.get(ENDPOINTS.REPORTS.INVENTORY, {
      params: { storeId },
    });
    return response.data.data;
  }

  /**
   * Generate financial report
   */
  async getFinancialReport(startDate, endDate, storeId) {
    const response = await api.get(ENDPOINTS.REPORTS.FINANCIAL, {
      params: { startDate, endDate, storeId },
    });
    return response.data.data;
  }

  /**
   * Generate user performance report
   */
  async getUserPerformanceReport(startDate, endDate, storeId) {
    const response = await api.get(ENDPOINTS.REPORTS.USER_PERFORMANCE, {
      params: { startDate, endDate, storeId },
    });
    return response.data.data;
  }

  /**
   * Generate product performance report
   */
  async getProductPerformanceReport(startDate, endDate, storeId) {
    const response = await api.get(ENDPOINTS.REPORTS.PRODUCT_PERFORMANCE, {
      params: { startDate, endDate, storeId },
    });
    return response.data.data;
  }

  /**
   * Generate store comparison report
   */
  async getStoreComparisonReport(storeIds, startDate, endDate) {
    const response = await api.get(ENDPOINTS.REPORTS.STORE_COMPARISON, {
      params: { storeIds: storeIds.join(','), startDate, endDate },
    });
    return response.data.data;
  }
}

export default new ReportService();