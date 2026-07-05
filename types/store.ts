export interface StoreAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Store {
  _id: string;
  name: string;
  code: string;
  address: StoreAddress;
  phone: string;
  email: string;
  taxRate: number;
  currency: string;
  timezone: string;
  receiptFooter: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreStats {
  users: number;
  products: number;
  transactions: {
    total: number;
    completed: number;
    pending: number;
  };
  revenue: {
    today: number;
    thisMonth: number;
    total: number;
  };
  inventory: {
    totalItems: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
}

export interface StoreFilter {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}