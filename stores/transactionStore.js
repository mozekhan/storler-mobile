import { create } from 'zustand';
import TransactionService from '../services/transactionService';

const useTransactionStore = create((set, get) => ({
  transactions: [],
  currentTransaction: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  fetchTransactions: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await TransactionService.getTransactions(params);
      set({
        transactions: result.transactions || [],
        pagination: result.pagination || {},
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTransaction: async (id, forceRefresh = false) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if we already have this transaction cached
      if (!forceRefresh && get().currentTransaction?._id === id) {
        set({ isLoading: false });
        return get().currentTransaction;
      }

      const data = await TransactionService.getTransaction(id);
      
      // The API returns { transaction, receiptData }
      const transaction = {
        ...data.transaction,
        receiptData: data.receiptData
      };
      
      set({ 
        currentTransaction: transaction,
        isLoading: false 
      });
      
      return transaction;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch transaction' 
      });
      throw error;
    }
  },

  // Alias for fetchTransaction with receipt data (for consistency)
  // fetchTransactionWithReceipt: async (id) => {
  //   return get().fetchTransaction(id);
  // },
  fetchTransactionWithReceipt: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const result = await TransactionService.getTransaction(id);
      
      // The service already flattens the response, but let's ensure we have the right structure
      let transaction = result;
      
      // If the result still has a transaction property (backup check), flatten it
      if (result && result.transaction) {
        transaction = {
          ...result.transaction,
          receiptData: result.receiptData || result.transaction.receiptData || null,
        };
      }
      
      // Ensure receiptData is properly structured
      if (transaction && !transaction.receiptData && transaction.items) {
        // Generate receipt data from transaction if not present
        transaction.receiptData = {
          items: transaction.items || [],
          summary: {
            subtotal: transaction.subtotal || 0,
            taxTotal: transaction.taxTotal || 0,
            totalAmount: transaction.totalAmount || 0,
            paymentMethod: transaction.paymentMethod || 'N/A',
            amountPaid: transaction.amountPaid || 0,
            changeAmount: transaction.changeAmount || 0,
          },
          staff: {
            salesAttendant: transaction.salesAttendantId || null,
            financeAttendant: transaction.financeAttendantId || null,
            warehouseStaff: transaction.warehouseStaffId || null,
          },
          timeline: {
            created: transaction.createdAt,
            sales: transaction.salesTimestamp,
            payment: transaction.paymentTimestamp,
            release: transaction.releaseTimestamp,
            completed: transaction.updatedAt,
          }
        };
      }
      
      set({ 
        currentTransaction: transaction, 
        isLoading: false 
      });
      
      return transaction;
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
      set({ 
        error: error.message || 'Failed to fetch transaction', 
        isLoading: false 
      });
      throw error;
    }
  },

  setCurrentTransaction: (transaction) => {
    set({ currentTransaction: transaction });
  },

  clearCurrentTransaction: () => {
    set({ currentTransaction: null, error: null });
  },


  createTransaction: async () => {
    set({ isLoading: true, error: null });
    try {
      const transaction = await TransactionService.createTransaction();
      set({ currentTransaction: transaction, isLoading: false });
      return transaction;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addItem: async (transactionId, productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const transaction = await TransactionService.addItem(transactionId, productId, quantity);
      set({ currentTransaction: transaction, isLoading: false });
      return transaction;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  generateSalesQR: async (transactionId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await TransactionService.generateSalesQR(transactionId);
      set({ currentTransaction: result.transaction, isLoading: false });
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  processPayment: async (transactionId, paymentMethod, amountPaid) => {
    set({ isLoading: true, error: null });
    try {
      const result = await TransactionService.processPayment(transactionId, paymentMethod, amountPaid);
      set({ currentTransaction: result.transaction, isLoading: false });
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  releaseStock: async (transactionId, releasedItems) => {
    set({ isLoading: true, error: null });
    try {
      const transaction = await TransactionService.releaseStock(transactionId, releasedItems);
      set({ currentTransaction: transaction, isLoading: false });
      return transaction;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  completeTransaction: async (transactionId) => {
    set({ isLoading: true, error: null });
    try {
      const transaction = await TransactionService.completeTransaction(transactionId);
      set({ currentTransaction: transaction, isLoading: false });
      return transaction;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearCurrentTransaction: () => {
    set({ currentTransaction: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useTransactionStore;