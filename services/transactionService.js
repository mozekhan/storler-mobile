// // services/transactionService.js
// import api from './api';
// import ENDPOINTS from '../constants/apiEndpoints';

// class TransactionService {
//   /**
//    * Create a new transaction
//    */
//   async createTransaction() {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.CREATE);
//     return response.data.data;
//   }

//   /**
//    * Get transaction by ID with receipt data
//    */
//   async getTransaction(id) {
//     const response = await api.get(ENDPOINTS.TRANSACTIONS.GET(id));
//     return response.data.data;
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
//    * Add item to transaction - auto-generates Sales QR on backend
//    */
//   async addItem(transactionId, productId, quantity) {
//     console.log("transactionId:", transactionId);
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.ADD_ITEM(transactionId), {
//       productId,
//       quantity,
//     });
//     return response.data.data;
//   }

//   /**
//    * Generate sales QR manually
//    */
//   async generateSalesQR(transactionId) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.GENERATE_SALES_QR(transactionId));
//     return response.data.data;
//   }

//   /**
//    * Process payment - generates Payment QR on backend
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
//    * Release stock - generates Release QR and Invoice QR on backend
//    */
//   async releaseStock(transactionId, releasedItems) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.RELEASE_STOCK(transactionId), {
//       releasedItems,
//     });
//     return response.data.data;
//   }

//   /**
//    * Complete transaction
//    */
//   async completeTransaction(transactionId) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.COMPLETE(transactionId));
//     return response.data.data;
//   }

//   /**
//    * Validate QR - delegates entirely to backend
//    */
//   async validateQR(qrData) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.VALIDATE_QR, { qrData });
//     return response.data.data;
//   }

//   /**
//    * Get receipt data
//    */
//   async getReceipt(transactionId) {
//     const response = await api.get(ENDPOINTS.TRANSACTIONS.GET_RECEIPT(transactionId));
//     return response.data.data;
//   }

//   /**
//    * Print receipt
//    */
//   async printReceipt(transactionId) {
//     const response = await api.get(ENDPOINTS.TRANSACTIONS.PRINT_RECEIPT(transactionId));
//     return response.data.data;
//   }
// }

// export default new TransactionService();



























// // services/transactionService.js
// import api from './api';
// import ENDPOINTS from '../constants/apiEndpoints';

// class TransactionService {
//   /**
//    * Create a new transaction
//    */
//   async createTransaction() {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.CREATE);
//     return response.data.data;
//   }

//   /**
//    * Create transaction with items in one call
//    * items: Array of { productId, quantity }
//    */
//   async createTransactionWithItems(items) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.CREATE_WITH_ITEMS, { items });
//     return response.data.data;
//   }

//   /**
//    * Get transaction by ID with receipt data
//    */
//   async getTransaction(id) {
//     const response = await api.get(ENDPOINTS.TRANSACTIONS.GET(id));
//     return response.data.data;
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
//    * Add multiple items to transaction in batch
//    * items: Array of { productId, quantity }
//    */
//   async addBatchItems(transactionId, items) {
//     const response = await api.post(
//       ENDPOINTS.TRANSACTIONS.ADD_BATCH_ITEMS(transactionId),
//       { items }
//     );
//     return response.data.data;
//   }

//   /**
//    * Generate sales QR
//    */
//   async generateSalesQR(transactionId) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.GENERATE_SALES_QR(transactionId));
//     return response.data.data;
//   }

//   /**
//    * Process payment - generates Payment QR on backend
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
//    * Release stock - generates Release QR and Invoice QR on backend
//    */
//   async releaseStock(transactionId, releasedItems) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.RELEASE_STOCK(transactionId), {
//       releasedItems,
//     });
//     return response.data.data;
//   }

//   /**
//    * Complete transaction
//    */
//   async completeTransaction(transactionId) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.COMPLETE(transactionId));
//     return response.data.data;
//   }

//   /**
//    * Validate QR - delegates entirely to backend
//    */
//   async validateQR(qrData) {
//     const response = await api.post(ENDPOINTS.TRANSACTIONS.VALIDATE_QR, { qrData });
//     return response.data.data;
//   }

//   /**
//    * Get receipt data
//    */
//   async getReceipt(transactionId) {
//     const response = await api.get(ENDPOINTS.TRANSACTIONS.GET_RECEIPT(transactionId));
//     return response.data.data;
//   }

//   /**
//    * Print receipt
//    */
//   async printReceipt(transactionId) {
//     const response = await api.get(ENDPOINTS.TRANSACTIONS.PRINT_RECEIPT(transactionId));
//     return response.data.data;
//   }
// }

// export default new TransactionService();






























import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';

class TransactionService {
  /**
   * Create transaction with items - generates Sales QR
   */
  async createTransactionWithItems(items) {
    const response = await api.post(ENDPOINTS.TRANSACTIONS.CREATE_WITH_ITEMS, { items });
    return response.data.data;
  }

  /**
   * Get transaction by ID with full details
   */
  async getTransaction(id) {
    const response = await api.get(ENDPOINTS.TRANSACTIONS.GET(id));
    return response.data.data;
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
   */
  async getTransactions(params = {}) {
    const response = await api.get(ENDPOINTS.TRANSACTIONS.LIST, { params });
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