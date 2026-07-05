// import useAuthStore from '../stores/authStore';

// export const useAuth = () => {
//   const {
//     user,
//     token,
//     isLoading,
//     isAuthenticated,
//     currentStore,
//     accessibleStores,
//     storeVersion,
//     login,
//     logout,
//     switchStore,
//     refreshUser
//   } = useAuthStore();

//   return {
//     user,
//     token,
//     isLoading,
//     isAuthenticated,
//     currentStore,
//     accessibleStores,
//     storeVersion,
//     login,
//     logout,
//     switchStore,
//     refreshUser,
//     isSuperAdmin: user?.role === 'SUPER_ADMIN',
//     isAdmin: user?.role === 'ADMIN',
//     isSalesRole: ['SALES_MANAGER', 'SALES_ATTENDANT'].includes(user?.role),
//     isFinanceRole: ['FINANCE_MANAGER', 'FINANCE_CASHIER'].includes(user?.role),
//     isWarehouseRole: ['WAREHOUSE_MANAGER', 'WAREHOUSE_STAFF'].includes(user?.role),
//     can: (permission) => {
//       if (!user) return false;
//       if (user.role === 'SUPER_ADMIN') return true;
//       return user.permissions?.includes(permission) || false;
//     },
//     hasStoreAccess: (storeId) => {
//       if (!user) return false;
//       if (user.role === 'SUPER_ADMIN') return true;
//       if (user.storeId?.toString() === storeId?.toString()) return true;
//       if (user.assignedStores?.some(s => s.toString() === storeId?.toString())) return true;
//       return false;
//     }
//   };
// };

import useAuthStore from "../stores/authStore";

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    currentStore,
    accessibleStores,
    storeVersion,
    login,
    logout,
    switchStore,
    refreshUser,
  } = useAuthStore();

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    currentStore,
    accessibleStores,
    storeVersion,
    login,
    logout,
    switchStore,
    refreshUser,
    isSuperAdmin: user?.role === "SUPER_ADMIN",
    isAdmin: user?.role === "ADMIN",
    isSalesRole: ["SALES_MANAGER", "SALES_ATTENDANT"].includes(user?.role),
    isFinanceRole: ["FINANCE_MANAGER", "FINANCE_CASHIER"].includes(user?.role),
    isWarehouseRole: ["WAREHOUSE_MANAGER", "WAREHOUSE_STAFF"].includes(
      user?.role,
    ),
    can: (permission) => {
      if (!user) return false;
      if (user.role === "SUPER_ADMIN") return true;
      return user.permissions?.includes(permission) || false;
    },
    hasStoreAccess: (storeId) => {
      if (!user) return false;
      if (user.role === "SUPER_ADMIN") return true;
      if (user.storeId?.toString() === storeId?.toString()) return true;
      if (
        user.assignedStores?.some((s) => s.toString() === storeId?.toString())
      )
        return true;
      return false;
    },
  };
};

export default useAuth;
