// import { useState, useEffect } from 'react';
// import { Alert, Platform } from 'react-native';
// import * as Print from 'expo-print';
// import * as Sharing from 'expo-sharing';
// import { useAuth } from './useAuth';
// import ReceiptTemplate from '../components/print/ReceiptTemplate';

// // Mock Bluetooth printer support
// const isBluetoothAvailable = Platform.OS === 'android' || Platform.OS === 'ios';

// export const usePrinter = () => {
//   const { user } = useAuth();
//   const [isPrinting, setIsPrinting] = useState(false);
//   const [printerConnected, setPrinterConnected] = useState(false);

//   // Mock Bluetooth connection check
//   useEffect(() => {
//     if (isBluetoothAvailable) {
//       // In a real app, you would check Bluetooth connection
//       setPrinterConnected(true);
//     }
//   }, []);

//   const printReceipt = async (transaction, store, type = 'sales') => {
//     setIsPrinting(true);

//     try {
//       if (isBluetoothAvailable && printerConnected) {
//         // In a real app, you would send to Bluetooth printer
//         // This is a mock implementation
//         console.log('Printing to Bluetooth printer...');
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         Alert.alert('Success', 'Receipt sent to printer');
//       } else {
//         // Generate PDF
//         const html = generateReceiptHTML(transaction, store, type);
//         const { uri } = await Print.printToFileAsync({ html });
        
//         if (Platform.OS === 'ios') {
//           await Print.printAsync({ uri });
//         } else {
//           await Sharing.shareAsync(uri, {
//             mimeType: 'application/pdf',
//             dialogTitle: 'Save Receipt'
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Print error:', error);
//       throw error;
//     } finally {
//       setIsPrinting(false);
//     }
//   };

//   const generateReceiptHTML = (transaction, store, type) => {
//     // HTML template for PDF printing
//     return `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Receipt</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
//             .header { text-align: center; margin-bottom: 20px; }
//             .title { font-size: 24px; font-weight: bold; }
//             .subtitle { font-size: 16px; color: #666; }
//             .divider { border-top: 1px dashed #ccc; margin: 15px 0; }
//             .row { display: flex; justify-content: space-between; padding: 5px 0; }
//             .item { padding: 3px 0; }
//             .total { font-weight: bold; font-size: 18px; }
//             .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <div class="title">${store?.name || 'Store'}</div>
//             <div class="subtitle">${type.charAt(0).toUpperCase() + type.slice(1)} Receipt</div>
//           </div>
//           <div class="divider"></div>
//           <div class="row"><span>Transaction</span><span>${transaction.transactionNumber}</span></div>
//           <div class="row"><span>Date</span><span>${new Date().toLocaleString()}</span></div>
//           <div class="row"><span>Attendant</span><span>${transaction.salesAttendantId?.firstName || 'N/A'}</span></div>
//           <div class="divider"></div>
//           ${transaction.items?.map(item => `
//             <div class="row item">
//               <span>${item.name} x${item.quantity}</span>
//               <span>$${item.totalPrice?.toFixed(2)}</span>
//             </div>
//           `).join('')}
//           <div class="divider"></div>
//           <div class="row"><span>Subtotal</span><span>$${transaction.subtotal?.toFixed(2)}</span></div>
//           <div class="row"><span>Tax</span><span>$${transaction.taxTotal?.toFixed(2)}</span></div>
//           <div class="row total"><span>Total</span><span>$${transaction.totalAmount?.toFixed(2)}</span></div>
//           <div class="divider"></div>
//           <div class="footer">${store?.receiptFooter || 'Thank you for your purchase!'}</div>
//         </body>
//       </html>
//     `;
//   };

//   return {
//     isPrinting,
//     printerConnected,
//     printReceipt,
//     isBluetoothAvailable
//   };
// };
























// hooks/usePrinter.js
/**
 * Reusable printing hook - the same pattern receipt-preview.jsx uses,
 * extracted so any screen can wire up "connect + print" in a few lines
 * instead of re-implementing the connection listener / modal state.
 *
 * Usage in any screen:
 *
 *   import usePrinter from '../hooks/usePrinter';
 *   import BluetoothPrinterModal from '../components/print/BluetoothPrinterModal';
 *
 *   const { isPrinterConnected, print, modalProps } = usePrinter();
 *
 *   <TouchableOpacity onPress={() => print(myReceiptData)}>
 *     <Text>Print</Text>
 *   </TouchableOpacity>
 *
 *   <BluetoothPrinterModal {...modalProps} />
 *
 * `myReceiptData` should be shaped like the `printData` object built in
 * receipt-preview.jsx's handlePrint (store/transaction/items/summary/
 * staff/payment/invoice/qrCode).
 */
import { useEffect, useState, useCallback } from 'react';
import PrinterService from '../services/printer'; // adjust path per screen location

export default function usePrinter() {
  const [isPrinterConnected, setIsPrinterConnected] = useState(false);
  const [printerDevice, setPrinterDevice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptType, setReceiptType] = useState('SALES');

  useEffect(() => {
    const status = PrinterService.getConnectionStatus();
    setIsPrinterConnected(status.connected);
    if (status.connected) setPrinterDevice(status.device);

    // addConnectionListener returns an unsubscribe function - always capture
    // and call it. (PrinterService has no removeConnectionListener().)
    const unsubscribe = PrinterService.addConnectionListener(({ connected, device }) => {
      setIsPrinterConnected(connected);
      setPrinterDevice(device);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const print = useCallback((data, type = 'SALES') => {
    setReceiptData(data);
    setReceiptType(type);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setReceiptData(null);
  }, []);

  return {
    isPrinterConnected,
    printerDevice,
    print, // print(receiptData, 'SALES' | 'PAYMENT' | 'RELEASE' | 'INVOICE')
    // Spread directly onto <BluetoothPrinterModal {...modalProps} />
    modalProps: {
      visible: modalVisible,
      onClose: closeModal,
      receiptData,
      receiptType,
      onPrintComplete: closeModal,
    },
  };
}
