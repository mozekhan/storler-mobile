// import { create } from 'zustand';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const useOfflineStore = create((set, get) => ({
//   queue: [],
//   isProcessing: false,

//   initialize: async () => {
//     try {
//       const queueString = await AsyncStorage.getItem('offline_queue');

//       if (queueString) {
//         const queue = JSON.parse(queueString);
//         set({ queue });
//       }
//     } catch (error) {
//       await AsyncStorage.removeItem('offline_queue');
//     }
//   },

//   saveQueue: async (queue) => {
//     try {
//       await AsyncStorage.setItem(
//         'offline_queue',
//         JSON.stringify(queue)
//       );
//     } catch (error) {
//       console.error('Failed to save queue:', error);
//     }
//   },

//   addToQueue: async (item) => {
//     const { queue } = get();

//     const newQueue = [
//       ...queue,
//       {
//         ...item,
//         addedAt: new Date().toISOString(),
//       },
//     ];

//     set({ queue: newQueue });
//     await get().saveQueue(newQueue);
//   },

//   removeFromQueue: async (id) => {
//     const { queue } = get();

//     const newQueue = queue.filter(
//       (item) => item.id !== id
//     );

//     set({ queue: newQueue });
//     await get().saveQueue(newQueue);
//   },

//   updateStatus: async (id, status, error = null) => {
//     const { queue } = get();

//     const newQueue = queue.map((item) =>
//       item.id === id
//         ? {
//             ...item,
//             status,
//             error,
//             updatedAt: new Date().toISOString(),
//           }
//         : item
//     );

//     set({ queue: newQueue });
//     await get().saveQueue(newQueue);
//   },

//   clearQueue: async () => {
//     set({ queue: [] });

//     try {
//       await AsyncStorage.removeItem('offline_queue');
//     } catch (error) {
//       console.error('Failed to clear queue:', error);
//     }
//   },

//   startProcessing: () => {
//     set({ isProcessing: true });
//   },

//   stopProcessing: () => {
//     set({ isProcessing: false });
//   },

//   getPendingItems: () => {
//     const { queue } = get();
//     return queue.filter(
//       (item) => item.status === 'pending'
//     );
//   },

//   getFailedItems: () => {
//     const { queue } = get();
//     return queue.filter(
//       (item) => item.status === 'failed'
//     );
//   },
// }));

// export default useOfflineStore;
























import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useOfflineStore = create((set, get) => ({
  queue: [],
  isProcessing: false,

  initialize: async () => {
    try {
      const queueString = await AsyncStorage.getItem('offline_queue');
      if (queueString) {
        const queue = JSON.parse(queueString);
        set({ queue });
      }
    } catch (error) {
      await AsyncStorage.removeItem('offline_queue');
    }
  },

  saveQueue: async (queue) => {
    try {
      await AsyncStorage.setItem('offline_queue', JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save queue:', error);
    }
  },

  addToQueue: async (item) => {
    const { queue } = get();
    const newQueue = [...queue, { ...item, addedAt: new Date().toISOString() }];
    set({ queue: newQueue });
    await get().saveQueue(newQueue);
  },

  removeFromQueue: async (id) => {
    const { queue } = get();
    const newQueue = queue.filter((item) => item.id !== id);
    set({ queue: newQueue });
    await get().saveQueue(newQueue);
  },

  updateStatus: async (id, status, error = null) => {
    const { queue } = get();
    const newQueue = queue.map((item) =>
      item.id === id ? { ...item, status, error, updatedAt: new Date().toISOString() } : item
    );
    set({ queue: newQueue });
    await get().saveQueue(newQueue);
  },

  clearQueue: async () => {
    set({ queue: [] });
    try {
      await AsyncStorage.removeItem('offline_queue');
    } catch (error) {
      console.error('Failed to clear queue:', error);
    }
  },

  startProcessing: () => set({ isProcessing: true }),
  stopProcessing: () => set({ isProcessing: false }),
  getPendingItems: () => {
    const { queue } = get();
    return queue.filter((item) => item.status === 'pending');
  },
  getFailedItems: () => {
    const { queue } = get();
    return queue.filter((item) => item.status === 'failed');
  }
}));

export default useOfflineStore;