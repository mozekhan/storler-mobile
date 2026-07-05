import { create } from 'zustand';
import StoreService from '../services/storeService';

const useStoreStore = create((set, get) => ({
  stores: [],
  currentStore: null,
  storeOptions: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  fetchStores: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await StoreService.getStores(params);
      set({
        stores: result.stores || [],
        pagination: result.pagination || {},
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchStore: async (id, force = false) => {
    if (!force && get().currentStore?._id === id) {
      return get().currentStore;
    }

    set({ isLoading: true, error: null });
    try {
      const store = await StoreService.getStore(id);
      set({ currentStore: store, isLoading: false });
      return store;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createStore: async (storeData) => {
    set({ isLoading: true, error: null });
    try {
      const store = await StoreService.createStore(storeData);
      set({ isLoading: false });
      return store;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateStore: async (id, storeData) => {
    set({ isLoading: true, error: null });
    try {
      const store = await StoreService.updateStore(id, storeData);
      set({ currentStore: store, isLoading: false });
      return store;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteStore: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await StoreService.deleteStore(id);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchStoreOptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const options = await StoreService.getStoreOptions();
      set({ storeOptions: options, isLoading: false });
      return options;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearCurrentStore: () => {
    set({ currentStore: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useStoreStore;