// // services/printer/PrinterService.js

// import { Platform, PermissionsAndroid } from 'react-native';

// import ReactNativePosPrinter from 'react-native-thermal-pos-printer';

// import ReceiptFormatter, { TEXT_SIZE } from './ReceiptFormatter';

// import PrinterStorage from './PrinterStorage';

// import { generateQRCodeImage } from './QRCodeGenerator';

// /**
//  * PrinterService
//  *
//  * Responsible for:
//  * - Bluetooth permissions
//  * - printer initialization
//  * - device discovery
//  * - connection
//  * - disconnection
//  * - printer settings
//  * - receipt formatting orchestration
//  * - executing receipt nodes
//  * - test printing
//  *
//  * ReceiptFormatter is responsible only for creating nodes.
//  *
//  * QR CODE PRINTING
//  * -----------------
//  * QR codes are printed via the library's native printQRCode() first -
//  * the printer's own firmware draws the modules directly at native
//  * resolution, with no client-side image resize/threshold/dither step
//  * to degrade small, precisely-aligned module edges the way pushing a
//  * rasterized bitmap through printImage() can (observed in practice:
//  * a bitmap QR that decoded perfectly in isolation still failed to
//  * scan once printed, while the same payload via native printQRCode
//  * did not).
//  *
//  * This used to be the OTHER way around, because native printQRCode
//  * appeared unreliable - it would print a wall of raw text instead of
//  * a QR code. That turned out to be a content bug elsewhere in the
//  * app: printQRCode was being handed an entire rendered PNG data-URL
//  * (thousands of characters) instead of the actual short signed
//  * payload string, which exceeds QR capacity and made printers fall
//  * back to dumping it as text. That's fixed upstream now (the caller
//  * always passes the raw signed string), so native QR gets first try
//  * again. The bitmap+printImage() approach (QRCodeGenerator) remains
//  * as a fallback for devices/libraries that don't support native QR
//  * at all, with a larger default module size than the bitmap alone
//  * would need, to leave headroom against printImage()'s own
//  * processing. Final fallback is wrapped raw text, so a QR failure
//  * never silently drops that part of the receipt.
//  */
// class PrinterService {
//   static instance = null;

//   constructor() {
//     if (PrinterService.instance) {
//       return PrinterService.instance;
//     }

//     this.currentPrinter = null;
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

//   // ============================================================
//   // PERMISSIONS
//   // ============================================================

//   async requestPermissions() {
//     if (Platform.OS !== 'android') {
//       return true;
//     }

//     try {
//       const permissions =
//         Platform.Version >= 31
//           ? [
//               PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//               PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//             ]
//           : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

//       const result = await PermissionsAndroid.requestMultiple(permissions);

//       return permissions.every(
//         permission =>
//           result[permission] === PermissionsAndroid.RESULTS.GRANTED,
//       );
//     } catch (error) {
//       console.error('Bluetooth permission error:', error);
//       return false;
//     }
//   }

//   // ============================================================
//   // INITIALIZATION
//   // ============================================================

//   async initialize() {
//     if (this.isInitialized) {
//       return true;
//     }

//     try {
//       const permissionGranted = await this.requestPermissions();

//       if (!permissionGranted) {
//         console.warn('Bluetooth permission was not granted.');
//       }

//       await ReactNativePosPrinter.init();

//       this.isInitialized = true;

//       console.log('[PrinterService] Initialized.');

//       await this.autoConnect();

//       return true;
//     } catch (error) {
//       console.error('[PrinterService] Initialization failed:', error);
//       this.isInitialized = false;
//       return false;
//     }
//   }

//   // ============================================================
//   // DEVICE DISCOVERY
//   // ============================================================

//   // This library only lists bonded/paired devices (no live discovery
//   // scan) - pair the printer via Android Bluetooth settings first.
//   // Any entry missing a usable address is dropped, since it can never
//   // be connected to anyway.
//   async getPairedDevices() {
//     try {
//       if (!this.isInitialized) {
//         await this.initialize();
//       }

//       const devices = await ReactNativePosPrinter.getDeviceList();

//       if (!Array.isArray(devices)) {
//         console.warn('[PrinterService] No printer devices returned.');
//         return [];
//       }

//       return devices
//         .map(device => ({
//           name: device?.name || device?.getName?.() || 'Unknown Device',
//           address: device?.address || device?.getAddress?.(),
//           type: device?.type || device?.getType?.() || 'BLUETOOTH',
//           connected: Boolean(device?.connected),
//           rssi: device?.rssi,
//           batteryLevel: device?.batteryLevel,
//         }))
//         .filter(device => {
//           if (!device.address) {
//             console.warn(
//               '[PrinterService] Ignoring printer without Bluetooth address:',
//               device,
//             );
//             return false;
//           }
//           return true;
//         });
//     } catch (error) {
//       console.error('[PrinterService] Failed to get paired printers:', error);
//       return [];
//     }
//   }

//   async scanForDevices() {
//     return this.getPairedDevices();
//   }

//   // ============================================================
//   // CONNECTION
//   // ============================================================

//   async connectToPrinter(deviceInfo) {
//     this.connectionState = 'connecting';
//     this.notifyListeners();

//     try {
//       if (!deviceInfo?.address) {
//         throw new Error('The selected printer has no Bluetooth address.');
//       }

//       if (!this.isInitialized) {
//         await this.initialize();
//       }

//       console.log('[PrinterService] Connecting to:', deviceInfo);

//       const printer = await ReactNativePosPrinter.connectPrinter(
//         deviceInfo.address,
//         { type: deviceInfo.type || 'BLUETOOTH' },
//       );

//       this.currentPrinter = printer;
//       this.connectionState = 'connected';

//       const savedPrinter = {
//         name: deviceInfo.name || 'Unknown Printer',
//         address: deviceInfo.address,
//         type: deviceInfo.type || 'BLUETOOTH',
//       };

//       await PrinterStorage.saveDefaultPrinter(savedPrinter);
//       await PrinterStorage.saveLastPrinter(savedPrinter);

//       this.notifyListeners();

//       console.log(`[PrinterService] Connected to ${savedPrinter.name}`);

//       return true;
//     } catch (error) {
//       this.currentPrinter = null;
//       this.connectionState = 'error';
//       this.notifyListeners();

//       console.error('[PrinterService] Printer connection failed:', error);
//       throw error;
//     }
//   }

//   async disconnect() {
//     try {
//       await ReactNativePosPrinter.disconnectPrinter();
//     } catch (error) {
//       console.warn('[PrinterService] Disconnect warning:', error);
//     }

//     this.currentPrinter = null;
//     this.connectionState = 'disconnected';
//     this.notifyListeners();
//   }

//   async autoConnect() {
//     try {
//       const enabled = await PrinterStorage.getAutoConnect();

//       if (!enabled) {
//         return false;
//       }

//       const printer = await PrinterStorage.getDefaultPrinter();

//       if (!printer?.address) {
//         return false;
//       }

//       return this.connectToPrinter(printer);
//     } catch (error) {
//       console.warn('[PrinterService] Auto-connect failed:', error);
//       return false;
//     }
//   }

//   // ============================================================
//   // STATUS
//   // ============================================================

//   isConnected() {
//     return (
//       this.connectionState === 'connected' && this.currentPrinter !== null
//     );
//   }

//   getCurrentDevice() {
//     if (!this.currentPrinter) {
//       return null;
//     }

//     return {
//       name:
//         this.currentPrinter.getName?.() ||
//         this.currentPrinter.name ||
//         'Unknown Printer',
//       address:
//         this.currentPrinter.getAddress?.() || this.currentPrinter.address,
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
//     if (typeof listener !== 'function') {
//       return () => {};
//     }

//     this.connectionListeners.push(listener);

//     try {
//       listener(this.getConnectionStatus());
//     } catch (error) {
//       console.warn('[PrinterService] Connection listener error:', error);
//     }

//     return () => {
//       this.connectionListeners = this.connectionListeners.filter(
//         item => item !== listener,
//       );
//     };
//   }

//   notifyListeners() {
//     const status = this.getConnectionStatus();

//     this.connectionListeners.forEach(listener => {
//       try {
//         listener(status);
//       } catch (error) {
//         console.warn('[PrinterService] Connection listener error:', error);
//       }
//     });
//   }

//   // ============================================================
//   // SETTINGS
//   // ============================================================

//   async getPaperSize() {
//     return PrinterStorage.getPaperSize();
//   }

//   async setPaperSize(size) {
//     const normalized = size === '80mm' ? '80mm' : '58mm';
//     return PrinterStorage.savePaperSize(normalized);
//   }

//   async getAutoConnect() {
//     return PrinterStorage.getAutoConnect();
//   }

//   async setAutoConnect(enabled) {
//     return PrinterStorage.saveAutoConnect(Boolean(enabled));
//   }

//   async getPrintCopies() {
//     return PrinterStorage.getPrintCopies();
//   }

//   async setPrintCopies(copies) {
//     const parsed = Number.parseInt(copies, 10);
//     const count = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 10) : 1;
//     return PrinterStorage.savePrintCopies(count);
//   }

//   async getPaperWidth() {
//     const size = await this.getPaperSize();
//     return size === '80mm' ? 48 : 32;
//   }

//   // ============================================================
//   // RECEIPT PRINTING
//   // ============================================================

//   async printReceipt(receiptData, receiptType = 'SALES') {
//     if (!this.isConnected()) {
//       throw new Error('No printer connected.');
//     }

//     const copies = Math.max(1, Number((await this.getPrintCopies()) || 1));
//     const deviceName = this.getCurrentDevice()?.name || '';
//     const paperSize = await this.getPaperSize();

//     // Configure formatter.
//     ReceiptFormatter.detectPrinterType(deviceName);
//     ReceiptFormatter.setPaperSize(paperSize);

//     const nodes = ReceiptFormatter.formatReceipt(
//       receiptData || {},
//       receiptType,
//       deviceName,
//     );

//     console.log('[PrinterService] Receipt generated:', {
//       receiptType,
//       paperSize,
//       width: ReceiptFormatter.getWidth(),
//       nodeCount: nodes.length,
//       printer: deviceName,
//     });

//     for (let copy = 0; copy < copies; copy++) {
//       await this._printNodes(nodes);
//       console.log(`[PrinterService] Receipt copy ${copy + 1}/${copies} printed.`);
//     }

//     return {
//       success: true,
//       copies,
//       paperSize,
//       nodeCount: nodes.length,
//     };
//   }

//   async printSalesReceipt(data) {
//     return this.printReceipt(data, 'SALES');
//   }

//   async printPaymentReceipt(data) {
//     return this.printReceipt(data, 'PAYMENT');
//   }

//   async printReleaseReceipt(data) {
//     return this.printReceipt(data, 'RELEASE');
//   }

//   async printInvoiceReceipt(data) {
//     return this.printReceipt(data, 'INVOICE');
//   }

//   async printFinalReceipt(data) {
//     return this.printReceipt(data, 'FINAL');
//   }

//   // ============================================================
//   // NODE EXECUTION
//   // ============================================================

//   async _printNodes(nodes) {
//     if (!Array.isArray(nodes) || nodes.length === 0) {
//       return;
//     }

//     for (let index = 0; index < nodes.length; index++) {
//       const node = nodes[index];

//       if (!node) {
//         continue;
//       }

//       try {
//         switch (node.type) {
//           // ====================================================
//           // TEXT
//           // ====================================================

//           case 'text': {
//             const style = this._convertStyle(node.style);
//             const content = `${node.content || ''}\n`;

//             console.log('[PrinterService] TEXT:', {
//               content: node.content,
//               style,
//             });

//             await ReactNativePosPrinter.printText(content, style);

//             break;
//           }

//           // ====================================================
//           // LINE
//           // ====================================================

//           case 'line': {
//             const width = await this.getPaperWidth();
//             const character = node.style === 'dashed' ? '-' : '=';
//             const line = character.repeat(width);

//             await ReactNativePosPrinter.printText(
//               `${line}\n`,
//               this._normalStyle('LEFT'),
//             );

//             break;
//           }

//           // ====================================================
//           // QR (see class docstring for why this is image-based)
//           // ====================================================

//           case 'qr': {
//             await this._printQRNode(node);
//             break;
//           }

//           // ====================================================
//           // FEED
//           // ====================================================

//           case 'feed': {
//             const lines = Math.min(Math.max(Number(node.lines) || 3, 1), 10);
//             await ReactNativePosPrinter.newLine(lines);
//             break;
//           }

//           // ====================================================
//           // CUT
//           // ====================================================

//           case 'cut': {
//             await ReactNativePosPrinter.cutPaper();
//             break;
//           }

//           // ====================================================
//           // UNKNOWN
//           // ====================================================

//           default:
//             console.warn('[PrinterService] Unsupported receipt node:', node);
//         }
//       } catch (error) {
//         console.error(
//           `[PrinterService] Failed printing node ${index} (${node.type}):`,
//           error,
//         );

//         throw error;
//       }
//     }
//   }

//   // ============================================================
//   // QR NODE
//   // ============================================================

//   /**
//    * Prints a QR node as an image, with fallbacks so a QR/printer
//    * quirk degrades gracefully instead of aborting the whole receipt.
//    *
//    *   1. Preferred: render a QR bitmap ourselves and printImage() it.
//    *      This is the reliable, generic-ESC/POS path (see class docstring).
//    *   2. Fallback: the library's native printQRCode(), in case a given
//    *      device/library combination can't handle printImage but does
//    *      support the native QR command correctly.
//    *   3. Last resort: print the raw data as wrapped text, so the
//    *      receipt still contains something the customer can act on
//    *      instead of silently dropping the QR section.
//    */
//   async _printQRNode(node) {
//     const qrData = String(node.content ?? '').trim();

//     if (!qrData) {
//       console.warn('[PrinterService] QR node has no content.');
//       return;
//     }

//     const dotWidth = ReceiptFormatter.getDotWidth();

//     // Leave room on either side so the code doesn't touch the paper edge.
//     const maxWidthPx = Math.floor(dotWidth * 0.85);

//     // Defensive guard: if something upstream passed an already-rendered
//     // image (a data: URL) instead of raw scannable text - e.g. a screen
//     // that displays the QR as <Image source={{uri: qrCode}}> also being
//     // wired into the print path by mistake - do NOT try to re-encode
//     // that multi-KB base64 string as new QR "content". Attempting to
//     // encode thousands of characters into a QR code exceeds QR capacity
//     // and is exactly what previously caused printers to fall back to
//     // dumping the raw base64 string as a wall of text. Instead, print
//     // the image directly: it's already a valid, correctly-sized picture.
//     const dataUrlMatch = qrData.match(/^data:image\/(png|jpe?g);base64,(.+)$/i);

//     if (dataUrlMatch) {
//       console.warn(
//         '[PrinterService] QR node content is a rendered image (data URL), not raw scan data. ' +
//           'Printing the image as-is instead of re-encoding it as a new QR - ' +
//           'check the caller: it should be passing the raw signed QR string (e.g. receiptData.qrCode), ' +
//           'not a rendered/display QR image (e.g. receiptData.qrCodeImage).',
//       );

//       try {
//         await ReactNativePosPrinter.printImage(dataUrlMatch[2], {
//           align: 'CENTER',
//           width: maxWidthPx,
//         });

//         await ReactNativePosPrinter.newLine(1);

//         return;
//       } catch (imagePrintError) {
//         console.warn(
//           '[PrinterService] Printing pre-rendered QR image failed, will attempt to continue with fallbacks:',
//           imagePrintError,
//         );
//         // fall through to the normal encode/print/fallback chain below,
//         // in case the image itself was malformed - the raw text fallback
//         // at the end will at least surface the issue instead of crashing
//         // the whole receipt.
//       }
//     }

//     // ---- Primary: native hardware QR command ----
//     // The printer's own firmware draws QR modules directly at native
//     // print-head resolution - there's no client-side bitmap resize,
//     // threshold, or dithering step to degrade fine module edges the way
//     // pushing a rasterized image through printImage() can (see below).
//     // This used to fail here because the content reaching it was wrong
//     // (an entire rendered PNG data-URL, not the raw signed payload) -
//     // that's fixed upstream now, so native QR gets first try.
//     try {
//       const qrSize = Math.min(Math.max(Number(node.moduleScale) || 6, 1), 16);

//       const qrAlign =
//         node.align === 'center'
//           ? 'CENTER'
//           : node.align === 'right'
//             ? 'RIGHT'
//             : 'LEFT';

//       const allowedErrorLevels = ['L', 'M', 'Q', 'H'];
//       const requestedErrorLevel = String(node.errorLevel || 'M').toUpperCase();
//       const errorLevel = allowedErrorLevels.includes(requestedErrorLevel)
//         ? requestedErrorLevel
//         : 'M';

//       await ReactNativePosPrinter.printQRCode(qrData, {
//         align: qrAlign,
//         size: qrSize,
//         errorLevel,
//       });

//       await ReactNativePosPrinter.newLine(1);

//       return;
//     } catch (nativeError) {
//       console.warn(
//         '[PrinterService] Native printQRCode failed, falling back to a rendered bitmap image:',
//         nativeError,
//       );
//     }

//     // ---- Fallback: render our own bitmap and printImage() it ----
//     // Used only when native QR isn't supported by this printer/library.
//     // NOTE: some printImage() implementations resize/dither/threshold
//     // whatever bitmap they're given, which can blur small, precisely-
//     // aligned QR modules enough to break scanning even though the
//     // source bitmap itself decodes perfectly (verified independently -
//     // see QRCodeGenerator). Bigger modules give more headroom against
//     // that, hence the larger default moduleScale/floor here versus what
//     // might seem necessary from the bitmap alone.
//     try {
//       const image = generateQRCodeImage(qrData, {
//         errorCorrectionLevel: node.errorLevel || 'M',
//         moduleScale: Number(node.moduleScale) || 6,
//         minModuleScale: 5,
//         quietZoneModules: 4,
//         maxWidthPx,
//         fullWidthPx: dotWidth,
//       });

//       if (!image) {
//         throw new Error('QR bitmap generation returned no image.');
//       }

//       console.log('[PrinterService] Printing QR as image:', {
//         length: qrData.length,
//         widthPx: image.widthPx,
//         moduleCount: image.moduleCount,
//         scale: image.scale,
//       });

//       await ReactNativePosPrinter.printImage(image.base64, {
//         align: 'CENTER',
//         width: image.widthPx,
//       });

//       await ReactNativePosPrinter.newLine(1);

//       return;
//     } catch (imageError) {
//       console.warn(
//         '[PrinterService] QR bitmap image print also failed, falling back to text:',
//         imageError,
//       );
//     }

//     // ---- Last resort: raw text, so the receipt isn't silently missing this ----
//     try {
//       const width = await this.getPaperWidth();
//       const wrapped = this._wrapPlainText(qrData, width);

//       await ReactNativePosPrinter.printText(
//         `${'(scan unavailable - use link below)'}\n`,
//         this._normalStyle('CENTER'),
//       );

//       for (const line of wrapped) {
//         await ReactNativePosPrinter.printText(
//           `${line}\n`,
//           this._normalStyle('CENTER'),
//         );
//       }
//     } catch (textError) {
//       console.error(
//         '[PrinterService] All QR print fallbacks failed:',
//         textError,
//       );
//     }
//   }

//   _wrapPlainText(text, width) {
//     const value = String(text ?? '');
//     const lines = [];

//     for (let i = 0; i < value.length; i += width) {
//       lines.push(value.substring(i, i + width));
//     }

//     return lines.length ? lines : [''];
//   }

//   // ============================================================
//   // TEXT STYLE
//   // ============================================================

//   _normalStyle(align = 'LEFT') {
//     return {
//       align,
//       size: 8,
//       bold: false,
//       underline: false,
//     };
//   }

//   _convertStyle(style = {}) {
//     const alignMap = {
//       left: 'LEFT',
//       center: 'CENTER',
//       right: 'RIGHT',
//     };

//     /**
//      * IMPORTANT:
//      * Physical size remains fixed for all receipt text so that
//      * fixed-width formatting remains predictable. Bold is used for
//      * emphasis instead of a larger font.
//      */
//     const sizeMap = {
//       [TEXT_SIZE.NORMAL]: 8,
//       [TEXT_SIZE.EMPHASIZED]: 10,
//     };

//     const logicalSize = Number(style.size) || TEXT_SIZE.NORMAL;

//     return {
//       align: alignMap[style.align] || 'LEFT',
//       size: sizeMap[logicalSize] || 10,
//       bold: Boolean(style.bold),
//       underline: Boolean(style.underline),
//     };
//   }

//   // ============================================================
//   // TEST PRINT
//   // ============================================================

//   async testPrint() {
//     if (!this.isConnected()) {
//       throw new Error('No printer connected.');
//     }

//     const width = await this.getPaperWidth();

//     await ReactNativePosPrinter.printText(
//       `${'='.repeat(width)}\n`,
//       this._normalStyle('LEFT'),
//     );

//     await ReactNativePosPrinter.printText('PRINTER TEST\n', {
//       ...this._normalStyle('CENTER'),
//       bold: true,
//       size: 10,
//     });

//     await ReactNativePosPrinter.printText(
//       'Normal text size\n',
//       this._normalStyle('LEFT'),
//     );

//     await ReactNativePosPrinter.printText(
//       'This should be normal size.\n',
//       this._normalStyle('LEFT'),
//     );

//     await ReactNativePosPrinter.printText(
//       `${'='.repeat(width)}\n`,
//       this._normalStyle('LEFT'),
//     );

//     await ReactNativePosPrinter.newLine(3);
//     await ReactNativePosPrinter.cutPaper();

//     return { success: true };
//   }

//   /** Isolated QR-only test print, useful for verifying the QR fix on-device. */
//   async testPrintQRCode() {
//     if (!this.isConnected()) {
//       throw new Error('No printer connected.');
//     }

//     const paperSize = await this.getPaperSize();
//     ReceiptFormatter.setPaperSize(paperSize);

//     await this._printQRNode({
//       content: 'https://example.com/printer-qr-test',
//       align: 'center',
//       errorLevel: 'M',
//       moduleScale: paperSize === '80mm' ? 8 : 6,
//     });

//     await ReactNativePosPrinter.newLine(3);
//     await ReactNativePosPrinter.cutPaper();

//     return { success: true };
//   }

//   // ============================================================
//   // DIAGNOSTIC PRINT
//   // ============================================================

//   async diagnosticPrint() {
//     const results = [];

//     try {
//       await this.testPrint();
//       results.push({ method: 'testPrint', success: true });
//     } catch (error) {
//       results.push({
//         method: 'testPrint',
//         success: false,
//         error: error?.message || String(error),
//       });
//     }

//     try {
//       await this.testPrintQRCode();
//       results.push({ method: 'testPrintQRCode', success: true });
//     } catch (error) {
//       results.push({
//         method: 'testPrintQRCode',
//         success: false,
//         error: error?.message || String(error),
//       });
//     }

//     try {
//       const diagnosticData = {
//         store: {
//           name: 'DIAGNOSTIC STORE',
//           address: 'Printer Test Address',
//           phone: '08000000000',
//         },
//         transaction: {
//           number: 'TEST-0001',
//           createdAt: new Date(),
//           status: 'COMPLETED',
//         },
//         items: [
//           {
//             name: 'Test Product',
//             quantity: 2,
//             unitPrice: 1500,
//             totalPrice: 3000,
//           },
//         ],
//         summary: {
//           subtotal: 3000,
//           totalAmount: 3000,
//           amountPaid: 5000,
//           changeAmount: 2000,
//         },
//         staff: { salesAttendant: { name: 'Test User' } },
//         qrCode: 'https://example.com/receipt/TEST-0001',
//       };

//       await this.printReceipt(diagnosticData, 'SALES');

//       results.push({ method: 'formattedReceipt', success: true });
//     } catch (error) {
//       results.push({
//         method: 'formattedReceipt',
//         success: false,
//         error: error?.message || String(error),
//       });
//     }

//     console.log('[PrinterService] Diagnostics:', results);

//     return results;
//   }
// }

// export default PrinterService.getInstance();


























// services/printer/PrinterService.js

import { Platform, PermissionsAndroid } from 'react-native';

import ReactNativePosPrinter from 'react-native-thermal-pos-printer';

import ReceiptFormatter, { TEXT_SIZE } from './ReceiptFormatter';

import PrinterStorage from './PrinterStorage';

import { generateQRCodeImage } from './QRCodeGenerator';

/**
 * PrinterService
 *
 * Responsible for:
 * - Bluetooth permissions
 * - printer initialization
 * - device discovery
 * - connection
 * - disconnection
 * - printer settings
 * - receipt formatting orchestration
 * - executing receipt nodes
 * - test printing
 *
 * ReceiptFormatter is responsible only for creating nodes.
 *
 * QR CODE PRINTING
 * -----------------
 * QR codes are printed via a self-rendered bitmap (QRCodeGenerator +
 * printImage()) first, with the library's native printQRCode() as a
 * fallback, and wrapped raw text as a last resort.
 *
 * This order has changed twice, each time based on evidence from
 * actual hardware (this can only be reasoned about and simulated
 * against mocks locally - the real printer is the only ground truth):
 *   1. Originally bitmap-first, because native printQRCode appeared to
 *      dump a wall of raw text instead of a QR code. Root cause: a
 *      content bug elsewhere in the app was handing it an entire
 *      rendered PNG data-URL (thousands of characters) instead of the
 *      actual short signed payload, overflowing QR capacity.
 *   2. After that content bug was fixed, switched to native-first,
 *      reasoning that hardware-native rendering avoids whatever
 *      resize/dither a printer library might apply to a bitmap image
 *      - and indeed, a bitmap QR that decoded perfectly in isolation
 *      (verified independently) still failed to scan once printed.
 *   3. Real-world testing then showed native printQRCode on this
 *      printer/library resolves successfully as a JS promise while
 *      producing NO physical output at all - a silent no-op that's
 *      worse than an outright failure, since nothing signals the
 *      fallback chain to continue. Reverted to bitmap-first: it's the
 *      one path confirmed to actually produce visible printed output
 *      on this hardware. Its scannability (the step 2 problem) was
 *      separately hardened - larger modules, a scannability floor
 *      that won't shrink below a safe size to fit paper width (see
 *      QRCodeGenerator) - rather than abandoning it.
 * Native printQRCode is kept as a fallback (not removed) since it may
 * still work correctly on other printers/libraries.
 */
class PrinterService {
  static instance = null;

  constructor() {
    if (PrinterService.instance) {
      return PrinterService.instance;
    }

    this.currentPrinter = null;
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

  // ============================================================
  // PERMISSIONS
  // ============================================================

  async requestPermissions() {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const permissions =
        Platform.Version >= 31
          ? [
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]
          : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

      const result = await PermissionsAndroid.requestMultiple(permissions);

      return permissions.every(
        permission =>
          result[permission] === PermissionsAndroid.RESULTS.GRANTED,
      );
    } catch (error) {
      console.error('Bluetooth permission error:', error);
      return false;
    }
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  async initialize() {
    if (this.isInitialized) {
      return true;
    }

    try {
      const permissionGranted = await this.requestPermissions();

      if (!permissionGranted) {
        console.warn('Bluetooth permission was not granted.');
      }

      await ReactNativePosPrinter.init();

      this.isInitialized = true;

      console.log('[PrinterService] Initialized.');

      await this.autoConnect();

      return true;
    } catch (error) {
      console.error('[PrinterService] Initialization failed:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // ============================================================
  // DEVICE DISCOVERY
  // ============================================================

  // This library only lists bonded/paired devices (no live discovery
  // scan) - pair the printer via Android Bluetooth settings first.
  // Any entry missing a usable address is dropped, since it can never
  // be connected to anyway.
  async getPairedDevices() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const devices = await ReactNativePosPrinter.getDeviceList();

      if (!Array.isArray(devices)) {
        console.warn('[PrinterService] No printer devices returned.');
        return [];
      }

      return devices
        .map(device => ({
          name: device?.name || device?.getName?.() || 'Unknown Device',
          address: device?.address || device?.getAddress?.(),
          type: device?.type || device?.getType?.() || 'BLUETOOTH',
          connected: Boolean(device?.connected),
          rssi: device?.rssi,
          batteryLevel: device?.batteryLevel,
        }))
        .filter(device => {
          if (!device.address) {
            console.warn(
              '[PrinterService] Ignoring printer without Bluetooth address:',
              device,
            );
            return false;
          }
          return true;
        });
    } catch (error) {
      console.error('[PrinterService] Failed to get paired printers:', error);
      return [];
    }
  }

  async scanForDevices() {
    return this.getPairedDevices();
  }

  // ============================================================
  // CONNECTION
  // ============================================================

  async connectToPrinter(deviceInfo) {
    this.connectionState = 'connecting';
    this.notifyListeners();

    try {
      if (!deviceInfo?.address) {
        throw new Error('The selected printer has no Bluetooth address.');
      }

      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('[PrinterService] Connecting to:', deviceInfo);

      const printer = await ReactNativePosPrinter.connectPrinter(
        deviceInfo.address,
        { type: deviceInfo.type || 'BLUETOOTH' },
      );

      this.currentPrinter = printer;
      this.connectionState = 'connected';

      const savedPrinter = {
        name: deviceInfo.name || 'Unknown Printer',
        address: deviceInfo.address,
        type: deviceInfo.type || 'BLUETOOTH',
      };

      await PrinterStorage.saveDefaultPrinter(savedPrinter);
      await PrinterStorage.saveLastPrinter(savedPrinter);

      this.notifyListeners();

      console.log(`[PrinterService] Connected to ${savedPrinter.name}`);

      return true;
    } catch (error) {
      this.currentPrinter = null;
      this.connectionState = 'error';
      this.notifyListeners();

      console.error('[PrinterService] Printer connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await ReactNativePosPrinter.disconnectPrinter();
    } catch (error) {
      console.warn('[PrinterService] Disconnect warning:', error);
    }

    this.currentPrinter = null;
    this.connectionState = 'disconnected';
    this.notifyListeners();
  }

  async autoConnect() {
    try {
      const enabled = await PrinterStorage.getAutoConnect();

      if (!enabled) {
        return false;
      }

      const printer = await PrinterStorage.getDefaultPrinter();

      if (!printer?.address) {
        return false;
      }

      return this.connectToPrinter(printer);
    } catch (error) {
      console.warn('[PrinterService] Auto-connect failed:', error);
      return false;
    }
  }

  // ============================================================
  // STATUS
  // ============================================================

  isConnected() {
    return (
      this.connectionState === 'connected' && this.currentPrinter !== null
    );
  }

  getCurrentDevice() {
    if (!this.currentPrinter) {
      return null;
    }

    return {
      name:
        this.currentPrinter.getName?.() ||
        this.currentPrinter.name ||
        'Unknown Printer',
      address:
        this.currentPrinter.getAddress?.() || this.currentPrinter.address,
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
    if (typeof listener !== 'function') {
      return () => {};
    }

    this.connectionListeners.push(listener);

    try {
      listener(this.getConnectionStatus());
    } catch (error) {
      console.warn('[PrinterService] Connection listener error:', error);
    }

    return () => {
      this.connectionListeners = this.connectionListeners.filter(
        item => item !== listener,
      );
    };
  }

  notifyListeners() {
    const status = this.getConnectionStatus();

    this.connectionListeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.warn('[PrinterService] Connection listener error:', error);
      }
    });
  }

  // ============================================================
  // SETTINGS
  // ============================================================

  async getPaperSize() {
    return PrinterStorage.getPaperSize();
  }

  async setPaperSize(size) {
    const normalized = size === '80mm' ? '80mm' : '58mm';
    return PrinterStorage.savePaperSize(normalized);
  }

  async getAutoConnect() {
    return PrinterStorage.getAutoConnect();
  }

  async setAutoConnect(enabled) {
    return PrinterStorage.saveAutoConnect(Boolean(enabled));
  }

  async getPrintCopies() {
    return PrinterStorage.getPrintCopies();
  }

  async setPrintCopies(copies) {
    const parsed = Number.parseInt(copies, 10);
    const count = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 10) : 1;
    return PrinterStorage.savePrintCopies(count);
  }

  async getPaperWidth() {
    const size = await this.getPaperSize();
    return size === '80mm' ? 48 : 32;
  }

  // ============================================================
  // RECEIPT PRINTING
  // ============================================================

  async printReceipt(receiptData, receiptType = 'SALES') {
    if (!this.isConnected()) {
      throw new Error('No printer connected.');
    }

    const copies = Math.max(1, Number((await this.getPrintCopies()) || 1));
    const deviceName = this.getCurrentDevice()?.name || '';
    const paperSize = await this.getPaperSize();

    // Configure formatter.
    ReceiptFormatter.detectPrinterType(deviceName);
    ReceiptFormatter.setPaperSize(paperSize);

    const nodes = ReceiptFormatter.formatReceipt(
      receiptData || {},
      receiptType,
      deviceName,
    );

    console.log('[PrinterService] Receipt generated:', {
      receiptType,
      paperSize,
      width: ReceiptFormatter.getWidth(),
      nodeCount: nodes.length,
      printer: deviceName,
    });

    for (let copy = 0; copy < copies; copy++) {
      await this._printNodes(nodes);
      console.log(`[PrinterService] Receipt copy ${copy + 1}/${copies} printed.`);
    }

    return {
      success: true,
      copies,
      paperSize,
      nodeCount: nodes.length,
    };
  }

  async printSalesReceipt(data) {
    return this.printReceipt(data, 'SALES');
  }

  async printPaymentReceipt(data) {
    return this.printReceipt(data, 'PAYMENT');
  }

  async printReleaseReceipt(data) {
    return this.printReceipt(data, 'RELEASE');
  }

  async printInvoiceReceipt(data) {
    return this.printReceipt(data, 'INVOICE');
  }

  async printFinalReceipt(data) {
    return this.printReceipt(data, 'FINAL');
  }

  // ============================================================
  // NODE EXECUTION
  // ============================================================

  async _printNodes(nodes) {
    if (!Array.isArray(nodes) || nodes.length === 0) {
      return;
    }

    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];

      if (!node) {
        continue;
      }

      try {
        switch (node.type) {
          // ====================================================
          // TEXT
          // ====================================================

          case 'text': {
            const style = this._convertStyle(node.style);
            const content = `${node.content || ''}\n`;

            console.log('[PrinterService] TEXT:', {
              content: node.content,
              style,
            });

            await ReactNativePosPrinter.printText(content, style);

            break;
          }

          // ====================================================
          // LINE
          // ====================================================

          case 'line': {
            const width = await this.getPaperWidth();
            const character = node.style === 'dashed' ? '-' : '=';
            const line = character.repeat(width);

            await ReactNativePosPrinter.printText(
              `${line}\n`,
              this._normalStyle('LEFT'),
            );

            break;
          }

          // ====================================================
          // QR (see class docstring for why this is image-based)
          // ====================================================

          case 'qr': {
            await this._printQRNode(node);
            break;
          }

          // ====================================================
          // FEED
          // ====================================================

          case 'feed': {
            const lines = Math.min(Math.max(Number(node.lines) || 3, 1), 10);
            await ReactNativePosPrinter.newLine(lines);
            break;
          }

          // ====================================================
          // CUT
          // ====================================================

          case 'cut': {
            await ReactNativePosPrinter.cutPaper();
            break;
          }

          // ====================================================
          // UNKNOWN
          // ====================================================

          default:
            console.warn('[PrinterService] Unsupported receipt node:', node);
        }
      } catch (error) {
        console.error(
          `[PrinterService] Failed printing node ${index} (${node.type}):`,
          error,
        );

        throw error;
      }
    }
  }

  // ============================================================
  // QR NODE
  // ============================================================

  /**
   * Prints a QR node as an image, with fallbacks so a QR/printer
   * quirk degrades gracefully instead of aborting the whole receipt.
   *
   *   1. Preferred: render a QR bitmap ourselves and printImage() it.
   *      This is the reliable, generic-ESC/POS path (see class docstring).
   *   2. Fallback: the library's native printQRCode(), in case a given
   *      device/library combination can't handle printImage but does
   *      support the native QR command correctly.
   *   3. Last resort: print the raw data as wrapped text, so the
   *      receipt still contains something the customer can act on
   *      instead of silently dropping the QR section.
   */
  async _printQRNode(node) {
    const qrData = String(node.content ?? '').trim();

    console.log('[PrinterService] QR Node Data:', {
    length: qrData.length,
    isDataUrl: qrData.startsWith('data:image/'),
    isJSON: qrData.startsWith('{') || qrData.startsWith('['),
    preview: qrData.substring(0, 200),
    full: qrData,
  });

    if (!qrData) {
      console.warn('[PrinterService] QR node has no content.');
      return;
    }

    const dotWidth = ReceiptFormatter.getDotWidth();

    // Leave room on either side so the code doesn't touch the paper edge.
    const maxWidthPx = Math.floor(dotWidth * 0.85);

    // Defensive guard: if something upstream passed an already-rendered
    // image (a data: URL) instead of raw scannable text - e.g. a screen
    // that displays the QR as <Image source={{uri: qrCode}}> also being
    // wired into the print path by mistake - do NOT try to re-encode
    // that multi-KB base64 string as new QR "content". Attempting to
    // encode thousands of characters into a QR code exceeds QR capacity
    // and is exactly what previously caused printers to fall back to
    // dumping the raw base64 string as a wall of text. Instead, print
    // the image directly: it's already a valid, correctly-sized picture.
    const dataUrlMatch = qrData.match(/^data:image\/(png|jpe?g);base64,(.+)$/i);

    if (dataUrlMatch) {
      console.warn(
        '[PrinterService] QR node content is a rendered image (data URL), not raw scan data. ' +
          'Printing the image as-is instead of re-encoding it as a new QR - ' +
          'check the caller: it should be passing the raw signed QR string (e.g. receiptData.qrCode), ' +
          'not a rendered/display QR image (e.g. receiptData.qrCodeImage).',
      );

      try {
        await ReactNativePosPrinter.printImage(dataUrlMatch[2], {
          align: 'CENTER',
          width: maxWidthPx,
        });

        await ReactNativePosPrinter.newLine(1);

        return;
      } catch (imagePrintError) {
        console.warn(
          '[PrinterService] Printing pre-rendered QR image failed, will attempt to continue with fallbacks:',
          imagePrintError,
        );
        // fall through to the normal encode/print/fallback chain below,
        // in case the image itself was malformed - the raw text fallback
        // at the end will at least surface the issue instead of crashing
        // the whole receipt.
      }
    }

    // ---- Primary: render our own bitmap and printImage() it ----
    // NOTE ON HISTORY: this and native printQRCode below have swapped
    // priority twice now, based on real evidence from testing against
    // actual hardware (this codebase can't be run/tested locally, only
    // reasoned about and simulated against mocks - the actual printer
    // is the only ground truth that matters here):
    //   1. Originally bitmap-first, because native printQRCode was
    //      seen dumping a wall of raw text - turned out to be a
    //      content bug elsewhere (it was being handed an entire
    //      rendered PNG data-URL instead of the short signed payload,
    //      which overflows QR capacity).
    //   2. After fixing that content bug, switched to native-first,
    //      reasoning that hardware-native QR rendering avoids any
    //      image resize/dither degradation printImage() might apply -
    //      and a bitmap QR (verified independently) printed but failed
    //      to scan.
    //   3. Real-world evidence then showed native printQRCode on this
    //      printer/library resolves successfully as a JS promise while
    //      producing NO physical output at all - a silent no-op. A
    //      broken-but-non-throwing native call is worse than one that
    //      throws (nothing signals the fallback chain to continue), so
    //      it cannot be trusted as primary. Bitmap-via-printImage is
    //      back to primary because it's the one path confirmed to
    //      actually produce visible printed output on this hardware -
    //      its scannability was then separately hardened (larger
    //      modules, a scannability floor - see QRCodeGenerator).
    try {
      const image = generateQRCodeImage(qrData, {
        errorCorrectionLevel: node.errorLevel || 'M',
        moduleScale: Number(node.moduleScale) || 6,
        minModuleScale: 5,
        quietZoneModules: 4,
        maxWidthPx,
        fullWidthPx: dotWidth,
      });

      if (!image) {
        throw new Error('QR bitmap generation returned no image.');
      }

      console.log('[PrinterService] Printing QR as image:', {
        length: qrData.length,
        widthPx: image.widthPx,
        moduleCount: image.moduleCount,
        scale: image.scale,
      });

      await ReactNativePosPrinter.printImage(image.base64, {
        align: 'CENTER',
        width: image.widthPx,
      });

      await ReactNativePosPrinter.newLine(1);

      return;
    } catch (imageError) {
      console.warn(
        '[PrinterService] QR bitmap image print failed, falling back to native printQRCode:',
        imageError,
      );
    }

    // ---- Fallback: native hardware QR command ----
    // Kept as a fallback (not removed) for other printers/libraries
    // where this DOES work and may render more cleanly than a
    // resized bitmap - just not trusted as primary given it silently
    // no-ops on this project's actual hardware. If printQRCode
    // resolves without producing output, this fallback is
    // indistinguishable from success and the receipt will still be
    // missing its QR - that's a limitation of a native module that
    // doesn't surface failures, not something detectable from here.
    try {
      const qrSize = Math.min(Math.max(Number(node.moduleScale) || 6, 1), 16);

      const qrAlign =
        node.align === 'center'
          ? 'CENTER'
          : node.align === 'right'
            ? 'RIGHT'
            : 'LEFT';

      const allowedErrorLevels = ['L', 'M', 'Q', 'H'];
      const requestedErrorLevel = String(node.errorLevel || 'M').toUpperCase();
      const errorLevel = allowedErrorLevels.includes(requestedErrorLevel)
        ? requestedErrorLevel
        : 'M';

      await ReactNativePosPrinter.printQRCode(qrData, {
        align: qrAlign,
        size: qrSize,
        errorLevel,
      });

      await ReactNativePosPrinter.newLine(1);

      return;
    } catch (nativeError) {
      console.warn(
        '[PrinterService] Native printQRCode also failed, falling back to text:',
        nativeError,
      );
    }

    // ---- Last resort: raw text, so the receipt isn't silently missing this ----
    try {
      const width = await this.getPaperWidth();
      const wrapped = this._wrapPlainText(qrData, width);

      await ReactNativePosPrinter.printText(
        `${'(scan unavailable - use link below)'}\n`,
        this._normalStyle('CENTER'),
      );

      for (const line of wrapped) {
        await ReactNativePosPrinter.printText(
          `${line}\n`,
          this._normalStyle('CENTER'),
        );
      }
    } catch (textError) {
      console.error(
        '[PrinterService] All QR print fallbacks failed:',
        textError,
      );
    }
  }

  _wrapPlainText(text, width) {
    const value = String(text ?? '');
    const lines = [];

    for (let i = 0; i < value.length; i += width) {
      lines.push(value.substring(i, i + width));
    }

    return lines.length ? lines : [''];
  }

  // ============================================================
  // TEXT STYLE
  // ============================================================

  _normalStyle(align = 'LEFT') {
    return {
      align,
      size: 8,
      bold: false,
      underline: false,
    };
  }

  _convertStyle(style = {}) {
    const alignMap = {
      left: 'LEFT',
      center: 'CENTER',
      right: 'RIGHT',
    };

    /**
     * IMPORTANT:
     * Physical size remains fixed for all receipt text so that
     * fixed-width formatting remains predictable. Bold is used for
     * emphasis instead of a larger font.
     */
    const sizeMap = {
      [TEXT_SIZE.NORMAL]: 8,
      [TEXT_SIZE.EMPHASIZED]: 10,
    };

    const logicalSize = Number(style.size) || TEXT_SIZE.NORMAL;

    return {
      align: alignMap[style.align] || 'LEFT',
      size: sizeMap[logicalSize] || 10,
      bold: Boolean(style.bold),
      underline: Boolean(style.underline),
    };
  }

  // ============================================================
  // TEST PRINT
  // ============================================================

  async testPrint() {
    if (!this.isConnected()) {
      throw new Error('No printer connected.');
    }

    const width = await this.getPaperWidth();

    await ReactNativePosPrinter.printText(
      `${'='.repeat(width)}\n`,
      this._normalStyle('LEFT'),
    );

    await ReactNativePosPrinter.printText('PRINTER TEST\n', {
      ...this._normalStyle('CENTER'),
      bold: true,
      size: 10,
    });

    await ReactNativePosPrinter.printText(
      'Normal text size\n',
      this._normalStyle('LEFT'),
    );

    await ReactNativePosPrinter.printText(
      'This should be normal size.\n',
      this._normalStyle('LEFT'),
    );

    await ReactNativePosPrinter.printText(
      `${'='.repeat(width)}\n`,
      this._normalStyle('LEFT'),
    );

    await ReactNativePosPrinter.newLine(3);
    await ReactNativePosPrinter.cutPaper();

    return { success: true };
  }

  /** Isolated QR-only test print, useful for verifying the QR fix on-device. */
  async testPrintQRCode() {
    if (!this.isConnected()) {
      throw new Error('No printer connected.');
    }

    const paperSize = await this.getPaperSize();
    ReceiptFormatter.setPaperSize(paperSize);

    await this._printQRNode({
      content: 'https://example.com/printer-qr-test',
      align: 'center',
      errorLevel: 'M',
      moduleScale: paperSize === '80mm' ? 8 : 6,
    });

    await ReactNativePosPrinter.newLine(3);
    await ReactNativePosPrinter.cutPaper();

    return { success: true };
  }

  // ============================================================
  // DIAGNOSTIC PRINT
  // ============================================================

  async diagnosticPrint() {
    const results = [];

    try {
      await this.testPrint();
      results.push({ method: 'testPrint', success: true });
    } catch (error) {
      results.push({
        method: 'testPrint',
        success: false,
        error: error?.message || String(error),
      });
    }

    try {
      await this.testPrintQRCode();
      results.push({ method: 'testPrintQRCode', success: true });
    } catch (error) {
      results.push({
        method: 'testPrintQRCode',
        success: false,
        error: error?.message || String(error),
      });
    }

    try {
      const diagnosticData = {
        store: {
          name: 'DIAGNOSTIC STORE',
          address: 'Printer Test Address',
          phone: '08000000000',
        },
        transaction: {
          number: 'TEST-0001',
          createdAt: new Date(),
          status: 'COMPLETED',
        },
        items: [
          {
            name: 'Test Product',
            quantity: 2,
            unitPrice: 1500,
            totalPrice: 3000,
          },
        ],
        summary: {
          subtotal: 3000,
          totalAmount: 3000,
          amountPaid: 5000,
          changeAmount: 2000,
        },
        staff: { salesAttendant: { name: 'Test User' } },
        qrCode: 'https://example.com/receipt/TEST-0001',
      };

      await this.printReceipt(diagnosticData, 'SALES');

      results.push({ method: 'formattedReceipt', success: true });
    } catch (error) {
      results.push({
        method: 'formattedReceipt',
        success: false,
        error: error?.message || String(error),
      });
    }

    console.log('[PrinterService] Diagnostics:', results);

    return results;
  }
}

export default PrinterService.getInstance();
