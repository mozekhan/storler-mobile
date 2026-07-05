// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Platform } from "react-native";

// const API_URL =
//   process.env.EXPO_PUBLIC_API_URL || "http://10.89.16.73:5000/api";

// const api = axios.create({
//   baseURL: API_URL,
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor - add token and store context
// api.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Add store context header
//     const userStr = await AsyncStorage.getItem("user");
//     if (userStr) {
//       try {
//         const user = JSON.parse(userStr);
//         if (user.currentStoreId || user.storeId) {
//           config.headers["X-Store-Id"] = user.currentStoreId || user.storeId;
//         }
//       } catch (e) {
//         // Ignore parsing error
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// // Response interceptor - handle token refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = await AsyncStorage.getItem("refreshToken");
//         if (refreshToken) {
//           const response = await axios.post(`${API_URL}/auth/refresh`, {
//             refreshToken,
//           });

//           const { accessToken } = response.data.data;
//           await AsyncStorage.setItem("accessToken", accessToken);

//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//           return api(originalRequest);
//         }
//       } catch (refreshError) {
//         console.log("Refresh token failed. Logging out user...");
//         // Clear storage
//         await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
//         // Clear Zustand state
//         useAuthStore.getState().logout();
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// export default api;























import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const API_URL = "http://10.199.140.73:5000/api";
// process.env.EXPO_PUBLIC_API_URL || 

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token and store context
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add store context header
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.currentStoreId || user.storeId) {
          config.headers["X-Store-Id"] = user.currentStoreId || user.storeId;
        }
      } catch (e) {
        // Ignore parsing error
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          await AsyncStorage.setItem("accessToken", accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.log("Refresh token failed. Logging out user...");
        await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
        // Clear Zustand state - will be handled by authStore
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;