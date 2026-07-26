// utils/receiptPrintHelper.js
import { formatCurrency } from './formatters';

/**
 * Prepares receipt data for printing
 * @param {Object} transaction - The transaction object
 * @param {Object} receiptData - The receipt data object
 * @param {string} qrCode - The QR code image data
 * @param {string} receiptType - The type of receipt
 * @returns {Object} Prepared print data
 */
export const prepareReceiptPrintData = (transaction, receiptData, qrCode, receiptType) => {
  const t = transaction || {};
  const data = receiptData || {};
  const store = data.store || {};
  const summary = data.summary || {};
  const items = data.items || t.items || [];

  return {
    store: {
      name: store.name || t?.storeId?.name || 'Store',
      address: store.address || '',
      phone: store.phone || '',
      email: store.email || '',
    },
    transaction: {
      number: t?.transactionNumber || 'N/A',
      createdAt: t?.createdAt || new Date(),
      status: t?.status || 'N/A',
    },
    items: items.map(item => ({
      name: item.name || item.productId?.name || 'Item',
      sku: item.sku || item.productId?.sku || '',
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice || 0,
      totalPrice: item.totalPrice || (item.quantity || 0) * (item.unitPrice || 0),
      taxAmount: item.taxAmount || 0,
    })),
    summary: {
      subtotal: summary.subtotal || t?.subtotal || 0,
      taxTotal: summary.taxTotal || t?.taxTotal || 0,
      discountTotal: summary.discountTotal || 0,
      totalAmount: summary.totalAmount || t?.totalAmount || 0,
      amountPaid: summary.amountPaid || t?.amountPaid || 0,
      changeAmount: summary.changeAmount || t?.changeAmount || 0,
      paymentMethod: summary.paymentMethod || t?.paymentMethod || '',
    },
    payment: {
      method: t?.paymentMethod || '',
      reference: t?.paymentReference || '',
    },
    invoice: {
      number: t?.finalInvoiceNumber || '',
    },
    qrCode: qrCode,
    staff: data.staff || {},
    type: receiptType || 'SALES',
  };
};