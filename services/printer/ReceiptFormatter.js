// // services/printer/ReceiptFormatter.js
// /**
//  * Universal ESC/POS Receipt Formatter
//  * 
//  * IMPORTANT:
//  * This class ONLY creates printer document nodes.
//  * PrinterService executes the generated nodes.
//  */

// const PRINTER_TYPES = {
//   DATECS_DPP250: 'DATECS_DPP250',
//   TSC_TSPL2: 'TSC_TSPL2',
//   GENERIC_ESCPOS: 'GENERIC_ESCPOS',
//   UNKNOWN: 'UNKNOWN',
// };

// const PAPER_CONFIG = {
//   '58mm': {
//     widthChars: 32,
//     maxItemName: 10,
//     dotWidthPx: 384,
//   },
//   '80mm': {
//     widthChars: 48,
//     maxItemName: 26,
//     dotWidthPx: 576,
//   },
// };

// const TEXT_SIZE = {
//   NORMAL: 1,
//   EMPHASIZED: 2,
// };

// class ReceiptFormatter {
//   static instance = null;

//   constructor() {
//     if (ReceiptFormatter.instance) {
//       return ReceiptFormatter.instance;
//     }

//     this.printerType = PRINTER_TYPES.UNKNOWN;
//     this.paperSize = '58mm';

//     ReceiptFormatter.instance = this;
//   }

//   static getInstance() {
//     if (!ReceiptFormatter.instance) {
//       ReceiptFormatter.instance = new ReceiptFormatter();
//     }
//     return ReceiptFormatter.instance;
//   }

//   // ============================================================
//   // PRINTER CONFIGURATION
//   // ============================================================

//   detectPrinterType(deviceName = '') {
//     const name = String(deviceName || '').toUpperCase();

//     if (name.includes('DATECS') || name.includes('DPP-250') || name.includes('DPP250')) {
//       this.printerType = PRINTER_TYPES.DATECS_DPP250;
//       return this.printerType;
//     }

//     if (name.includes('TSC') || name.includes('TTP-')) {
//       this.printerType = PRINTER_TYPES.TSC_TSPL2;
//       return this.printerType;
//     }

//     this.printerType = PRINTER_TYPES.GENERIC_ESCPOS;
//     return this.printerType;
//   }

//   setPrinterType(type) {
//     if (Object.values(PRINTER_TYPES).includes(type)) {
//       this.printerType = type;
//     }
//   }

//   getPrinterType() {
//     return this.printerType;
//   }

//   setPaperSize(size) {
//     this.paperSize = size === '80mm' ? '80mm' : '58mm';
//   }

//   getPaperSize() {
//     return this.paperSize;
//   }

//   getWidth() {
//     return PAPER_CONFIG[this.paperSize]?.widthChars || 32;
//   }

//   getMaxItemName() {
//     return PAPER_CONFIG[this.paperSize]?.maxItemName || 10;
//   }

//   getDotWidth() {
//     return PAPER_CONFIG[this.paperSize]?.dotWidthPx || 384;
//   }

//   // ============================================================
//   // MAIN RECEIPT FORMATTER
//   // ============================================================

//   formatReceipt(data = {}, type = 'SALES', deviceName = '') {
//     if (this.printerType === PRINTER_TYPES.UNKNOWN) {
//       this.detectPrinterType(deviceName);
//     }

//     const nodes = [];
//     const width = this.getWidth();

//     this.addHeader(nodes, data, width);
//     this.addTitle(nodes, type, width);
//     this.addTransactionInfo(nodes, data, width);
//     this.addPaymentInfo(nodes, data, type, width);
//     this.addInvoiceInfo(nodes, data, type, width);
//     this.addItems(nodes, data, type, width);
//     this.addRemainingItems(nodes, data, width);
//     this.addSummary(nodes, data, width);
//     this.addStaff(nodes, data, width);
    
//     // CRITICAL: Add QR code with the raw string for scanning
//     this.addQRCode(nodes, data, width);
    
//     this.addFooter(nodes, data, type, width);

//     nodes.push({ type: 'feed', lines: 4 });
//     nodes.push({ type: 'cut' });

//     return nodes;
//   }

//   // ============================================================
//   // HEADER
//   // ============================================================

//   addHeader(nodes, data, width) {
//     if (!data?.store) return;

//     const storeName = data.store.name || 'STORE';

//     nodes.push(
//       this.text(this.center(storeName, width), {
//         align: 'center',
//         bold: true,
//         size: TEXT_SIZE.EMPHASIZED,
//       }),
//     );

//     if (data.store.address) {
//       this.addWrappedCenteredText(nodes, data.store.address, width);
//     }

//     if (data.store.phone) {
//       nodes.push(
//         this.text(this.center(`Tel: ${data.store.phone}`, width), {
//           align: 'center',
//           size: TEXT_SIZE.NORMAL,
//         }),
//       );
//     }

//     if (data.store.email) {
//       nodes.push(
//         this.text(this.center(`Email: ${data.store.email}`, width), {
//           align: 'center',
//           size: TEXT_SIZE.NORMAL,
//         }),
//       );
//     }

//     nodes.push(this.line('solid'));
//   }

//   // ============================================================
//   // TITLE
//   // ============================================================

//   addTitle(nodes, type, width) {
//     const titles = {
//       SALES: 'SALES RECEIPT',
//       PAYMENT: 'PAYMENT RECEIPT',
//       RELEASE: 'RELEASE / INVOICE',
//       INVOICE: 'INVOICE',
//       FINAL: 'FINAL RECEIPT',
//     };

//     nodes.push(
//       this.text(this.center(titles[type] || 'RECEIPT', width), {
//         align: 'center',
//         bold: true,
//         size: TEXT_SIZE.EMPHASIZED,
//       }),
//     );

//     nodes.push(this.line('solid'));
//   }

//   // ============================================================
//   // TRANSACTION INFORMATION
//   // ============================================================

//   addTransactionInfo(nodes, data, width) {
//     if (!data?.transaction) return;

//     nodes.push(
//       this.text(`Trans: ${data.transaction.number || 'N/A'}`, {
//         align: 'left',
//         size: TEXT_SIZE.NORMAL,
//       }),
//     );

//     nodes.push(
//       this.text(`Date:  ${this.formatDate(data.transaction.createdAt)}`, {
//         align: 'left',
//         size: TEXT_SIZE.NORMAL,
//       }),
//     );

//     if (data.transaction.status) {
//       nodes.push(
//         this.text(`Status: ${data.transaction.status}`, {
//           align: 'left',
//           size: TEXT_SIZE.NORMAL,
//         }),
//       );
//     }
//   }

//   // ============================================================
//   // PAYMENT
//   // ============================================================

//   addPaymentInfo(nodes, data, type, width) {
//     if (!data?.payment || type !== 'PAYMENT') return;

//     nodes.push(
//       this.text(`Method: ${data.payment.method || 'N/A'}`, {
//         align: 'left',
//         size: TEXT_SIZE.NORMAL,
//       }),
//     );

//     if (data.payment.reference) {
//       nodes.push(
//         this.text(`Ref: ${data.payment.reference}`, {
//           align: 'left',
//           size: TEXT_SIZE.NORMAL,
//         }),
//       );
//     }
//   }

//   // ============================================================
//   // INVOICE
//   // ============================================================

//   addInvoiceInfo(nodes, data, type, width) {
//     if (!data?.invoice || !(type === 'RELEASE' || type === 'INVOICE')) return;

//     nodes.push(
//       this.text(`Inv#: ${data.invoice.number || 'N/A'}`, {
//         align: 'left',
//         size: TEXT_SIZE.NORMAL,
//       }),
//     );
//   }

//   // ============================================================
//   // ITEMS
//   // ============================================================

//   addItems(nodes, data, type, width) {
//     nodes.push(this.line('solid'));

//     const qtyWidth = 4;
//     const priceWidth = 9;
//     const totalWidth = 9;
//     const itemColumnWidth = Math.max(1, width - qtyWidth - priceWidth - totalWidth);

//     const displayItems = data?.releasedItems || data?.items || [];

//     if (!Array.isArray(displayItems) || displayItems.length === 0) return;

//     const header = 'Item'.padEnd(itemColumnWidth) +
//       'Qty'.padStart(qtyWidth) +
//       'Price'.padStart(priceWidth) +
//       'Total'.padStart(totalWidth);

//     nodes.push(
//       this.text(header, {
//         align: 'left',
//         bold: true,
//         size: TEXT_SIZE.NORMAL,
//       }),
//     );

//     nodes.push(this.line('solid'));

//     for (const item of displayItems) {
//       const quantityNumber = Number(item?.quantity ?? item?.quantityReleased ?? 0);
//       const quantity = String(Number.isFinite(quantityNumber) ? quantityNumber : 0);
//       const name = item?.name || item?.productName || 'Item';
//       const truncatedName = this.truncate(name, itemColumnWidth);
//       const unitPrice = Number(item?.unitPrice ?? 0);
//       const calculatedTotal = quantityNumber * unitPrice;
//       const totalPrice = item?.totalPrice ?? calculatedTotal;

//       const row = truncatedName.padEnd(itemColumnWidth) +
//         quantity.padStart(qtyWidth) +
//         this.formatCurrency(unitPrice).padStart(priceWidth) +
//         this.formatCurrency(totalPrice).padStart(totalWidth);

//       nodes.push(
//         this.text(row, {
//           align: 'left',
//           size: TEXT_SIZE.NORMAL,
//         }),
//       );

//       // if (item?.sku) {
//       //   const skuText = `SKU: ${String(item.sku)}`;
//       //   nodes.push(
//       //     this.text(this.truncate(skuText, width), {
//       //       align: 'left',
//       //       size: TEXT_SIZE.NORMAL,
//       //     }),
//       //   );
//       // }

//       if (type === 'RELEASE' && item?.isReleased) {
//         nodes.push(
//           this.text(this.truncate('Released', width), {
//             align: 'left',
//             size: TEXT_SIZE.NORMAL,
//           }),
//         );
//       }
//     }
//   }

//   // ============================================================
//   // REMAINING ITEMS
//   // ============================================================

//   addRemainingItems(nodes, data, width) {
//     const remaining = data?.remainingItems;

//     if (!Array.isArray(remaining) || remaining.length === 0) return;

//     const qtyWidth = 4;
//     const priceWidth = 9;
//     const totalWidth = 9;
//     const itemColumnWidth = Math.max(1, width - qtyWidth - priceWidth - totalWidth);

//     nodes.push(this.line('dashed'));

//     nodes.push(
//       this.text(this.center('*** NOT YET RELEASED ***', width), {
//         align: 'center',
//         bold: true,
//         size: TEXT_SIZE.EMPHASIZED,
//       }),
//     );

//     nodes.push(
//       this.text(this.center('Still owed on this order', width), {
//         align: 'center',
//         size: TEXT_SIZE.NORMAL,
//       }),
//     );

//     nodes.push(this.line('solid'));

//     const header = 'Item'.padEnd(itemColumnWidth) +
//       'Qty'.padStart(qtyWidth) +
//       'Price'.padStart(priceWidth) +
//       'Total'.padStart(totalWidth);

//     nodes.push(
//       this.text(header, {
//         align: 'left',
//         bold: true,
//         size: TEXT_SIZE.NORMAL,
//       }),
//     );

//     nodes.push(this.line('solid'));

//     let remainingTotal = 0;

//     for (const item of remaining) {
//       const quantityRemaining = Number(item?.quantityRemaining ?? 0);
//       const unitPrice = Number(item?.unitPrice ?? 0);
//       const lineTotal = item?.totalPrice ?? quantityRemaining * unitPrice;

//       remainingTotal += Number(lineTotal) || 0;

//       const name = item?.productName || item?.name || 'Item';
//       const truncatedName = this.truncate(name, itemColumnWidth);
//       const quantity = String(Number.isFinite(quantityRemaining) ? quantityRemaining : 0);

//       const row = truncatedName.padEnd(itemColumnWidth) +
//         quantity.padStart(qtyWidth) +
//         this.formatCurrency(unitPrice).padStart(priceWidth) +
//         this.formatCurrency(lineTotal).padStart(totalWidth);

//       nodes.push(
//         this.text(row, {
//           align: 'left',
//           size: TEXT_SIZE.NORMAL,
//         }),
//       );

//       if (item?.sku) {
//         nodes.push(
//           this.text(this.truncate(`SKU: ${String(item.sku)}`, width), {
//             align: 'left',
//             size: TEXT_SIZE.NORMAL,
//           }),
//         );
//       }

//       if (Number.isFinite(item?.quantityOrdered)) {
//         const progress = `(${item.quantityReleased || 0} of ${item.quantityOrdered} released)`;
//         nodes.push(
//           this.text(this.truncate(progress, width), {
//             align: 'left',
//             size: TEXT_SIZE.NORMAL,
//           }),
//         );
//       }
//     }

//     nodes.push(this.line('solid'));

//     nodes.push(
//       this.text(
//         this.rightAlign('Balance owed:', this.formatCurrency(remainingTotal), width),
//         { align: 'left', bold: true, size: TEXT_SIZE.NORMAL },
//       ),
//     );

//     nodes.push(
//       this.text(this.center('Bring this receipt to collect', width), {
//         align: 'center',
//         size: TEXT_SIZE.NORMAL,
//       }),
//     );
//   }

//   // ============================================================
//   // SUMMARY
//   // ============================================================

//   addSummary(nodes, data, width) {
//     if (!data?.summary) return;

//     const summary = data.summary;

//     if (summary.subtotal !== undefined) {
//       nodes.push(
//         this.text(
//           this.rightAlign('Subtotal:', this.formatCurrency(summary.subtotal), width),
//           { align: 'left', size: TEXT_SIZE.NORMAL },
//         ),
//       );
//     }

//     if (summary.taxTotal !== undefined && Number(summary.taxTotal) > 0) {
//       nodes.push(
//         this.text(
//           this.rightAlign('Tax:', this.formatCurrency(summary.taxTotal), width),
//           { align: 'left', size: TEXT_SIZE.NORMAL },
//         ),
//       );
//     }

//     if (summary.discountTotal !== undefined && Number(summary.discountTotal) > 0) {
//       nodes.push(
//         this.text(
//           this.rightAlign('Discount:', `-${this.formatCurrency(summary.discountTotal)}`, width),
//           { align: 'left', size: TEXT_SIZE.NORMAL },
//         ),
//       );
//     }

//     nodes.push(this.line('solid'));

//     nodes.push(
//       this.text(
//         this.rightAlign('TOTAL:', this.formatCurrency(summary.totalAmount || 0), width),
//         { align: 'left', bold: true, size: TEXT_SIZE.EMPHASIZED },
//       ),
//     );

//     if (summary.amountPaid !== undefined && Number(summary.amountPaid) > 0) {
//       nodes.push(
//         this.text(
//           this.rightAlign('Paid:', this.formatCurrency(summary.amountPaid), width),
//           { align: 'left', size: TEXT_SIZE.NORMAL },
//         ),
//       );
//     }

//     if (summary.changeAmount !== undefined && Number(summary.changeAmount) > 0) {
//       nodes.push(
//         this.text(
//           this.rightAlign('Change:', this.formatCurrency(summary.changeAmount), width),
//           { align: 'left', size: TEXT_SIZE.NORMAL },
//         ),
//       );
//     }
//   }

//   // ============================================================
//   // STAFF
//   // ============================================================

//   addStaff(nodes, data, width) {
//     if (!data?.staff) return;

//     nodes.push(this.line('dashed'));

//     if (data.staff.salesAttendant?.name) {
//       nodes.push(
//         this.text(
//           this.truncate(`Sales: ${data.staff.salesAttendant.name}`, width),
//           { align: 'left', size: TEXT_SIZE.NORMAL },
//         ),
//       );
//     }

//     if (data.staff.financeAttendant?.name) {
//       nodes.push(
//         this.text(
//           this.truncate(`Cashier: ${data.staff.financeAttendant.name}`, width),
//           { align: 'left', size: TEXT_SIZE.NORMAL },
//         ),
//       );
//     }

//     if (data.staff.warehouseStaff?.name) {
//       nodes.push(
//         this.text(
//           this.truncate(`Released: ${data.staff.warehouseStaff.name}`, width),
//           { align: 'left', size: TEXT_SIZE.NORMAL },
//         ),
//       );
//     }
//   }

//   // ============================================================
//   // QR CODE - CRITICAL FIX
//   // ============================================================

//   /**
//    * Emits a declarative 'qr' node with the RAW signed string.
//    * The raw string (qrCode) is what QRService.validateQR() expects.
//    * The image (qrCodeImage) is for display only and should NOT be printed.
//    */
//   addQRCode(nodes, data, width) {
//     // CRITICAL: Use the raw QR string, not the image
//     // The raw string is what QRService.validateQR() expects when scanned
//     let qrData = null;
    
//     // Check for raw QR string in various possible locations
//     if (data?.qrCode) {
//       qrData = data.qrCode;
//     } else if (data?.qrCodes) {
//       qrData = data.qrCodes.salesQRData || 
//                data.qrCodes.paymentQRData || 
//                data.qrCodes.releaseQRData || 
//                data.qrCodes.invoiceQRData || 
//                null;
//     }

//     // If no raw data found, check if we have an image as last resort
//     if (!qrData) {
//       let qrImage = data?.qrCodeImage || null;
//       if (!qrImage && data?.qrCodes) {
//         qrImage = data.qrCodes.salesQR || 
//                   data.qrCodes.paymentQR || 
//                   data.qrCodes.releaseQR || 
//                   data.qrCodes.invoiceQR || 
//                   null;
//       }
      
//       if (qrImage) {
//         console.warn(
//           '[ReceiptFormatter] No raw QR data found, using image as fallback. ' +
//           'The printed QR may not be scannable.'
//         );
//         // PrinterService will handle the data-URL detection
//         nodes.push({
//           type: 'qr',
//           content: qrImage,
//           align: 'center',
//           errorLevel: 'M',
//           moduleScale: this.paperSize === '80mm' ? 8 : 6,
//         });
//       }
//       return;
//     }

//     // Validate that we're not passing a data-URL
//     if (qrData.startsWith('data:image/')) {
//       console.warn(
//         '[ReceiptFormatter] QR data appears to be an image URL, not raw data. ' +
//         'This will likely not scan correctly. Check the data source.'
//       );
//     }

//     nodes.push(this.line('dashed'));

//     nodes.push(
//       this.text(this.center('--- SCAN QR ---', width), {
//         align: 'center',
//         bold: true,
//         size: TEXT_SIZE.NORMAL,
//       }),
//     );

//     // Pass the RAW string to the QR node
//     nodes.push({
//       type: 'qr',
//       content: qrData,  // Raw signed payload string
//       align: 'center',
//       errorLevel: 'M',
//       moduleScale: this.paperSize === '80mm' ? 8 : 6,
//     });
//   }

//   // ============================================================
//   // FOOTER
//   // ============================================================

//   addFooter(nodes, data, type, width) {
//     nodes.push(this.line('solid'));

//     const hasRemainingItems = Array.isArray(data?.remainingItems) && data.remainingItems.length > 0;

//     const footerMessages = {
//       SALES: ['Thank you!', 'Scan QR for payment'],
//       PAYMENT: ['Payment Confirmed', 'Scan QR for release'],
//       RELEASE: hasRemainingItems ? ['Partial Release', 'See balance owed above'] : ['Items Released', 'Thank you!'],
//       INVOICE: ['Thank you!', 'Keep this invoice'],
//       FINAL: hasRemainingItems ? ['Partial Release', 'See balance owed above'] : ['Thank you!', 'Transaction Complete'],
//     };

//     const messages = footerMessages[type] || ['Thank you!'];

//     messages.forEach(msg => {
//       nodes.push(
//         this.text(this.center(msg, width), {
//           align: 'center',
//           size: TEXT_SIZE.NORMAL,
//         }),
//       );
//     });
//   }

//   // ============================================================
//   // NODE HELPERS
//   // ============================================================

//   text(content, style = {}) {
//     return {
//       type: 'text',
//       content: String(content ?? ''),
//       style: {
//         align: style.align || 'left',
//         bold: Boolean(style.bold),
//         underline: Boolean(style.underline),
//         size: style.size || TEXT_SIZE.NORMAL,
//       },
//     };
//   }

//   line(style = 'solid') {
//     return { type: 'line', style };
//   }

//   // ============================================================
//   // TEXT UTILITIES
//   // ============================================================

//   truncate(value, maxLength) {
//     const text = String(value ?? '');
//     if (text.length <= maxLength) return text;
//     if (maxLength <= 1) return text.substring(0, maxLength);
//     return text.substring(0, maxLength - 1) + '…';
//   }

//   center(text, width) {
//     const value = String(text ?? '').trim();
//     const truncated = this.truncate(value, width);
//     if (truncated.length >= width) return truncated;
//     const padding = Math.floor((width - truncated.length) / 2);
//     return ' '.repeat(Math.max(0, padding)) + truncated;
//   }

//   rightAlign(label, value, width) {
//     const labelText = String(label ?? '');
//     const valueText = String(value ?? '');
//     const totalLength = labelText.length + valueText.length;

//     if (totalLength >= width) {
//       const available = Math.max(1, width - valueText.length - 1);
//       const shortenedLabel = this.truncate(labelText, available);
//       return (shortenedLabel + ' ' + valueText).substring(0, width);
//     }

//     const spaces = width - labelText.length - valueText.length;
//     return labelText + ' '.repeat(Math.max(1, spaces)) + valueText;
//   }

//   addWrappedCenteredText(nodes, text, width) {
//     const lines = this.wrapText(String(text), width);
//     for (const line of lines) {
//       nodes.push(
//         this.text(this.center(line, width), {
//           align: 'center',
//           size: TEXT_SIZE.NORMAL,
//         }),
//       );
//     }
//   }

//   wrapText(text, width) {
//     const words = String(text ?? '').trim().split(/\s+/);
//     if (!words.length) return [''];

//     const lines = [];
//     let current = '';

//     for (const word of words) {
//       if (!current) {
//         current = word;
//         continue;
//       }
//       const candidate = `${current} ${word}`;
//       if (candidate.length <= width) {
//         current = candidate;
//       } else {
//         lines.push(this.truncate(current, width));
//         current = word;
//       }
//     }

//     if (current) {
//       lines.push(this.truncate(current, width));
//     }

//     return lines;
//   }

//   // ============================================================
//   // CURRENCY
//   // ============================================================

//   formatCurrency(amount) {
//   const number = Number(amount || 0);
//   if (!Number.isFinite(number)) return 'N0';

//   return `${Math.round(number).toLocaleString('en-NG')}`;
// }

//   // ============================================================
//   // DATE
//   // ============================================================

//   formatDate(date) {
//     if (!date) return 'N/A';
//     const parsed = typeof date === 'string' ? new Date(date) : date;
//     if (!(parsed instanceof Date) || Number.isNaN(parsed.getTime())) return 'N/A';
//     return parsed.toLocaleString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   }
// }

// export default ReceiptFormatter.getInstance();

// export { PRINTER_TYPES, PAPER_CONFIG, TEXT_SIZE };




































// services/printer/ReceiptFormatter.js
/**
 * Universal ESC/POS Receipt Formatter
 * 
 * IMPORTANT:
 * This class ONLY creates printer document nodes.
 * PrinterService executes the generated nodes.
 */

const PRINTER_TYPES = {
  DATECS_DPP250: 'DATECS_DPP250',
  TSC_TSPL2: 'TSC_TSPL2',
  GENERIC_ESCPOS: 'GENERIC_ESCPOS',
  UNKNOWN: 'UNKNOWN',
};

const PAPER_CONFIG = {
  '58mm': {
    widthChars: 32,
    maxItemName: 10,
    dotWidthPx: 384,
  },
  '80mm': {
    widthChars: 48,
    maxItemName: 26,
    dotWidthPx: 576,
  },
};

const TEXT_SIZE = {
  NORMAL: 1,
  EMPHASIZED: 2,
};

class ReceiptFormatter {
  static instance = null;

  constructor() {
    if (ReceiptFormatter.instance) {
      return ReceiptFormatter.instance;
    }

    this.printerType = PRINTER_TYPES.UNKNOWN;
    this.paperSize = '58mm';

    ReceiptFormatter.instance = this;
  }

  static getInstance() {
    if (!ReceiptFormatter.instance) {
      ReceiptFormatter.instance = new ReceiptFormatter();
    }
    return ReceiptFormatter.instance;
  }

  // ============================================================
  // PRINTER CONFIGURATION
  // ============================================================

  detectPrinterType(deviceName = '') {
    const name = String(deviceName || '').toUpperCase();

    if (name.includes('DATECS') || name.includes('DPP-250') || name.includes('DPP250')) {
      this.printerType = PRINTER_TYPES.DATECS_DPP250;
      return this.printerType;
    }

    if (name.includes('TSC') || name.includes('TTP-')) {
      this.printerType = PRINTER_TYPES.TSC_TSPL2;
      return this.printerType;
    }

    this.printerType = PRINTER_TYPES.GENERIC_ESCPOS;
    return this.printerType;
  }

  setPrinterType(type) {
    if (Object.values(PRINTER_TYPES).includes(type)) {
      this.printerType = type;
    }
  }

  getPrinterType() {
    return this.printerType;
  }

  setPaperSize(size) {
    this.paperSize = size === '80mm' ? '80mm' : '58mm';
  }

  getPaperSize() {
    return this.paperSize;
  }

  getWidth() {
    return PAPER_CONFIG[this.paperSize]?.widthChars || 32;
  }

  getMaxItemName() {
    return PAPER_CONFIG[this.paperSize]?.maxItemName || 10;
  }

  getDotWidth() {
    return PAPER_CONFIG[this.paperSize]?.dotWidthPx || 384;
  }

  // ============================================================
  // MAIN RECEIPT FORMATTER
  // ============================================================

  formatReceipt(data = {}, type = 'SALES', deviceName = '') {
    if (this.printerType === PRINTER_TYPES.UNKNOWN) {
      this.detectPrinterType(deviceName);
    }

    const nodes = [];
    const width = this.getWidth();

    this.addHeader(nodes, data, width);
    this.addTitle(nodes, type, width);
    this.addTransactionInfo(nodes, data, width);
    this.addPaymentInfo(nodes, data, type, width);
    this.addInvoiceInfo(nodes, data, type, width);
    this.addItems(nodes, data, type, width);
    this.addRemainingItems(nodes, data, width);
    this.addSummary(nodes, data, width);
    this.addStaff(nodes, data, width);
    
    // CRITICAL: Add QR code with the raw string for scanning
    this.addQRCode(nodes, data, width);
    
    this.addFooter(nodes, data, type, width);

    nodes.push({ type: 'feed', lines: 4 });
    nodes.push({ type: 'cut' });

    return nodes;
  }

  // ============================================================
  // HEADER - FIXED CENTER ALIGNMENT
  // ============================================================

  addHeader(nodes, data, width) {
    if (!data?.store) return;

    const storeName = data.store.name || 'STORE';

    // Store name - centered, bold, emphasized
    nodes.push(
      this.text(this.centerText(storeName, width), {
        align: 'center',
        bold: true,
        size: TEXT_SIZE.EMPHASIZED,
      }),
    );

    // Address - wrapped and centered
    if (data.store.address) {
      const addressLines = this.wrapText(String(data.store.address), width);
      for (const line of addressLines) {
        nodes.push(
          this.text(this.centerText(line, width), {
            align: 'center',
            size: TEXT_SIZE.NORMAL,
          }),
        );
      }
    }

    // Phone - centered
    if (data.store.phone) {
      nodes.push(
        this.text(this.centerText(`Tel: ${data.store.phone}`, width), {
          align: 'center',
          size: TEXT_SIZE.NORMAL,
        }),
      );
    }

    // Email - centered
    if (data.store.email) {
      nodes.push(
        this.text(this.centerText(`Email: ${data.store.email}`, width), {
          align: 'center',
          size: TEXT_SIZE.NORMAL,
        }),
      );
    }

    nodes.push(this.line('solid'));
  }

  // ============================================================
  // TITLE - FIXED CENTER ALIGNMENT
  // ============================================================

  addTitle(nodes, type, width) {
    const titles = {
      SALES: 'SALES RECEIPT',
      PAYMENT: 'PAYMENT RECEIPT',
      RELEASE: 'RELEASE / INVOICE',
      INVOICE: 'INVOICE',
      FINAL: 'FINAL RECEIPT',
    };

    nodes.push(
      this.text(this.centerText(titles[type] || 'RECEIPT', width), {
        align: 'center',
        bold: true,
        size: TEXT_SIZE.EMPHASIZED,
      }),
    );

    nodes.push(this.line('solid'));
  }

  // ============================================================
  // TRANSACTION INFORMATION
  // ============================================================

  addTransactionInfo(nodes, data, width) {
    if (!data?.transaction) return;

    nodes.push(
      this.text(`Trans: ${data.transaction.number || 'N/A'}`, {
        align: 'left',
        size: TEXT_SIZE.NORMAL,
      }),
    );

    nodes.push(
      this.text(`Date:  ${this.formatDate(data.transaction.createdAt)}`, {
        align: 'left',
        size: TEXT_SIZE.NORMAL,
      }),
    );

    if (data.transaction.status) {
      nodes.push(
        this.text(`Status: ${data.transaction.status}`, {
          align: 'left',
          size: TEXT_SIZE.NORMAL,
        }),
      );
    }
  }

  // ============================================================
  // PAYMENT
  // ============================================================

  addPaymentInfo(nodes, data, type, width) {
    if (!data?.payment || type !== 'PAYMENT') return;

    nodes.push(
      this.text(`Method: ${data.payment.method || 'N/A'}`, {
        align: 'left',
        size: TEXT_SIZE.NORMAL,
      }),
    );

    if (data.payment.reference) {
      nodes.push(
        this.text(`Ref: ${data.payment.reference}`, {
          align: 'left',
          size: TEXT_SIZE.NORMAL,
        }),
      );
    }
  }

  // ============================================================
  // INVOICE
  // ============================================================

  addInvoiceInfo(nodes, data, type, width) {
    if (!data?.invoice || !(type === 'RELEASE' || type === 'INVOICE')) return;

    nodes.push(
      this.text(`Inv#: ${data.invoice.number || 'N/A'}`, {
        align: 'left',
        size: TEXT_SIZE.NORMAL,
      }),
    );
  }

  // ============================================================
  // ITEMS
  // ============================================================

  addItems(nodes, data, type, width) {
    nodes.push(this.line('solid'));

    const qtyWidth = 4;
    const priceWidth = 9;
    const totalWidth = 9;
    const itemColumnWidth = Math.max(1, width - qtyWidth - priceWidth - totalWidth);

    const displayItems = data?.releasedItems || data?.items || [];

    if (!Array.isArray(displayItems) || displayItems.length === 0) return;

    const header = 'Item'.padEnd(itemColumnWidth) +
      'Qty'.padStart(qtyWidth) +
      'Price'.padStart(priceWidth) +
      'Total'.padStart(totalWidth);

    nodes.push(
      this.text(header, {
        align: 'left',
        bold: true,
        size: TEXT_SIZE.NORMAL,
      }),
    );

    nodes.push(this.line('solid'));

    for (const item of displayItems) {
      const quantityNumber = Number(item?.quantity ?? item?.quantityReleased ?? 0);
      const quantity = String(Number.isFinite(quantityNumber) ? quantityNumber : 0);
      const name = item?.name || item?.productName || 'Item';
      const truncatedName = this.truncate(name, itemColumnWidth);
      const unitPrice = Number(item?.unitPrice ?? 0);
      const calculatedTotal = quantityNumber * unitPrice;
      const totalPrice = item?.totalPrice ?? calculatedTotal;

      const row = truncatedName.padEnd(itemColumnWidth) +
        quantity.padStart(qtyWidth) +
        this.formatCurrency(unitPrice).padStart(priceWidth) +
        this.formatCurrency(totalPrice).padStart(totalWidth);

      nodes.push(
        this.text(row, {
          align: 'left',
          size: TEXT_SIZE.NORMAL,
        }),
      );

      if (type === 'RELEASE' && item?.isReleased) {
        nodes.push(
          this.text(this.truncate('Released', width), {
            align: 'left',
            size: TEXT_SIZE.NORMAL,
          }),
        );
      }
    }
  }

  // ============================================================
  // REMAINING ITEMS
  // ============================================================

  addRemainingItems(nodes, data, width) {
    const remaining = data?.remainingItems;

    if (!Array.isArray(remaining) || remaining.length === 0) return;

    const qtyWidth = 4;
    const priceWidth = 9;
    const totalWidth = 9;
    const itemColumnWidth = Math.max(1, width - qtyWidth - priceWidth - totalWidth);

    nodes.push(this.line('dashed'));

    // Center the "NOT YET RELEASED" header
    nodes.push(
      this.text(this.centerText('*** NOT YET RELEASED ***', width), {
        align: 'center',
        bold: true,
        size: TEXT_SIZE.EMPHASIZED,
      }),
    );

    nodes.push(
      this.text(this.centerText('Still owed on this order', width), {
        align: 'center',
        size: TEXT_SIZE.NORMAL,
      }),
    );

    nodes.push(this.line('solid'));

    const header = 'Item'.padEnd(itemColumnWidth) +
      'Qty'.padStart(qtyWidth) +
      'Price'.padStart(priceWidth) +
      'Total'.padStart(totalWidth);

    nodes.push(
      this.text(header, {
        align: 'left',
        bold: true,
        size: TEXT_SIZE.NORMAL,
      }),
    );

    nodes.push(this.line('solid'));

    let remainingTotal = 0;

    for (const item of remaining) {
      const quantityRemaining = Number(item?.quantityRemaining ?? 0);
      const unitPrice = Number(item?.unitPrice ?? 0);
      const lineTotal = item?.totalPrice ?? quantityRemaining * unitPrice;

      remainingTotal += Number(lineTotal) || 0;

      const name = item?.productName || item?.name || 'Item';
      const truncatedName = this.truncate(name, itemColumnWidth);
      const quantity = String(Number.isFinite(quantityRemaining) ? quantityRemaining : 0);

      const row = truncatedName.padEnd(itemColumnWidth) +
        quantity.padStart(qtyWidth) +
        this.formatCurrency(unitPrice).padStart(priceWidth) +
        this.formatCurrency(lineTotal).padStart(totalWidth);

      nodes.push(
        this.text(row, {
          align: 'left',
          size: TEXT_SIZE.NORMAL,
        }),
      );

      if (item?.sku) {
        nodes.push(
          this.text(this.truncate(`SKU: ${String(item.sku)}`, width), {
            align: 'left',
            size: TEXT_SIZE.NORMAL,
          }),
        );
      }

      if (Number.isFinite(item?.quantityOrdered)) {
        const progress = `(${item.quantityReleased || 0} of ${item.quantityOrdered} released)`;
        nodes.push(
          this.text(this.truncate(progress, width), {
            align: 'left',
            size: TEXT_SIZE.NORMAL,
          }),
        );
      }
    }

    nodes.push(this.line('solid'));

    nodes.push(
      this.text(
        this.rightAlign('Balance owed:', this.formatCurrency(remainingTotal), width),
        { align: 'left', bold: true, size: TEXT_SIZE.NORMAL },
      ),
    );

    nodes.push(
      this.text(this.centerText('Bring this receipt to collect', width), {
        align: 'center',
        size: TEXT_SIZE.NORMAL,
      }),
    );
  }

  // ============================================================
  // SUMMARY
  // ============================================================

  addSummary(nodes, data, width) {
    if (!data?.summary) return;

    const summary = data.summary;

    if (summary.subtotal !== undefined) {
      nodes.push(
        this.text(
          this.rightAlign('Subtotal:', this.formatCurrency(summary.subtotal), width),
          { align: 'left', size: TEXT_SIZE.NORMAL },
        ),
      );
    }

    if (summary.taxTotal !== undefined && Number(summary.taxTotal) > 0) {
      nodes.push(
        this.text(
          this.rightAlign('Tax:', this.formatCurrency(summary.taxTotal), width),
          { align: 'left', size: TEXT_SIZE.NORMAL },
        ),
      );
    }

    if (summary.discountTotal !== undefined && Number(summary.discountTotal) > 0) {
      nodes.push(
        this.text(
          this.rightAlign('Discount:', `-${this.formatCurrency(summary.discountTotal)}`, width),
          { align: 'left', size: TEXT_SIZE.NORMAL },
        ),
      );
    }

    nodes.push(this.line('solid'));

    nodes.push(
      this.text(
        this.rightAlign('TOTAL:', this.formatCurrency(summary.totalAmount || 0), width),
        { align: 'left', bold: true, size: TEXT_SIZE.EMPHASIZED },
      ),
    );

    if (summary.amountPaid !== undefined && Number(summary.amountPaid) > 0) {
      nodes.push(
        this.text(
          this.rightAlign('Paid:', this.formatCurrency(summary.amountPaid), width),
          { align: 'left', size: TEXT_SIZE.NORMAL },
        ),
      );
    }

    if (summary.changeAmount !== undefined && Number(summary.changeAmount) > 0) {
      nodes.push(
        this.text(
          this.rightAlign('Change:', this.formatCurrency(summary.changeAmount), width),
          { align: 'left', size: TEXT_SIZE.NORMAL },
        ),
      );
    }
  }

  // ============================================================
  // STAFF
  // ============================================================

  addStaff(nodes, data, width) {
    if (!data?.staff) return;

    nodes.push(this.line('dashed'));

    if (data.staff.salesAttendant?.name) {
      nodes.push(
        this.text(
          this.truncate(`Sales: ${data.staff.salesAttendant.name}`, width),
          { align: 'left', size: TEXT_SIZE.NORMAL },
        ),
      );
    }

    if (data.staff.financeAttendant?.name) {
      nodes.push(
        this.text(
          this.truncate(`Cashier: ${data.staff.financeAttendant.name}`, width),
          { align: 'left', size: TEXT_SIZE.NORMAL },
        ),
      );
    }

    if (data.staff.warehouseStaff?.name) {
      nodes.push(
        this.text(
          this.truncate(`Released: ${data.staff.warehouseStaff.name}`, width),
          { align: 'left', size: TEXT_SIZE.NORMAL },
        ),
      );
    }
  }

  // ============================================================
  // QR CODE - FIXED CENTER ALIGNMENT
  // ============================================================

  /**
   * Emits a declarative 'qr' node with the RAW signed string.
   * The raw string (qrCode) is what QRService.validateQR() expects.
   */
  addQRCode(nodes, data, width) {
    // CRITICAL: Use the raw QR string, not the image
    let qrData = null;
    
    // Check for raw QR string in various possible locations
    if (data?.qrCode) {
      qrData = data.qrCode;
    } else if (data?.qrCodes) {
      qrData = data.qrCodes.salesQRData || 
               data.qrCodes.paymentQRData || 
               data.qrCodes.releaseQRData || 
               data.qrCodes.invoiceQRData || 
               null;
    }

    // If no raw data found, check if we have an image as last resort
    if (!qrData) {
      let qrImage = data?.qrCodeImage || null;
      if (!qrImage && data?.qrCodes) {
        qrImage = data.qrCodes.salesQR || 
                  data.qrCodes.paymentQR || 
                  data.qrCodes.releaseQR || 
                  data.qrCodes.invoiceQR || 
                  null;
      }
      
      if (qrImage) {
        console.warn(
          '[ReceiptFormatter] No raw QR data found, using image as fallback.'
        );
        nodes.push({
          type: 'qr',
          content: qrImage,
          align: 'center',
          errorLevel: 'M',
          moduleScale: this.paperSize === '80mm' ? 8 : 6,
        });
      }
      return;
    }

    // Validate that we're not passing a data-URL
    if (qrData.startsWith('data:image/')) {
      console.warn(
        '[ReceiptFormatter] QR data appears to be an image URL, not raw data.'
      );
    }

    nodes.push(this.line('dashed'));

    // Center the "SCAN QR" label
    nodes.push(
      this.text(this.centerText('--- SCAN QR ---', width), {
        align: 'center',
        bold: true,
        size: TEXT_SIZE.NORMAL,
      }),
    );

    // Pass the RAW string to the QR node
    nodes.push({
      type: 'qr',
      content: qrData,
      align: 'center',
      errorLevel: 'M',
      moduleScale: this.paperSize === '80mm' ? 8 : 6,
    });
  }

  // ============================================================
  // FOOTER - FIXED CENTER ALIGNMENT
  // ============================================================

  addFooter(nodes, data, type, width) {
    nodes.push(this.line('solid'));

    const hasRemainingItems = Array.isArray(data?.remainingItems) && data.remainingItems.length > 0;

    const footerMessages = {
      SALES: ['Thank you!', 'Scan QR for payment'],
      PAYMENT: ['Payment Confirmed', 'Scan QR for release'],
      RELEASE: hasRemainingItems ? ['Partial Release', 'See balance owed above'] : ['Items Released', 'Thank you!'],
      INVOICE: ['Thank you!', 'Keep this invoice'],
      FINAL: hasRemainingItems ? ['Partial Release', 'See balance owed above'] : ['Thank you!', 'Transaction Complete'],
    };

    const messages = footerMessages[type] || ['Thank you!'];

    for (const msg of messages) {
      nodes.push(
        this.text(this.centerText(msg, width), {
          align: 'center',
          size: TEXT_SIZE.NORMAL,
        }),
      );
    }
  }

  // ============================================================
  // NODE HELPERS
  // ============================================================

  text(content, style = {}) {
    return {
      type: 'text',
      content: String(content ?? ''),
      style: {
        align: style.align || 'left',
        bold: Boolean(style.bold),
        underline: Boolean(style.underline),
        size: style.size || TEXT_SIZE.NORMAL,
      },
    };
  }

  line(style = 'solid') {
    return { type: 'line', style };
  }

  // ============================================================
  // TEXT UTILITIES - FIXED CENTER ALIGNMENT
  // ============================================================

  truncate(value, maxLength) {
    const text = String(value ?? '');
    if (text.length <= maxLength) return text;
    if (maxLength <= 1) return text.substring(0, maxLength);
    return text.substring(0, maxLength - 1) + '…';
  }

  /**
   * Center text within the given width.
   * This properly centers text without truncating before centering.
   * The truncation happens inside the method to ensure proper alignment.
   */
  centerText(text, width) {
    const value = String(text ?? '').trim();
    
    // If text is empty, return empty string
    if (!value) return '';
    
    // First truncate if needed
    const truncated = this.truncate(value, width);
    
    // If truncated text is exactly the width, return as-is
    if (truncated.length >= width) return truncated;
    
    // Calculate padding to center
    const padding = Math.floor((width - truncated.length) / 2);
    const extraPadding = (width - truncated.length) % 2;
    
    // Return centered text with proper padding
    return ' '.repeat(Math.max(0, padding)) + 
           truncated + 
           ' '.repeat(Math.max(0, padding + extraPadding));
  }

  rightAlign(label, value, width) {
    const labelText = String(label ?? '');
    const valueText = String(value ?? '');
    const totalLength = labelText.length + valueText.length;

    if (totalLength >= width) {
      const available = Math.max(1, width - valueText.length - 1);
      const shortenedLabel = this.truncate(labelText, available);
      return (shortenedLabel + ' ' + valueText).substring(0, width);
    }

    const spaces = width - labelText.length - valueText.length;
    return labelText + ' '.repeat(Math.max(1, spaces)) + valueText;
  }

  /**
   * Wraps text into multiple lines at the given width.
   * Used for addresses and long text that needs to wrap.
   */
  wrapText(text, width) {
    const words = String(text ?? '').trim().split(/\s+/);
    if (!words.length) return [''];

    const lines = [];
    let current = '';

    for (const word of words) {
      if (!current) {
        current = word;
        continue;
      }
      const candidate = `${current} ${word}`;
      if (candidate.length <= width) {
        current = candidate;
      } else {
        lines.push(current);
        current = word;
      }
    }

    if (current) {
      lines.push(current);
    }

    return lines;
  }

  // ============================================================
  // CURRENCY
  // ============================================================

  formatCurrency(amount) {
    const number = Number(amount || 0);
    if (!Number.isFinite(number)) return '0';
    return `${Math.round(number).toLocaleString('en-NG')}`;
  }

  // ============================================================
  // DATE
  // ============================================================

  formatDate(date) {
    if (!date) return 'N/A';
    const parsed = typeof date === 'string' ? new Date(date) : date;
    if (!(parsed instanceof Date) || Number.isNaN(parsed.getTime())) return 'N/A';
    return parsed.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

export default ReceiptFormatter.getInstance();

export { PRINTER_TYPES, PAPER_CONFIG, TEXT_SIZE };