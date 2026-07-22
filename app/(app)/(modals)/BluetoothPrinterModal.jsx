// // components/BluetoothPrinterModal.jsx

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   Modal,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   Switch,
// } from 'react-native';
// import { 
//   Bluetooth, 
//   BluetoothOff, 
//   CheckCircle, 
//   XCircle, 
//   RefreshCw, 
//   Printer,
//   Scan,
// } from 'lucide-react-native';
// import { Colors, Spacing, Typography, BorderRadius } from '../../../constants/theme';
// import PrinterService from '../../../services/printer/PrinterService';

// export default function BluetoothPrinterModal({ 
//   visible, 
//   onClose, 
//   onPrintComplete,
//   receiptData,
//   receiptType = 'SALES',
// }) {
//   const [loading, setLoading] = useState(false);
//   const [devices, setDevices] = useState([]);
//   const [scanning, setScanning] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [isPrinting, setIsPrinting] = useState(false);
//   const [paperSize, setPaperSize] = useState('58mm');
//   const [autoConnect, setAutoConnect] = useState(true);
//   const [printCopies, setPrintCopies] = useState(1);
//   const [connectionStatus, setConnectionStatus] = useState({
//     state: 'disconnected',
//     device: null,
//   });

//   // Load settings on mount
//   useEffect(() => {
//     if (visible) {
//       initializeBluetooth();
//       loadSettings();
//     }
//   }, [visible]);

//   // Setup connection listener
//   useEffect(() => {
//     const unsubscribe = PrinterService.addConnectionListener((status) => {
//       setConnectionStatus(status);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   const loadSettings = async () => {
//     try {
//       const size = await PrinterService.getPaperSize();
//       const auto = await PrinterService.getAutoConnect();
//       const copies = await PrinterService.getPrintCopies();
      
//       setPaperSize(size);
//       setAutoConnect(auto);
//       setPrintCopies(copies || 1);
//     } catch (error) {
//       console.error('Failed to load settings:', error);
//     }
//   };

//   const initializeBluetooth = async () => {
//     setLoading(true);
//     try {
//       const initialized = await PrinterService.initialize();
//       if (initialized) {
//         await loadDevices();
//       } else {
//         Alert.alert(
//           'Bluetooth Error',
//           'Failed to initialize Bluetooth. Please check your device settings.'
//         );
//       }
//     } catch (error) {
//       console.error('Init error:', error);
//       Alert.alert('Error', 'Failed to initialize Bluetooth');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadDevices = async () => {
//     try {
//       const devices = await PrinterService.getPairedDevices();
//       setDevices(devices);
//     } catch (error) {
//       console.error('Failed to load devices:', error);
//     }
//   };

//   const scanForDevices = async () => {
//     setScanning(true);
//     try {
//       const devices = await PrinterService.scanForDevices(10000);
//       setDevices(devices);
//     } catch (error) {
//       console.error('Scan error:', error);
//       Alert.alert('Error', 'Failed to scan for devices');
//     } finally {
//       setScanning(false);
//     }
//   };

//   const connectToDevice = async (device) => {
//     setLoading(true);
//     try {
//       const connected = await PrinterService.connectToPrinter(device);
//       if (connected) {
//         Alert.alert('Connected', `Connected to ${device.name}`);
//         await loadDevices();
//       } else {
//         Alert.alert('Connection Failed', 'Could not connect to printer');
//       }
//     } catch (error) {
//       console.error('Connection error:', error);
//       Alert.alert('Connection Failed', error.message || 'Unknown error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disconnectPrinter = async () => {
//     try {
//       await PrinterService.disconnect();
//       Alert.alert('Disconnected', 'Printer disconnected');
//       await loadDevices();
//     } catch (error) {
//       Alert.alert('Error', 'Failed to disconnect');
//     }
//   };

//   const handlePrint = async () => {
//     if (!connectionStatus.connected) {
//       Alert.alert('Not Connected', 'Please connect to a printer first');
//       return;
//     }

//     if (!receiptData) {
//       Alert.alert('No Data', 'No receipt data to print');
//       return;
//     }

//     setIsPrinting(true);
//     try {
//       let result;
      
//       switch (receiptType) {
//         case 'SALES':
//           result = await PrinterService.printSalesReceipt(receiptData);
//           break;
//         case 'PAYMENT':
//           result = await PrinterService.printPaymentReceipt(receiptData);
//           break;
//         case 'RELEASE':
//         case 'INVOICE':
//           result = await PrinterService.printReleaseReceipt(receiptData);
//           break;
//         default:
//           Alert.alert('Error', 'Unsupported receipt type');
//           return;
//       }

//       if (result?.success) {
//         Alert.alert('Success', 'Receipt printed successfully');
//         if (onPrintComplete) onPrintComplete();
//         onClose();
//       } else {
//         const errors = Array.from(result?.results?.entries() || [])
//           .filter(([, r]) => !r.success)
//           .map(([addr, r]) => `${addr}: ${r.error?.message || 'Unknown error'}`);
        
//         Alert.alert('Print Error', errors.join('\n') || 'Failed to print receipt');
//       }
//     } catch (error) {
//       console.error('Print error:', error);
//       Alert.alert('Print Error', error.message || 'Failed to print receipt');
//     } finally {
//       setIsPrinting(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await loadDevices();
//     setRefreshing(false);
//   };

//   const togglePaperSize = async () => {
//     const newSize = paperSize === '80mm' ? '58mm' : '80mm';
//     await PrinterService.setPaperSize(newSize);
//     setPaperSize(newSize);
//   };

//   const toggleAutoConnect = async (value) => {
//     await PrinterService.setAutoConnect(value);
//     setAutoConnect(value);
//   };

//   const updatePrintCopies = async (copies) => {
//     await PrinterService.setPrintCopies(copies);
//     setPrintCopies(copies);
//   };

//   const renderDevice = ({ item }) => {
//     const isConnected = connectionStatus.connected && 
//       connectionStatus.device?.address === item.address;

//     return (
//       <TouchableOpacity
//         style={[styles.deviceItem, isConnected && styles.deviceConnected]}
//         onPress={() => connectToDevice(item)}
//         disabled={isConnected}
//       >
//         <View style={styles.deviceIcon}>
//           <Printer size={24} color={isConnected ? Colors.success : Colors.gray700} />
//         </View>
//         <View style={styles.deviceInfo}>
//           <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
//           <Text style={styles.deviceAddress}>{item.address}</Text>
//           {item.deviceType && (
//             <Text style={styles.deviceType}>Type: {item.deviceType}</Text>
//           )}
//         </View>
//         {isConnected && (
//           <View style={styles.connectedBadge}>
//             <CheckCircle size={16} color={Colors.success} />
//             <Text style={styles.connectedText}>Connected</Text>
//           </View>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <Printer size={48} color={Colors.gray300} />
//       <Text style={styles.emptyText}>No Bluetooth printers found</Text>
//       <Text style={styles.emptySubtext}>
//         Please pair your printer in system settings or scan for nearby devices
//       </Text>
//       <TouchableOpacity style={styles.scanButton} onPress={scanForDevices} disabled={scanning}>
//         {scanning ? (
//           <ActivityIndicator color={Colors.white} size="small" />
//         ) : (
//           <>
//             <Scan size={20} color={Colors.white} />
//             <Text style={styles.scanButtonText}>Scan for Devices</Text>
//           </>
//         )}
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <View style={styles.modalHeaderLeft}>
//               <Printer size={24} color={Colors.primary} />
//               <Text style={styles.modalTitle}>Thermal Printer</Text>
//             </View>
//             <TouchableOpacity onPress={onClose}>
//               <XCircle size={24} color={Colors.gray500} />
//             </TouchableOpacity>
//           </View>

//           {/* Connection Status */}
//           <View style={styles.statusContainer}>
//             <View style={styles.statusRow}>
//               <Text style={styles.statusLabel}>Status:</Text>
//               {connectionStatus.connected ? (
//                 <View style={styles.statusConnected}>
//                   <CheckCircle size={14} color={Colors.success} />
//                   <Text style={styles.statusTextConnected}>Connected</Text>
//                 </View>
//               ) : (
//                 <View style={styles.statusDisconnected}>
//                   <BluetoothOff size={14} color={Colors.error} />
//                   <Text style={styles.statusTextDisconnected}>
//                     {connectionStatus.state === 'connecting' ? 'Connecting...' : 'Disconnected'}
//                   </Text>
//                 </View>
//               )}
//             </View>
//             {connectionStatus.connected && connectionStatus.device && (
//               <Text style={styles.currentDeviceText}>
//                 {connectionStatus.device.name}
//               </Text>
//             )}
//             {connectionStatus.connected && (
//               <TouchableOpacity style={styles.disconnectButton} onPress={disconnectPrinter}>
//                 <Text style={styles.disconnectText}>Disconnect</Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* Settings */}
//           <View style={styles.settingsContainer}>
//             <View style={styles.settingRow}>
//               <Text style={styles.settingLabel}>Paper Size</Text>
//               <View style={styles.paperSizeButtons}>
//                 <TouchableOpacity
//                   style={[
//                     styles.paperSizeButton,
//                     paperSize === '80mm' && styles.paperSizeActive,
//                   ]}
//                   onPress={() => paperSize !== '80mm' && togglePaperSize()}
//                 >
//                   <Text style={[
//                     styles.paperSizeText,
//                     paperSize === '80mm' && styles.paperSizeTextActive,
//                   ]}>
//                     80mm
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.paperSizeButton,
//                     paperSize === '58mm' && styles.paperSizeActive,
//                   ]}
//                   onPress={() => paperSize !== '58mm' && togglePaperSize()}
//                 >
//                   <Text style={[
//                     styles.paperSizeText,
//                     paperSize === '58mm' && styles.paperSizeTextActive,
//                   ]}>
//                     58mm
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <View style={styles.settingRow}>
//               <Text style={styles.settingLabel}>Auto-Connect</Text>
//               <Switch
//                 value={autoConnect}
//                 onValueChange={toggleAutoConnect}
//                 trackColor={{ false: Colors.gray300, true: Colors.primary }}
//                 thumbColor={Colors.white}
//               />
//             </View>

//             <View style={styles.settingRow}>
//               <Text style={styles.settingLabel}>Copies</Text>
//               <View style={styles.copyControls}>
//                 <TouchableOpacity
//                   style={styles.copyButton}
//                   onPress={() => updatePrintCopies(Math.max(1, printCopies - 1))}
//                 >
//                   <Text style={styles.copyButtonText}>-</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.copyCount}>{printCopies}</Text>
//                 <TouchableOpacity
//                   style={styles.copyButton}
//                   onPress={() => updatePrintCopies(Math.min(5, printCopies + 1))}
//                 >
//                   <Text style={styles.copyButtonText}>+</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>

//           {/* Device List */}
//           <View style={styles.deviceListContainer}>
//             <View style={styles.deviceListHeader}>
//               <Text style={styles.deviceListTitle}>Available Printers</Text>
//               <View style={styles.deviceActions}>
//                 <TouchableOpacity onPress={scanForDevices} disabled={scanning}>
//                   <Scan size={20} color={Colors.primary} />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
//                   <RefreshCw size={20} color={Colors.primary} />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {loading ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color={Colors.primary} />
//                 <Text style={styles.loadingText}>Loading devices...</Text>
//               </View>
//             ) : (
//               <FlatList
//                 data={devices}
//                 keyExtractor={(item) => item.address || Math.random().toString()}
//                 renderItem={renderDevice}
//                 contentContainerStyle={styles.deviceList}
//                 showsVerticalScrollIndicator={false}
//                 ListEmptyComponent={renderEmptyState}
//                 refreshControl={
//                   <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//                 }
//               />
//             )}
//           </View>

//           {/* Print Button */}
//           <View style={styles.footer}>
//             <TouchableOpacity
//               style={[
//                 styles.printButton,
//                 (!connectionStatus.connected || isPrinting) && styles.printButtonDisabled,
//               ]}
//               onPress={handlePrint}
//               disabled={!connectionStatus.connected || isPrinting}
//             >
//               {isPrinting ? (
//                 <ActivityIndicator color={Colors.white} size="small" />
//               ) : (
//                 <>
//                   <Printer size={20} color={Colors.white} />
//                   <Text style={styles.printButtonText}>Print Receipt</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius.xl,
//     borderTopRightRadius: BorderRadius.xl,
//     padding: Spacing.xl,
//     maxHeight: '92%',
//     minHeight: '75%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: Spacing.md,
//   },
//   modalHeaderLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//   },
//   modalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   statusContainer: {
//     backgroundColor: Colors.gray50,
//     borderRadius: BorderRadius.md,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//   },
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//   },
//   statusLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   statusConnected: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   statusTextConnected: {
//     fontSize: Typography.sm,
//     color: Colors.success,
//     fontWeight: '600',
//   },
//   statusDisconnected: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   statusTextDisconnected: {
//     fontSize: Typography.sm,
//     color: Colors.error,
//     fontWeight: '600',
//   },
//   currentDeviceText: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: 4,
//     marginLeft: 4,
//   },
//   disconnectButton: {
//     alignSelf: 'flex-start',
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//     backgroundColor: Colors.error + '20',
//     borderRadius: BorderRadius.sm,
//     marginTop: Spacing.xs,
//   },
//   disconnectText: {
//     fontSize: Typography.xs,
//     color: Colors.error,
//     fontWeight: '500',
//   },
//   settingsContainer: {
//     backgroundColor: Colors.gray50,
//     borderRadius: BorderRadius.md,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//   },
//   settingRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 4,
//   },
//   settingLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray700,
//     fontWeight: '500',
//   },
//   paperSizeButtons: {
//     flexDirection: 'row',
//     gap: Spacing.sm,
//   },
//   paperSizeButton: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: 4,
//     borderRadius: BorderRadius.sm,
//     backgroundColor: Colors.white,
//     borderWidth: 1,
//     borderColor: Colors.gray300,
//   },
//   paperSizeActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   paperSizeText: {
//     fontSize: Typography.sm,
//     color: Colors.gray700,
//   },
//   paperSizeTextActive: {
//     color: Colors.white,
//   },
//   copyControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.md,
//   },
//   copyButton: {
//     width: 30,
//     height: 30,
//     borderRadius: BorderRadius.full,
//     backgroundColor: Colors.primary,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   copyButtonText: {
//     fontSize: Typography.lg,
//     color: Colors.white,
//     fontWeight: 'bold',
//   },
//   copyCount: {
//     fontSize: Typography.md,
//     fontWeight: '600',
//     color: Colors.gray900,
//     minWidth: 20,
//     textAlign: 'center',
//   },
//   deviceListContainer: {
//     flex: 1,
//   },
//   deviceListHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: Spacing.sm,
//   },
//   deviceListTitle: {
//     fontSize: Typography.md,
//     fontWeight: '600',
//     color: Colors.gray900,
//   },
//   deviceActions: {
//     flexDirection: 'row',
//     gap: Spacing.md,
//   },
//   deviceList: {
//     paddingBottom: Spacing.md,
//   },
//   deviceItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: Spacing.md,
//     backgroundColor: Colors.gray50,
//     borderRadius: BorderRadius.md,
//     marginBottom: Spacing.sm,
//     borderWidth: 1,
//     borderColor: Colors.gray200,
//   },
//   deviceConnected: {
//     borderColor: Colors.success,
//     backgroundColor: Colors.success + '10',
//   },
//   deviceIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: BorderRadius.full,
//     backgroundColor: Colors.white,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: Spacing.md,
//   },
//   deviceInfo: {
//     flex: 1,
//   },
//   deviceName: {
//     fontSize: Typography.md,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   deviceAddress: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   deviceType: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//   },
//   connectedBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: Colors.success + '20',
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   connectedText: {
//     fontSize: Typography.xs,
//     color: Colors.success,
//     fontWeight: '500',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: Spacing.xl,
//   },
//   loadingText: {
//     marginTop: Spacing.md,
//     color: Colors.gray500,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: Spacing.xl,
//   },
//   emptyText: {
//     fontSize: Typography.md,
//     color: Colors.gray500,
//     marginTop: Spacing.md,
//   },
//   emptySubtext: {
//     fontSize: Typography.sm,
//     color: Colors.gray400,
//     marginTop: Spacing.xs,
//     textAlign: 'center',
//   },
//   scanButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: Spacing.md,
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing.xl,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.md,
//     gap: Spacing.sm,
//   },
//   scanButtonText: {
//     color: Colors.white,
//     fontWeight: '600',
//   },
//   footer: {
//     marginTop: Spacing.md,
//     paddingTop: Spacing.md,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//   },
//   printButton: {
//     backgroundColor: Colors.primary,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.md,
//     gap: Spacing.sm,
//   },
//   printButtonDisabled: {
//     opacity: 0.5,
//   },
//   printButtonText: {
//     color: Colors.white,
//     fontWeight: '600',
//     fontSize: Typography.md,
//   },
// });


































// components/print/BluetoothPrinterModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Switch,
} from 'react-native';
import { 
  Bluetooth, 
  BluetoothOff, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Printer,
  Scan,
  Settings,
  AlertTriangle,
  Bug,
} from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';
import PrinterService from '../../../services/printer';
import { PRINTER_TYPES } from '../../../services/printer/ReceiptFormatter';

export default function BluetoothPrinterModal({ 
  visible, 
  onClose, 
  onPrintComplete,
  receiptData,
  receiptType,
}) {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [paperSize, setPaperSize] = useState('58mm');
  const [autoConnect, setAutoConnect] = useState(true);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [detectedType, setDetectedType] = useState(PRINTER_TYPES.UNKNOWN);
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    if (visible) {
      initializeBluetooth();
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    try {
      const size = await PrinterService.getPaperSize();
      const auto = await PrinterService.getAutoConnect();
      setPaperSize(size || '58mm');
      setAutoConnect(auto !== undefined ? auto : true);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const initializeBluetooth = async () => {
    setLoading(true);
    try {
      const initialized = await PrinterService.initialize();
      if (initialized) {
        await loadPairedDevices();
        updateConnectionStatus();
      }
    } catch (error) {
      console.error('Init error:', error);
      Alert.alert('Bluetooth Error', 'Failed to initialize Bluetooth');
    } finally {
      setLoading(false);
    }
  };

  const loadPairedDevices = async () => {
    try {
      const pairedDevices = await PrinterService.getPairedDevices();
      setDevices(pairedDevices);
    } catch (error) {
      console.error('Failed to load paired devices:', error);
    }
  };

  const scanForDevices = async () => {
    setScanning(true);
    try {
      const scannedDevices = await PrinterService.scanForDevices(8000);
      const allDevices = [...devices];
      for (const device of scannedDevices) {
        if (!allDevices.some(d => d.address === device.address || d.id === device.id)) {
          allDevices.push(device);
        }
      }
      setDevices(allDevices);
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert('Error', 'Failed to scan for devices');
    } finally {
      setScanning(false);
    }
  };

  const updateConnectionStatus = () => {
    const status = PrinterService.getConnectionStatus();
    setIsConnected(status.connected);
    if (status.connected && status.device) {
      setCurrentDevice(status.device);
      const name = status.device.name || '';
      if (name.toUpperCase().includes('DATECS') || name.toUpperCase().includes('DPP') || name.toUpperCase().includes('BT-SPP')) {
        setDetectedType(PRINTER_TYPES.DATECS_DPP250);
      } else if (name.toUpperCase().includes('TSC')) {
        setDetectedType(PRINTER_TYPES.GENERIC_ESCPOS);
      } else {
        setDetectedType(PRINTER_TYPES.GENERIC_ESCPOS);
      }
    } else {
      setCurrentDevice(null);
      setDetectedType(PRINTER_TYPES.UNKNOWN);
    }
  };

  const connectToDevice = async (device) => {
    setLoading(true);
    try {
      await PrinterService.connectToPrinter(device);
      setIsConnected(true);
      setCurrentDevice(device);
      Alert.alert('Connected', `Connected to ${device.name || 'Unknown'}`);
    } catch (error) {
      console.error('Failed to connect:', error);
      Alert.alert('Connection Failed', error.message || 'Failed to connect to printer');
    } finally {
      setLoading(false);
    }
  };

  const disconnectPrinter = async () => {
    try {
      await PrinterService.disconnect();
      setIsConnected(false);
      setCurrentDevice(null);
      setDetectedType(PRINTER_TYPES.UNKNOWN);
    } catch (error) {
      Alert.alert('Error', 'Failed to disconnect');
    }
  };

  const handlePrint = async () => {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Please connect to a printer first');
      return;
    }

    setIsPrinting(true);
    try {
      let result;
      
      switch (receiptType) {
        case 'SALES':
          result = await PrinterService.printSalesReceipt(receiptData);
          break;
        case 'PAYMENT':
          result = await PrinterService.printPaymentReceipt(receiptData);
          break;
        case 'RELEASE':
        case 'INVOICE':
          result = await PrinterService.printReleaseReceipt(receiptData);
          break;
        default:
          throw new Error('Unsupported receipt type');
      }

      if (result?.success) {
        Alert.alert('Success', 'Receipt printed successfully');
        if (onPrintComplete) onPrintComplete();
        onClose();
      } else {
        throw new Error('Print returned unsuccessfully');
      }
    } catch (error) {
      console.error('Print error:', error);
      Alert.alert(
        'Print Failed', 
        `${error.message}\n\nTry running Diagnostics to test different print methods.`,
        [
          { text: 'OK', style: 'cancel' },
          { text: 'Run Diagnostics', onPress: runDiagnostics },
        ]
      );
    } finally {
      setIsPrinting(false);
    }
  };

  const runDiagnostics = async () => {
    setShowDiagnostics(true);
    setLoading(true);
    try {
      const results = await PrinterService.diagnosticPrint();
      setDiagnosticResults(results);
      
      const anySuccess = results.some(r => r.success);
      if (anySuccess) {
        Alert.alert('Diagnostic Result', 'At least one print method succeeded! The printer is working. Try printing again.');
      } else {
        Alert.alert(
          'All Methods Failed',
          'Printer connected but not responding to commands.\n\nTry power cycling the printer and ensuring it\'s in receipt mode.',
          [
            { text: 'OK', style: 'cancel' },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Diagnostic Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestPrint = async () => {
    setLoading(true);
    try {
      await PrinterService.testPrint();
      Alert.alert('Success', 'Test print sent! Check your printer.');
    } catch (error) {
      Alert.alert('Test Print Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPairedDevices();
    updateConnectionStatus();
    setRefreshing(false);
  };

  const togglePaperSize = async () => {
    const newSize = paperSize === '80mm' ? '58mm' : '80mm';
    await PrinterService.setPaperSize(newSize);
    setPaperSize(newSize);
  };

  const toggleAutoConnect = async (value) => {
    await PrinterService.setAutoConnect(value);
    setAutoConnect(value);
  };

  const renderDevice = ({ item }) => {
    const isConnectedDevice = currentDevice && 
      (currentDevice.address === item.address || currentDevice.id === item.id);
    
    return (
      <TouchableOpacity
        style={[styles.deviceItem, isConnectedDevice && styles.deviceConnected]}
        onPress={() => connectToDevice(item)}
        disabled={isConnectedDevice}
      >
        <View style={styles.deviceIcon}>
          <Printer size={24} color={isConnectedDevice ? Colors.success : Colors.gray700} />
        </View>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
          <Text style={styles.deviceAddress}>{item.address || item.id || 'N/A'}</Text>
        </View>
        {isConnectedDevice && (
          <View style={styles.connectedBadge}>
            <CheckCircle size={16} color={Colors.success} />
            <Text style={styles.connectedText}>Connected</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderDiagnostics = () => {
    if (!showDiagnostics || !diagnosticResults) return null;
    
    return (
      <View style={styles.diagnosticsContainer}>
        <Text style={styles.diagnosticsTitle}>Diagnostic Results</Text>
        {diagnosticResults.map((result, index) => (
          <View key={index} style={styles.diagnosticRow}>
            <View style={[styles.diagnosticDot, { backgroundColor: result.success ? Colors.success : Colors.error }]} />
            <Text style={styles.diagnosticMethod}>{result.method}</Text>
            <Text style={[styles.diagnosticStatus, { color: result.success ? Colors.success : Colors.error }]}>
              {result.success ? 'PASS' : 'FAIL'}
            </Text>
          </View>
        ))}
        <TouchableOpacity style={styles.closeDiagnosticsButton} onPress={() => setShowDiagnostics(false)}>
          <Text style={styles.closeDiagnosticsText}>Hide</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Printer size={24} color={Colors.primary} />
              <Text style={styles.modalTitle}>Thermal Printer</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <XCircle size={24} color={Colors.gray500} />
            </TouchableOpacity>
          </View>

          {/* Connection Status */}
          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status:</Text>
              {isConnected ? (
                <View style={styles.statusConnected}>
                  <CheckCircle size={14} color={Colors.success} />
                  <Text style={styles.statusTextConnected}>Connected</Text>
                </View>
              ) : (
                <View style={styles.statusDisconnected}>
                  <BluetoothOff size={14} color={Colors.error} />
                  <Text style={styles.statusTextDisconnected}>Disconnected</Text>
                </View>
              )}
            </View>
            {isConnected && detectedType !== PRINTER_TYPES.UNKNOWN && (
              <Text style={styles.detectedType}>Detected: {detectedType}</Text>
            )}
            {isConnected && (
              <TouchableOpacity style={styles.disconnectButton} onPress={disconnectPrinter}>
                <Text style={styles.disconnectText}>Disconnect</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Settings */}
          <View style={styles.settingsContainer}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Paper Size</Text>
              <View style={styles.paperSizeButtons}>
                <TouchableOpacity
                  style={[styles.paperSizeButton, paperSize === '80mm' && styles.paperSizeActive]}
                  onPress={() => paperSize !== '80mm' && togglePaperSize()}
                >
                  <Text style={[styles.paperSizeText, paperSize === '80mm' && styles.paperSizeTextActive]}>80mm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.paperSizeButton, paperSize === '58mm' && styles.paperSizeActive]}
                  onPress={() => paperSize !== '58mm' && togglePaperSize()}
                >
                  <Text style={[styles.paperSizeText, paperSize === '58mm' && styles.paperSizeTextActive]}>58mm</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Auto-Connect</Text>
              <Switch
                value={autoConnect}
                onValueChange={toggleAutoConnect}
                trackColor={{ false: Colors.gray300, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
          </View>

          {/* Diagnostics Panel */}
          {renderDiagnostics()}

          {/* Device List */}
          <View style={styles.deviceListContainer}>
            <View style={styles.deviceListHeader}>
              <Text style={styles.deviceListTitle}>Available Printers</Text>
              <View style={styles.deviceActions}>
                <TouchableOpacity onPress={scanForDevices} disabled={scanning}>
                  <Scan size={20} color={scanning ? Colors.gray400 : Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
                  <RefreshCw size={20} color={refreshing ? Colors.gray400 : Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {loading && devices.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading devices...</Text>
              </View>
            ) : devices.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Printer size={48} color={Colors.gray300} />
                <Text style={styles.emptyText}>No Bluetooth printers found</Text>
                <Text style={styles.emptySubtext}>
                  Pair your printer in system settings, then tap Scan
                </Text>
                <TouchableOpacity style={styles.scanButton} onPress={scanForDevices}>
                  <Scan size={20} color={Colors.white} />
                  <Text style={styles.scanButtonText}>Scan for Devices</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={devices}
                keyExtractor={(item) => item.address || item.id || Math.random().toString()}
                renderItem={renderDevice}
                contentContainerStyle={styles.deviceList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
              />
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.footer}>
            {isConnected && (
              <TouchableOpacity
                style={styles.testButton}
                onPress={handleTestPrint}
                disabled={isPrinting}
              >
                <Bug size={18} color={Colors.primary} />
                <Text style={styles.testButtonText}>Test Print</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[
                styles.printButton,
                (!isConnected || isPrinting) && styles.printButtonDisabled,
              ]}
              onPress={handlePrint}
              disabled={!isConnected || isPrinting}
            >
              {isPrinting ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <>
                  <Printer size={20} color={Colors.white} />
                  <Text style={styles.printButtonText}>Print Receipt</Text>
                </>
              )}
            </TouchableOpacity>
            
            {isConnected && (
              <TouchableOpacity
                style={styles.diagnosticButton}
                onPress={runDiagnostics}
                disabled={isPrinting}
              >
                <AlertTriangle size={18} color={Colors.warning} />
                <Text style={styles.diagnosticButtonText}>Diagnostics</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['3xl'],
    borderTopRightRadius: BorderRadius['3xl'],
    padding: Spacing['2xl'],
    maxHeight: '92%',
    minHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.gray900,
  },
  statusContainer: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusLabel: {
    fontSize: Typography.sm,
    color: Colors.gray600,
  },
  statusConnected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusTextConnected: {
    fontSize: Typography.sm,
    color: Colors.success,
    fontWeight: '600',
  },
  statusDisconnected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusTextDisconnected: {
    fontSize: Typography.sm,
    color: Colors.error,
    fontWeight: '600',
  },
  detectedType: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  disconnectButton: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.error + '20',
    borderRadius: BorderRadius.sm,
  },
  disconnectText: {
    fontSize: Typography.xs,
    color: Colors.error,
    fontWeight: '500',
  },
  settingsContainer: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingLabel: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    fontWeight: '500',
  },
  paperSizeButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  paperSizeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  paperSizeActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  paperSizeText: {
    fontSize: Typography.sm,
    color: Colors.gray700,
  },
  paperSizeTextActive: {
    color: Colors.white,
  },
  diagnosticsContainer: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  diagnosticsTitle: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: Spacing.sm,
  },
  diagnosticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: Spacing.sm,
  },
  diagnosticDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  diagnosticMethod: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.gray700,
  },
  diagnosticStatus: {
    fontSize: Typography.sm,
    fontWeight: '600',
  },
  closeDiagnosticsButton: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-end',
  },
  closeDiagnosticsText: {
    fontSize: Typography.sm,
    color: Colors.primary,
  },
  deviceListContainer: {
    flex: 1,
  },
  deviceListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  deviceListTitle: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.gray900,
  },
  deviceActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  deviceList: {
    paddingBottom: Spacing.md,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  deviceConnected: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '10',
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: Typography.md,
    fontWeight: '500',
    color: Colors.gray900,
  },
  deviceAddress: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  connectedText: {
    fontSize: Typography.xs,
    color: Colors.success,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.gray500,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyText: {
    fontSize: Typography.md,
    color: Colors.gray500,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: Typography.sm,
    color: Colors.gray400,
    marginTop: Spacing.xs,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  scanButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  footer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    gap: Spacing.sm,
  },
  printButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  printButtonDisabled: {
    opacity: 0.5,
  },
  printButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: Typography.md,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: Spacing.sm,
  },
  testButtonText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  diagnosticButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.warning,
    gap: Spacing.sm,
  },
  diagnosticButtonText: {
    color: Colors.warning,
    fontWeight: '500',
  },
});