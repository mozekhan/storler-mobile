
// /**
//  * Universal Bluetooth Manager - Works with DATECS DPP-250, TSC, and generic ESC/POS printers
//  */

// import { Platform } from 'react-native';
// import PrinterStorage from './PrinterStorage';

// import * as ThermalPrinterModule from '@finan-me/react-native-thermal-printer';

// const ThermalPrinter = ThermalPrinterModule.ThermalPrinter || ThermalPrinterModule;

// const scanDevices = ThermalPrinter?.scanDevices || null;
// const stopScanDevices = ThermalPrinter?.stopScanDevices || null;
// const testConnection = ThermalPrinter?.testConnection || null;
// const disconnectFn = ThermalPrinter?.disconnect || null;
// const BluetoothStateManager = ThermalPrinter?.BluetoothStateManager || null;

// const EVENT_DEVICE_ALREADY_PAIRED = 'EVENT_DEVICE_ALREADY_PAIRED';
// const EVENT_DEVICE_FOUND = 'EVENT_DEVICE_FOUND';
// const EVENT_DEVICE_DISCOVER_DONE = 'EVENT_DEVICE_DISCOVER_DONE';
// const EVENT_BLUETOOTH_NOT_SUPPORT = 'EVENT_BLUETOOTH_NOT_SUPPORT';

// let addDiscoveryEventListener = null;
// let removeDiscoveryEventListener = null;

// if (ThermalPrinter) {
//   addDiscoveryEventListener = ThermalPrinter.addDiscoveryEventListener || null;
//   removeDiscoveryEventListener = ThermalPrinter.removeDiscoveryEventListener || null;
// }

// console.log('BluetoothManager - ThermalPrinter:', !!ThermalPrinter, 'scanDevices:', !!scanDevices, 'testConnection:', !!testConnection);

// class BluetoothManager {
//   static instance = null;

//   constructor() {
//     if (BluetoothManager.instance) return BluetoothManager.instance;
//     this.currentDevice = null;
//     this.connectionState = 'disconnected';
//     this.connectionListeners = [];
//     this.devices = [];
//     this.isScanning = false;
//     this.scanTimeout = null;
//     this.eventSubscriptions = [];
//     this.isInitialized = false;
//     this.isLibraryAvailable = !!ThermalPrinter;
//     BluetoothManager.instance = this;
//   }

//   static getInstance() {
//     if (!BluetoothManager.instance) {
//       BluetoothManager.instance = new BluetoothManager();
//     }
//     return BluetoothManager.instance;
//   }

//   setupEventListeners() {
//     this.eventSubscriptions.forEach(sub => {
//       try {
//         if (removeDiscoveryEventListener) removeDiscoveryEventListener(sub);
//       } catch (e) {}
//     });
//     this.eventSubscriptions = [];

//     if (!addDiscoveryEventListener || !removeDiscoveryEventListener) {
//       console.warn('Discovery event listeners not available');
//       return;
//     }

//     const events = [
//       { name: EVENT_DEVICE_ALREADY_PAIRED, handler: (event) => {
//         if (event?.devices) {
//           try {
//             const paired = typeof event.devices === 'string' ? JSON.parse(event.devices) : event.devices;
//             if (Array.isArray(paired)) this.devices = [...this.devices, ...paired];
//           } catch (e) {}
//         }
//       }},
//       { name: EVENT_DEVICE_FOUND, handler: (event) => {
//         if (event?.device) {
//           try {
//             const device = typeof event.device === 'string' ? JSON.parse(event.device) : event.device;
//             if (device?.address && !this.devices.some(d => d.address === device.address)) {
//               this.devices.push(device);
//             }
//           } catch (e) {}
//         }
//       }},
//       { name: EVENT_DEVICE_DISCOVER_DONE, handler: () => {
//         this.isScanning = false;
//         if (this.scanTimeout) { clearTimeout(this.scanTimeout); this.scanTimeout = null; }
//       }},
//       { name: EVENT_BLUETOOTH_NOT_SUPPORT, handler: () => {
//         this.isScanning = false;
//         console.warn('Bluetooth not supported');
//       }},
//     ];

//     for (const evt of events) {
//       try {
//         const sub = addDiscoveryEventListener(evt.name, evt.handler);
//         if (sub) this.eventSubscriptions.push(sub);
//       } catch (e) {
//         console.warn(`Failed to add ${evt.name} listener:`, e);
//       }
//     }
//   }

//   async initialize() {
//     if (this.isInitialized) return true;
//     try {
//       const hasPermission = await this.requestPermissions();
//       if (!hasPermission) throw new Error('Bluetooth permission denied');

//       if (BluetoothStateManager?.getState) {
//         try {
//           const state = await BluetoothStateManager.getState();
//           if (state !== 'PoweredOn' && BluetoothStateManager.enable) {
//             try { await BluetoothStateManager.enable(); } catch (e) {}
//           }
//         } catch (e) {}
//       }

//       this.setupEventListeners();
//       await this.autoConnect();
//       this.isInitialized = true;
//       return true;
//     } catch (error) {
//       console.error('Failed to initialize Bluetooth:', error);
//       return false;
//     }
//   }

//   async requestPermissions() {
//     if (Platform.OS !== 'android') return true;
//     try {
//       const { PermissionsAndroid } = require('react-native');
//       const permissions = Platform.Version >= 31
//         ? [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]
//         : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

//       const result = await PermissionsAndroid.requestMultiple(permissions);
//       return permissions.every(p => result[p] === PermissionsAndroid.RESULTS.GRANTED);
//     } catch (error) {
//       console.error('Permission error:', error);
//       return false;
//     }
//   }

//   async scanForDevices(timeoutMs = 10000) {
//     if (this.isScanning) {
//       console.warn('Scan already in progress');
//       return this.devices;
//     }
//     try {
//       await this.initialize();
//       this.devices = [];
//       this.isScanning = true;

//       if (typeof scanDevices === 'function') {
//         try { await scanDevices(); } catch (error) {
//           console.warn('scanDevices error:', error);
//           await this.getPairedDevicesFallback();
//           this.isScanning = false;
//           return this.devices;
//         }
//       } else {
//         await this.getPairedDevicesFallback();
//         this.isScanning = false;
//         return this.devices;
//       }

//       await new Promise((resolve) => {
//         this.scanTimeout = setTimeout(() => {
//           if (typeof stopScanDevices === 'function') {
//             stopScanDevices().catch(() => {});
//           }
//           this.isScanning = false;
//           resolve();
//         }, timeoutMs);

//         const checkComplete = () => {
//           if (!this.isScanning) {
//             if (this.scanTimeout) { clearTimeout(this.scanTimeout); this.scanTimeout = null; }
//             resolve();
//           } else {
//             setTimeout(checkComplete, 100);
//           }
//         };
//         setTimeout(checkComplete, 500);
//       });

//       return this.devices;
//     } catch (error) {
//       console.error('Scan error:', error);
//       this.isScanning = false;
//       return this.devices;
//     }
//   }

//   async getPairedDevicesFallback() {
//     try {
//       if (BluetoothStateManager?.getPairedDevices) {
//         const devices = await BluetoothStateManager.getPairedDevices();
//         if (Array.isArray(devices)) this.devices = devices;
//       }
//     } catch (e) {}
//   }

//   async stopScanning() {
//     if (this.scanTimeout) { clearTimeout(this.scanTimeout); this.scanTimeout = null; }
//     try {
//       if (typeof stopScanDevices === 'function') await stopScanDevices();
//     } catch (error) {}
//     this.isScanning = false;
//   }

//   async getPairedDevices() {
//     try {
//       await this.scanForDevices(3000);
//       return this.devices.filter(d => d && d.address);
//     } catch (error) {
//       return [];
//     }
//   }

//   async connectToPrinter(device) {
//     this.connectionState = 'connecting';
//     this.notifyListeners();

//     try {
//       const address = this.normalizeAddress(device.address);
//       console.log('Connecting to:', address, 'Name:', device.name);

//       if (typeof testConnection === 'function') {
//         const result = await testConnection(address);
//         console.log('Test connection result:', result);

//         if (result && result.success !== false) {
//           this.currentDevice = device;
//           this.connectionState = 'connected';
//           await PrinterStorage.saveDefaultPrinter(device);
//           await PrinterStorage.saveLastPrinter(device);
//           this.notifyListeners();
//           console.log('Connected to:', device.name);
//           return true;
//         } else {
//           throw new Error(result?.error?.message || 'Connection test failed');
//         }
//       } else {
//         this.currentDevice = device;
//         this.connectionState = 'connected';
//         await PrinterStorage.saveDefaultPrinter(device);
//         await PrinterStorage.saveLastPrinter(device);
//         this.notifyListeners();
//         return true;
//       }
//     } catch (error) {
//       this.connectionState = 'error';
//       console.error('Connection error:', error);
//       this.notifyListeners();
//       return false;
//     }
//   }

//   normalizeAddress(address) {
//     if (!address) return address;
//     if (address.startsWith('bt:') || address.startsWith('ble:') || address.startsWith('lan:')) {
//       return address;
//     }
//     return Platform.OS === 'ios' ? `ble:${address}` : `bt:${address}`;
//   }

//   async disconnect() {
//     if (!this.currentDevice) return;
//     try {
//       if (typeof disconnectFn === 'function') {
//         const address = this.normalizeAddress(this.currentDevice.address);
//         await disconnectFn(address);
//       }
//     } catch (error) {}

//     this.currentDevice = null;
//     this.connectionState = 'disconnected';
//     this.notifyListeners();
//   }

//   async autoConnect() {
//     try {
//       const autoConnectEnabled = await PrinterStorage.getAutoConnect();
//       if (!autoConnectEnabled) return false;

//       const defaultPrinter = await PrinterStorage.getDefaultPrinter();
//       if (!defaultPrinter) return false;

//       return await this.connectToPrinter(defaultPrinter);
//     } catch (error) {
//       return false;
//     }
//   }

//   isConnected() {
//     return this.connectionState === 'connected' && this.currentDevice !== null;
//   }

//   getCurrentDevice() {
//     return this.currentDevice;
//   }

//   getConnectionStatus() {
//     return {
//       state: this.connectionState,
//       device: this.currentDevice,
//       connected: this.connectionState === 'connected',
//     };
//   }

//   addConnectionListener(listener) {
//     this.connectionListeners.push(listener);
//     try { listener(this.getConnectionStatus()); } catch (e) {}
//     return () => {
//       this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
//     };
//   }

//   notifyListeners() {
//     const status = this.getConnectionStatus();
//     this.connectionListeners.forEach(listener => {
//       try { listener(status); } catch (error) {}
//     });
//   }

//   async cleanup() {
//     this.eventSubscriptions.forEach(sub => {
//       try { if (removeDiscoveryEventListener) removeDiscoveryEventListener(sub); } catch (e) {}
//     });
//     this.eventSubscriptions = [];
//     await this.stopScanning();
//     if (this.currentDevice) await this.disconnect();
//     this.connectionListeners = [];
//     this.isInitialized = false;
//   }
// }

// export default BluetoothManager.getInstance();
































// // services/bluetooth/BluetoothManager.js
// /**
//  * Bluetooth connection manager - rebuilt on a different package after the
//  * previous transport (@finan-me/react-native-thermal-printer) proved
//  * unreliable: printers connected fine and every write reported success, but
//  * nothing printed, on multiple printers that print fine from other apps.
//  *
//  * New transport: react-native-thermal-receipt-printer-image-qr
//  * (fork of the long-established, widely used `react-native-thermal-receipt-printer`
//  * / "pinmi" printer library). On Android its `BLEPrinter` namespace is - despite
//  * the name - implemented with classic Bluetooth (BluetoothSocket.createRfcommSocketToServiceRecord
//  * with the standard SPP UUID 00001101-...), exactly the profile these thermal
//  * printers use. It's a much smaller, simpler connection implementation (no
//  * connection pooling/retry layers to go wrong) and is what most production
//  * POS apps for generic ESC/POS printers are actually built on.
//  *
//  * Public API is kept intentionally identical to the previous BluetoothManager
//  * (initialize, requestPermissions, scanForDevices, getPairedDevices,
//  * connectToPrinter, disconnect, isConnected, getCurrentDevice,
//  * addConnectionListener, getConnectionStatus) so the rest of the app
//  * (BluetoothPrinterModal.jsx, receipt-preview.jsx, usePrinter.js) does not
//  * need to change.
//  *
//  * New: printRawBytes(bytes) - sends a raw ESC/POS byte array (base64-encoded
//  * under the hood) straight to the socket. This is what EscPosPrinter.js now
//  * uses instead of the old NativeModules.RNThermalPrinter.printRaw call.
//  */
// import { Platform, PermissionsAndroid } from 'react-native';
// import { BLEPrinter } from 'react-native-thermal-receipt-printer-image-qr';
// import PrinterStorage from './PrinterStorage';

// // ---- tiny base64 encoder (no extra dependency) ----
// const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// function bytesToBase64(bytes) {
//   let result = '';
//   const len = bytes.length;
//   for (let i = 0; i < len; i += 3) {
//     const b1 = bytes[i];
//     const b2 = i + 1 < len ? bytes[i + 1] : null;
//     const b3 = i + 2 < len ? bytes[i + 2] : null;

//     result += B64_CHARS[b1 >> 2];
//     result += B64_CHARS[((b1 & 0x03) << 4) | (b2 !== null ? (b2 >> 4) : 0)];
//     result += b2 !== null ? B64_CHARS[((b2 & 0x0f) << 2) | (b3 !== null ? (b3 >> 6) : 0)] : '=';
//     result += b3 !== null ? B64_CHARS[b3 & 0x3f] : '=';
//   }
//   return result;
// }

// class BluetoothManager {
//   static instance = null;

//   constructor() {
//     if (BluetoothManager.instance) return BluetoothManager.instance;
//     this.currentDevice = null; // { name, address } - address is bare MAC
//     this.connectionState = 'disconnected';
//     this.connectionListeners = [];
//     this.devices = [];
//     this.isInitialized = false;
//     BluetoothManager.instance = this;
//   }

//   static getInstance() {
//     if (!BluetoothManager.instance) {
//       BluetoothManager.instance = new BluetoothManager();
//     }
//     return BluetoothManager.instance;
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
//       if (!hasPermission) throw new Error('Bluetooth permission denied');

//       await BLEPrinter.init();
//       this.isInitialized = true;
//       await this.autoConnect();
//       return true;
//     } catch (error) {
//       console.error('Failed to initialize Bluetooth:', error);
//       return false;
//     }
//   }

//   // ============= Discovery =============
//   // This package only lists bonded/paired devices (no live discovery scan) -
//   // pair the printer via Android Bluetooth settings first, same as before.
//   async scanForDevices() {
//     try {
//       await this.initialize();
//       const list = await BLEPrinter.getDeviceList(); // [{ device_name, inner_mac_address }]
//       this.devices = (list || []).map((d) => ({
//         name: d.device_name || 'Unknown printer',
//         address: d.inner_mac_address,
//       }));
//       return this.devices;
//     } catch (error) {
//       console.error('Scan error:', error);
//       return [];
//     }
//   }

//   async getPairedDevices() {
//     return this.scanForDevices();
//   }

//   async stopScanning() {
//     // no-op: this package has no live scan to stop, listing bonded devices
//     // is effectively instant.
//   }

//   // ============= Connection =============
//   async connectToPrinter(device) {
//     this.connectionState = 'connecting';
//     this.notifyListeners();

//     try {
//       console.log('Connecting to:', device.address, 'Name:', device.name);
//       const result = await BLEPrinter.connectPrinter(device.address);

//       this.currentDevice = { name: result?.device_name || device.name, address: device.address };
//       this.connectionState = 'connected';
//       await PrinterStorage.saveDefaultPrinter(this.currentDevice);
//       await PrinterStorage.saveLastPrinter(this.currentDevice);
//       this.notifyListeners();
//       console.log('Connected to:', this.currentDevice.name);
//       return true;
//     } catch (error) {
//       this.connectionState = 'error';
//       console.error('Connection error:', error);
//       this.notifyListeners();
//       return false;
//     }
//   }

//   async disconnect() {
//     if (!this.currentDevice) return;
//     try {
//       await BLEPrinter.closeConn();
//     } catch (error) {
//       // ignore - socket may already be closed
//     }
//     this.currentDevice = null;
//     this.connectionState = 'disconnected';
//     this.notifyListeners();
//   }

//   async autoConnect() {
//     try {
//       const autoConnectEnabled = await PrinterStorage.getAutoConnect();
//       if (!autoConnectEnabled) return false;

//       const defaultPrinter = await PrinterStorage.getDefaultPrinter();
//       if (!defaultPrinter) return false;

//       return await this.connectToPrinter(defaultPrinter);
//     } catch (error) {
//       return false;
//     }
//   }

//   // ============= Raw byte printing =============
//   // Sends a raw ESC/POS byte array straight to the connected printer's
//   // socket. Base64-encoded because the native side does
//   // Base64.decode(...) -> OutputStream.write(...) directly - fully
//   // binary-safe (unlike passing raw bytes through a JS string).
//   async printRawBytes(bytes) {
//     if (!this.isConnected()) {
//       throw new Error('Printer not connected');
//     }
//     const base64 = bytesToBase64(bytes);
//     return new Promise((resolve, reject) => {
//       try {
//         BLEPrinter.printRaw(base64);
//         // This library's printRaw() has no success callback (only an error
//         // one, logged internally) - resolve optimistically; failures throw
//         // synchronously or surface via the error console.warn in the lib.
//         resolve({ success: true });
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }

//   // ============= Status =============
//   isConnected() {
//     return this.connectionState === 'connected' && this.currentDevice !== null;
//   }

//   getCurrentDevice() {
//     return this.currentDevice;
//   }

//   getConnectionStatus() {
//     return {
//       state: this.connectionState,
//       device: this.currentDevice,
//       connected: this.connectionState === 'connected',
//     };
//   }

//   addConnectionListener(listener) {
//     this.connectionListeners.push(listener);
//     try { listener(this.getConnectionStatus()); } catch (e) {}
//     return () => {
//       this.connectionListeners = this.connectionListeners.filter((l) => l !== listener);
//     };
//   }

//   notifyListeners() {
//     const status = this.getConnectionStatus();
//     this.connectionListeners.forEach((listener) => {
//       try { listener(status); } catch (error) {}
//     });
//   }

//   async cleanup() {
//     if (this.currentDevice) await this.disconnect();
//     this.connectionListeners = [];
//     this.isInitialized = false;
//   }
// }

// export default BluetoothManager.getInstance();
