// import { roles } from './roles';

// export const routes = {
//   // Public routes
//   LOGIN: '/login',
//   FORGOT_PASSWORD: '/forgot-password',
  
//   // App routes
//   HOME: '/(app)',
//   SCAN: '/(app)/scan',
//   SALES: '/(app)/sales',
//   FINANCE: '/(app)/finance',
//   WAREHOUSE: '/(app)/warehouse',
//   PROFILE: '/(app)/profile',
//   REPORTS: '/(app)/reports',
  
//   // Stack routes
//   TRANSACTIONS: '/(app)/transactions',
//   TRANSACTION_DETAIL: '/(app)/transactions/[id]',
//   PRODUCTS: '/(app)/products',
//   PRODUCT_DETAIL: '/(app)/products/[id]',
//   PRODUCT_NEW: '/(app)/products/new',
  
//   // Modal routes
//   TRANSACTION_DETAIL_MODAL: '/(app)/transaction-detail',
//   PRODUCT_SEARCH: '/(app)/product-search',
//   RECEIPT_PREVIEW: '/(app)/receipt-preview',
//   PAYMENT_MODAL: '/(app)/payment-modal',
//   INVENTORY_ADJUST: '/(app)/inventory-adjust',
  
//   // Admin routes
//   ADMIN_STAFF: '/(admin)/staff',
//   ADMIN_STORES: '/(admin)/stores',
//   ADMIN_AUDIT_LOGS: '/(admin)/audit-logs',
//   ADMIN_SETTINGS: '/(admin)/settings'
// };

// export const routeAccess = {
//   [routes.HOME]: Object.values(roles),
//   [routes.SCAN]: Object.values(roles),
//   [routes.SALES]: [
//     roles.SALES_ATTENDANT,
//     roles.SALES_MANAGER,
//     roles.ADMIN,
//     roles.SUPER_ADMIN
//   ],
//   [routes.FINANCE]: [
//     roles.FINANCE_CASHIER,
//     roles.FINANCE_MANAGER,
//     roles.ADMIN,
//     roles.SUPER_ADMIN
//   ],
//   [routes.WAREHOUSE]: [
//     roles.WAREHOUSE_STAFF,
//     roles.WAREHOUSE_MANAGER,
//     roles.ADMIN,
//     roles.SUPER_ADMIN
//   ],
//   [routes.REPORTS]: [
//     roles.SALES_MANAGER,
//     roles.FINANCE_MANAGER,
//     roles.WAREHOUSE_MANAGER,
//     roles.ADMIN,
//     roles.SUPER_ADMIN
//   ],
//   [routes.ADMIN_STAFF]: [
//     roles.ADMIN,
//     roles.SUPER_ADMIN
//   ],
//   [routes.ADMIN_STORES]: [
//     roles.SUPER_ADMIN
//   ],
//   [routes.ADMIN_AUDIT_LOGS]: [
//     roles.ADMIN,
//     roles.SUPER_ADMIN
//   ],
//   [routes.ADMIN_SETTINGS]: [
//     roles.SUPER_ADMIN
//   ]
// };




















import { Roles } from './roles';

export const Routes = {
  // Auth routes
  LOGIN: '/(auth)/login',
  FORGOT_PASSWORD: '/(auth)/forgot-password',
  CHANGE_PASSWORD: '/(auth)/change-password',

  // App routes
  HOME: '/(app)/(tabs)',
  SCAN: '/(app)/(tabs)/scan',
  SALES: '/(app)/(tabs)/sales',
  FINANCE: '/(app)/(tabs)/finance',
  WAREHOUSE: '/(app)/(tabs)/warehouse',
  REPORTS: '/(app)/(tabs)/reports',
  PROFILE: '/(app)/(tabs)/profile',

  // Stack routes
  TRANSACTIONS: '/(app)/(stacks)/transactions',
  TRANSACTION_DETAIL: '/(app)/(stacks)/transactions/[id]',
  PRODUCTS: '/(app)/(stacks)/products',
  PRODUCT_DETAIL: '/(app)/(stacks)/products/[id]',
  PRODUCT_NEW: '/(app)/(stacks)/products/new',
  STORES: '/(app)/(stacks)/stores',
  STORE_DETAIL: '/(app)/(stacks)/stores/[id]',
  USERS: '/(app)/(stacks)/users',
  USER_DETAIL: '/(app)/(stacks)/users/[id]',
  INVENTORY: '/(app)/(stacks)/inventory',
  INVENTORY_DETAIL: '/(app)/(stacks)/inventory/[productId]',
  PAYMENTS: '/(app)/(stacks)/payments',
  PAYMENT_DETAIL: '/(app)/(stacks)/payments/[id]',
  RECEIPTS: '/(app)/(stacks)/receipts',
  RECEIPT_DETAIL: '/(app)/(stacks)/receipts/[id]',
  REPORTS_SALES: '/(app)/(stacks)/reports/sales',
  REPORTS_INVENTORY: '/(app)/(stacks)/reports/inventory',
  REPORTS_FINANCIAL: '/(app)/(stacks)/reports/financial',

  // Modal routes
  PAYMENT_MODAL: '/(app)/(modals)/payment-modal',
  RECEIPT_PREVIEW: '/(app)/(modals)/receipt-preview',
  INVENTORY_ADJUST: '/(app)/(modals)/inventory-adjust',
  TRANSACTION_DETAIL_MODAL: '/(app)/(modals)/transaction-detail',
  PRODUCT_SEARCH: '/(app)/(modals)/product-search',

  // Admin routes
  ADMIN: '/(admin)',
  ADMIN_STAFF: '/(admin)/staff',
  ADMIN_STORES: '/(admin)/stores',
  ADMIN_AUDIT_LOGS: '/(admin)/audit-logs',
  ADMIN_SETTINGS: '/(admin)/settings',
};

export const RouteAccess = {
  [Routes.HOME]: Object.values(Roles),
  [Routes.SCAN]: Object.values(Roles),
  [Routes.SALES]: [Roles.SALES_ATTENDANT, Roles.SALES_MANAGER, Roles.ADMIN, Roles.SUPER_ADMIN],
  [Routes.FINANCE]: [Roles.FINANCE_CASHIER, Roles.FINANCE_MANAGER, Roles.ADMIN, Roles.SUPER_ADMIN],
  [Routes.WAREHOUSE]: [Roles.WAREHOUSE_STAFF, Roles.WAREHOUSE_MANAGER, Roles.ADMIN, Roles.SUPER_ADMIN],
  [Routes.REPORTS]: [Roles.SALES_MANAGER, Roles.FINANCE_MANAGER, Roles.WAREHOUSE_MANAGER, Roles.ADMIN, Roles.SUPER_ADMIN],
  [Routes.ADMIN]: [Roles.ADMIN, Roles.SUPER_ADMIN],
  [Routes.ADMIN_STAFF]: [Roles.ADMIN, Roles.SUPER_ADMIN],
  [Routes.ADMIN_STORES]: [Roles.SUPER_ADMIN],
  [Routes.ADMIN_AUDIT_LOGS]: [Roles.ADMIN, Roles.SUPER_ADMIN],
  [Routes.ADMIN_SETTINGS]: [Roles.SUPER_ADMIN],
};

export default { Routes, RouteAccess };