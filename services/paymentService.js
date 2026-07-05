import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';

class PaymentService {

//   async getPayments (params) {
//   const response = await api.get(ENDPOINTS.PAYMENTS.PAYMENTS(), {
//     params,
//   });

//   return response.data.data;
// };

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
  async getPaymentStats(params = {}) {
    const response = await api.get(ENDPOINTS.PAYMENTS.STATS, { params });
    return response.data.data;
  }
}

export default new PaymentService();