// import { create } from "zustand";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import api from "../services/api";

// const authStore = (set, get) => ({
//   user: null,
//   token: null,
//   isLoading: true,
//   isAuthenticated: false,
//   currentStore: null,
//   accessibleStores: [],
//   storeVersion: 0, // Used to force refresh pages after store switch

//   /**
//    * Helper: Build accessible stores list
//    */
//   getAccessibleStores: async (user) => {
//     try {
//       if (user?.role === "SUPER_ADMIN") {
//         const response = await api.get("/stores");

//         return response.data?.data?.stores || [];
//       }

//       return user?.assignedStores?.length > 0
//         ? user.assignedStores
//         : user?.storeId
//           ? [user.storeId]
//           : [];
//     } catch (error) {
//       console.error("Failed to load stores:", error);
//       return [];
//     }
//   },

//   /**
//    * Initialize auth state
//    */
//   initialize: async () => {
//     try {
//       const token = await AsyncStorage.getItem("accessToken");
//       const userData = await AsyncStorage.getItem("user");
//       const currentStoreData = await AsyncStorage.getItem("currentStore");

//       if (token && userData) {
//         const user = JSON.parse(userData);

//         const accessibleStores = await get().getAccessibleStores(user);

//         let currentStore = null;

//         if (currentStoreData) {
//           currentStore = JSON.parse(currentStoreData);
//         } else {
//           currentStore = user.currentStoreId || user.storeId || null;
//         }

//         set({
//           token,
//           user,
//           isAuthenticated: true,
//           currentStore,
//           accessibleStores,
//         });
//       }
//     } catch (error) {
//       console.error("Auth initialization error:", error);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   /**
//    * Login
//    */
//   login: async (email, password) => {
//     try {
//       const response = await api.post("/auth/login", {
//         email,
//         password,
//       });

//       const { user, accessToken } = response.data.data;

//       const accessibleStores = await get().getAccessibleStores(user);

//       const currentStore =
//         user.currentStoreId || user.storeId || accessibleStores[0] || null;

//       await AsyncStorage.setItem("accessToken", accessToken);

//       await AsyncStorage.setItem("user", JSON.stringify(user));

//       if (currentStore) {
//         await AsyncStorage.setItem(
//           "currentStore",
//           JSON.stringify(currentStore),
//         );
//       }

//       set({
//         user,
//         token: accessToken,
//         isAuthenticated: true,
//         currentStore,
//         accessibleStores,
//       });

//       return {
//         success: true,
//         user,
//       };
//     } catch (error) {
//       console.error("Login error:", error.response?.data || error);

//       return {
//         success: false,
//         error: error.response?.data?.message || "Login failed",
//       };
//     }
//   },

//   /**
//    * Logout
//    */
//   logout: async () => {
//     try {
//       await api.post("/auth/logout");
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       await AsyncStorage.multiRemove(["accessToken", "user", "currentStore"]);

//       set({
//         user: null,
//         token: null,
//         isAuthenticated: false,
//         currentStore: null,
//         accessibleStores: [],
//         storeVersion: 0,
//       });
//     }
//   },

//   /**
//    * Refresh current user
//    */
//   refreshUser: async () => {
//     try {
//       const response = await api.get("/users/me");

//       const user = response.data.data;

//       const accessibleStores = await get().getAccessibleStores(user);

//       await AsyncStorage.setItem("user", JSON.stringify(user));

//       const currentStore =
//         get().currentStore || user.currentStoreId || user.storeId || null;

//       set({
//         user,
//         currentStore,
//         accessibleStores,
//       });

//       return {
//         success: true,
//         user,
//       };
//     } catch (error) {
//       console.error("Refresh user error:", error);

//       return {
//         success: false,
//         error: error.response?.data?.message || "Failed to refresh user",
//       };
//     }
//   },

//   /**
//    * Switch active store
//    */
//   switchStore: async (storeId) => {
//     try {
//       const response = await api.post("/users/switch-store", {
//         storeId,
//       });

//       const { store } = response.data.data;

//       // Refresh user from backend
//       await get().refreshUser();

//       // Save selected store
//       await AsyncStorage.setItem("currentStore", JSON.stringify(store));

//       set((state) => ({
//         currentStore: store,
//         storeVersion: state.storeVersion + 1,
//       }));

//       return {
//         success: true,
//         store,
//       };
//     } catch (error) {
//       console.error("Switch store error:", error.response?.data || error);

//       return {
//         success: false,
//         error: error.response?.data?.message || "Failed to switch store",
//       };
//     }
//   },
// });

// export default create(authStore);























import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

const authStore = (set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  currentStore: null,
  accessibleStores: [],
  storeVersion: 0,

  getAccessibleStores: async (user) => {
    try {
      if (user?.role === "SUPER_ADMIN") {
        const response = await api.get("/stores");
        return response.data?.data?.stores || [];
      }
      return user?.assignedStores?.length > 0
        ? user.assignedStores
        : user?.storeId ? [user.storeId] : [];
    } catch (error) {
      console.error("Failed to load stores:", error);
      return [];
    }
  },

  initialize: async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const userData = await AsyncStorage.getItem("user");
      const currentStoreData = await AsyncStorage.getItem("currentStore");

      if (token && userData) {
        const user = JSON.parse(userData);
        const accessibleStores = await get().getAccessibleStores(user);

        let currentStore = null;
        if (currentStoreData) {
          currentStore = JSON.parse(currentStoreData);
        } else {
          currentStore = user.currentStoreId || user.storeId || null;
        }

        set({
          token,
          user,
          isAuthenticated: true,
          currentStore,
          accessibleStores,
        });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken } = response.data.data;

      const accessibleStores = await get().getAccessibleStores(user);
      const currentStore = user.currentStoreId || user.storeId || accessibleStores[0] || null;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      if (currentStore) {
        await AsyncStorage.setItem("currentStore", JSON.stringify(currentStore));
      }

      set({ user, token: accessToken, isAuthenticated: true, currentStore, accessibleStores });

      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await AsyncStorage.multiRemove(["accessToken", "user", "currentStore"]);
      set({ user: null, token: null, isAuthenticated: false, currentStore: null, accessibleStores: [], storeVersion: 0 });
    }
  },

  refreshUser: async () => {
    try {
      const response = await api.get("/users/me");
      const user = response.data.data;
      const accessibleStores = await get().getAccessibleStores(user);

      await AsyncStorage.setItem("user", JSON.stringify(user));
      const currentStore = get().currentStore || user.currentStoreId || user.storeId || null;

      set({ user, currentStore, accessibleStores });
      return { success: true, user };
    } catch (error) {
      console.error("Refresh user error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to refresh user",
      };
    }
  },

  switchStore: async (storeId) => {
    try {
      const response = await api.post("/users/switch-store", { storeId });
      const { store } = response.data.data;

      await get().refreshUser();
      await AsyncStorage.setItem("currentStore", JSON.stringify(store));

      set((state) => ({
        currentStore: store,
        storeVersion: state.storeVersion + 1,
      }));

      return { success: true, store };
    } catch (error) {
      console.error("Switch store error:", error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to switch store",
      };
    }
  },
});

export default create(authStore);