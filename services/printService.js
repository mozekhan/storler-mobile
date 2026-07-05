// import * as Print from 'expo-print';
// import * as Sharing from 'expo-sharing';
// import * as FileSystem from 'expo-file-system';
// import { Platform, Alert } from 'react-native';
// import { formatCurrency, formatDateTime } from '../utils/formatters';

// class PrintService {
//   constructor() {
//     this.isBluetoothSupported = Platform.OS === 'android' || Platform.OS === 'ios';
//     this.printerConnected = false;
//   }

//   async printReceipt(transaction, store, type = 'sales') {
//     try {
//       const html = this.generateReceiptHTML(transaction, store, type);
//       const { uri } = await Print.printToFileAsync({ html });

//       if (Platform.OS === 'ios') {
//         await Print.printAsync({ uri });
//       } else {
//         await Sharing.shareAsync(uri, {
//           mimeType: 'application/pdf',
//           dialogTitle: 'Save Receipt'
//         });
//       }

//       return { success: true, uri };
//     } catch (error) {
//       console.error('Print error:', error);
//       throw error;
//     }
//   }

//   generateReceiptHTML(transaction, store, type) {
//     const itemsHTML = transaction.items?.map(item => `
//       <div class="row item">
//         <span>${item.name} x${item.quantity}</span>
//         <span>${formatCurrency(item.totalPrice)}</span>
//       </div>
//     `).join('') || '';

//     const paymentHTML = type === 'payment' ? `
//       <div class="divider"></div>
//       <div class="row"><span>Payment Method</span><span>${transaction.paymentMethod}</span></div>
//       <div class="row"><span>Amount Paid</span><span>${formatCurrency(transaction.amountPaid)}</span></div>
//       ${transaction.changeAmount > 0 ? `
//         <div class="row"><span>Change</span><span>${formatCurrency(transaction.changeAmount)}</span></div>
//       ` : ''}
//     ` : '';

//     const releaseHTML = type === 'invoice' ? `
//       <div class="divider"></div>
//       <div class="row"><span>Released By</span><span>${transaction.warehouseStaffId?.firstName || 'N/A'}</span></div>
//       <div class="row"><span>Invoice #</span><span>${transaction.finalInvoiceNumber || 'N/A'}</span></div>
//     ` : '';

//     return `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>${type.charAt(0).toUpperCase() + type.slice(1)} Receipt</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               padding: 20px;
//               max-width: 400px;
//               margin: 0 auto;
//               background: #fff;
//             }
//             .header { text-align: center; margin-bottom: 20px; }
//             .title { font-size: 24px; font-weight: bold; color: #1f2937; }
//             .subtitle { font-size: 16px; color: #6b7280; margin-top: 4px; }
//             .divider { border-top: 1px dashed #d1d5db; margin: 15px 0; }
//             .row { display: flex; justify-content: space-between; padding: 4px 0; }
//             .item { padding: 3px 0; }
//             .total { font-weight: bold; font-size: 18px; color: #1f2937; }
//             .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
//             .qr { text-align: center; margin: 15px 0; }
//             .label { color: #6b7280; font-size: 14px; }
//             .value { font-weight: 500; color: #1f2937; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <div class="title">${store?.name || 'Store'}</div>
//             <div class="subtitle">${type.charAt(0).toUpperCase() + type.slice(1)} Receipt</div>
//           </div>
//           <div class="divider"></div>
//           <div class="row"><span class="label">Transaction</span><span class="value">${transaction.transactionNumber}</span></div>
//           <div class="row"><span class="label">Date</span><span class="value">${formatDateTime(transaction.createdAt || transaction.salesTimestamp)}</span></div>
//           <div class="row"><span class="label">Attendant</span><span class="value">${transaction.salesAttendantId?.firstName || 'N/A'}</span></div>
//           <div class="divider"></div>
//           ${itemsHTML}
//           <div class="divider"></div>
//           <div class="row"><span class="label">Subtotal</span><span class="value">${formatCurrency(transaction.subtotal)}</span></div>
//           <div class="row"><span class="label">Tax</span><span class="value">${formatCurrency(transaction.taxTotal)}</span></div>
//           <div class="row total"><span>Total</span><span>${formatCurrency(transaction.totalAmount)}</span></div>
//           ${paymentHTML}
//           ${releaseHTML}
//           <div class="divider"></div>
//           ${transaction.salesReceiptQR ? `
//             <div class="qr">
//               <p style="font-size: 12px; color: #6b7280;">Scan QR Code</p>
//               <div style="display: flex; justify-content: center;">
//                 <img src="data:image/png;base64,${transaction.salesReceiptQR}" alt="QR Code" style="width: 120px; height: 120px;" />
//               </div>
//             </div>
//           ` : ''}
//           <div class="divider"></div>
//           <div class="footer">${store?.receiptFooter || 'Thank you for your purchase!'}</div>
//         </body>
//       </html>
//     `;
//   }

//   async connectBluetooth() {
//     if (!this.isBluetoothSupported) {
//       Alert.alert('Error', 'Bluetooth printing is not supported on this device');
//       return false;
//     }

//     try {
//       // In a real app, you would connect to Bluetooth printer
//       this.printerConnected = true;
//       return true;
//     } catch (error) {
//       Alert.alert('Error', 'Failed to connect to Bluetooth printer');
//       return false;
//     }
//   }

//   async printBluetooth(html) {
//     if (!this.printerConnected) {
//       await this.connectBluetooth();
//     }

//     // In a real app, you would send to Bluetooth printer
//     console.log('Printing to Bluetooth...');
//     return { success: true };
//   }

//   async saveReceipt(transaction, store, type) {
//     try {
//       const html = this.generateReceiptHTML(transaction, store, type);
//       const { uri } = await Print.printToFileAsync({ html });

//       const fileName = `receipt_${transaction.transactionNumber}_${Date.now()}.pdf`;
//       const newUri = `${FileSystem.documentDirectory}${fileName}`;
      
//       await FileSystem.copyAsync({
//         from: uri,
//         to: newUri
//       });

//       return { uri: newUri, fileName };
//     } catch (error) {
//       console.error('Save receipt error:', error);
//       throw error;
//     }
//   }
// }

// export default new PrintService();

























import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform, Alert } from 'react-native';
import { formatCurrency, formatDateTime } from '../utils/formatters';

class PrintService {
  constructor() {
    this.isBluetoothSupported = Platform.OS === 'android' || Platform.OS === 'ios';
    this.printerConnected = false;
  }

  async printReceipt(transaction, store, type = 'sales') {
    try {
      const html = this.generateReceiptHTML(transaction, store, type);
      const { uri } = await Print.printToFileAsync({ html });

      if (Platform.OS === 'ios') {
        await Print.printAsync({ uri });
      } else {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save Receipt'
        });
      }

      return { success: true, uri };
    } catch (error) {
      console.error('Print error:', error);
      throw error;
    }
  }

  generateReceiptHTML(transaction, store, type) {
    const itemsHTML = transaction.items?.map(item => `
      <div class="row item">
        <span>${item.name} x${item.quantity}</span>
        <span>${formatCurrency(item.totalPrice)}</span>
      </div>
    `).join('') || '';

    const paymentHTML = type === 'payment' ? `
      <div class="divider"></div>
      <div class="row"><span>Payment Method</span><span>${transaction.paymentMethod}</span></div>
      <div class="row"><span>Amount Paid</span><span>${formatCurrency(transaction.amountPaid)}</span></div>
      ${transaction.changeAmount > 0 ? `
        <div class="row"><span>Change</span><span>${formatCurrency(transaction.changeAmount)}</span></div>
      ` : ''}
    ` : '';

    const releaseHTML = type === 'invoice' ? `
      <div class="divider"></div>
      <div class="row"><span>Released By</span><span>${transaction.warehouseStaffId?.firstName || 'N/A'}</span></div>
      <div class="row"><span>Invoice #</span><span>${transaction.finalInvoiceNumber || 'N/A'}</span></div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${type.charAt(0).toUpperCase() + type.slice(1)} Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; background: #fff; }
            .header { text-align: center; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #1f2937; }
            .subtitle { font-size: 16px; color: #6b7280; margin-top: 4px; }
            .divider { border-top: 1px dashed #d1d5db; margin: 15px 0; }
            .row { display: flex; justify-content: space-between; padding: 4px 0; }
            .item { padding: 3px 0; }
            .total { font-weight: bold; font-size: 18px; color: #1f2937; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
            .qr { text-align: center; margin: 15px 0; }
            .label { color: #6b7280; font-size: 14px; }
            .value { font-weight: 500; color: #1f2937; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${store?.name || 'Store'}</div>
            <div class="subtitle">${type.charAt(0).toUpperCase() + type.slice(1)} Receipt</div>
          </div>
          <div class="divider"></div>
          <div class="row"><span class="label">Transaction</span><span class="value">${transaction.transactionNumber}</span></div>
          <div class="row"><span class="label">Date</span><span class="value">${formatDateTime(transaction.createdAt || transaction.salesTimestamp)}</span></div>
          <div class="row"><span class="label">Attendant</span><span class="value">${transaction.salesAttendantId?.firstName || 'N/A'}</span></div>
          <div class="divider"></div>
          ${itemsHTML}
          <div class="divider"></div>
          <div class="row"><span class="label">Subtotal</span><span class="value">${formatCurrency(transaction.subtotal)}</span></div>
          <div class="row"><span class="label">Tax</span><span class="value">${formatCurrency(transaction.taxTotal)}</span></div>
          <div class="row total"><span>Total</span><span>${formatCurrency(transaction.totalAmount)}</span></div>
          ${paymentHTML}
          ${releaseHTML}
          <div class="divider"></div>
          ${transaction.salesReceiptQR ? `
            <div class="qr">
              <p style="font-size: 12px; color: #6b7280;">Scan QR Code</p>
              <div style="display: flex; justify-content: center;">
                <img src="data:image/png;base64,${transaction.salesReceiptQR}" alt="QR Code" style="width: 120px; height: 120px;" />
              </div>
            </div>
          ` : ''}
          <div class="divider"></div>
          <div class="footer">${store?.receiptFooter || 'Thank you for your purchase!'}</div>
        </body>
      </html>
    `;
  }

  async connectBluetooth() {
    if (!this.isBluetoothSupported) {
      Alert.alert('Error', 'Bluetooth printing is not supported on this device');
      return false;
    }

    try {
      this.printerConnected = true;
      return true;
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to Bluetooth printer');
      return false;
    }
  }

  async printBluetooth(html) {
    if (!this.printerConnected) {
      await this.connectBluetooth();
    }
    console.log('Printing to Bluetooth...');
    return { success: true };
  }

  async saveReceipt(transaction, store, type) {
    try {
      const html = this.generateReceiptHTML(transaction, store, type);
      const { uri } = await Print.printToFileAsync({ html });

      const fileName = `receipt_${transaction.transactionNumber}_${Date.now()}.pdf`;
      const newUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.copyAsync({ from: uri, to: newUri });

      return { uri: newUri, fileName };
    } catch (error) {
      console.error('Save receipt error:', error);
      throw error;
    }
  }
}

export default new PrintService();