
// // services/bluetooth/PrinterStorage.js
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const STORAGE_KEYS = {
//   DEFAULT_PRINTER: '@printer/default',
//   PAPER_SIZE: '@printer/paper_size',
//   PRINT_QUALITY: '@printer/quality',
//   AUTO_CONNECT: '@printer/auto_connect',
// };

// class PrinterStorage {
//   /**
//    * Save default printer
//    */
//   async saveDefaultPrinter(printer) {
//     try {
//       await AsyncStorage.setItem(STORAGE_KEYS.DEFAULT_PRINTER, JSON.stringify(printer));
//       return true;
//     } catch (error) {
//       console.error('Failed to save default printer:', error);
//       return false;
//     }
//   }

//   /**
//    * Get default printer
//    */
//   async getDefaultPrinter() {
//     try {
//       const data = await AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_PRINTER);
//       return data ? JSON.parse(data) : null;
//     } catch (error) {
//       console.error('Failed to get default printer:', error);
//       return null;
//     }
//   }

//   /**
//    * Save paper size preference
//    */
//   async savePaperSize(size) {
//     try {
//       await AsyncStorage.setItem(STORAGE_KEYS.PAPER_SIZE, size);
//       return true;
//     } catch (error) {
//       console.error('Failed to save paper size:', error);
//       return false;
//     }
//   }

//   /**
//    * Get paper size preference
//    */
//   async getPaperSize() {
//     try {
//       const size = await AsyncStorage.getItem(STORAGE_KEYS.PAPER_SIZE);
//       return size || '80mm'; // Default to 80mm
//     } catch (error) {
//       console.error('Failed to get paper size:', error);
//       return '80mm';
//     }
//   }

//   /**
//    * Save print quality
//    */
//   async savePrintQuality(quality) {
//     try {
//       await AsyncStorage.setItem(STORAGE_KEYS.PRINT_QUALITY, quality);
//       return true;
//     } catch (error) {
//       console.error('Failed to save print quality:', error);
//       return false;
//     }
//   }

//   /**
//    * Get print quality
//    */
//   async getPrintQuality() {
//     try {
//       const quality = await AsyncStorage.getItem(STORAGE_KEYS.PRINT_QUALITY);
//       return quality || 'normal';
//     } catch (error) {
//       console.error('Failed to get print quality:', error);
//       return 'normal';
//     }
//   }

//   /**
//    * Save auto-connect preference
//    */
//   async saveAutoConnect(enabled) {
//     try {
//       await AsyncStorage.setItem(STORAGE_KEYS.AUTO_CONNECT, JSON.stringify(enabled));
//       return true;
//     } catch (error) {
//       console.error('Failed to save auto-connect:', error);
//       return false;
//     }
//   }

//   /**
//    * Get auto-connect preference
//    */
//   async getAutoConnect() {
//     try {
//       const data = await AsyncStorage.getItem(STORAGE_KEYS.AUTO_CONNECT);
//       return data ? JSON.parse(data) : true;
//     } catch (error) {
//       console.error('Failed to get auto-connect:', error);
//       return true;
//     }
//   }

//   /**
//    * Clear all printer settings
//    */
//   async clearAllSettings() {
//     try {
//       await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
//       return true;
//     } catch (error) {
//       console.error('Failed to clear settings:', error);
//       return false;
//     }
//   }
// }

// export default new PrinterStorage();





























// services/bluetooth/PrinterStorage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  DEFAULT_PRINTER: '@printer/default',
  PAPER_SIZE: '@printer/paper_size',
  AUTO_CONNECT: '@printer/auto_connect',
  PRINT_COPIES: '@printer/print_copies',
  LAST_PRINTER: '@printer/last',
};

const DEFAULT_SETTINGS = {
  paperSize: '58mm',
  autoConnect: true,
  printCopies: 1,
};

/**
 * Printer Storage - Persistent storage for printer settings
 */
class PrinterStorage {
  static instance = null;

  constructor() {
    if (PrinterStorage.instance) {
      return PrinterStorage.instance;
    }
    PrinterStorage.instance = this;
  }

  static getInstance() {
    if (!PrinterStorage.instance) {
      PrinterStorage.instance = new PrinterStorage();
    }
    return PrinterStorage.instance;
  }

  /**
   * Save default printer
   */
  async saveDefaultPrinter(printer) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DEFAULT_PRINTER, JSON.stringify(printer));
    } catch (error) {
      console.error('Failed to save default printer:', error);
    }
  }

  /**
   * Get default printer
   */
  async getDefaultPrinter() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_PRINTER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get default printer:', error);
      return null;
    }
  }

  /**
   * Remove default printer
   */
  async removeDefaultPrinter() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.DEFAULT_PRINTER);
    } catch (error) {
      console.error('Failed to remove default printer:', error);
    }
  }

  /**
   * Save last used printer
   */
  async saveLastPrinter(printer) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_PRINTER, JSON.stringify(printer));
    } catch (error) {
      console.error('Failed to save last printer:', error);
    }
  }

  /**
   * Get last used printer
   */
  async getLastPrinter() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_PRINTER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get last printer:', error);
      return null;
    }
  }

  /**
   * Save paper size
   */
  async savePaperSize(size) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PAPER_SIZE, size);
    } catch (error) {
      console.error('Failed to save paper size:', error);
    }
  }

  /**
   * Get paper size
   */
  async getPaperSize() {
    try {
      const size = await AsyncStorage.getItem(STORAGE_KEYS.PAPER_SIZE);
      return size || DEFAULT_SETTINGS.paperSize;
    } catch (error) {
      console.error('Failed to get paper size:', error);
      return DEFAULT_SETTINGS.paperSize;
    }
  }

  /**
   * Save auto-connect preference
   */
  async saveAutoConnect(enabled) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTO_CONNECT, JSON.stringify(enabled));
    } catch (error) {
      console.error('Failed to save auto-connect:', error);
    }
  }

  /**
   * Get auto-connect preference
   */
  async getAutoConnect() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.AUTO_CONNECT);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS.autoConnect;
    } catch (error) {
      console.error('Failed to get auto-connect:', error);
      return DEFAULT_SETTINGS.autoConnect;
    }
  }

  /**
   * Save print copies
   */
  async savePrintCopies(copies) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PRINT_COPIES, String(copies));
    } catch (error) {
      console.error('Failed to save print copies:', error);
    }
  }

  /**
   * Get print copies
   */
  async getPrintCopies() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PRINT_COPIES);
      return data ? parseInt(data, 10) : DEFAULT_SETTINGS.printCopies;
    } catch (error) {
      console.error('Failed to get print copies:', error);
      return DEFAULT_SETTINGS.printCopies;
    }
  }

  /**
   * Get all settings
   */
  async getSettings() {
    const [paperSize, autoConnect, printCopies] = await Promise.all([
      this.getPaperSize(),
      this.getAutoConnect(),
      this.getPrintCopies(),
    ]);

    return {
      paperSize,
      autoConnect,
      printCopies,
    };
  }

  /**
   * Clear all settings
   */
  async clearAll() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Failed to clear settings:', error);
    }
  }
}

// Export singleton instance
export default PrinterStorage.getInstance();