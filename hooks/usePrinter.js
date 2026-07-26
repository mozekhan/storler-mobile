// import { useEffect, useState, useCallback } from 'react';
// import PrinterService from '../services/printer'; // adjust path per screen location

// export default function usePrinter() {
//   const [isPrinterConnected, setIsPrinterConnected] = useState(false);
//   const [printerDevice, setPrinterDevice] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [receiptData, setReceiptData] = useState(null);
//   const [receiptType, setReceiptType] = useState('SALES');

//   useEffect(() => {
//     const status = PrinterService.getConnectionStatus();
//     setIsPrinterConnected(status.connected);
//     if (status.connected) setPrinterDevice(status.device);

//     // addConnectionListener returns an unsubscribe function - always capture
//     // and call it. (PrinterService has no removeConnectionListener().)
//     const unsubscribe = PrinterService.addConnectionListener(({ connected, device }) => {
//       setIsPrinterConnected(connected);
//       setPrinterDevice(device);
//     });

//     return () => {
//       if (typeof unsubscribe === 'function') unsubscribe();
//     };
//   }, []);

//   const print = useCallback((data, type = 'SALES') => {
//     setReceiptData(data);
//     setReceiptType(type);
//     setModalVisible(true);
//   }, []);

//   const closeModal = useCallback(() => {
//     setModalVisible(false);
//     setReceiptData(null);
//   }, []);

//   return {
//     isPrinterConnected,
//     printerDevice,
//     print, // print(receiptData, 'SALES' | 'PAYMENT' | 'RELEASE' | 'INVOICE')
//     // Spread directly onto <BluetoothPrinterModal {...modalProps} />
//     modalProps: {
//       visible: modalVisible,
//       onClose: closeModal,
//       receiptData,
//       receiptType,
//       onPrintComplete: closeModal,
//     },
//   };
// }


































// hooks/usePrinter.js
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import PrinterService from '../services/printer';

export const usePrinter = () => {
  const [isPrinterConnected, setIsPrinterConnected] = useState(false);
  const [printerDevice, setPrinterDevice] = useState(null);
  const [printerModalVisible, setPrinterModalVisible] = useState(false);
  const [printReceiptData, setPrintReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPrinterStatus();

    const unsubscribe = PrinterService.addConnectionListener?.(({ connected, device }) => {
      setIsPrinterConnected(connected);
      setPrinterDevice(device);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const checkPrinterStatus = useCallback(() => {
    const status = PrinterService.getConnectionStatus();
    setIsPrinterConnected(status.connected);
    if (status.connected) {
      setPrinterDevice(status.device);
    }
  }, []);

  const openPrintModal = useCallback((receiptData, receiptType) => {
    if (!receiptData) {
      Alert.alert('Error', 'No receipt data available to print');
      return;
    }
    setPrintReceiptData(receiptData);
    setPrinterModalVisible(true);
  }, []);

  const closePrintModal = useCallback(() => {
    setPrinterModalVisible(false);
    setPrintReceiptData(null);
  }, []);

  const handlePrintComplete = useCallback(() => {
    // Refresh or update after printing
    setPrinterModalVisible(false);
    setPrintReceiptData(null);
  }, []);

  return {
    isPrinterConnected,
    printerDevice,
    printerModalVisible,
    printReceiptData,
    loading,
    openPrintModal,
    closePrintModal,
    handlePrintComplete,
    checkPrinterStatus,
    setPrinterModalVisible,
  };
};