
// /**
//  * Low-level ESC/POS Printer Interface
//  * Direct ESC/POS command builder for maximum compatibility
//  */

// import { Platform } from 'react-native';
// import BluetoothManager from './BluetoothManager';
// import PrinterStorage from './PrinterStorage';

// const { NativeModules } = require('react-native');
// const RNThermalPrinter = NativeModules?.RNThermalPrinter;

// const ESC = 0x1B;
// const GS = 0x1D;
// const LF = 0x0A;

// class EscPosBuilder {
//   constructor() {
//     this.bytes = [];
//   }

//   init() {
//     this.bytes.push(ESC, 0x40);
//     return this;
//   }

//   lineSpacing(n = 30) {
//     this.bytes.push(ESC, 0x33, n);
//     return this;
//   }

//   align(mode = 0) {
//     this.bytes.push(ESC, 0x61, mode);
//     return this;
//   }

//   bold(on = true) {
//     this.bytes.push(ESC, 0x45, on ? 0x01 : 0x00);
//     return this;
//   }

//   size(scale = 0) {
//     this.bytes.push(GS, 0x21, scale);
//     return this;
//   }

//   underline(mode = 0) {
//     this.bytes.push(ESC, 0x2D, mode);
//     return this;
//   }

//   feedLines(n = 1) {
//     this.bytes.push(ESC, 0x64, n);
//     return this;
//   }

//   feedDots(n = 30) {
//     this.bytes.push(ESC, 0x4A, n);
//     return this;
//   }

//   cut(partial = true) {
//     this.bytes.push(GS, 0x56, partial ? 0x42 : 0x41, 0x03);
//     return this;
//   }

//   openDrawer() {
//     this.bytes.push(ESC, 0x70, 0x00, 0x37, 0x37);
//     return this;
//   }

//   text(str) {
//     for (let i = 0; i < str.length; i++) {
//       const code = str.charCodeAt(i);
//       if (code >= 0x20 && code <= 0x7E) {
//         this.bytes.push(code);
//       } else if (code === 0x0A || code === 0x0D) {
//         this.bytes.push(code);
//       } else {
//         this.bytes.push(0x3F);
//       }
//     }
//     return this;
//   }

//   // Print QR code using GS ( k (model 2 store/size/EC/print).
//   // Deliberately does NOT use GS W / GS L (page-mode print-area commands) -
//   // those are the ones that hang/garble output on many clone SPP printers.
//   qrCode(data, size = 4) {
//     const str = String(data || '');
//     const len = str.length + 3;
//     const pL = len & 0xFF;
//     const pH = (len >> 8) & 0xFF;

//     // Select model 2
//     this.bytes.push(GS, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00);
//     // Set module size
//     this.bytes.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, size);
//     // Set error correction level (48 = L)
//     this.bytes.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, 0x30);
//     // Store data
//     this.bytes.push(GS, 0x28, 0x6B, pL, pH, 0x31, 0x50, 0x30);
//     for (let i = 0; i < str.length; i++) {
//       this.bytes.push(str.charCodeAt(i) & 0xFF);
//     }
//     // Print stored QR
//     this.bytes.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30);
//     return this;
//   }

//   newline() {
//     this.bytes.push(LF);
//     return this;
//   }

//   getBytes() {
//     return [...this.bytes];
//   }

//   getBuffer() {
//     return Buffer.from(this.bytes);
//   }
// }

// class EscPosPrinter {
//   async getPaperWidth() {
//     const paperSize = await PrinterStorage.getPaperSize();
//     return paperSize === '80mm' ? 48 : 32;
//   }

//   async sendRaw(bytes, options = {}) {
//     if (!BluetoothManager.isConnected()) {
//       throw new Error('Printer not connected');
//     }
//     if (!RNThermalPrinter) {
//       throw new Error('RNThermalPrinter native module not available');
//     }

//     const device = BluetoothManager.getCurrentDevice();
//     const address = device?.address ? 
//       (device.address.startsWith('bt:') || device.address.startsWith('ble:') ? device.address : `bt:${device.address}`) 
//       : '';

//     try {
//       const result = await RNThermalPrinter.printRaw(
//         address,
//         bytes,
//         { keepAlive: false, timeout: options.timeout || 15000 }
//       );
//       return result;
//     } catch (error) {
//       console.error('Raw print error:', error);
//       throw error;
//     }
//   }

//   async printSimpleReceipt(lines) {
//     const builder = new EscPosBuilder();
//     const width = await this.getPaperWidth();

//     builder.init().lineSpacing(30);

//     for (const line of lines) {
//       const { text, align = 'left', bold = false, size = 0, newline: nl = true } = line;
//       builder.align(align === 'center' ? 1 : align === 'right' ? 2 : 0);
//       builder.bold(bold);
//       builder.size(size);
//       builder.text(text);
//       if (nl) builder.newline();
//     }

//     builder.feedLines(3).cut(true);
//     return this.sendRaw(builder.getBytes());
//   }

//   /**
//    * Convert ReceiptFormatter's document nodes ({type:'text'|'line'|'feed'|'cut'|'qr'})
//    * into raw ESC/POS bytes using ONLY the safe, universally-supported commands
//    * in EscPosBuilder. This intentionally never touches GS W / GS L (page-mode
//    * print-area/margin commands) which is what the vendor library's
//    * compileDocument() sends and what causes clone/SPP printers to silently
//    * drop the rest of the job.
//    */
//   nodesToBytes(nodes, width) {
//     const builder = new EscPosBuilder();
//     builder.init().lineSpacing(30);

//     for (const node of nodes || []) {
//       switch (node.type) {
//         case 'text': {
//           const style = node.style || {};
//           const align = style.align === 'center' ? 1 : style.align === 'right' ? 2 : 0;
//           const scale = style.size === 2 ? 0x11 : style.size === 3 ? 0x22 : 0x00;
//           builder
//             .align(align)
//             .bold(!!style.bold)
//             .size(scale)
//             .text(node.content || '')
//             .newline()
//             .size(0x00)
//             .bold(false)
//             .align(0);
//           break;
//         }
//         case 'line': {
//           const ch = node.style === 'dashed' ? '-' : '-';
//           builder.align(0).text(ch.repeat(width)).newline();
//           break;
//         }
//         case 'qr': {
//           builder.align(1);
//           try {
//             builder.qrCode(node.content, node.size || 4);
//           } catch (e) {
//             // If the printer/library ever chokes on QR bytes, degrade to text
//             // instead of losing the whole job.
//             builder.text(String(node.content || '').substring(0, width));
//           }
//           builder.newline().align(0);
//           break;
//         }
//         case 'feed': {
//           builder.feedLines(node.lines || 3);
//           break;
//         }
//         case 'cut': {
//           builder.cut(true);
//           break;
//         }
//         default:
//           break; // ignore unknown/'raw' node types - nothing safe to do with them
//       }
//     }

//     return builder.getBytes();
//   }

//   /**
//    * High-level, safe print path for a formatted receipt. Use this instead of
//    * the vendor library's printReceipt()/compileDocument() - it never emits
//    * page-mode-only commands, so it is compatible with generic/clone SPP
//    * printers (e.g. devices reporting as "BT-SPP") that don't implement Page
//    * Mode.
//    */
//   async printFormattedReceipt(nodes, options = {}) {
//     const paperSize = await PrinterStorage.getPaperSize();
//     const width = options.width || (paperSize === '80mm' ? 48 : 32);
//     const bytes = this.nodesToBytes(nodes, width);
//     return this.sendRaw(bytes, options);
//   }

//   async printTest() {
//     const builder = new EscPosBuilder();
//     builder
//       .init()
//       .lineSpacing(30)
//       .align(1).bold(true).size(0x11)
//       .text('TEST PRINT').newline()
//       .size(0).bold(false)
//       .text('----------------').newline()
//       .align(0)
//       .text('Line 1: Normal text').newline()
//       .text('Line 2: Normal text').newline()
//       .align(1)
//       .text('Centered text').newline()
//       .align(2)
//       .text('Right aligned').newline()
//       .align(0)
//       .text('----------------').newline()
//       .feedLines(4)
//       .cut(true);

//     return this.sendRaw(builder.getBytes());
//   }
// }

// export { EscPosBuilder };
// export default new EscPosPrinter();











































// services/bluetooth/EscPosPrinter.js
/**
 * Low-level ESC/POS Printer Interface
 * Direct ESC/POS command builder for maximum compatibility.
 *
 * Transport is now react-native-thermal-receipt-printer-image-qr (via
 * BluetoothManager), not the vendor @finan-me/react-native-thermal-printer
 * native module. Command construction (this file) was never the confirmed
 * problem - the printers work fine with other apps - so it's kept as-is,
 * just rewired to a transport that's known to work with generic ESC/POS
 * SPP printers.
 */

import BluetoothManager from './BluetoothManager';
import PrinterStorage from './PrinterStorage';

const ESC = 0x1B;
const GS = 0x1D;
const LF = 0x0A;

class EscPosBuilder {
  constructor() {
    this.bytes = [];
  }

  init() {
    this.bytes.push(ESC, 0x40);
    return this;
  }

  lineSpacing(n = 30) {
    this.bytes.push(ESC, 0x33, n);
    return this;
  }

  align(mode = 0) {
    this.bytes.push(ESC, 0x61, mode);
    return this;
  }

  bold(on = true) {
    this.bytes.push(ESC, 0x45, on ? 0x01 : 0x00);
    return this;
  }

  size(scale = 0) {
    this.bytes.push(GS, 0x21, scale);
    return this;
  }

  underline(mode = 0) {
    this.bytes.push(ESC, 0x2D, mode);
    return this;
  }

  feedLines(n = 1) {
    this.bytes.push(ESC, 0x64, n);
    return this;
  }

  feedDots(n = 30) {
    this.bytes.push(ESC, 0x4A, n);
    return this;
  }

  cut(partial = true) {
    this.bytes.push(GS, 0x56, partial ? 0x42 : 0x41, 0x03);
    return this;
  }

  openDrawer() {
    this.bytes.push(ESC, 0x70, 0x00, 0x37, 0x37);
    return this;
  }

  text(str) {
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code >= 0x20 && code <= 0x7E) {
        this.bytes.push(code);
      } else if (code === 0x0A || code === 0x0D) {
        this.bytes.push(code);
      } else {
        this.bytes.push(0x3F);
      }
    }
    return this;
  }

  // Print QR code using GS ( k (model 2 store/size/EC/print).
  // Deliberately does NOT use GS W / GS L (page-mode print-area commands) -
  // those are the ones that hang/garble output on many clone SPP printers.
  qrCode(data, size = 4) {
    const str = String(data || '');
    const len = str.length + 3;
    const pL = len & 0xFF;
    const pH = (len >> 8) & 0xFF;

    // Select model 2
    this.bytes.push(GS, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00);
    // Set module size
    this.bytes.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, size);
    // Set error correction level (48 = L)
    this.bytes.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, 0x30);
    // Store data
    this.bytes.push(GS, 0x28, 0x6B, pL, pH, 0x31, 0x50, 0x30);
    for (let i = 0; i < str.length; i++) {
      this.bytes.push(str.charCodeAt(i) & 0xFF);
    }
    // Print stored QR
    this.bytes.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30);
    return this;
  }

  newline() {
    this.bytes.push(LF);
    return this;
  }

  getBytes() {
    return [...this.bytes];
  }
}

class EscPosPrinter {
  async getPaperWidth() {
    const paperSize = await PrinterStorage.getPaperSize();
    return paperSize === '80mm' ? 48 : 32;
  }

  async sendRaw(bytes, options = {}) {
    if (!BluetoothManager.isConnected()) {
      throw new Error('Printer not connected');
    }

    try {
      const result = await BluetoothManager.printRawBytes(bytes);
      return result;
    } catch (error) {
      console.error('Raw print error:', error);
      throw error;
    }
  }

  async printSimpleReceipt(lines) {
    const builder = new EscPosBuilder();
    const width = await this.getPaperWidth();

    builder.init().lineSpacing(30);

    for (const line of lines) {
      const { text, align = 'left', bold = false, size = 0, newline: nl = true } = line;
      builder.align(align === 'center' ? 1 : align === 'right' ? 2 : 0);
      builder.bold(bold);
      builder.size(size);
      builder.text(text);
      if (nl) builder.newline();
    }

    builder.feedLines(3).cut(true);
    return this.sendRaw(builder.getBytes());
  }

  /**
   * Convert ReceiptFormatter's document nodes ({type:'text'|'line'|'feed'|'cut'|'qr'})
   * into raw ESC/POS bytes using ONLY the safe, universally-supported commands
   * in EscPosBuilder. This intentionally never touches GS W / GS L (page-mode
   * print-area/margin commands) which is what the vendor library's
   * compileDocument() sends and what causes clone/SPP printers to silently
   * drop the rest of the job.
   */
  nodesToBytes(nodes, width) {
    const builder = new EscPosBuilder();
    builder.init().lineSpacing(30);

    for (const node of nodes || []) {
      switch (node.type) {
        case 'text': {
          const style = node.style || {};
          const align = style.align === 'center' ? 1 : style.align === 'right' ? 2 : 0;
          const scale = style.size === 2 ? 0x11 : style.size === 3 ? 0x22 : 0x00;
          builder
            .align(align)
            .bold(!!style.bold)
            .size(scale)
            .text(node.content || '')
            .newline()
            .size(0x00)
            .bold(false)
            .align(0);
          break;
        }
        case 'line': {
          const ch = node.style === 'dashed' ? '-' : '-';
          builder.align(0).text(ch.repeat(width)).newline();
          break;
        }
        case 'qr': {
          builder.align(1);
          try {
            builder.qrCode(node.content, node.size || 4);
          } catch (e) {
            // If the printer/library ever chokes on QR bytes, degrade to text
            // instead of losing the whole job.
            builder.text(String(node.content || '').substring(0, width));
          }
          builder.newline().align(0);
          break;
        }
        case 'feed': {
          builder.feedLines(node.lines || 3);
          break;
        }
        case 'cut': {
          builder.cut(true);
          break;
        }
        default:
          break; // ignore unknown/'raw' node types - nothing safe to do with them
      }
    }

    return builder.getBytes();
  }

  /**
   * High-level, safe print path for a formatted receipt. Use this instead of
   * the vendor library's printReceipt()/compileDocument() - it never emits
   * page-mode-only commands, so it is compatible with generic/clone SPP
   * printers (e.g. devices reporting as "BT-SPP") that don't implement Page
   * Mode.
   */
  async printFormattedReceipt(nodes, options = {}) {
    const paperSize = await PrinterStorage.getPaperSize();
    const width = options.width || (paperSize === '80mm' ? 48 : 32);
    const bytes = this.nodesToBytes(nodes, width);
    return this.sendRaw(bytes, options);
  }

  async printTest() {
    const builder = new EscPosBuilder();
    builder
      .init()
      .lineSpacing(30)
      .align(1).bold(true).size(0x11)
      .text('TEST PRINT').newline()
      .size(0).bold(false)
      .text('----------------').newline()
      .align(0)
      .text('Line 1: Normal text').newline()
      .text('Line 2: Normal text').newline()
      .align(1)
      .text('Centered text').newline()
      .align(2)
      .text('Right aligned').newline()
      .align(0)
      .text('----------------').newline()
      .feedLines(4)
      .cut(true);

    return this.sendRaw(builder.getBytes());
  }
}

export { EscPosBuilder };
export default new EscPosPrinter();
