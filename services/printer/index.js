// services/printer/index.js
/**
 * Universal Bluetooth Printer Module Exports
 * Compatible with DATECS DPP-250, TSC, and generic ESC/POS thermal printers
 */

export { default as BluetoothManager } from './BluetoothManager';
export { default as PrinterService } from './PrinterService';
export { default as ReceiptFormatter, PRINTER_TYPES } from './ReceiptFormatter';
export { default as PrinterStorage } from './PrinterStorage';

// Export utility functions
export {
  center,
  right,
  line,
  money,
  truncate,
} from './PrinterUtils';

// Export constants
export {
  PAPER_WIDTH,
  ALIGN,
  FONT,
  PRINTER_STATUS,
  DEFAULT_SETTINGS,
} from './PrinterConstants';

// Default export
export { default } from './PrinterService';