
// // services/printer/PrinterService.js
// /**
//  * Talks directly to react-native-thermal-pos-printer's real, verified API
//  * (https://github.com/CoFixer/react-native-thermal-pos-printer). No
//  * BluetoothManager/EscPosPrinter layer needed - this library already
//  * provides connection management + native text/QR/barcode/raw printing.
//  *
//  * IMPORTANT - bugs fixed from the previous version of this file:
//  *
//  * 1. `ReactNativePosPrinter.discoverDevices(timeout)` and
//  *    `ReactNativePosPrinter.getDevice(address)` do NOT exist in this
//  *    library (verified against the published source on npm/GitHub). The
//  *    only device-listing method is `getDeviceList()` (bonded/paired devices
//  *    only - no live discovery scan), and connecting is done with the static
//  *    `connectPrinter(address, options)`, not by fetching a device object
//  *    first. Calling either nonexistent method throws
//  *    "... is not a function", which is exactly the error you were seeing.
//  *
//  * 2. `requestBluetoothPermissions` is an internal utility in this package,
//  *    NOT re-exported from its public entry point - importing it from
//  *    'react-native-thermal-pos-printer' resolves to undefined. Permission
//  *    requesting is implemented locally here instead.
//  *
//  * 3. PrinterService was missing several methods that
//  *    BluetoothPrinterModal.jsx actually calls (getPaperSize, setPaperSize,
//  *    getAutoConnect, setAutoConnect, printSalesReceipt, printPaymentReceipt,
//  *    printReleaseReceipt, printPureEscPos, testPrint, diagnosticPrint) -
//  *    calling any of them threw "is not a function". All are implemented
//  *    below.
//  *
//  * 4. getPairedDevices()/scanForDevices() now validate that each device has a
//  *    real `address` before returning it, instead of silently passing through
//  *    a malformed {name: undefined, address: undefined} entry that fails
//  *    later at connect time with "No Bluetooth address found."
//  */
// import { Platform, PermissionsAndroid } from 'react-native';
// import ReactNativePosPrinter, { ESCPOSCommands } from 'react-native-thermal-pos-printer';
// import ReceiptFormatter, { PRINTER_TYPES } from './ReceiptFormatter';
// import PrinterStorage from './PrinterStorage';

// class PrinterService {
//   static instance = null;

//   constructor() {
//     if (PrinterService.instance) return PrinterService.instance;
//     this.currentPrinter = null; // ThermalPrinterDevice instance once connected
//     this.connectionState = 'disconnected';
//     this.connectionListeners = [];
//     this.isInitialized = false;
//     PrinterService.instance = this;
//   }

//   static getInstance() {
//     if (!PrinterService.instance) {
//       PrinterService.instance = new PrinterService();
//     }
//     return PrinterService.instance;
//   }

//   // ============= Permissions =============
//   async requestPermissions() {
//     if (Platform.OS !== 'android') return true;
//     try {
//       const permissions = Platform.Version >= 31
//         ? [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]
//         : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

//       const result = await PermissionsAndroid.requestMultiple(permissions);
//       return permissions.every((p) => result[p] === PermissionsAndroid.RESULTS.GRANTED);
//     } catch (error) {
//       console.error('Permission error:', error);
//       return false;
//     }
//   }

//   // ============= Lifecycle =============
//   async initialize() {
//     if (this.isInitialized) return true;
//     try {
//       const hasPermission = await this.requestPermissions();
//       if (!hasPermission) {
//         console.warn('Bluetooth permission denied - device list will likely be empty');
//       }

//       await ReactNativePosPrinter.init();
//       this.isInitialized = true;
//       console.log('PrinterService initialized.');
//       await this.autoConnect();
//       return true;
//     } catch (error) {
//       console.error('Failed to initialize PrinterService:', error);
//       return false;
//     }
//   }

//   // ============= Discovery =============
//   // This library only lists bonded/paired devices (no live discovery scan) -
//   // pair the printer via Android Bluetooth settings first. Any entry missing
//   // a usable address is dropped rather than handed to the UI, since it can
//   // never be connected to anyway.
//   async getPairedDevices() {
//     try {
//       const devices = await ReactNativePosPrinter.getDeviceList();

//       if (!devices || !Array.isArray(devices)) {
//         console.warn('getDeviceList returned no devices');
//         return [];
//       }

//       const mapped = devices
//         .map((device) => ({
//           name: device.name || device.getName?.() || 'Unknown Device',
//           address: device.address || device.getAddress?.(),
//           type: device.type || device.getType?.() || 'BLUETOOTH',
//           connected: device.connected || false,
//           rssi: device.rssi,
//           batteryLevel: device.batteryLevel,
//         }))
//         .filter((d) => {
//           if (!d.address) {
//             console.warn('Dropping paired device with no address:', d);
//             return false;
//           }
//           return true;
//         });

//       if (mapped.length === 0) {
//         console.warn('No usable paired printers found. Pair the printer in Android Bluetooth settings first.');
//       }

//       return mapped;
//     } catch (error) {
//       console.error('Failed to get paired devices:', error);
//       return [];
//     }
//   }

//   // No live discovery scan exists in this library - scanForDevices is just
//   // an alias so existing UI code (a "scan" button) keeps working.
//   async scanForDevices() {
//     return this.getPairedDevices();
//   }

//   // ============= Connection =============
//   async connectToPrinter(deviceInfo) {
//     this.connectionState = 'connecting';
//     this.notifyListeners();

//     try {
//       console.log('Selected printer:', deviceInfo);

//       const deviceAddress = deviceInfo?.address;
//       if (!deviceAddress) {
//         throw new Error(
//           `No Bluetooth address found.\nDevice: ${JSON.stringify(deviceInfo, null, 2)}\n` +
//           `This usually means the device came from a malformed list entry - ` +
//           `reopen the printer list and make sure the printer is paired in ` +
//           `Android Bluetooth settings.`
//         );
//       }

//       // connectPrinter is the ONLY connect API - it connects AND returns the
//       // connected ThermalPrinterDevice in one call.
//       const printerDevice = await ReactNativePosPrinter.connectPrinter(deviceAddress, {
//         type: deviceInfo.type || 'BLUETOOTH',
//       });

//       this.currentPrinter = printerDevice;
//       this.connectionState = 'connected';

//       const savedDevice = {
//         name: deviceInfo.name || 'Unknown',
//         address: deviceAddress,
//         type: deviceInfo.type || 'BLUETOOTH',
//       };

//       await PrinterStorage.saveDefaultPrinter(savedDevice);
//       await PrinterStorage.saveLastPrinter(savedDevice);

//       this.notifyListeners();
//       console.log(`Connected to ${deviceInfo.name}`);
//       return true;
//     } catch (error) {
//       this.connectionState = 'error';
//       this.notifyListeners();
//       console.error('Connection error:', error);
//       throw error;
//     }
//   }

//   async disconnect() {
//     try {
//       await ReactNativePosPrinter.disconnectPrinter();
//     } catch (error) {
//       console.warn('Error during disconnect:', error);
//     }
//     this.currentPrinter = null;
//     this.connectionState = 'disconnected';
//     this.notifyListeners();
//     console.log('Disconnected from printer.');
//   }

//   async autoConnect() {
//     try {
//       const autoConnectEnabled = await PrinterStorage.getAutoConnect();
//       if (!autoConnectEnabled) return false;

//       const defaultPrinter = await PrinterStorage.getDefaultPrinter();
//       if (!defaultPrinter?.address) return false;

//       return await this.connectToPrinter(defaultPrinter);
//     } catch (error) {
//       return false;
//     }
//   }

//   // ============= Status =============
//   isConnected() {
//     return this.connectionState === 'connected' && this.currentPrinter !== null;
//   }

//   getCurrentDevice() {
//     if (!this.currentPrinter) return null;
//     return {
//       name: this.currentPrinter.getName?.() || this.currentPrinter.name || 'Unknown',
//       address: this.currentPrinter.getAddress?.() || this.currentPrinter.address,
//       type: this.currentPrinter.getType?.() || this.currentPrinter.type,
//     };
//   }

//   getConnectionStatus() {
//     return {
//       connected: this.isConnected(),
//       state: this.connectionState,
//       device: this.getCurrentDevice(),
//     };
//   }

//   addConnectionListener(listener) {
//     this.connectionListeners.push(listener);
//     try {
//       listener(this.getConnectionStatus());
//     } catch (e) {
//       console.warn('Error in connection listener:', e);
//     }
//     return () => {
//       this.connectionListeners = this.connectionListeners.filter((l) => l !== listener);
//     };
//   }

//   notifyListeners() {
//     const status = this.getConnectionStatus();
//     this.connectionListeners.forEach((listener) => {
//       try {
//         listener(status);
//       } catch (error) {
//         console.error('Error notifying listener:', error);
//       }
//     });
//   }

//   // ============= Settings passthrough (PrinterStorage) =============
//   // BluetoothPrinterModal.jsx calls these directly on PrinterService.
//   async getPaperSize() { return PrinterStorage.getPaperSize(); }
//   async setPaperSize(size) { return PrinterStorage.savePaperSize(size); }
//   async getAutoConnect() { return PrinterStorage.getAutoConnect(); }
//   async setAutoConnect(enabled) { return PrinterStorage.saveAutoConnect(enabled); }
//   async getPrintCopies() { return PrinterStorage.getPrintCopies(); }
//   async setPrintCopies(copies) { return PrinterStorage.savePrintCopies(copies); }

//   async getPaperWidth() {
//     const paperSize = await this.getPaperSize();
//     return paperSize === '80mm' ? 48 : 32;
//   }

//   // ============= Printing =============
//   async printReceipt(receiptData, receiptType) {
//     if (!this.isConnected()) {
//       throw new Error('No printer connected');
//     }

//     const printer = this.currentPrinter;
//     const copies = (await this.getPrintCopies()) || 1;
//     const deviceName = this.getCurrentDevice()?.name || '';

//     ReceiptFormatter.detectPrinterType(deviceName);
//     ReceiptFormatter.setPaperSize(await this.getPaperSize());
//     const nodes = ReceiptFormatter.formatReceipt(receiptData, receiptType, deviceName);

//     for (let i = 0; i < copies; i++) {
//       await this._printNodes(printer, nodes);
//       console.log(`Printed copy ${i + 1} of ${copies}`);
//     }
//     return { success: true };
//   }

//   async printSalesReceipt(receiptData) { return this.printReceipt(receiptData, 'SALES'); }
//   async printPaymentReceipt(receiptData) { return this.printReceipt(receiptData, 'PAYMENT'); }
//   async printReleaseReceipt(receiptData) { return this.printReceipt(receiptData, 'RELEASE'); }

//   async _printNodes(printer, nodes) {
//     if (!nodes || nodes.length === 0) return;

//     for (const node of nodes) {
//       switch (node.type) {
//         case 'text': {
//           const style = this._convertStyle(node.style);
//           await printer.printText(node.content + '\n', style);
//           break;
//         }
//         case 'line': {
//           const width = await this.getPaperWidth();
//           const lineStr = node.style === 'dashed' ? '-'.repeat(width) : '='.repeat(width);
//           await printer.printText(lineStr + '\n');
//           break;
//         }
//         case 'qr': {
//           await printer.printQRCode(node.content, {
//             align: node.align === 'center' ? 'CENTER' : 'LEFT',
//             size: node.size || 4,
//             errorLevel: 'M',
//           });
//           break;
//         }
//         case 'feed': {
//           await ReactNativePosPrinter.newLine(Math.min(node.lines || 3, 10));
//           break;
//         }
//         case 'cut': {
//           await printer.cutPaper();
//           break;
//         }
//         default:
//           console.warn('Unsupported node type:', node.type);
//       }
//     }
//   }

//   _convertStyle(style = {}) {
//     const alignMap = { left: 'LEFT', center: 'CENTER', right: 'RIGHT' };
//     const sizeMap = { 1: 'NORMAL', 2: 'LARGE', 3: 'XLARGE' };

//     return {
//       align: alignMap[style.align] || 'LEFT',
//       size: sizeMap[style.size] || 'NORMAL',
//       bold: !!style.bold,
//       underline: !!style.underline,
//     };
//   }

//   // ============= Test / diagnostics =============
//   // Minimal, dependency-free raw ESC/POS test page - useful to confirm the
//   // transport itself works independent of ReceiptFormatter/QR.
//   async testPrint() {
//     if (!this.isConnected()) {
//       throw new Error('No printer connected');
//     }
//     const bytes = [
//       ...ESCPOSCommands.INIT,
//       ...ESCPOSCommands.ALIGN_CENTER,
//       ...ESCPOSCommands.BOLD_ON,
//       ...'TEST PRINT'.split('').map((c) => c.charCodeAt(0)),
//       ...ESCPOSCommands.LINE_FEED,
//       ...ESCPOSCommands.BOLD_OFF,
//       ...ESCPOSCommands.ALIGN_LEFT,
//       ...'Line 1: Normal text'.split('').map((c) => c.charCodeAt(0)),
//       ...ESCPOSCommands.LINE_FEED,
//       ...ESCPOSCommands.LINE_FEED,
//       ...ESCPOSCommands.LINE_FEED,
//       ...ESCPOSCommands.CUT_PAPER,
//     ];
//     console.log('Sending test print (raw ESC/POS)...');
//     await ReactNativePosPrinter.sendRawCommand(bytes);
//     return { success: true };
//   }

//   // Legacy manual-bytes path some UI still calls directly - builds a plain
//   // text receipt without going through ReceiptFormatter, useful as a
//   // last-resort fallback if node-based printing ever misbehaves.
//   async printPureEscPos(receiptData, receiptType) {
//     if (!this.isConnected()) {
//       throw new Error('No printer connected');
//     }
//     const width = await this.getPaperWidth();
//     const bytes = [...ESCPOSCommands.INIT];
//     const pushText = (text) => bytes.push(...text.split('').map((c) => c.charCodeAt(0) & 0x7F));

//     if (receiptData?.store?.name) {
//       bytes.push(...ESCPOSCommands.ALIGN_CENTER, ...ESCPOSCommands.BOLD_ON);
//       pushText(receiptData.store.name);
//       bytes.push(...ESCPOSCommands.LINE_FEED, ...ESCPOSCommands.BOLD_OFF, ...ESCPOSCommands.ALIGN_LEFT);
//     }
//     bytes.push(...'-'.repeat(width).split('').map((c) => c.charCodeAt(0)), ...ESCPOSCommands.LINE_FEED);
//     pushText(`${receiptType || 'RECEIPT'}`);
//     bytes.push(...ESCPOSCommands.LINE_FEED);
//     if (receiptData?.summary?.totalAmount !== undefined) {
//       pushText(`TOTAL: N${Number(receiptData.summary.totalAmount).toFixed(2)}`);
//       bytes.push(...ESCPOSCommands.LINE_FEED);
//     }
//     bytes.push(...ESCPOSCommands.LINE_FEED, ...ESCPOSCommands.LINE_FEED, ...ESCPOSCommands.LINE_FEED, ...ESCPOSCommands.CUT_PAPER);

//     await ReactNativePosPrinter.sendRawCommand(bytes);
//     return { success: true };
//   }

//   async diagnosticPrint() {
//     const results = [];
//     try {
//       await this.testPrint();
//       results.push({ method: 'testPrint', success: true });
//     } catch (e) {
//       results.push({ method: 'testPrint', success: false, error: e.message });
//     }
//     try {
//       await this.printReceipt(
//         { store: { name: 'DIAGNOSTIC' }, summary: { totalAmount: 0 } },
//         'SALES',
//       );
//       results.push({ method: 'printReceipt', success: true });
//     } catch (e) {
//       results.push({ method: 'printReceipt', success: false, error: e.message });
//     }
//     console.log('Diagnostic results:', results);
//     return results;
//   }
// }

// export default PrinterService.getInstance();




































// // services/printer/PrinterService.js
// /**
//  * Talks directly to react-native-thermal-pos-printer's real, verified API
//  * (https://github.com/CoFixer/react-native-thermal-pos-printer). No
//  * BluetoothManager/EscPosPrinter layer needed - this library already
//  * provides connection management + native text/QR/barcode/raw printing.
//  *
//  * IMPORTANT - bugs fixed from the previous version of this file:
//  *
//  * 1. `ReactNativePosPrinter.discoverDevices(timeout)` and
//  *    `ReactNativePosPrinter.getDevice(address)` do NOT exist in this
//  *    library (verified against the published source on npm/GitHub). The
//  *    only device-listing method is `getDeviceList()` (bonded/paired devices
//  *    only - no live discovery scan), and connecting is done with the static
//  *    `connectPrinter(address, options)`, not by fetching a device object
//  *    first. Calling either nonexistent method throws
//  *    "... is not a function", which is exactly the error you were seeing.
//  *
//  * 2. `requestBluetoothPermissions` is an internal utility in this package,
//  *    NOT re-exported from its public entry point - importing it from
//  *    'react-native-thermal-pos-printer' resolves to undefined. Permission
//  *    requesting is implemented locally here instead.
//  *
//  * 3. PrinterService was missing several methods that
//  *    BluetoothPrinterModal.jsx actually calls (getPaperSize, setPaperSize,
//  *    getAutoConnect, setAutoConnect, printSalesReceipt, printPaymentReceipt,
//  *    printReleaseReceipt, printPureEscPos, testPrint, diagnosticPrint) -
//  *    calling any of them threw "is not a function". All are implemented
//  *    below.
//  *
//  * 4. getPairedDevices()/scanForDevices() now validate that each device has a
//  *    real `address` before returning it, instead of silently passing through
//  *    a malformed {name: undefined, address: undefined} entry that fails
//  *    later at connect time with "No Bluetooth address found."
//  */
// import { Platform, PermissionsAndroid } from 'react-native';
// import ReactNativePosPrinter, { ESCPOSCommands } from 'react-native-thermal-pos-printer';
// import ReceiptFormatter, { PRINTER_TYPES } from './ReceiptFormatter';
// import PrinterStorage from './PrinterStorage';

// class PrinterService {
//   static instance = null;

//   constructor() {
//     if (PrinterService.instance) return PrinterService.instance;
//     this.currentPrinter = null; // ThermalPrinterDevice instance once connected
//     this.connectionState = 'disconnected';
//     this.connectionListeners = [];
//     this.isInitialized = false;
//     PrinterService.instance = this;
//   }

//   static getInstance() {
//     if (!PrinterService.instance) {
//       PrinterService.instance = new PrinterService();
//     }
//     return PrinterService.instance;
//   }

//   // ============= Permissions =============
//   async requestPermissions() {
//     if (Platform.OS !== 'android') return true;
//     try {
//       const permissions = Platform.Version >= 31
//         ? [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]
//         : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

//       const result = await PermissionsAndroid.requestMultiple(permissions);
//       return permissions.every((p) => result[p] === PermissionsAndroid.RESULTS.GRANTED);
//     } catch (error) {
//       console.error('Permission error:', error);
//       return false;
//     }
//   }

//   // ============= Lifecycle =============
//   async initialize() {
//     if (this.isInitialized) return true;
//     try {
//       const hasPermission = await this.requestPermissions();
//       if (!hasPermission) {
//         console.warn('Bluetooth permission denied - device list will likely be empty');
//       }

//       await ReactNativePosPrinter.init();
//       this.isInitialized = true;
//       console.log('PrinterService initialized.');
//       await this.autoConnect();
//       return true;
//     } catch (error) {
//       console.error('Failed to initialize PrinterService:', error);
//       return false;
//     }
//   }

//   // ============= Discovery =============
//   // This library only lists bonded/paired devices (no live discovery scan) -
//   // pair the printer via Android Bluetooth settings first. Any entry missing
//   // a usable address is dropped rather than handed to the UI, since it can
//   // never be connected to anyway.
//   async getPairedDevices() {
//     try {
//       const devices = await ReactNativePosPrinter.getDeviceList();

//       if (!devices || !Array.isArray(devices)) {
//         console.warn('getDeviceList returned no devices');
//         return [];
//       }

//       const mapped = devices
//         .map((device) => ({
//           name: device.name || device.getName?.() || 'Unknown Device',
//           address: device.address || device.getAddress?.(),
//           type: device.type || device.getType?.() || 'BLUETOOTH',
//           connected: device.connected || false,
//           rssi: device.rssi,
//           batteryLevel: device.batteryLevel,
//         }))
//         .filter((d) => {
//           if (!d.address) {
//             console.warn('Dropping paired device with no address:', d);
//             return false;
//           }
//           return true;
//         });

//       if (mapped.length === 0) {
//         console.warn('No usable paired printers found. Pair the printer in Android Bluetooth settings first.');
//       }

//       return mapped;
//     } catch (error) {
//       console.error('Failed to get paired devices:', error);
//       return [];
//     }
//   }

//   // No live discovery scan exists in this library - scanForDevices is just
//   // an alias so existing UI code (a "scan" button) keeps working.
//   async scanForDevices() {
//     return this.getPairedDevices();
//   }

//   // ============= Connection =============
//   async connectToPrinter(deviceInfo) {
//     this.connectionState = 'connecting';
//     this.notifyListeners();

//     try {
//       console.log('Selected printer:', deviceInfo);

//       const deviceAddress = deviceInfo?.address;
//       if (!deviceAddress) {
//         throw new Error(
//           `No Bluetooth address found.\nDevice: ${JSON.stringify(deviceInfo, null, 2)}\n` +
//           `This usually means the device came from a malformed list entry - ` +
//           `reopen the printer list and make sure the printer is paired in ` +
//           `Android Bluetooth settings.`
//         );
//       }

//       // connectPrinter is the ONLY connect API - it connects AND returns the
//       // connected ThermalPrinterDevice in one call.
//       const printerDevice = await ReactNativePosPrinter.connectPrinter(deviceAddress, {
//         type: deviceInfo.type || 'BLUETOOTH',
//       });

//       this.currentPrinter = printerDevice;
//       this.connectionState = 'connected';

//       const savedDevice = {
//         name: deviceInfo.name || 'Unknown',
//         address: deviceAddress,
//         type: deviceInfo.type || 'BLUETOOTH',
//       };

//       await PrinterStorage.saveDefaultPrinter(savedDevice);
//       await PrinterStorage.saveLastPrinter(savedDevice);

//       this.notifyListeners();
//       console.log(`Connected to ${deviceInfo.name}`);
//       return true;
//     } catch (error) {
//       this.connectionState = 'error';
//       this.notifyListeners();
//       console.error('Connection error:', error);
//       throw error;
//     }
//   }

//   async disconnect() {
//     try {
//       await ReactNativePosPrinter.disconnectPrinter();
//     } catch (error) {
//       console.warn('Error during disconnect:', error);
//     }
//     this.currentPrinter = null;
//     this.connectionState = 'disconnected';
//     this.notifyListeners();
//     console.log('Disconnected from printer.');
//   }

//   async autoConnect() {
//     try {
//       const autoConnectEnabled = await PrinterStorage.getAutoConnect();
//       if (!autoConnectEnabled) return false;

//       const defaultPrinter = await PrinterStorage.getDefaultPrinter();
//       if (!defaultPrinter?.address) return false;

//       return await this.connectToPrinter(defaultPrinter);
//     } catch (error) {
//       return false;
//     }
//   }

//   // ============= Status =============
//   isConnected() {
//     return this.connectionState === 'connected' && this.currentPrinter !== null;
//   }

//   getCurrentDevice() {
//     if (!this.currentPrinter) return null;
//     return {
//       name: this.currentPrinter.getName?.() || this.currentPrinter.name || 'Unknown',
//       address: this.currentPrinter.getAddress?.() || this.currentPrinter.address,
//       type: this.currentPrinter.getType?.() || this.currentPrinter.type,
//     };
//   }

//   getConnectionStatus() {
//     return {
//       connected: this.isConnected(),
//       state: this.connectionState,
//       device: this.getCurrentDevice(),
//     };
//   }

//   addConnectionListener(listener) {
//     this.connectionListeners.push(listener);
//     try {
//       listener(this.getConnectionStatus());
//     } catch (e) {
//       console.warn('Error in connection listener:', e);
//     }
//     return () => {
//       this.connectionListeners = this.connectionListeners.filter((l) => l !== listener);
//     };
//   }

//   notifyListeners() {
//     const status = this.getConnectionStatus();
//     this.connectionListeners.forEach((listener) => {
//       try {
//         listener(status);
//       } catch (error) {
//         console.error('Error notifying listener:', error);
//       }
//     });
//   }

//   // ============= Settings passthrough (PrinterStorage) =============
//   // BluetoothPrinterModal.jsx calls these directly on PrinterService.
//   async getPaperSize() { return PrinterStorage.getPaperSize(); }
//   async setPaperSize(size) { return PrinterStorage.savePaperSize(size); }
//   async getAutoConnect() { return PrinterStorage.getAutoConnect(); }
//   async setAutoConnect(enabled) { return PrinterStorage.saveAutoConnect(enabled); }
//   async getPrintCopies() { return PrinterStorage.getPrintCopies(); }
//   async setPrintCopies(copies) { return PrinterStorage.savePrintCopies(copies); }

//   async getPaperWidth() {
//     const paperSize = await this.getPaperSize();
//     return paperSize === '80mm' ? 48 : 32;
//   }

//   // ============= Printing =============
//   async printReceipt(receiptData, receiptType) {
//     if (!this.isConnected()) {
//       throw new Error('No printer connected');
//     }

//     const printer = this.currentPrinter;
//     const copies = (await this.getPrintCopies()) || 1;
//     const deviceName = this.getCurrentDevice()?.name || '';

//     ReceiptFormatter.detectPrinterType(deviceName);
//     ReceiptFormatter.setPaperSize(await this.getPaperSize());
//     const nodes = ReceiptFormatter.formatReceipt(receiptData, receiptType, deviceName);

//     for (let i = 0; i < copies; i++) {
//       await this._printNodes(printer, nodes);
//       console.log(`Printed copy ${i + 1} of ${copies}`);
//     }
//     return { success: true };
//   }

//   async printSalesReceipt(receiptData) { return this.printReceipt(receiptData, 'SALES'); }
//   async printPaymentReceipt(receiptData) { return this.printReceipt(receiptData, 'PAYMENT'); }
//   async printReleaseReceipt(receiptData) { return this.printReceipt(receiptData, 'RELEASE'); }

//   async _printNodes(printer, nodes) {
//     if (!nodes || nodes.length === 0) return;

//     // NOTE: deliberately using the static ReactNativePosPrinter.* methods,
//     // not printer.printText()/printQRCode()/cutPaper() (instance methods).
//     // The instance's internal `connected` flag is set once from
//     // getDeviceList()'s "connected" field, which the native Android code
//     // never actually populates for paired devices - so it's always false on
//     // a freshly connected ThermalPrinterDevice, and instance methods throw
//     // "Device not connected" regardless of the real (working) socket state.
//     // The static methods check the real native connection instead.
//     for (const node of nodes) {
//       switch (node.type) {
//         case 'text': {
//           const style = this._convertStyle(node.style);
//           await ReactNativePosPrinter.printText(node.content + '\n', style);
//           break;
//         }
//         case 'line': {
//           const width = await this.getPaperWidth();
//           const lineStr = node.style === 'dashed' ? '-'.repeat(width) : '='.repeat(width);
//           await ReactNativePosPrinter.printText(lineStr + '\n');
//           break;
//         }
//         case 'qr': {
//           await ReactNativePosPrinter.printQRCode(node.content, {
//             align: node.align === 'center' ? 'CENTER' : 'LEFT',
//             size: node.size || 4,
//             errorLevel: 'M',
//           });
//           break;
//         }
//         case 'feed': {
//           await ReactNativePosPrinter.newLine(Math.min(node.lines || 3, 10));
//           break;
//         }
//         case 'cut': {
//           await ReactNativePosPrinter.cutPaper();
//           break;
//         }
//         default:
//           console.warn('Unsupported node type:', node.type);
//       }
//     }
//   }

//   _convertStyle(style = {}) {
//     const alignMap = { left: 'LEFT', center: 'CENTER', right: 'RIGHT' };
//     const sizeMap = { 1: 'NORMAL', 2: 'LARGE', 3: 'XLARGE' };

//     return {
//       align: alignMap[style.align] || 'LEFT',
//       size: sizeMap[style.size] || 'NORMAL',
//       bold: !!style.bold,
//       underline: !!style.underline,
//     };
//   }

//   // ============= Test / diagnostics =============
//   // Minimal, dependency-free raw ESC/POS test page - useful to confirm the
//   // transport itself works independent of ReceiptFormatter/QR.
//   async testPrint() {
//     if (!this.isConnected()) {
//       throw new Error('No printer connected');
//     }
//     const bytes = [
//       ...ESCPOSCommands.INIT,
//       ...ESCPOSCommands.ALIGN_CENTER,
//       ...ESCPOSCommands.BOLD_ON,
//       ...'TEST PRINT'.split('').map((c) => c.charCodeAt(0)),
//       ...ESCPOSCommands.LINE_FEED,
//       ...ESCPOSCommands.BOLD_OFF,
//       ...ESCPOSCommands.ALIGN_LEFT,
//       ...'Line 1: Normal text'.split('').map((c) => c.charCodeAt(0)),
//       ...ESCPOSCommands.LINE_FEED,
//       ...ESCPOSCommands.LINE_FEED,
//       ...ESCPOSCommands.LINE_FEED,
//       ...ESCPOSCommands.CUT_PAPER,
//     ];
//     console.log('Sending test print (raw ESC/POS)...');
//     await ReactNativePosPrinter.sendRawCommand(bytes);
//     return { success: true };
//   }

//   // Legacy manual-bytes path some UI still calls directly - builds a plain
//   // text receipt without going through ReceiptFormatter, useful as a
//   // last-resort fallback if node-based printing ever misbehaves.
//   async printPureEscPos(receiptData, receiptType) {
//     if (!this.isConnected()) {
//       throw new Error('No printer connected');
//     }
//     const width = await this.getPaperWidth();
//     const bytes = [...ESCPOSCommands.INIT];
//     const pushText = (text) => bytes.push(...text.split('').map((c) => c.charCodeAt(0) & 0x7F));

//     if (receiptData?.store?.name) {
//       bytes.push(...ESCPOSCommands.ALIGN_CENTER, ...ESCPOSCommands.BOLD_ON);
//       pushText(receiptData.store.name);
//       bytes.push(...ESCPOSCommands.LINE_FEED, ...ESCPOSCommands.BOLD_OFF, ...ESCPOSCommands.ALIGN_LEFT);
//     }
//     bytes.push(...'-'.repeat(width).split('').map((c) => c.charCodeAt(0)), ...ESCPOSCommands.LINE_FEED);
//     pushText(`${receiptType || 'RECEIPT'}`);
//     bytes.push(...ESCPOSCommands.LINE_FEED);
//     if (receiptData?.summary?.totalAmount !== undefined) {
//       pushText(`TOTAL: N${Number(receiptData.summary.totalAmount).toFixed(2)}`);
//       bytes.push(...ESCPOSCommands.LINE_FEED);
//     }
//     bytes.push(...ESCPOSCommands.LINE_FEED, ...ESCPOSCommands.LINE_FEED, ...ESCPOSCommands.LINE_FEED, ...ESCPOSCommands.CUT_PAPER);

//     await ReactNativePosPrinter.sendRawCommand(bytes);
//     return { success: true };
//   }

//   async diagnosticPrint() {
//     const results = [];
//     try {
//       await this.testPrint();
//       results.push({ method: 'testPrint', success: true });
//     } catch (e) {
//       results.push({ method: 'testPrint', success: false, error: e.message });
//     }
//     try {
//       await this.printReceipt(
//         { store: { name: 'DIAGNOSTIC' }, summary: { totalAmount: 0 } },
//         'SALES',
//       );
//       results.push({ method: 'printReceipt', success: true });
//     } catch (e) {
//       results.push({ method: 'printReceipt', success: false, error: e.message });
//     }
//     console.log('Diagnostic results:', results);
//     return results;
//   }
// }

// export default PrinterService.getInstance();












































// services/printer/PrinterService.js
/**
 * Talks directly to react-native-thermal-pos-printer's real, verified API
 * (https://github.com/CoFixer/react-native-thermal-pos-printer). No
 * BluetoothManager/EscPosPrinter layer needed - this library already
 * provides connection management + native text/QR/barcode/raw printing.
 *
 * IMPORTANT - bugs fixed from the previous version of this file:
 *
 * 1. `ReactNativePosPrinter.discoverDevices(timeout)` and
 *    `ReactNativePosPrinter.getDevice(address)` do NOT exist in this
 *    library (verified against the published source on npm/GitHub). The
 *    only device-listing method is `getDeviceList()` (bonded/paired devices
 *    only - no live discovery scan), and connecting is done with the static
 *    `connectPrinter(address, options)`, not by fetching a device object
 *    first. Calling either nonexistent method throws
 *    "... is not a function", which is exactly the error you were seeing.
 *
 * 2. `requestBluetoothPermissions` is an internal utility in this package,
 *    NOT re-exported from its public entry point - importing it from
 *    'react-native-thermal-pos-printer' resolves to undefined. Permission
 *    requesting is implemented locally here instead.
 *
 * 3. PrinterService was missing several methods that
 *    BluetoothPrinterModal.jsx actually calls (getPaperSize, setPaperSize,
 *    getAutoConnect, setAutoConnect, printSalesReceipt, printPaymentReceipt,
 *    printReleaseReceipt, printPureEscPos, testPrint, diagnosticPrint) -
 *    calling any of them threw "is not a function". All are implemented
 *    below.
 *
 * 4. getPairedDevices()/scanForDevices() now validate that each device has a
 *    real `address` before returning it, instead of silently passing through
 *    a malformed {name: undefined, address: undefined} entry that fails
 *    later at connect time with "No Bluetooth address found."
 */
import { Platform, PermissionsAndroid } from 'react-native';
import ReactNativePosPrinter, { ESCPOSCommands } from 'react-native-thermal-pos-printer';
import ReceiptFormatter, { PRINTER_TYPES } from './ReceiptFormatter';
import PrinterStorage from './PrinterStorage';

class PrinterService {
  static instance = null;

  constructor() {
    if (PrinterService.instance) return PrinterService.instance;
    this.currentPrinter = null; // ThermalPrinterDevice instance once connected
    this.connectionState = 'disconnected';
    this.connectionListeners = [];
    this.isInitialized = false;
    PrinterService.instance = this;
  }

  static getInstance() {
    if (!PrinterService.instance) {
      PrinterService.instance = new PrinterService();
    }
    return PrinterService.instance;
  }

  // ============= Permissions =============
  async requestPermissions() {
    if (Platform.OS !== 'android') return true;
    try {
      const permissions = Platform.Version >= 31
        ? [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]
        : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

      const result = await PermissionsAndroid.requestMultiple(permissions);
      return permissions.every((p) => result[p] === PermissionsAndroid.RESULTS.GRANTED);
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  }

  // ============= Lifecycle =============
  async initialize() {
    if (this.isInitialized) return true;
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Bluetooth permission denied - device list will likely be empty');
      }

      await ReactNativePosPrinter.init();
      this.isInitialized = true;
      console.log('PrinterService initialized.');
      await this.autoConnect();
      return true;
    } catch (error) {
      console.error('Failed to initialize PrinterService:', error);
      return false;
    }
  }

  // ============= Discovery =============
  // This library only lists bonded/paired devices (no live discovery scan) -
  // pair the printer via Android Bluetooth settings first. Any entry missing
  // a usable address is dropped rather than handed to the UI, since it can
  // never be connected to anyway.
  async getPairedDevices() {
    try {
      const devices = await ReactNativePosPrinter.getDeviceList();

      if (!devices || !Array.isArray(devices)) {
        console.warn('getDeviceList returned no devices');
        return [];
      }

      const mapped = devices
        .map((device) => ({
          name: device.name || device.getName?.() || 'Unknown Device',
          address: device.address || device.getAddress?.(),
          type: device.type || device.getType?.() || 'BLUETOOTH',
          connected: device.connected || false,
          rssi: device.rssi,
          batteryLevel: device.batteryLevel,
        }))
        .filter((d) => {
          if (!d.address) {
            console.warn('Dropping paired device with no address:', d);
            return false;
          }
          return true;
        });

      if (mapped.length === 0) {
        console.warn('No usable paired printers found. Pair the printer in Android Bluetooth settings first.');
      }

      return mapped;
    } catch (error) {
      console.error('Failed to get paired devices:', error);
      return [];
    }
  }

  // No live discovery scan exists in this library - scanForDevices is just
  // an alias so existing UI code (a "scan" button) keeps working.
  async scanForDevices() {
    return this.getPairedDevices();
  }

  // ============= Connection =============
  async connectToPrinter(deviceInfo) {
    this.connectionState = 'connecting';
    this.notifyListeners();

    try {
      console.log('Selected printer:', deviceInfo);

      const deviceAddress = deviceInfo?.address;
      if (!deviceAddress) {
        throw new Error(
          `No Bluetooth address found.\nDevice: ${JSON.stringify(deviceInfo, null, 2)}\n` +
          `This usually means the device came from a malformed list entry - ` +
          `reopen the printer list and make sure the printer is paired in ` +
          `Android Bluetooth settings.`
        );
      }

      // connectPrinter is the ONLY connect API - it connects AND returns the
      // connected ThermalPrinterDevice in one call.
      const printerDevice = await ReactNativePosPrinter.connectPrinter(deviceAddress, {
        type: deviceInfo.type || 'BLUETOOTH',
      });

      this.currentPrinter = printerDevice;
      this.connectionState = 'connected';

      const savedDevice = {
        name: deviceInfo.name || 'Unknown',
        address: deviceAddress,
        type: deviceInfo.type || 'BLUETOOTH',
      };

      await PrinterStorage.saveDefaultPrinter(savedDevice);
      await PrinterStorage.saveLastPrinter(savedDevice);

      this.notifyListeners();
      console.log(`Connected to ${deviceInfo.name}`);
      return true;
    } catch (error) {
      this.connectionState = 'error';
      this.notifyListeners();
      console.error('Connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await ReactNativePosPrinter.disconnectPrinter();
    } catch (error) {
      console.warn('Error during disconnect:', error);
    }
    this.currentPrinter = null;
    this.connectionState = 'disconnected';
    this.notifyListeners();
    console.log('Disconnected from printer.');
  }

  async autoConnect() {
    try {
      const autoConnectEnabled = await PrinterStorage.getAutoConnect();
      if (!autoConnectEnabled) return false;

      const defaultPrinter = await PrinterStorage.getDefaultPrinter();
      if (!defaultPrinter?.address) return false;

      return await this.connectToPrinter(defaultPrinter);
    } catch (error) {
      return false;
    }
  }

  // ============= Status =============
  isConnected() {
    return this.connectionState === 'connected' && this.currentPrinter !== null;
  }

  getCurrentDevice() {
    if (!this.currentPrinter) return null;
    return {
      name: this.currentPrinter.getName?.() || this.currentPrinter.name || 'Unknown',
      address: this.currentPrinter.getAddress?.() || this.currentPrinter.address,
      type: this.currentPrinter.getType?.() || this.currentPrinter.type,
    };
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected(),
      state: this.connectionState,
      device: this.getCurrentDevice(),
    };
  }

  addConnectionListener(listener) {
    this.connectionListeners.push(listener);
    try {
      listener(this.getConnectionStatus());
    } catch (e) {
      console.warn('Error in connection listener:', e);
    }
    return () => {
      this.connectionListeners = this.connectionListeners.filter((l) => l !== listener);
    };
  }

  notifyListeners() {
    const status = this.getConnectionStatus();
    this.connectionListeners.forEach((listener) => {
      try {
        listener(status);
      } catch (error) {
        console.error('Error notifying listener:', error);
      }
    });
  }

  // ============= Settings passthrough (PrinterStorage) =============
  // BluetoothPrinterModal.jsx calls these directly on PrinterService.
  async getPaperSize() { return PrinterStorage.getPaperSize(); }
  async setPaperSize(size) { return PrinterStorage.savePaperSize(size); }
  async getAutoConnect() { return PrinterStorage.getAutoConnect(); }
  async setAutoConnect(enabled) { return PrinterStorage.saveAutoConnect(enabled); }
  async getPrintCopies() { return PrinterStorage.getPrintCopies(); }
  async setPrintCopies(copies) { return PrinterStorage.savePrintCopies(copies); }

  async getPaperWidth() {
    const paperSize = await this.getPaperSize();
    return paperSize === '80mm' ? 48 : 32;
  }

  // ============= Printing =============
  async printReceipt(receiptData, receiptType) {
    if (!this.isConnected()) {
      throw new Error('No printer connected');
    }

    const printer = this.currentPrinter;
    const copies = (await this.getPrintCopies()) || 1;
    const deviceName = this.getCurrentDevice()?.name || '';

    ReceiptFormatter.detectPrinterType(deviceName);
    ReceiptFormatter.setPaperSize(await this.getPaperSize());
    const nodes = ReceiptFormatter.formatReceipt(receiptData, receiptType, deviceName);

    for (let i = 0; i < copies; i++) {
      await this._printNodes(printer, nodes);
      console.log(`Printed copy ${i + 1} of ${copies}`);
    }
    return { success: true };
  }

  async printSalesReceipt(receiptData) { return this.printReceipt(receiptData, 'SALES'); }
  async printPaymentReceipt(receiptData) { return this.printReceipt(receiptData, 'PAYMENT'); }
  async printReleaseReceipt(receiptData) { return this.printReceipt(receiptData, 'RELEASE'); }

  async _printNodes(printer, nodes) {
    if (!nodes || nodes.length === 0) return;

    // NOTE: deliberately using the static ReactNativePosPrinter.* methods,
    // not printer.printText()/printQRCode()/cutPaper() (instance methods).
    // The instance's internal `connected` flag is set once from
    // getDeviceList()'s "connected" field, which the native Android code
    // never actually populates for paired devices - so it's always false on
    // a freshly connected ThermalPrinterDevice, and instance methods throw
    // "Device not connected" regardless of the real (working) socket state.
    // The static methods check the real native connection instead.
    for (const node of nodes) {
      switch (node.type) {
        case 'text': {
          const style = this._convertStyle(node.style);
          await ReactNativePosPrinter.printText(node.content + '\n', style);
          break;
        }
        case 'line': {
          const width = await this.getPaperWidth();
          const lineStr = node.style === 'dashed' ? '-'.repeat(width) : '='.repeat(width);
          await ReactNativePosPrinter.printText(lineStr + '\n');
          break;
        }
        case 'qr': {
          await ReactNativePosPrinter.printQRCode(node.content, {
            align: node.align === 'center' ? 'CENTER' : 'LEFT',
            size: node.size || 4,
            errorLevel: 'M',
          });
          break;
        }
        case 'feed': {
          await ReactNativePosPrinter.newLine(Math.min(node.lines || 3, 10));
          break;
        }
        case 'cut': {
          await ReactNativePosPrinter.cutPaper();
          break;
        }
        default:
          console.warn('Unsupported node type:', node.type);
      }
    }
  }

  _convertStyle(style = {}) {
    const alignMap = { left: 'LEFT', center: 'CENTER', right: 'RIGHT' };
    // IMPORTANT: native printText() does options.getInt('size') - this must
    // be a plain number (point size). Passing a string like 'NORMAL'/'LARGE'
    // (which the TS types technically allow) throws on the native bridge
    // and surfaces as a generic "Failed to print text" error.
    const sizeMap = { 1: 12, 2: 24, 3: 36 };

    return {
      align: alignMap[style.align] || 'LEFT',
      size: sizeMap[style.size] || 12,
      bold: !!style.bold,
      underline: !!style.underline,
    };
  }

  // ============= Test / diagnostics =============
  // Minimal, dependency-free raw ESC/POS test page - useful to confirm the
  // transport itself works independent of ReceiptFormatter/QR.
  async testPrint() {
    if (!this.isConnected()) {
      throw new Error('No printer connected');
    }
    const bytes = [
      ...ESCPOSCommands.INIT,
      ...ESCPOSCommands.ALIGN_CENTER,
      ...ESCPOSCommands.BOLD_ON,
      ...'TEST PRINT'.split('').map((c) => c.charCodeAt(0)),
      ...ESCPOSCommands.LINE_FEED,
      ...ESCPOSCommands.BOLD_OFF,
      ...ESCPOSCommands.ALIGN_LEFT,
      ...'Line 1: Normal text'.split('').map((c) => c.charCodeAt(0)),
      ...ESCPOSCommands.LINE_FEED,
      ...ESCPOSCommands.LINE_FEED,
      ...ESCPOSCommands.LINE_FEED,
      ...ESCPOSCommands.CUT_PAPER,
    ];
    console.log('Sending test print (raw ESC/POS)...');
    await ReactNativePosPrinter.sendRawCommand(bytes);
    return { success: true };
  }

  // Legacy manual-bytes path some UI still calls directly - builds a plain
  // text receipt without going through ReceiptFormatter, useful as a
  // last-resort fallback if node-based printing ever misbehaves.
  async printPureEscPos(receiptData, receiptType) {
    if (!this.isConnected()) {
      throw new Error('No printer connected');
    }
    const width = await this.getPaperWidth();
    const bytes = [...ESCPOSCommands.INIT];
    const pushText = (text) => bytes.push(...text.split('').map((c) => c.charCodeAt(0) & 0x7F));

    if (receiptData?.store?.name) {
      bytes.push(...ESCPOSCommands.ALIGN_CENTER, ...ESCPOSCommands.BOLD_ON);
      pushText(receiptData.store.name);
      bytes.push(...ESCPOSCommands.LINE_FEED, ...ESCPOSCommands.BOLD_OFF, ...ESCPOSCommands.ALIGN_LEFT);
    }
    bytes.push(...'-'.repeat(width).split('').map((c) => c.charCodeAt(0)), ...ESCPOSCommands.LINE_FEED);
    pushText(`${receiptType || 'RECEIPT'}`);
    bytes.push(...ESCPOSCommands.LINE_FEED);
    if (receiptData?.summary?.totalAmount !== undefined) {
      pushText(`TOTAL: N${Number(receiptData.summary.totalAmount).toFixed(2)}`);
      bytes.push(...ESCPOSCommands.LINE_FEED);
    }
    bytes.push(...ESCPOSCommands.LINE_FEED, ...ESCPOSCommands.LINE_FEED, ...ESCPOSCommands.LINE_FEED, ...ESCPOSCommands.CUT_PAPER);

    await ReactNativePosPrinter.sendRawCommand(bytes);
    return { success: true };
  }

  async diagnosticPrint() {
    const results = [];
    try {
      await this.testPrint();
      results.push({ method: 'testPrint', success: true });
    } catch (e) {
      results.push({ method: 'testPrint', success: false, error: e.message });
    }
    try {
      await this.printReceipt(
        { store: { name: 'DIAGNOSTIC' }, summary: { totalAmount: 0 } },
        'SALES',
      );
      results.push({ method: 'printReceipt', success: true });
    } catch (e) {
      results.push({ method: 'printReceipt', success: false, error: e.message });
    }
    console.log('Diagnostic results:', results);
    return results;
  }
}

export default PrinterService.getInstance();