// import { create } from 'zustand';

// const useCartStore = create((set, get) => ({
//   items: [],
//   transactionId: null,
//   subtotal: 0,
//   taxTotal: 0,
//   totalAmount: 0,

//   setTransaction: (transaction) => {
//     set({
//       transactionId: transaction._id,
//       items: transaction.items || [],
//       subtotal: transaction.subtotal || 0,
//       taxTotal: transaction.taxTotal || 0,
//       totalAmount: transaction.totalAmount || 0
//     });
//   },

//   addItem: (item) => {
//     const { items } = get();
//     const existingItem = items.find(i => i.productId === item.productId);
    
//     let updatedItems;
//     if (existingItem) {
//       updatedItems = items.map(i =>
//         i.productId === item.productId
//           ? { ...i, quantity: i.quantity + item.quantity }
//           : i
//       );
//     } else {
//       updatedItems = [...items, item];
//     }

//     set({ items: updatedItems });
//     get().recalculateTotals();
//   },

//   updateQuantity: (productId, quantity) => {
//     const { items } = get();
//     if (quantity <= 0) {
//       get().removeItem(productId);
//       return;
//     }

//     const updatedItems = items.map(item =>
//       item.productId === productId
//         ? { ...item, quantity }
//         : item
//     );

//     set({ items: updatedItems });
//     get().recalculateTotals();
//   },

//   removeItem: (productId) => {
//     const { items } = get();
//     const updatedItems = items.filter(item => item.productId !== productId);
//     set({ items: updatedItems });
//     get().recalculateTotals();
//   },

//   clearCart: () => {
//     set({
//       items: [],
//       transactionId: null,
//       subtotal: 0,
//       taxTotal: 0,
//       totalAmount: 0
//     });
//   },

//   recalculateTotals: () => {
//     const { items } = get();
//     let subtotal = 0;
//     let taxTotal = 0;

//     items.forEach(item => {
//       subtotal += item.unitPrice * item.quantity;
//       taxTotal += (item.unitPrice * item.quantity * (item.taxRate || 0)) / 100;
//     });

//     set({
//       subtotal,
//       taxTotal,
//       totalAmount: subtotal + taxTotal
//     });
//   },

//   getItemCount: () => {
//     const { items } = get();
//     return items.reduce((sum, item) => sum + item.quantity, 0);
//   },

//   getItemTotal: (productId) => {
//     const { items } = get();
//     const item = items.find(i => i.productId === productId);
//     return item ? item.unitPrice * item.quantity : 0;
//   }
// }));

// export default useCartStore;

























import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  transactionId: null,
  subtotal: 0,
  taxTotal: 0,
  totalAmount: 0,

  setTransaction: (transaction) => {
    set({
      transactionId: transaction._id,
      items: transaction.items || [],
      subtotal: transaction.subtotal || 0,
      taxTotal: transaction.taxTotal || 0,
      totalAmount: transaction.totalAmount || 0
    });
  },

  addItem: (item) => {
    const { items } = get();
    const existingItem = items.find(i => i.productId === item.productId);

    let updatedItems;
    if (existingItem) {
      updatedItems = items.map(i =>
        i.productId === item.productId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      updatedItems = [...items, item];
    }

    set({ items: updatedItems });
    get().recalculateTotals();
  },

  updateQuantity: (productId, quantity) => {
    const { items } = get();
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const updatedItems = items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );

    set({ items: updatedItems });
    get().recalculateTotals();
  },

  removeItem: (productId) => {
    const { items } = get();
    const updatedItems = items.filter(item => item.productId !== productId);
    set({ items: updatedItems });
    get().recalculateTotals();
  },

  clearCart: () => {
    set({ items: [], transactionId: null, subtotal: 0, taxTotal: 0, totalAmount: 0 });
  },

  recalculateTotals: () => {
    const { items } = get();
    let subtotal = 0;
    let taxTotal = 0;

    items.forEach(item => {
      subtotal += item.unitPrice * item.quantity;
      taxTotal += (item.unitPrice * item.quantity * (item.taxRate || 0)) / 100;
    });

    set({ subtotal, taxTotal, totalAmount: subtotal + taxTotal });
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getItemTotal: (productId) => {
    const { items } = get();
    const item = items.find(i => i.productId === productId);
    return item ? item.unitPrice * item.quantity : 0;
  }
}));

export default useCartStore;