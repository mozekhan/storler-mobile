import { create } from 'zustand';
import ProductService from '../services/productService';

const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  categories: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await ProductService.getProducts(params);
      set({
        products: result.products || [],
        pagination: result.pagination || {},
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchProduct: async (id, force = false) => {
    if (!force && get().currentProduct?._id === id) {
      return get().currentProduct;
    }

    set({ isLoading: true, error: null });
    try {
      const product = await ProductService.getProduct(id);
      set({ currentProduct: product, isLoading: false });
      return product;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await ProductService.createProduct(productData);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      const product = await ProductService.updateProduct(id, productData);
      set({ currentProduct: product, isLoading: false });
      return product;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await ProductService.deleteProduct(id);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await ProductService.getCategories();
      set({ categories, isLoading: false });
      return categories;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useProductStore;