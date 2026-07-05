// import { useMemo, useCallback } from 'react';
// import { useAuth } from './useAuth';
// import { 
//   Roles, 
//   RolePermissions, 
//   RoleLabels,
//   RoleColors,
//   hasPermission, 
//   hasAnyPermission,
//   hasAllPermissions,
//   canCreateRole,
//   getStoreAccessLevel,
// } from '../constants/roles';
// import { Colors } from '../constants/theme';
// import { Permissions } from '../constants/roles';

// export const useRole = () => {
//   const { user, currentStore, accessibleStores } = useAuth();

//   const role = useMemo(() => user?.role || null, [user]);
//   const permissions = useMemo(() => {
//     if (!role) return [];
//     return RolePermissions[role] || [];
//   }, [role]);

//   // Role checks
//   const isSuperAdmin = useMemo(() => role === Roles.SUPER_ADMIN, [role]);
//   const isAdmin = useMemo(() => role === Roles.ADMIN, [role]);
//   const isSalesManager = useMemo(() => role === Roles.SALES_MANAGER, [role]);
//   const isSalesAttendant = useMemo(() => role === Roles.SALES_ATTENDANT, [role]);
//   const isFinanceManager = useMemo(() => role === Roles.FINANCE_MANAGER, [role]);
//   const isFinanceCashier = useMemo(() => role === Roles.FINANCE_CASHIER, [role]);
//   const isWarehouseManager = useMemo(() => role === Roles.WAREHOUSE_MANAGER, [role]);
//   const isWarehouseStaff = useMemo(() => role === Roles.WAREHOUSE_STAFF, [role]);

//   // Role groups
//   const isSalesRole = useMemo(() => 
//     [Roles.SALES_MANAGER, Roles.SALES_ATTENDANT].includes(role), 
//     [role]
//   );
//   const isFinanceRole = useMemo(() => 
//     [Roles.FINANCE_MANAGER, Roles.FINANCE_CASHIER].includes(role), 
//     [role]
//   );
//   const isWarehouseRole = useMemo(() => 
//     [Roles.WAREHOUSE_MANAGER, Roles.WAREHOUSE_STAFF].includes(role), 
//     [role]
//   );
//   const isManager = useMemo(() => 
//     [Roles.ADMIN, Roles.SALES_MANAGER, Roles.FINANCE_MANAGER, Roles.WAREHOUSE_MANAGER].includes(role), 
//     [role]
//   );
//   const isStaff = useMemo(() => 
//     [Roles.SALES_ATTENDANT, Roles.FINANCE_CASHIER, Roles.WAREHOUSE_STAFF].includes(role), 
//     [role]
//   );

//   // Permission checks
//   const can = useCallback((permission) => {
//     if (!user) return false;
//     if (user.role === Roles.SUPER_ADMIN) return true;
//     return hasPermission(role, permission);
//   }, [user, role]);

//   const canAny = useCallback((permissionList) => {
//     if (!user) return false;
//     if (user.role === Roles.SUPER_ADMIN) return true;
//     return hasAnyPermission(role, permissionList);
//   }, [user, role]);

//   const canAll = useCallback((permissionList) => {
//     if (!user) return false;
//     if (user.role === Roles.SUPER_ADMIN) return true;
//     return hasAllPermissions(role, permissionList);
//   }, [user, role]);

//   // Store access checks
//   const hasStoreAccess = useCallback((storeId) => {
//     if (!user) return false;
//     if (user.role === Roles.SUPER_ADMIN) return true;
//     if (user.storeId?.toString() === storeId?.toString()) return true;
//     if (user.assignedStores?.some(s => s.toString() === storeId?.toString())) return true;
//     return false;
//   }, [user]);

//   const storeAccessLevel = useMemo(() => {
//     return getStoreAccessLevel(user);
//   }, [user]);

//   const canSwitchStore = useMemo(() => {
//     if (!user) return false;
//     if (user.role === Roles.SUPER_ADMIN) return true;
//     return can(Permissions.STORE_SWITCH) || 
//            (user.assignedStores && user.assignedStores.length > 1);
//   }, [user, can]);

//   // Role info
//   const roleLabel = useMemo(() => {
//     return RoleLabels[role] || role;
//   }, [role]);

//   const roleColor = useMemo(() => {
//     return RoleColors[role] || Colors.gray500;
//   }, [role]);

//   // Tab visibility
//   const getVisibleTabs = useCallback(() => {
//     const tabs = [];
    
//     // Always show these
//     tabs.push('index');
//     tabs.push('scan');
    
//     // Role-based tabs
//     if (isSalesRole || isAdmin || isSuperAdmin) {
//       tabs.push('sales');
//     }
//     if (isFinanceRole || isAdmin || isSuperAdmin) {
//       tabs.push('finance');
//     }
//     if (isWarehouseRole || isAdmin || isSuperAdmin) {
//       tabs.push('warehouse');
//     }
    
//     // Reports tab for managers
//     if (isManager || isSuperAdmin) {
//       tabs.push('reports');
//     }
    
//     // Profile always last
//     tabs.push('profile');
    
//     return tabs;
//   }, [isSalesRole, isFinanceRole, isWarehouseRole, isManager, isAdmin, isSuperAdmin]);

//   // Admin access
//   const hasAdminAccess = useMemo(() => {
//     return isSuperAdmin || isAdmin;
//   }, [isSuperAdmin, isAdmin]);

//   const hasFullAccess = useMemo(() => {
//     return isSuperAdmin;
//   }, [isSuperAdmin]);

//   return {
//     // Role
//     role,
//     roleLabel,
//     roleColor,
//     permissions,
    
//     // Role checks
//     isSuperAdmin,
//     isAdmin,
//     isSalesManager,
//     isSalesAttendant,
//     isFinanceManager,
//     isFinanceCashier,
//     isWarehouseManager,
//     isWarehouseStaff,
    
//     // Role groups
//     isSalesRole,
//     isFinanceRole,
//     isWarehouseRole,
//     isManager,
//     isStaff,
    
//     // Store context
//     currentStore,
//     accessibleStores,
//     storeAccessLevel,
//     hasStoreAccess,
//     canSwitchStore,
    
//     // Admin access
//     hasAdminAccess,
//     hasFullAccess,
    
//     // Permission helpers
//     can,
//     canAny,
//     canAll,
    
//     // Tab visibility
//     getVisibleTabs,
//   };
// };

// export default useRole;























import { useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  Roles,
  RolePermissions,
  RoleLabels,
  RoleColors,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canCreateRole,
  getStoreAccessLevel,
} from '../constants/roles';
import { Colors } from '../constants/theme';
import { Permissions } from '../constants/roles';

export const useRole = () => {
  const { user, currentStore, accessibleStores } = useAuth();

  const role = useMemo(() => user?.role || null, [user]);
  const permissions = useMemo(() => {
    if (!role) return [];
    return RolePermissions[role] || [];
  }, [role]);

  // Role checks
  const isSuperAdmin = useMemo(() => role === Roles.SUPER_ADMIN, [role]);
  const isAdmin = useMemo(() => role === Roles.ADMIN, [role]);
  const isSalesManager = useMemo(() => role === Roles.SALES_MANAGER, [role]);
  const isSalesAttendant = useMemo(() => role === Roles.SALES_ATTENDANT, [role]);
  const isFinanceManager = useMemo(() => role === Roles.FINANCE_MANAGER, [role]);
  const isFinanceCashier = useMemo(() => role === Roles.FINANCE_CASHIER, [role]);
  const isWarehouseManager = useMemo(() => role === Roles.WAREHOUSE_MANAGER, [role]);
  const isWarehouseStaff = useMemo(() => role === Roles.WAREHOUSE_STAFF, [role]);

  // Role groups
  const isSalesRole = useMemo(() =>
    [Roles.SALES_MANAGER, Roles.SALES_ATTENDANT].includes(role),
    [role]
  );
  const isFinanceRole = useMemo(() =>
    [Roles.FINANCE_MANAGER, Roles.FINANCE_CASHIER].includes(role),
    [role]
  );
  const isWarehouseRole = useMemo(() =>
    [Roles.WAREHOUSE_MANAGER, Roles.WAREHOUSE_STAFF].includes(role),
    [role]
  );
  const isManager = useMemo(() =>
    [Roles.ADMIN, Roles.SALES_MANAGER, Roles.FINANCE_MANAGER, Roles.WAREHOUSE_MANAGER].includes(role),
    [role]
  );
  const isStaff = useMemo(() =>
    [Roles.SALES_ATTENDANT, Roles.FINANCE_CASHIER, Roles.WAREHOUSE_STAFF].includes(role),
    [role]
  );

  // Permission checks
  const can = useCallback((permission) => {
    if (!user) return false;
    if (user.role === Roles.SUPER_ADMIN) return true;
    return hasPermission(role, permission);
  }, [user, role]);

  const canAny = useCallback((permissionList) => {
    if (!user) return false;
    if (user.role === Roles.SUPER_ADMIN) return true;
    return hasAnyPermission(role, permissionList);
  }, [user, role]);

  const canAll = useCallback((permissionList) => {
    if (!user) return false;
    if (user.role === Roles.SUPER_ADMIN) return true;
    return hasAllPermissions(role, permissionList);
  }, [user, role]);

  // Store access checks
  const hasStoreAccess = useCallback((storeId) => {
    if (!user) return false;
    if (user.role === Roles.SUPER_ADMIN) return true;
    if (user.storeId?.toString() === storeId?.toString()) return true;
    if (user.assignedStores?.some(s => s.toString() === storeId?.toString())) return true;
    return false;
  }, [user]);

  const storeAccessLevel = useMemo(() => {
    return getStoreAccessLevel(user);
  }, [user]);

  const canSwitchStore = useMemo(() => {
    if (!user) return false;
    if (user.role === Roles.SUPER_ADMIN) return true;
    return can(Permissions.STORE_SWITCH) ||
      (user.assignedStores && user.assignedStores.length > 1);
  }, [user, can]);

  // Role info
  const roleLabel = useMemo(() => {
    return RoleLabels[role] || role;
  }, [role]);

  const roleColor = useMemo(() => {
    return RoleColors[role] || Colors.gray500;
  }, [role]);

  // Tab visibility
  const getVisibleTabs = useCallback(() => {
    const tabs = [];
    tabs.push('index');
    tabs.push('scan');

    if (isSalesRole || isAdmin || isSuperAdmin) {
      tabs.push('sales');
    }
    if (isFinanceRole || isAdmin || isSuperAdmin) {
      tabs.push('finance');
    }
    if (isWarehouseRole || isAdmin || isSuperAdmin) {
      tabs.push('warehouse');
    }
    if (isManager || isSuperAdmin) {
      tabs.push('reports');
    }
    tabs.push('profile');

    return tabs;
  }, [isSalesRole, isFinanceRole, isWarehouseRole, isManager, isAdmin, isSuperAdmin]);

  // Admin access
  const hasAdminAccess = useMemo(() => {
    return isSuperAdmin || isAdmin;
  }, [isSuperAdmin, isAdmin]);

  const hasFullAccess = useMemo(() => {
    return isSuperAdmin;
  }, [isSuperAdmin]);

  return {
    role,
    roleLabel,
    roleColor,
    permissions,
    isSuperAdmin,
    isAdmin,
    isSalesManager,
    isSalesAttendant,
    isFinanceManager,
    isFinanceCashier,
    isWarehouseManager,
    isWarehouseStaff,
    isSalesRole,
    isFinanceRole,
    isWarehouseRole,
    isManager,
    isStaff,
    currentStore,
    accessibleStores,
    storeAccessLevel,
    hasStoreAccess,
    canSwitchStore,
    hasAdminAccess,
    hasFullAccess,
    can,
    canAny,
    canAll,
    getVisibleTabs,
  };
};

export default useRole;