export type RootStackParamList = {
  index: undefined;
  '(auth)': undefined;
  '(app)': undefined;
  '(admin)': undefined;
};

export type AuthStackParamList = {
  login: undefined;
  'forgot-password': undefined;
  'change-password': undefined;
};

export type AppTabsParamList = {
  index: undefined;
  scan: undefined;
  sales: undefined;
  finance: undefined;
  warehouse: undefined;
  reports: undefined;
  profile: undefined;
};

export type AppStacksParamList = {
  transactions: undefined;
  'transactions/[id]': { id: string };
  products: undefined;
  'products/[id]': { id: string };
  'products/new': undefined;
  inventory: undefined;
  stores: undefined;
  'stores/[id]': { id: string };
  users: undefined;
  'users/[id]': { id: string };
  payments: undefined;
  'payments/[id]': { id: string };
  receipts: undefined;
  'receipts/[id]': { id: string };
  reports: undefined;
  'reports/[type]': { type: string };
};

export type AppModalsParamList = {
  'transaction-detail': { id: string };
  'product-search': undefined;
  'receipt-preview': { transactionId: string };
  'payment-modal': { transactionId: string };
  'inventory-adjust': { productId: string; productName: string; currentStock: number };
  'qr-validation': undefined;
};

export type AdminStackParamList = {
  index: undefined;
  staff: undefined;
  stores: undefined;
  'audit-logs': undefined;
  settings: undefined;
};