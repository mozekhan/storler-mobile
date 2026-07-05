import { create } from 'zustand';
import UserService from '../services/userService';

const useUserStore = create((set, get) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await UserService.getUsers(params);
      set({
        users: result.users || [],
        pagination: result.pagination || {},
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchUser: async (id, force = false) => {
    if (!force && get().currentUser?._id === id) {
      return get().currentUser;
    }

    set({ isLoading: true, error: null });
    try {
      const user = await UserService.getUser(id);
      set({ currentUser: user, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await UserService.createUser(userData);
      set({ isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await UserService.updateUser(id, userData);
      set({ currentUser: user, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await UserService.deleteUser(id);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  switchStore: async (storeId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await UserService.switchStore(storeId);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearCurrentUser: () => {
    set({ currentUser: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useUserStore;