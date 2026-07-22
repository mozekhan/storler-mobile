// services/bluetoothPrinterService.js
import * as Bluetooth from 'expo-bluetooth';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class BluetoothPrinterService {
  constructor() {
    this.device = null;
    this.isConnected = false;
    this.characteristic = null;
    this.serviceUUID = '000018f0-0000-1000-8000-00805f9b34fb'; // Standard printer service
    this.characteristicUUID = '00002af1-0000-1000-8000-00805f9b34fb'; // Standard printer characteristic
  }

  /**
   * Initialize Bluetooth and request permissions
   */
  async initialize() {
    try {
      // Check if Bluetooth is available
      const isAvailable = await Bluetooth.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Bluetooth is not available on this device');
        return false;
      }

      // Request permissions
      const { status } = await Bluetooth.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Bluetooth permission is required to print');
        return false;
      }

      // Check if Bluetooth is enabled
      const isEnabled = await Bluetooth.isEnabledAsync();
      if (!isEnabled) {
        Alert.alert(
          'Bluetooth Disabled',
          'Please enable Bluetooth in settings',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Bluetooth.openBluetoothSettings() }
          ]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Bluetooth initialization error:', error);
      return false;
    }
  }

  /**
   * Get paired devices
   */
  async getPairedDevices() {
    try {
      const devices = await Bluetooth.getPairedDevicesAsync();
      
      // Filter for printer devices
      const printerDevices = devices.filter(device => 
        device.name && (
          device.name.toLowerCase().includes('printer') ||
          device.name.toLowerCase().includes('thermal') ||
          device.name.toLowerCase().includes('pos') ||
          device.name.toLowerCase().includes('receipt') ||
          device.name.toLowerCase().includes('bluetooth')
        )
      );
      
      return printerDevices.length > 0 ? printerDevices : devices;
    } catch (error) {
      console.error('Failed to get paired devices:', error);
      return [];
    }
  }

  /**
   * Scan for nearby devices
   */
  async scanForDevices(timeout = 5000) {
    try {
      const devices = await Bluetooth.scanForDevicesAsync({
        timeout,
        allowDuplicates: false,
      });
      
      // Filter for printer devices
      return devices.filter(device => 
        device.name && (
          device.name.toLowerCase().includes('printer') ||
          device.name.toLowerCase().includes('thermal') ||
          device.name.toLowerCase().includes('pos') ||
          device.name.toLowerCase().includes('receipt')
        )
      );
    } catch (error) {
      console.error('Scan error:', error);
      return [];
    }
  }

  /**
   * Connect to a device
   */
  async connectDevice(deviceId) {
    try {
      // Disconnect any existing connection
      if (this.isConnected) {
        await this.disconnectDevice();
      }

      // Connect to device
      this.device = await Bluetooth.connectToDeviceAsync(deviceId);
      
      // Discover services and characteristics
      const services = await this.device.discoverServicesAsync();
      
      // Find printer service and characteristic
      for (const service of services) {
        if (service.uuid === this.serviceUUID || service.uuid.includes('18f0')) {
          const characteristics = await service.getCharacteristicsAsync();
          for (const char of characteristics) {
            if (char.uuid === this.characteristicUUID || char.properties.write) {
              this.characteristic = char;
              break;
            }
          }
        }
      }

      // If not found, try the first writable characteristic
      if (!this.characteristic) {
        for (const service of services) {
          const characteristics = await service.getCharacteristicsAsync();
          for (const char of characteristics) {
            if (char.properties.write) {
              this.characteristic = char;
              break;
            }
          }
          if (this.characteristic) break;
        }
      }

      if (!this.characteristic) {
        throw new Error('No writable characteristic found for printing');
      }

      this.isConnected = true;
      
      // Save as default printer
      await AsyncStorage.setItem('default_printer', deviceId);
      
      return true;
    } catch (error) {
      console.error('Connection error:', error);
      this.isConnected = false;
      this.device = null;
      this.characteristic = null;
      throw error;
    }
  }

  /**
   * Disconnect from device
   */
  async disconnectDevice() {
    try {
      if (this.device) {
        await this.device.disconnectAsync();
      }
      this.isConnected = false;
      this.device = null;
      this.characteristic = null;
      return true;
    } catch (error) {
      console.error('Disconnect error:', error);
      return false;
    }
  }

  /**
   * Write data to printer
   */
  async writeToPrinter(data) {
    if (!this.isConnected || !this.characteristic) {
      throw new Error('Printer not connected');
    }

    try {
      await this.characteristic.writeAsync(data);
      return true;
    } catch (error) {
      console.error('Write error:', error);
      throw error;
    }
  }

  /**
   * Print text with ESC/POS commands
   */
  async printText(text) {
    const commands = this.buildESCCommands(text);
    await this.writeToPrinter(commands);
    return true;
  }

  /**
   * Build ESC/POS commands from text
   */
  buildESCCommands(text) {
    const commands = [];
    
    // Initialize printer
    commands.push(0x1B, 0x40);
    
    // Set encoding - UTF-8
    commands.push(0x1B, 0x74, 0x10);
    
    // Convert text to bytes
    const textBytes = this.stringToBytes(text);
    commands.push(...textBytes);
    
    // Feed paper
    commands.push(0x0A, 0x0A, 0x0A);
    
    // Cut paper
    commands.push(0x1D, 0x56, 0x00);
    
    return new Uint8Array(commands);
  }

  /**
   * Convert string to bytes with proper encoding
   */
  stringToBytes(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code < 128) {
        bytes.push(code);
      } else {
        // UTF-8 encoding for non-ASCII characters
        if (code < 0x800) {
          bytes.push(0xC0 | (code >> 6), 0x80 | (code & 0x3F));
        } else {
          bytes.push(0xE0 | (code >> 12), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
        }
      }
    }
    return bytes;
  }

  /**
   * Print sales receipt
   */
  async printSalesReceipt(receiptData) {
    const text = this.formatSalesReceipt(receiptData);
    return await this.printText(text);
  }

  /**
   * Print payment receipt
   */
  async printPaymentReceipt(receiptData) {
    const text = this.formatPaymentReceipt(receiptData);
    return await this.printText(text);
  }

  /**
   * Print release receipt
   */
  async printReleaseReceipt(receiptData) {
    const text = this.formatReleaseReceipt(receiptData);
    return await this.printText(text);
  }

  /**
   * Format sales receipt
   */
  formatSalesReceipt(data) {
    const { store, transaction, items, summary, staff } = data;
    const line = '═'.repeat(40);
    const thinLine = '─'.repeat(40);
    
    let text = '';
    
    // Header
    text += line + '\n';
    text += this.centerText(store?.name || 'STORE') + '\n';
    text += this.centerText(store?.address || '') + '\n';
    if (store?.phone) text += this.centerText('Tel: ' + store.phone) + '\n';
    if (store?.email) text += this.centerText('Email: ' + store.email) + '\n';
    text += thinLine + '\n';
    
    // Title
    text += this.centerText('SALES RECEIPT') + '\n';
    text += thinLine + '\n';
    
    // Transaction Info
    text += this.formatLine('Transaction', transaction?.number || 'N/A') + '\n';
    text += this.formatLine('Date', this.formatDate(transaction?.createdAt)) + '\n';
    text += this.formatLine('Status', transaction?.status || 'N/A') + '\n';
    text += thinLine + '\n';
    
    // Items
    text += this.formatHeaders('Item', 'Qty', 'Price', 'Total') + '\n';
    text += thinLine + '\n';
    
    for (const item of (items || [])) {
      const name = item.name || 'Item';
      const qty = item.quantity || 0;
      const price = item.unitPrice || 0;
      const total = item.totalPrice || (qty * price);
      text += this.formatItem(name, qty, price, total) + '\n';
      if (item.sku) {
        text += `  SKU: ${item.sku}\n`;
      }
    }
    
    text += thinLine + '\n';
    
    // Totals
    text += this.formatLine('Subtotal', this.formatCurrency(summary?.subtotal || 0)) + '\n';
    text += this.formatLine('Tax', this.formatCurrency(summary?.taxTotal || 0)) + '\n';
    if (summary?.discountTotal > 0) {
      text += this.formatLine('Discount', '-' + this.formatCurrency(summary.discountTotal)) + '\n';
    }
    text += thinLine + '\n';
    text += this.formatLine('TOTAL', this.formatCurrency(summary?.totalAmount || 0), true) + '\n';
    text += thinLine + '\n';
    
    // Staff
    if (staff?.salesAttendant) {
      text += this.formatLine('Sales', staff.salesAttendant.name) + '\n';
    }
    
    // Footer
    text += thinLine + '\n';
    text += this.centerText('Thank you for your business!') + '\n';
    text += this.centerText('Scan QR code for payment') + '\n';
    text += line + '\n';
    
    return text;
  }

  /**
   * Format payment receipt
   */
  formatPaymentReceipt(data) {
    const { store, transaction, summary, staff, payment } = data;
    const line = '═'.repeat(40);
    const thinLine = '─'.repeat(40);
    
    let text = '';
    
    text += line + '\n';
    text += this.centerText(store?.name || 'STORE') + '\n';
    text += this.centerText(store?.address || '') + '\n';
    if (store?.phone) text += this.centerText('Tel: ' + store.phone) + '\n';
    text += thinLine + '\n';
    
    text += this.centerText('PAYMENT RECEIPT') + '\n';
    text += thinLine + '\n';
    
    text += this.formatLine('Transaction', transaction?.number || 'N/A') + '\n';
    text += this.formatLine('Date', this.formatDate(transaction?.createdAt)) + '\n';
    text += this.formatLine('Payment Method', payment?.method || 'N/A') + '\n';
    if (payment?.reference) {
      text += this.formatLine('Reference', payment.reference) + '\n';
    }
    text += thinLine + '\n';
    
    text += this.formatLine('Total Amount', this.formatCurrency(summary?.totalAmount || 0)) + '\n';
    text += this.formatLine('Amount Paid', this.formatCurrency(summary?.amountPaid || 0)) + '\n';
    if (summary?.changeAmount > 0) {
      text += this.formatLine('Change', this.formatCurrency(summary.changeAmount)) + '\n';
    }
    text += thinLine + '\n';
    
    if (staff?.financeAttendant) {
      text += this.formatLine('Cashier', staff.financeAttendant.name) + '\n';
    }
    
    text += thinLine + '\n';
    text += this.centerText('Payment Confirmed') + '\n';
    text += this.centerText('Scan QR code for warehouse release') + '\n';
    text += line + '\n';
    
    return text;
  }

  /**
   * Format release receipt
   */
  formatReleaseReceipt(data) {
    const { store, transaction, items, releasedItems, summary, staff, invoice } = data;
    const line = '═'.repeat(40);
    const thinLine = '─'.repeat(40);
    
    let text = '';
    
    text += line + '\n';
    text += this.centerText(store?.name || 'STORE') + '\n';
    text += this.centerText(store?.address || '') + '\n';
    if (store?.phone) text += this.centerText('Tel: ' + store.phone) + '\n';
    text += thinLine + '\n';
    
    text += this.centerText('RELEASE / INVOICE') + '\n';
    text += thinLine + '\n';
    
    text += this.formatLine('Transaction', transaction?.number || 'N/A') + '\n';
    text += this.formatLine('Invoice #', invoice?.number || 'N/A') + '\n';
    text += this.formatLine('Date', this.formatDate(transaction?.createdAt)) + '\n';
    text += thinLine + '\n';
    
    const displayItems = releasedItems?.length > 0 ? releasedItems : items;
    text += this.formatHeaders('Item', 'Qty', 'Price', 'Total') + '\n';
    text += thinLine + '\n';
    
    for (const item of (displayItems || [])) {
      const name = item.productName || item.name || 'Item';
      const qty = item.quantityReleased || item.quantity || 0;
      const price = item.unitPrice || 0;
      const total = item.totalPrice || (qty * price);
      text += this.formatItem(name, qty, price, total) + '\n';
    }
    
    text += thinLine + '\n';
    text += this.formatLine('Total', this.formatCurrency(summary?.totalAmount || 0)) + '\n';
    text += thinLine + '\n';
    
    if (staff?.warehouseStaff) {
      text += this.formatLine('Released By', staff.warehouseStaff.name) + '\n';
    }
    
    text += thinLine + '\n';
    text += this.centerText('Items Released Successfully') + '\n';
    text += this.centerText('Thank you for your business!') + '\n';
    text += line + '\n';
    
    return text;
  }

  /**
   * Print QR Code (as text fallback)
   */
  async printQRCode(qrData) {
    const text = '\nQR Code:\n' + qrData + '\n\n';
    await this.printText(text);
    return true;
  }

  /**
   * Cut paper
   */
  async cutPaper() {
    const cutCommand = new Uint8Array([0x1D, 0x56, 0x00]);
    await this.writeToPrinter(cutCommand);
    return true;
  }

  /**
   * Utility: Center text
   */
  centerText(text, width = 40) {
    const trimmed = text.trim();
    if (trimmed.length >= width) return trimmed;
    const padding = Math.floor((width - trimmed.length) / 2);
    return ' '.repeat(padding) + trimmed;
  }

  /**
   * Utility: Format line
   */
  formatLine(label, value, bold = false) {
    const maxLabelWidth = 16;
    const paddedLabel = label.padEnd(maxLabelWidth);
    return paddedLabel + ' : ' + String(value || '');
  }

  /**
   * Utility: Format headers
   */
  formatHeaders(col1, col2, col3, col4) {
    const c1 = col1.padEnd(18);
    const c2 = col2.padStart(4);
    const c3 = col3.padStart(8);
    const c4 = col4.padStart(10);
    return c1 + c2 + c3 + c4;
  }

  /**
   * Utility: Format item row
   */
  formatItem(name, qty, price, total) {
    const maxNameLen = 18;
    const truncatedName = name.length > maxNameLen 
      ? name.substring(0, maxNameLen - 1) + '…' 
      : name.padEnd(maxNameLen);
    const qtyStr = String(qty).padStart(4);
    const priceStr = this.formatCurrency(price).padStart(8);
    const totalStr = this.formatCurrency(total).padStart(10);
    return truncatedName + qtyStr + priceStr + totalStr;
  }

  /**
   * Utility: Format currency
   */
  formatCurrency(amount) {
    return '$' + Number(amount || 0).toFixed(2);
  }

  /**
   * Utility: Format date
   */
  formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleString();
  }

  /**
   * Check connection status
   */
  isConnected() {
    return this.isConnected;
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      device: this.device?.id || null,
      deviceName: this.device?.name || null,
    };
  }
}

export default new BluetoothPrinterService();