// // services/transactionService.js
// import api from './api';
// import ENDPOINTS from '../constants/apiEndpoints';

// class TransactionService {
//   /**
//    * Create transaction with items - generates Sales QR
//    */
//   async createTransactionWithItems(items) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.CREATE_WITH_ITEMS, { items });
//     return response.data.data;
//   }

//   /**
//    * Get transaction by ID with full details.
//    *
//    * The backend responds with `{ transaction, receiptData }`.
//    * This flattens the response so callers can access transaction fields directly.
//    * CRITICAL: Preserves the raw QR string (qrCode) for printing/scanning.
//    */
//   async getTransaction(id) {
//     const response = await api.get(ENDPOINTS.TRANSACTIONS.GET(id));
//     const payload = response.data.data;

//     if (payload && payload.transaction) {
//       const transaction = payload.transaction;
//       const receiptData = payload.receiptData ?? transaction.receiptData ?? null;
      
//       // Ensure receiptData has the correct QR code fields
//       if (receiptData && receiptData.qrCodes) {
//         // The raw QR string is what should be printed and scanned
//         receiptData.qrCode = receiptData.qrCodes.salesQRData || 
//                              receiptData.qrCodes.paymentQRData || 
//                              receiptData.qrCodes.releaseQRData || 
//                              receiptData.qrCodes.invoiceQRData || null;
        
//         // The QR image is for display only
//         receiptData.qrCodeImage = receiptData.qrCodes.salesQR || 
//                                   receiptData.qrCodes.paymentQR || 
//                                   receiptData.qrCodes.releaseQR || 
//                                   receiptData.qrCodes.invoiceQR || null;
//       }
      
//       return {
//         ...transaction,
//         receiptData: receiptData,
//       };
//     }

//     return payload;
//   }

//   /**
//    * Get all QR codes for a transaction
//    */
//   async getTransactionQRs(id) {
//     const response = await api.get(ENDPOINTS.TRANSACTIONS.GET_QR(id));
//     return response.data.data;
//   }

//   /**
//    * Get transactions with filters
//    */
//   async getTransactions(params = {}) {
//     const response = await api.get(ENDPOINTS.TRANSACTIONS.LIST, { params });
//     return response.data.data;
//   }

//   /**
//    * Add single item to transaction
//    */
//   async addItem(transactionId, productId, quantity) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.ADD_ITEM(transactionId), {
//       productId,
//       quantity,
//     });
//     return response.data.data;
//   }

//   /**
//    * Generate Sales QR manually
//    */
//   async generateSalesQR(transactionId) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.GENERATE_SALES_QR(transactionId));
//     return response.data.data;
//   }

//   /**
//    * Scan Sales QR - Show transaction details for payment
//    */
//   async scanSalesQR(qrData) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.SCAN_SALES, { qrData });
//     return response.data.data;
//   }

//   /**
//    * Scan Payment QR - Show transaction details for warehouse release
//    */
//   async scanPaymentQR(qrData) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.SCAN_PAYMENT, { qrData });
//     return response.data.data;
//   }

//   /**
//    * Scan Release QR - Show transaction details for invoice
//    */
//   async scanReleaseQR(qrData) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.SCAN_RELEASE, { qrData });
//     return response.data.data;
//   }

//   /**
//    * Scan Invoice QR - Complete transaction
//    */
//   async scanInvoiceQR(qrData) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.SCAN_INVOICE, { qrData });
//     return response.data.data;
//   }

//   /**
//    * Validate any QR
//    */
//   async validateQR(qrData) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.VALIDATE_QR, { qrData });
//     return response.data.data;
//   }

//   /**
//    * Process payment - generates Payment QR
//    */
//   async processPayment(transactionId, paymentMethod, amountPaid, reference, details) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.PROCESS_PAYMENT(transactionId), {
//       paymentMethod,
//       amountPaid,
//       reference,
//       details,
//     });
//     return response.data.data;
//   }

//   /**
//    * Release stock - generates Release QR
//    */
//   async releaseStock(transactionId, releasedItems) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.RELEASE_STOCK(transactionId), {
//       releasedItems,
//     });
//     return response.data.data;
//   }

//   /**
//    * Get receipt data
//    */
//   async getReceipt(transactionId) {
//     const response = await api.get(ENDPOINTS.TRANSACTIONS.GET_RECEIPT(transactionId));
//     return response.data.data;
//   }
// }

// export default new TransactionService();






























// services/transactionService.js
import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';
import AuthService from './authService';

class TransactionService {
  /**
   * Create transaction with items - generates Sales QR
   * @param {Array} items - Array of { productId, quantity }
   * @param {string} storeId - Store ID (required for Super Admin)
   */
  async createTransactionWithItems(items, storeId = null) {
    const user = await AuthService.getCurrentUser();
    const payload = { items };

    // Super Admin must provide storeId
    if (user?.role === 'SUPER_ADMIN') {
      if (!storeId) {
        storeId = user.currentStoreId?._id || user.currentStoreId;
      }
      if (!storeId) {
        throw new Error('Store ID is required for Super Admin. Please select a store.');
      }
      payload.storeId = storeId;
    }

    const response = await api.post(ENDPOINTS.TRANSACTIONS.CREATE_WITH_ITEMS, payload);
    return response.data.data;
  }

  /**
   * Get transaction by ID with full details.
   * The backend responds with `{ transaction, receiptData }`.
   * This flattens the response so callers can access transaction fields directly.
   * CRITICAL: Preserves the raw QR string (qrCode) for printing/scanning.
   */
  async getTransaction(id) {
    const response = await api.get(ENDPOINTS.TRANSACTIONS.GET(id));
    const payload = response.data.data;

    if (payload && payload.transaction) {
      const transaction = payload.transaction;
      const receiptData = payload.receiptData ?? transaction.receiptData ?? null;
      
      // Ensure receiptData has the correct QR code fields
      if (receiptData && receiptData.qrCodes) {
        // The raw QR string is what should be printed and scanned
        receiptData.qrCode = receiptData.qrCodes.salesQRData || 
                             receiptData.qrCodes.paymentQRData || 
                             receiptData.qrCodes.releaseQRData || 
                             receiptData.qrCodes.invoiceQRData || null;
        
        // The QR image is for display only
        receiptData.qrCodeImage = receiptData.qrCodes.salesQR || 
                                  receiptData.qrCodes.paymentQR || 
                                  receiptData.qrCodes.releaseQR || 
                                  receiptData.qrCodes.invoiceQR || null;
      }
      
      return {
        ...transaction,
        receiptData: receiptData,
      };
    }

    return payload;
  }

  /**
   * Get all QR codes for a transaction
   */
  async getTransactionQRs(id) {
    const response = await api.get(ENDPOINTS.TRANSACTIONS.GET_QR(id));
    return response.data.data;
  }

  /**
   * Get transactions with filters
   * @param {Object} params - { status, limit, page, storeId, startDate, endDate }
   */
  async getTransactions(params = {}) {
    const user = await AuthService.getCurrentUser();
    const queryParams = { ...params };

    // Super Admin can filter by store
    if (user?.role === 'SUPER_ADMIN') {
      // If storeId is not provided, use currentStoreId
      if (!queryParams.storeId) {
        const storeId = user.currentStoreId?._id || user.currentStoreId;
        if (storeId) {
          queryParams.storeId = storeId;
        }
      }
    }

    const response = await api.get(ENDPOINTS.TRANSACTIONS.LIST, { params: queryParams });
    return response.data.data;
  }

  /**
   * Add single item to transaction
   */
  async addItem(transactionId, productId, quantity) {
    const response = await api.post(ENDPOINTS.TRANSACTIONS.ADD_ITEM(transactionId), {
      productId,
      quantity,
    });
    return response.data.data;
  }

  /**
   * Generate Sales QR manually
   */
  async generateSalesQR(transactionId) {
    const response = await api.post(ENDPOINTS.TRANSACTIONS.GENERATE_SALES_QR(transactionId));
    return response.data.data;
  }

  /**
   * Scan Sales QR - Show transaction details for payment
   */
  async scanSalesQR(qrData) {
    const response = await api.post(ENDPOINTS.TRANSACTIONS.SCAN_SALES, { qrData });
    return response.data.data;
  }

  /**
   * Scan Payment QR - Show transaction details for warehouse release
   */
  async scanPaymentQR(qrData) {
    const response = await api.post(ENDPOINTS.TRANSACTIONS.SCAN_PAYMENT, { qrData });
    return response.data.data;
  }

  /**
   * Scan Release QR - Show transaction details for invoice
   */
  async scanReleaseQR(qrData) {
    const response = await api.post(ENDPOINTS.TRANSACTIONS.SCAN_RELEASE, { qrData });
    return response.data.data;
  }

  /**
   * Scan Invoice QR - Complete transaction
   */
  async scanInvoiceQR(qrData) {
    const response = await api.post(ENDPOINTS.TRANSACTIONS.SCAN_INVOICE, { qrData });
    return response.data.data;
  }

  /**
   * Validate any QR
   */
  async validateQR(qrData) {
    const response = await api.post(ENDPOINTS.TRANSACTIONS.VALIDATE_QR, { qrData });
    return response.data.data;
  }

  /**
   * Process payment - generates Payment QR
   * @param {string} transactionId - Transaction ID
   * @param {string} paymentMethod - CASH, CARD, TRANSFER, MOBILE_MONEY, CREDIT
   * @param {number} amountPaid - Amount paid
   * @param {string} reference - Optional reference number
   * @param {Object} details - Optional payment details
   */
  async processPayment(transactionId, paymentMethod, amountPaid, reference, details) {
    const response = await api.post(ENDPOINTS.TRANSACTIONS.PROCESS_PAYMENT(transactionId), {
      paymentMethod,
      amountPaid,
      reference,
      details,
    });
    return response.data.data;
  }

  /**
   * Release stock - generates Release QR
   * @param {string} transactionId - Transaction ID
   * @param {Array} releasedItems - Array of { productId, quantity }
   */
  async releaseStock(transactionId, releasedItems) {
    const response = await api.post(ENDPOINTS.TRANSACTIONS.RELEASE_STOCK(transactionId), {
      releasedItems,
    });
    return response.data.data;
  }

  /**
   * Get receipt data
   */
  async getReceipt(transactionId) {
    const response = await api.get(ENDPOINTS.TRANSACTIONS.GET_RECEIPT(transactionId));
    return response.data.data;
  }
}

export default new TransactionService();