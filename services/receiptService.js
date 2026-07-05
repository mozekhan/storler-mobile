// import api from './api';
// import ENDPOINTS from '../constants/apiEndpoints';

// class ReceiptService {
//   /**
//    * Get receipt by ID
//    */
//   async getReceipt(id) {
//     const response = await api.get(ENDPOINTS.RECEIPTS.GET(id));
//     return response.data.data;
//   }

//   /**
//    * Get receipts by transaction
//    */
//   async getReceiptsByTransaction(transactionId) {
//     const response = await api.get(ENDPOINTS.RECEIPTS.BY_TRANSACTION(transactionId));
//     return response.data.data;
//   }

//   /**
//    * Generate receipt PDF
//    */
//   async generateReceipt(id) {
//     const response = await api.post(ENDPOINTS.RECEIPTS.GENERATE(id));
//     return response.data.data;
//   }

//   /**
//    * Mark receipt as printed
//    */
//   async markAsPrinted(id) {
//     const response = await api.post(ENDPOINTS.RECEIPTS.PRINT(id));
//     return response.data.data;
//   }

//   /**
//    * Download receipt
//    */
//   async downloadReceipt(id) {
//     const response = await api.get(ENDPOINTS.RECEIPTS.DOWNLOAD(id), {
//       responseType: 'blob',
//     });
//     return response.data;
//   }
// }

// export default new ReceiptService();























// services/receiptService.js
import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';

class ReceiptService {
  /**
   * Get all receipts with pagination and filters
   * Supports: page, limit, type, startDate, endDate, search, storeId
   */
  async getReceipts(params = {}) {
    const response = await api.get(ENDPOINTS.RECEIPTS.LIST, { params });
    return response.data.data;
  }

  /**
   * Get receipt by ID with full details
   */
  async getReceipt(id) {
    const response = await api.get(ENDPOINTS.RECEIPTS.GET(id));
    return response.data.data;
  }

  /**
   * Get receipt preview with formatted text and QR code
   */
  async getReceiptPreview(id) {
    const response = await api.get(ENDPOINTS.RECEIPTS.PREVIEW(id));
    return response.data.data;
  }

  /**
   * Get receipts by transaction with optional type filter
   */
  async getReceiptsByTransaction(transactionId, type = null) {
    const params = type ? { type } : {};
    const response = await api.get(ENDPOINTS.RECEIPTS.BY_TRANSACTION(transactionId), { params });
    return response.data.data;
  }

  /**
   * Generate a new receipt for a transaction
   * type: 'SALES' | 'PAYMENT' | 'INVOICE' | 'FINAL'
   */
  async generateReceipt(transactionId, type) {
    const response = await api.post(ENDPOINTS.RECEIPTS.GENERATE, { transactionId, type });
    return response.data.data;
  }

  /**
   * Mark receipt as printed
   */
  async markAsPrinted(id) {
    const response = await api.post(ENDPOINTS.RECEIPTS.PRINT(id));
    return response.data.data;
  }

  /**
   * Download receipt PDF
   */
  async downloadReceipt(id) {
    const response = await api.get(ENDPOINTS.RECEIPTS.DOWNLOAD(id), {
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Get formatted receipt text for a transaction
   */
  async getFormattedReceipt(transactionId, type = 'SALES') {
    try {
      const receipts = await this.getReceiptsByTransaction(transactionId, type);
      if (receipts && receipts.length > 0) {
        const preview = await this.getReceiptPreview(receipts[0]._id);
        return preview.formattedText || '';
      }
      return '';
    } catch (error) {
      console.error('Error getting formatted receipt:', error);
      return '';
    }
  }

  /**
   * Get QR code for a receipt
   */
  async getReceiptQRCode(id) {
    try {
      const receipt = await this.getReceipt(id);
      return receipt.qrCode || null;
    } catch (error) {
      console.error('Error getting QR code:', error);
      return null;
    }
  }
}

export default new ReceiptService();