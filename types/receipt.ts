export interface Receipt {
  _id: string;
  transactionId: {
    _id: string;
    transactionNumber: string;
  };
  storeId: {
    _id: string;
    name: string;
  };
  type: 'SALES' | 'PAYMENT' | 'INVOICE';
  receiptNumber: string;
  qrCode: string;
  qrPayload: {
    version: string;
    type: string;
    transactionId: string;
    timestamp: number;
    checksum: string;
  };
  filePath?: string;
  fileSize?: number;
  printed: boolean;
  printedAt?: Date;
  printedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  emailSent: boolean;
  emailSentAt?: Date;
  emailRecipient?: string;
  createdAt: Date;
}

export interface ReceiptFilter {
  type?: string;
  printed?: boolean;
  storeId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}