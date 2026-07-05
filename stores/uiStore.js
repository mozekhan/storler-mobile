// import { create } from 'zustand';

// const useUIStore = create((set, get) => ({
//   theme: 'light',
//   isModalOpen: false,
//   modalContent: null,
//   toasts: [],
//   isLoading: false,

//   toggleTheme: () => {
//     set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
//   },

//   setTheme: (theme) => {
//     set({ theme });
//   },

//   openModal: (content) => {
//     set({ isModalOpen: true, modalContent: content });
//   },

//   closeModal: () => {
//     set({ isModalOpen: false, modalContent: null });
//   },

//   showToast: (message, type = 'info', duration = 3000) => {
//     const id = Date.now();
//     const toast = { id, message, type, duration };
//     set((state) => ({ toasts: [...state.toasts, toast] }));

//     // Auto dismiss
//     setTimeout(() => {
//       get().hideToast(id);
//     }, duration);
//   },

//   hideToast: (id) => {
//     set((state) => ({
//       toasts: state.toasts.filter(toast => toast.id !== id)
//     }));
//   },

//   setLoading: (loading) => {
//     set({ isLoading: loading });
//   },

//   clearToasts: () => {
//     set({ toasts: [] });
//   }
// }));

// export default useUIStore;























import { create } from 'zustand';

const useUIStore = create((set, get) => ({
  theme: 'light',
  isModalOpen: false,
  modalContent: null,
  toasts: [],
  isLoading: false,

  toggleTheme: () => {
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
  },

  setTheme: (theme) => set({ theme }),

  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),

  showToast: (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };
    set((state) => ({ toasts: [...state.toasts, toast] }));

    setTimeout(() => {
      get().hideToast(id);
    }, duration);
  },

  hideToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter(toast => toast.id !== id) }));
  },

  setLoading: (loading) => set({ isLoading: loading }),
  clearToasts: () => set({ toasts: [] }),
}));

export default useUIStore;