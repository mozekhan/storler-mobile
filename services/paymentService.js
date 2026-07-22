import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';

class PaymentService {


 async getPayments(params = {}) {
    const response = await api.get(ENDPOINTS.PAYMENTS.PAYMENTS, { params });
    return response.data.data;
  }
  /**
   * Process payment
   */
  async processPayment(transactionId, paymentMethod, amountPaid, reference, details) {
    const response = await api.post(ENDPOINTS.PAYMENTS.PROCESS(transactionId), {
      paymentMethod,
      amountPaid,
      reference,
      details,
    });
    return response.data.data;
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId, reason) {
    const response = await api.post(ENDPOINTS.PAYMENTS.REFUND(paymentId), { reason });
    return response.data.data;
  }

  /**
   * Get payments by transaction
   */
  async getPaymentsByTransaction(transactionId) {
    const response = await api.get(ENDPOINTS.PAYMENTS.BY_TRANSACTION(transactionId));
    return response.data.data;
  }

  /**
   * Get payment statistics
   */
  // async getPaymentStats(params = {}) {
  //   const response = await api.get(ENDPOINTS.PAYMENTS.STATS, { params });
  //   return response.data.data;
  // }
  /**
   * Get payment statistics
   * @param {Object} params - { storeId, startDate, endDate }
   */
  async getPaymentStats(params = {}) {
    try {
      // Ensure storeId is present
      if (!params.storeId) {
        console.warn('storeId is required for payment stats');
        // Return empty stats to prevent errors
        return {
          byMethod: [],
          totals: { totalAmount: 0, totalCount: 0, averageAmount: 0 },
          refunds: { totalRefunded: 0, refundCount: 0 },
          summary: {
            totalRevenue: 0,
            totalTransactions: 0,
            averageTransactionValue: 0,
            totalRefunded: 0,
            refundCount: 0,
          }
        };
      }

      const response = await api.get(ENDPOINTS.PAYMENTS.STATS, { params });
      return response.data.data;
    } catch (error) {
      console.error('Get payment stats error:', error);
      // Return empty stats on error
      return {
        byMethod: [],
        totals: { totalAmount: 0, totalCount: 0, averageAmount: 0 },
        refunds: { totalRefunded: 0, refundCount: 0 },
        summary: {
          totalRevenue: 0,
          totalTransactions: 0,
          averageTransactionValue: 0,
          totalRefunded: 0,
          refundCount: 0,
        }
      };
    }
  }

  /**
   * Get payment summary for dashboard
   */
  // async getPaymentSummary(storeId) {
  //   try {
  //     const response = await api.get(ENDPOINTS.PAYMENTS.STATS, { 
  //       params: { storeId, summary: true } 
  //     });
  //     return response.data.data;
  //   } catch (error) {
  //     console.error('Get payment summary error:', error);
  //     return {
  //       totalRevenue: 0,
  //       totalTransactions: 0,
  //       todayRevenue: 0,
  //       todayTransactions: 0,
  //       pendingPayments: 0,
  //     };
  //   }
  // }

  async getPaymentSummary(params = {}) {
  try {
    if (!params.storeId) {
      throw new Error("storeId is required");
    }

    const response = await api.get(ENDPOINTS.PAYMENTS.STATS, {
      params: {
        ...params,
        summary: true,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Get payment summary error:", error);

    return {
      totalRevenue: 0,
      totalTransactions: 0,
      todayRevenue: 0,
      todayTransactions: 0,
      pendingPayments: 0,
    };
  }
}

}

export default new PaymentService();