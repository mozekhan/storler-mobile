
// export const Roles = {
//   SUPER_ADMIN: 'SUPER_ADMIN',
//   ADMIN: 'ADMIN',
//   SALES_MANAGER: 'SALES_MANAGER',
//   SALES_ATTENDANT: 'SALES_ATTENDANT',
//   FINANCE_MANAGER: 'FINANCE_MANAGER',
//   FINANCE_CASHIER: 'FINANCE_CASHIER',
//   WAREHOUSE_MANAGER: 'WAREHOUSE_MANAGER',
//   WAREHOUSE_STAFF: 'WAREHOUSE_STAFF'
// };

// export const Permissions = {
//   TRANSACTION_CREATE: 'transaction:create',
//   TRANSACTION_READ_OWN: 'transaction:read:own',
//   TRANSACTION_READ_ALL: 'transaction:read:all',
//   TRANSACTION_UPDATE: 'transaction:update',
//   TRANSACTION_DELETE: 'transaction:delete',
//   PAYMENT_PROCESS: 'payment:process',
//   PAYMENT_REFUND: 'payment:refund',
//   INVENTORY_READ: 'inventory:read',
//   INVENTORY_ADJUST: 'inventory:adjust',
//   INVENTORY_RELEASE: 'inventory:release',
//   USER_CREATE: 'user:create',
//   USER_UPDATE: 'user:update',
//   AUDIT_READ: 'audit:read',
//   REPORT_GENERATE: 'report:generate',
//   STORE_MANAGE: 'store:manage'
// };

// export const RolePermissions = {
//   [Roles.SUPER_ADMIN]: Object.values(Permissions),
//   [Roles.ADMIN]: [
//     Permissions.TRANSACTION_READ_ALL,
//     Permissions.USER_CREATE,
//     Permissions.USER_UPDATE,
//     Permissions.AUDIT_READ,
//     Permissions.REPORT_GENERATE,
//     Permissions.INVENTORY_READ,
//     Permissions.INVENTORY_ADJUST
//   ],
//   [Roles.SALES_MANAGER]: [
//     Permissions.TRANSACTION_CREATE,
//     Permissions.TRANSACTION_READ_ALL,
//     Permissions.REPORT_GENERATE
//   ],
//   [Roles.SALES_ATTENDANT]: [
//     Permissions.TRANSACTION_CREATE,
//     Permissions.TRANSACTION_READ_OWN
//   ],
//   [Roles.FINANCE_MANAGER]: [
//     Permissions.PAYMENT_PROCESS,
//     Permissions.PAYMENT_REFUND,
//     Permissions.REPORT_GENERATE
//   ],
//   [Roles.FINANCE_CASHIER]: [
//     Permissions.PAYMENT_PROCESS
//   ],
//   [Roles.WAREHOUSE_MANAGER]: [
//     Permissions.INVENTORY_READ,
//     Permissions.INVENTORY_ADJUST,
//     Permissions.INVENTORY_RELEASE,
//     Permissions.REPORT_GENERATE
//   ],
//   [Roles.WAREHOUSE_STAFF]: [
//     Permissions.INVENTORY_READ,
//     Permissions.INVENTORY_RELEASE
//   ]
// };

// export const hasPermission = (userRole, permission) => {
//   const permissions = RolePermissions[userRole] || [];
//   return permissions.includes(permission);
// };

// export const hasAnyPermission = (userRole, permissionList) => {
//   const permissions = RolePermissions[userRole] || [];
//   return permissionList.some(p => permissions.includes(p));
// };

// export default {
//   Roles,
//   Permissions,
//   RolePermissions,
//   hasPermission,
//   hasAnyPermission
// };











// export const Roles = {
//   SUPER_ADMIN: 'SUPER_ADMIN',
//   ADMIN: 'ADMIN',
//   SALES_MANAGER: 'SALES_MANAGER',
//   SALES_ATTENDANT: 'SALES_ATTENDANT',
//   FINANCE_MANAGER: 'FINANCE_MANAGER',
//   FINANCE_CASHIER: 'FINANCE_CASHIER',
//   WAREHOUSE_MANAGER: 'WAREHOUSE_MANAGER',
//   WAREHOUSE_STAFF: 'WAREHOUSE_STAFF'
// };

// export const Permissions = {
//   TRANSACTION_CREATE: 'transaction:create',
//   TRANSACTION_READ_OWN: 'transaction:read:own',
//   TRANSACTION_READ_ALL: 'transaction:read:all',
//   TRANSACTION_UPDATE: 'transaction:update',
//   TRANSACTION_DELETE: 'transaction:delete',
//   PAYMENT_PROCESS: 'payment:process',
//   PAYMENT_REFUND: 'payment:refund',
//   INVENTORY_READ: 'inventory:read',
//   INVENTORY_ADJUST: 'inventory:adjust',
//   INVENTORY_RELEASE: 'inventory:release',
//   USER_CREATE: 'user:create',
//   USER_UPDATE: 'user:update',
//   AUDIT_READ: 'audit:read',
//   REPORT_GENERATE: 'report:generate',
//   STORE_MANAGE: 'store:manage',
//   // New permissions for multi-store
//   STORE_SWITCH: 'store:switch',
//   STORE_VIEW_ALL: 'store:view:all',
// };

// export const RolePermissions = {
//   [Roles.SUPER_ADMIN]: Object.values(Permissions),
//   [Roles.ADMIN]: [
//     Permissions.TRANSACTION_READ_ALL,
//     Permissions.USER_CREATE,
//     Permissions.USER_UPDATE,
//     Permissions.AUDIT_READ,
//     Permissions.REPORT_GENERATE,
//     Permissions.INVENTORY_READ,
//     Permissions.INVENTORY_ADJUST,
//     Permissions.STORE_SWITCH,
//   ],
//   [Roles.SALES_MANAGER]: [
//     Permissions.TRANSACTION_CREATE,
//     Permissions.TRANSACTION_READ_ALL,
//     Permissions.REPORT_GENERATE,
//   ],
//   [Roles.SALES_ATTENDANT]: [
//     Permissions.TRANSACTION_CREATE,
//     Permissions.TRANSACTION_READ_OWN,
//   ],
//   [Roles.FINANCE_MANAGER]: [
//     Permissions.PAYMENT_PROCESS,
//     Permissions.PAYMENT_REFUND,
//     Permissions.REPORT_GENERATE,
//   ],
//   [Roles.FINANCE_CASHIER]: [
//     Permissions.PAYMENT_PROCESS,
//   ],
//   [Roles.WAREHOUSE_MANAGER]: [
//     Permissions.INVENTORY_READ,
//     Permissions.INVENTORY_ADJUST,
//     Permissions.INVENTORY_RELEASE,
//     Permissions.REPORT_GENERATE,
//   ],
//   [Roles.WAREHOUSE_STAFF]: [
//     Permissions.INVENTORY_READ,
//     Permissions.INVENTORY_RELEASE,
//   ],
// };

// // Role hierarchy for permission checks
// export const RoleHierarchy = {
//   [Roles.SUPER_ADMIN]: 10,
//   [Roles.ADMIN]: 8,
//   [Roles.SALES_MANAGER]: 6,
//   [Roles.FINANCE_MANAGER]: 6,
//   [Roles.WAREHOUSE_MANAGER]: 6,
//   [Roles.SALES_ATTENDANT]: 4,
//   [Roles.FINANCE_CASHIER]: 4,
//   [Roles.WAREHOUSE_STAFF]: 4,
// };

// // Human-readable role labels
// export const RoleLabels = {
//   [Roles.SUPER_ADMIN]: 'Super Admin',
//   [Roles.ADMIN]: 'Admin',
//   [Roles.SALES_MANAGER]: 'Sales Manager',
//   [Roles.SALES_ATTENDANT]: 'Sales Attendant',
//   [Roles.FINANCE_MANAGER]: 'Finance Manager',
//   [Roles.FINANCE_CASHIER]: 'Finance Cashier',
//   [Roles.WAREHOUSE_MANAGER]: 'Warehouse Manager',
//   [Roles.WAREHOUSE_STAFF]: 'Warehouse Staff',
// };

// // Role color mapping for UI
// export const RoleColors = {
//   [Roles.SUPER_ADMIN]: '#8B5CF6',
//   [Roles.ADMIN]: '#3B82F6',
//   [Roles.SALES_MANAGER]: '#22C55E',
//   [Roles.SALES_ATTENDANT]: '#14B8A6',
//   [Roles.FINANCE_MANAGER]: '#8B5CF6',
//   [Roles.FINANCE_CASHIER]: '#06B6D4',
//   [Roles.WAREHOUSE_MANAGER]: '#F59E0B',
//   [Roles.WAREHOUSE_STAFF]: '#FCD34D',
// };

// // Check if user has a specific permission
// export const hasPermission = (userRole, permission) => {
//   if (userRole === Roles.SUPER_ADMIN) return true;
//   const permissions = RolePermissions[userRole] || [];
//   return permissions.includes(permission);
// };

// // Check if user has any of the given permissions
// export const hasAnyPermission = (userRole, permissionList) => {
//   if (userRole === Roles.SUPER_ADMIN) return true;
//   const permissions = RolePermissions[userRole] || [];
//   return permissionList.some(p => permissions.includes(p));
// };

// // Check if user has all of the given permissions
// export const hasAllPermissions = (userRole, permissionList) => {
//   if (userRole === Roles.SUPER_ADMIN) return true;
//   const permissions = RolePermissions[userRole] || [];
//   return permissionList.every(p => permissions.includes(p));
// };

// // Get allowed roles for user creation based on creator role
// export const getAllowedRolesToCreate = (creatorRole) => {
//   const roleHierarchy = {
//     [Roles.SUPER_ADMIN]: [
//       Roles.SUPER_ADMIN,
//       Roles.ADMIN,
//       Roles.SALES_MANAGER,
//       Roles.SALES_ATTENDANT,
//       Roles.FINANCE_MANAGER,
//       Roles.FINANCE_CASHIER,
//       Roles.WAREHOUSE_MANAGER,
//       Roles.WAREHOUSE_STAFF,
//     ],
//     [Roles.ADMIN]: [
//       Roles.SALES_MANAGER,
//       Roles.SALES_ATTENDANT,
//       Roles.FINANCE_MANAGER,
//       Roles.FINANCE_CASHIER,
//       Roles.WAREHOUSE_MANAGER,
//       Roles.WAREHOUSE_STAFF,
//     ],
//     [Roles.SALES_MANAGER]: [Roles.SALES_ATTENDANT],
//     [Roles.FINANCE_MANAGER]: [Roles.FINANCE_CASHIER],
//     [Roles.WAREHOUSE_MANAGER]: [Roles.WAREHOUSE_STAFF],
//   };
//   return roleHierarchy[creatorRole] || [];
// };

// // Check if a user can create a user with the target role
// export const canCreateRole = (creatorRole, targetRole) => {
//   const allowed = getAllowedRolesToCreate(creatorRole);
//   return allowed.includes(targetRole);
// };

// // Get store access level for a user
// export const getStoreAccessLevel = (user) => {
//   if (!user) return 'NONE';
//   if (user.role === Roles.SUPER_ADMIN) return 'ALL';
//   if (user.assignedStores && user.assignedStores.length > 0) return 'MULTIPLE';
//   if (user.storeId) return 'SINGLE';
//   return 'NONE';
// };

// export default {
//   Roles,
//   Permissions,
//   RolePermissions,
//   RoleHierarchy,
//   RoleLabels,
//   RoleColors,
//   hasPermission,
//   hasAnyPermission,
//   hasAllPermissions,
//   getAllowedRolesToCreate,
//   canCreateRole,
//   getStoreAccessLevel,
// };



























export const Roles = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SALES_MANAGER: 'SALES_MANAGER',
  SALES_ATTENDANT: 'SALES_ATTENDANT',
  FINANCE_MANAGER: 'FINANCE_MANAGER',
  FINANCE_CASHIER: 'FINANCE_CASHIER',
  WAREHOUSE_MANAGER: 'WAREHOUSE_MANAGER',
  WAREHOUSE_STAFF: 'WAREHOUSE_STAFF'
};

export const Permissions = {
  TRANSACTION_CREATE: 'transaction:create',
  TRANSACTION_READ_OWN: 'transaction:read:own',
  TRANSACTION_READ_ALL: 'transaction:read:all',
  TRANSACTION_UPDATE: 'transaction:update',
  TRANSACTION_DELETE: 'transaction:delete',
  PAYMENT_PROCESS: 'payment:process',
  PAYMENT_REFUND: 'payment:refund',
  INVENTORY_READ: 'inventory:read',
  INVENTORY_ADJUST: 'inventory:adjust',
  INVENTORY_RELEASE: 'inventory:release',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  AUDIT_READ: 'audit:read',
  REPORT_GENERATE: 'report:generate',
  STORE_MANAGE: 'store:manage',
  STORE_SWITCH: 'store:switch',
  STORE_VIEW_ALL: 'store:view:all',
};

export const RolePermissions = {
  [Roles.SUPER_ADMIN]: Object.values(Permissions),
  [Roles.ADMIN]: [
    Permissions.TRANSACTION_READ_ALL,
    Permissions.USER_CREATE,
    Permissions.USER_UPDATE,
    Permissions.AUDIT_READ,
    Permissions.REPORT_GENERATE,
    Permissions.INVENTORY_READ,
    Permissions.INVENTORY_ADJUST,
    Permissions.STORE_SWITCH,
  ],
  [Roles.SALES_MANAGER]: [
    Permissions.TRANSACTION_CREATE,
    Permissions.TRANSACTION_READ_ALL,
    Permissions.INVENTORY_READ,
    Permissions.REPORT_GENERATE,
  ],
  [Roles.SALES_ATTENDANT]: [
    Permissions.TRANSACTION_CREATE,
    Permissions.TRANSACTION_READ_OWN,
    Permissions.INVENTORY_READ,
  ],
  [Roles.FINANCE_MANAGER]: [
    Permissions.PAYMENT_PROCESS,
    Permissions.PAYMENT_REFUND,
    Permissions.REPORT_GENERATE,
  ],
  [Roles.FINANCE_CASHIER]: [
    Permissions.PAYMENT_PROCESS,
  ],
  [Roles.WAREHOUSE_MANAGER]: [
    Permissions.INVENTORY_READ,
    Permissions.INVENTORY_ADJUST,
    Permissions.INVENTORY_RELEASE,
    Permissions.REPORT_GENERATE,
  ],
  [Roles.WAREHOUSE_STAFF]: [
    Permissions.INVENTORY_READ,
    Permissions.INVENTORY_RELEASE,
  ],
};

export const RoleHierarchy = {
  [Roles.SUPER_ADMIN]: 10,
  [Roles.ADMIN]: 8,
  [Roles.SALES_MANAGER]: 6,
  [Roles.FINANCE_MANAGER]: 6,
  [Roles.WAREHOUSE_MANAGER]: 6,
  [Roles.SALES_ATTENDANT]: 4,
  [Roles.FINANCE_CASHIER]: 4,
  [Roles.WAREHOUSE_STAFF]: 4,
};

export const RoleLabels = {
  [Roles.SUPER_ADMIN]: 'Super Admin',
  [Roles.ADMIN]: 'Admin',
  [Roles.SALES_MANAGER]: 'Sales Manager',
  [Roles.SALES_ATTENDANT]: 'Sales Attendant',
  [Roles.FINANCE_MANAGER]: 'Finance Manager',
  [Roles.FINANCE_CASHIER]: 'Finance Cashier',
  [Roles.WAREHOUSE_MANAGER]: 'Warehouse Manager',
  [Roles.WAREHOUSE_STAFF]: 'Warehouse Staff',
};

export const RoleColors = {
  [Roles.SUPER_ADMIN]: '#8B5CF6',
  [Roles.ADMIN]: '#3B82F6',
  [Roles.SALES_MANAGER]: '#22C55E',
  [Roles.SALES_ATTENDANT]: '#14B8A6',
  [Roles.FINANCE_MANAGER]: '#8B5CF6',
  [Roles.FINANCE_CASHIER]: '#06B6D4',
  [Roles.WAREHOUSE_MANAGER]: '#F59E0B',
  [Roles.WAREHOUSE_STAFF]: '#FCD34D',
};

export const hasPermission = (userRole, permission) => {
  if (userRole === Roles.SUPER_ADMIN) return true;
  const permissions = RolePermissions[userRole] || [];
  return permissions.includes(permission);
};

export const hasAnyPermission = (userRole, permissionList) => {
  if (userRole === Roles.SUPER_ADMIN) return true;
  const permissions = RolePermissions[userRole] || [];
  return permissionList.some(p => permissions.includes(p));
};

export const hasAllPermissions = (userRole, permissionList) => {
  if (userRole === Roles.SUPER_ADMIN) return true;
  const permissions = RolePermissions[userRole] || [];
  return permissionList.every(p => permissions.includes(p));
};

export const getAllowedRolesToCreate = (creatorRole) => {
  const roleHierarchy = {
    [Roles.SUPER_ADMIN]: [
      Roles.SUPER_ADMIN,
      Roles.ADMIN,
      Roles.SALES_MANAGER,
      Roles.SALES_ATTENDANT,
      Roles.FINANCE_MANAGER,
      Roles.FINANCE_CASHIER,
      Roles.WAREHOUSE_MANAGER,
      Roles.WAREHOUSE_STAFF,
    ],
    [Roles.ADMIN]: [
      Roles.SALES_MANAGER,
      Roles.SALES_ATTENDANT,
      Roles.FINANCE_MANAGER,
      Roles.FINANCE_CASHIER,
      Roles.WAREHOUSE_MANAGER,
      Roles.WAREHOUSE_STAFF,
    ],
    [Roles.SALES_MANAGER]: [Roles.SALES_ATTENDANT],
    [Roles.FINANCE_MANAGER]: [Roles.FINANCE_CASHIER],
    [Roles.WAREHOUSE_MANAGER]: [Roles.WAREHOUSE_STAFF],
  };
  return roleHierarchy[creatorRole] || [];
};

export const canCreateRole = (creatorRole, targetRole) => {
  const allowed = getAllowedRolesToCreate(creatorRole);
  return allowed.includes(targetRole);
};

export const getStoreAccessLevel = (user) => {
  if (!user) return 'NONE';
  if (user.role === Roles.SUPER_ADMIN) return 'ALL';
  if (user.assignedStores && user.assignedStores.length > 0) return 'MULTIPLE';
  if (user.storeId) return 'SINGLE';
  return 'NONE';
};

export default {
  Roles,
  Permissions,
  RolePermissions,
  RoleHierarchy,
  RoleLabels,
  RoleColors,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getAllowedRolesToCreate,
  canCreateRole,
  getStoreAccessLevel,
};