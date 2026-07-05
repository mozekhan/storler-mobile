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

  fetchTransaction: async (id, force = false) => {
    if (!force && get().currentTransaction?._id === id) {
      return get().currentTransaction;
    }

    set({ isLoading: true, error: null });
    try {
      const transaction = await TransactionService.getTransaction(id);
      set({ currentTransaction: transaction, isLoading: false });
      return transaction;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
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