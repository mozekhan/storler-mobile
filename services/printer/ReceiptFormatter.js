// services/printer/ReceiptFormatter.js
/**
 * Universal Receipt Formatter - Generates document nodes for printing
 * Works with all ESC/POS compatible printers
 */
const PRINTER_TYPES = {
  DATECS_DPP250: 'DATECS_DPP250',
  TSC_TSPL2: 'TSC_TSPL2',
  GENERIC_ESCPOS: 'GENERIC_ESCPOS',
  UNKNOWN: 'UNKNOWN',
};

const PAPER_CONFIG = {
  '58mm': { widthChars: 32 },
  '80mm': { widthChars: 48 },
};

class ReceiptFormatter {
  static instance = null;

  constructor() {
    if (ReceiptFormatter.instance) return ReceiptFormatter.instance;
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

  detectPrinterType(deviceName = '') {
    const name = (deviceName || '').toUpperCase();
    if (name.includes('DATECS') || name.includes('DPP-250') || name.includes('DPP250') || name.includes('BT-SPP')) {
      this.printerType = PRINTER_TYPES.DATECS_DPP250;
      this.paperSize = '58mm';
      return PRINTER_TYPES.DATECS_DPP250;
    }
    if (name.includes('TSC') || name.includes('TTP-') || name.includes('TE200') || name.includes('DA200')) {
      this.printerType = PRINTER_TYPES.GENERIC_ESCPOS;
      return PRINTER_TYPES.GENERIC_ESCPOS;
    }
    this.printerType = PRINTER_TYPES.GENERIC_ESCPOS;
    return PRINTER_TYPES.GENERIC_ESCPOS;
  }

  setPrinterType(type) {
    this.printerType = type;
  }

  setPaperSize(size) {
    this.paperSize = size === '80mm' ? '80mm' : '58mm';
  }

  getWidth() {
    return PAPER_CONFIG[this.paperSize]?.widthChars || 32;
  }

  formatReceipt(data, type, deviceName = '') {
    if (this.printerType === PRINTER_TYPES.UNKNOWN) {
      this.detectPrinterType(deviceName);
    }

    const nodes = [];
    const width = this.getWidth();

    // === HEADER ===
    if (data.store) {
      nodes.push({
        type: 'text',
        content: this.center(data.store.name || 'STORE', width),
        style: { align: 'center', bold: true, size: 2 },
      });
      if (data.store.address) {
        nodes.push({
          type: 'text',
          content: this.center(data.store.address, width),
          style: { align: 'center' },
        });
      }
      if (data.store.phone) {
        nodes.push({
          type: 'text',
          content: this.center(`Tel: ${data.store.phone}`, width),
          style: { align: 'center' },
        });
      }
      if (data.store.email) {
        nodes.push({
          type: 'text',
          content: this.center(`Email: ${data.store.email}`, width),
          style: { align: 'center' },
        });
      }
      nodes.push({ type: 'line', style: 'solid' });
    }

    // === TITLE ===
    const titles = {
      SALES: 'SALES RECEIPT',
      PAYMENT: 'PAYMENT RECEIPT',
      RELEASE: 'RELEASE / INVOICE',
      INVOICE: 'INVOICE',
    };
    nodes.push({
      type: 'text',
      content: this.center(titles[type] || 'RECEIPT', width),
      style: { align: 'center', bold: true, size: 2 },
    });
    nodes.push({ type: 'line', style: 'solid' });

    // === TRANSACTION INFO ===
    if (data.transaction) {
      nodes.push({
        type: 'text',
        content: `Trans: ${data.transaction.number || 'N/A'}`,
      });
      nodes.push({
        type: 'text',
        content: `Date:  ${this.formatDate(data.transaction.createdAt)}`,
      });
      if (data.transaction.status) {
        nodes.push({
          type: 'text',
          content: `Status: ${data.transaction.status}`,
        });
      }
    }

    if (data.payment && type === 'PAYMENT') {
      nodes.push({
        type: 'text',
        content: `Method: ${data.payment.method || 'N/A'}`,
      });
      if (data.payment.reference) {
        nodes.push({
          type: 'text',
          content: `Ref: ${data.payment.reference}`,
        });
      }
    }

    if (data.invoice && (type === 'RELEASE' || type === 'INVOICE')) {
      nodes.push({
        type: 'text',
        content: `Inv#: ${data.invoice.number || 'N/A'}`,
      });
    }

    nodes.push({ type: 'line', style: 'solid' });

    // === ITEMS ===
    const displayItems = data.releasedItems || data.items || [];
    if (displayItems.length > 0) {
      const itemW = Math.floor(width * 0.45);
      const qtyW = 4;
      const priceW = 9;
      const totalW = 9;
      
      const header = 
        'Item'.padEnd(itemW) + 
        'Qty'.padStart(qtyW) + 
        'Price'.padStart(priceW) + 
        'Total'.padStart(totalW);
      
      nodes.push({
        type: 'text',
        content: header,
        style: { bold: true },
      });
      nodes.push({ type: 'line', style: 'solid' });

      for (const item of displayItems) {
        const name = (item.name || item.productName || 'Item').substring(0, itemW - 1);
        const qty = String(item.quantity || item.quantityReleased || 0);
        const price = this.formatCurrency(item.unitPrice || 0);
        const total = this.formatCurrency(item.totalPrice || (item.quantity * item.unitPrice) || 0);
        
        const row = 
          name.padEnd(itemW) + 
          qty.padStart(qtyW) + 
          price.padStart(priceW) + 
          total.padStart(totalW);
        
        nodes.push({ type: 'text', content: row });
        
        if (item.sku) {
          nodes.push({
            type: 'text',
            content: `  SKU: ${item.sku.substring(0, width - 7)}`,
          });
        }
      }
    }

    nodes.push({ type: 'line', style: 'solid' });

    // === SUMMARY ===
    if (data.summary) {
      if (data.summary.subtotal !== undefined) {
        nodes.push({
          type: 'text',
          content: this.rightAlign('Subtotal:', this.formatCurrency(data.summary.subtotal), width),
        });
      }
      if (data.summary.taxTotal && data.summary.taxTotal > 0) {
        nodes.push({
          type: 'text',
          content: this.rightAlign('Tax:', this.formatCurrency(data.summary.taxTotal), width),
        });
      }
      if (data.summary.discountTotal && data.summary.discountTotal > 0) {
        nodes.push({
          type: 'text',
          content: this.rightAlign('Discount:', '-' + this.formatCurrency(data.summary.discountTotal), width),
        });
      }

      nodes.push({ type: 'line', style: 'solid' });
      nodes.push({
        type: 'text',
        content: this.rightAlign('TOTAL:', this.formatCurrency(data.summary.totalAmount || 0), width),
        style: { bold: true, size: 2 },
      });

      if (data.summary.amountPaid && data.summary.amountPaid > 0) {
        nodes.push({
          type: 'text',
          content: this.rightAlign('Paid:', this.formatCurrency(data.summary.amountPaid), width),
        });
        if (data.summary.changeAmount && data.summary.changeAmount > 0) {
          nodes.push({
            type: 'text',
            content: this.rightAlign('Change:', this.formatCurrency(data.summary.changeAmount), width),
          });
        }
      }
    }

    // === STAFF ===
    if (data.staff) {
      nodes.push({ type: 'line', style: 'dashed' });
      if (data.staff.salesAttendant) {
        nodes.push({
          type: 'text',
          content: `Sales: ${data.staff.salesAttendant.name}`,
        });
      }
      if (data.staff.financeAttendant) {
        nodes.push({
          type: 'text',
          content: `Cashier: ${data.staff.financeAttendant.name}`,
        });
      }
      if (data.staff.warehouseStaff) {
        nodes.push({
          type: 'text',
          content: `Released: ${data.staff.warehouseStaff.name}`,
        });
      }
    }

    // === QR CODE ===
    if (data.qrCode) {
      nodes.push({ type: 'line', style: 'dashed' });
      nodes.push({
        type: 'text',
        content: this.center('--- SCAN QR ---', width),
        style: { align: 'center' },
      });
      nodes.push({
        type: 'qr',
        content: data.qrCode,
        size: 4,
        align: 'center',
      });
    }

    // === FOOTER ===
    nodes.push({ type: 'line', style: 'solid' });

    const footerMessages = {
      SALES: ['Thank you!', 'Scan QR for payment'],
      PAYMENT: ['Payment Confirmed', 'Scan QR for release'],
      RELEASE: ['Items Released', 'Thank you!'],
      INVOICE: ['Thank you!', 'Keep this invoice'],
    };

    const messages = footerMessages[type] || ['Thank you!'];
    messages.forEach(msg => {
      nodes.push({
        type: 'text',
        content: this.center(msg, width),
        style: { align: 'center' },
      });
    });

    // === FEED AND CUT ===
    nodes.push({ type: 'feed', lines: 4 });
    nodes.push({ type: 'cut' });

    return nodes;
  }

  // ====== TEXT FORMATTING UTILITIES ======

  center(text, width) {
    const trimmed = String(text || '').trim();
    if (trimmed.length >= width) return trimmed.substring(0, width);
    const pad = Math.floor((width - trimmed.length) / 2);
    return ' '.repeat(pad) + trimmed;
  }

  rightAlign(label, value, width) {
    const totalLen = String(label).length + String(value).length;
    const spaces = Math.max(1, width - totalLen);
    return label + ' '.repeat(spaces) + value;
  }

  formatCurrency(amount) {
    return `N${Number(amount || 0).toFixed(2)}`;
  }

  formatDate(date) {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

export default ReceiptFormatter.getInstance();
export { PRINTER_TYPES };