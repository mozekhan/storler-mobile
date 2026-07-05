export interface Payment {
  _id: string;
  transactionId: string;
  storeId: string;
  paymentNumber: string;
  amount: number;
  amountPaid: number;
  change: number;
  method: 'CASH' | 'CARD' | 'TRANSFER' | 'CREDIT' | 'MOBILE_MONEY';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  reference: string;
  cardDetails?: {
    last4: string;
    cardType: string;
    expiryMonth: string;
    expiryYear: string;
  };
  transferDetails?: {
    bankName: string;
    accountNumber: string;
    reference: string;
  };
  mobileMoneyDetails?: {
    provider: string;
    phoneNumber: string;
    transactionId: string;
  };
  processedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  processedAt: Date;
  refundedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  refundedAt?: Date;
  refundReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentFilter {
  status?: string;
  method?: string;
  storeId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}