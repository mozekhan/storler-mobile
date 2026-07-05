export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  storeId: {
    _id: string;
    name: string;
    code: string;
  };
  currentStoreId?: string;
  assignedStores?: string[];
  permissions: string[];
  isActive: boolean;
  twoFactorEnabled: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFilter {
  search?: string;
  role?: string;
  storeId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserActivity {
  userId: string;
  days: number;
  transactionsProcessed: number;
  totalActions: number;
  loginCount: number;
  lastLogin: Date | null;
}