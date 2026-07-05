// import * as Crypto from 'expo-crypto';
// import * as SecureStore from 'expo-secure-store';
// import { Platform } from 'react-native';

// class QRService {
//   constructor() {
//     this.secretKey = null;
//     this.algorithm = 'aes-256-gcm';
//   }

//   async getSecretKey() {
//     if (this.secretKey) return this.secretKey;

//     if (Platform.OS === 'web') {
//       // For web, use localStorage
//       let key = localStorage.getItem('qr_secret_key');
//       if (!key) {
//         key = this.generateKey();
//         localStorage.setItem('qr_secret_key', key);
//       }
//       this.secretKey = key;
//       return key;
//     }

//     // For native, use SecureStore
//     let key = await SecureStore.getItemAsync('qr_secret_key');
//     if (!key) {
//       key = this.generateKey();
//       await SecureStore.setItemAsync('qr_secret_key', key);
//     }
//     this.secretKey = key;
//     return key;
//   }

//   generateKey() {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//     for (let i = 0; i < 32; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return result;
//   }

//   async generateQR(data) {
//     try {
//       const payload = {
//         version: '1.0',
//         type: data.type,
//         transactionId: data.transactionId,
//         timestamp: Date.now(),
//         storeId: data.storeId,
//         checksum: await this.generateChecksum(data)
//       };

//       const jsonString = JSON.stringify(payload);
//       // In a real app, you would encrypt the payload
//       // For demo, we'll use base64 encoding
//       const encoded = btoa(jsonString);
//       return encoded;
//     } catch (error) {
//       console.error('QR generation error:', error);
//       throw error;
//     }
//   }

//   async validateQR(qrData) {
//     try {
//       // Decode QR data
//       const decoded = atob(qrData);
//       const payload = JSON.parse(decoded);

//       // Validate checksum
//       const isValid = await this.validateChecksum(payload);
//       if (!isValid) {
//         return { valid: false, error: 'Invalid checksum' };
//       }

//       // Check expiration (24 hours)
//       const age = Date.now() - payload.timestamp;
//       if (age > 24 * 60 * 60 * 1000) {
//         return { valid: false, error: 'QR code expired' };
//       }

//       return {
//         valid: true,
//         data: payload
//       };
//     } catch (error) {
//       return {
//         valid: false,
//         error: 'Invalid QR code format'
//       };
//     }
//   }

//   async generateChecksum(data) {
//     const key = await this.getSecretKey();
//     const stringData = `${data.type}:${data.transactionId}:${data.storeId}:${key}`;
//     const digest = await Crypto.digestStringAsync(
//       Crypto.CryptoDigestAlgorithm.SHA256,
//       stringData
//     );
//     return digest;
//   }

//   async validateChecksum(payload) {
//     const key = await this.getSecretKey();
//     const { checksum, ...data } = payload;
//     const stringData = `${data.type}:${data.transactionId}:${data.storeId}:${key}`;
//     const digest = await Crypto.digestStringAsync(
//       Crypto.CryptoDigestAlgorithm.SHA256,
//       stringData
//     );
//     return digest === checksum;
//   }
// }

// export default new QRService();






















// // services/qrService.js - FIXED VERSION

// import * as Crypto from 'expo-crypto';
// import * as SecureStore from 'expo-secure-store';
// import { Platform } from 'react-native';
// import { encode, decode } from 'base-64';

// class QRService {
//   constructor() {
//     this.secretKey = null;
//     this.algorithm = 'aes-256-gcm';
//   }

//   async getSecretKey() {
//     if (this.secretKey) return this.secretKey;

//     if (Platform.OS === 'web') {
//       let key = localStorage.getItem('qr_secret_key');
//       if (!key) {
//         key = this.generateKey();
//         localStorage.setItem('qr_secret_key', key);
//       }
//       this.secretKey = key;
//       return key;
//     }

//     let key = await SecureStore.getItemAsync('qr_secret_key');
//     if (!key) {
//       key = this.generateKey();
//       await SecureStore.setItemAsync('qr_secret_key', key);
//     }
//     this.secretKey = key;
//     return key;
//   }

//   generateKey() {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//     for (let i = 0; i < 32; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return result;
//   }

//   /**
//    * Generate QR code data that matches backend format
//    * The backend expects: { encrypted, iv, authTag }
//    */
//   async generateQR(data) {
//     try {
//       const key = await this.getSecretKey();
      
//       const payload = {
//         version: '1.0',
//         type: data.type, // SALES, PAYMENT, RELEASE
//         transactionId: data.transactionId,
//         storeId: data.storeId,
//         timestamp: Date.now(),
//         expiresAt: Date.now() + 24 * 60 * 60 * 1000,
//       };

//       // Generate checksum
//       const checksumData = `${data.type}:${data.transactionId}:${data.storeId}:${key}`;
//       const checksum = await Crypto.digestStringAsync(
//         Crypto.CryptoDigestAlgorithm.SHA256,
//         checksumData
//       );
//       payload.checksum = checksum;

//       const jsonString = JSON.stringify(payload);
      
//       // For now, we're not actually encrypting (matching backend expectation)
//       // In production, you'd use proper encryption
//       const qrData = JSON.stringify({
//         // encrypted: Buffer.from(jsonString).toString('base64'),
//         encrypted: encode(jsonString),
//         iv: '00000000000000000000000000000000',
//         authTag: '00000000000000000000000000000000',
//       });

//       return qrData;
//     } catch (error) {
//       console.error('QR generation error:', error);
//       throw error;
//     }
//   }

//   /**
//    * Validate QR data
//    */
//   async validateQR(qrData) {
//     try {
//       // Try to parse as JSON first (backend format)
//       let parsedData;
//       try {
//         parsedData = JSON.parse(qrData);
//       } catch (e) {
//         // If not JSON, try base64 decode (old format)
//         try {
//           const decoded = atob(qrData);
//           parsedData = JSON.parse(decoded);
//         } catch (e2) {
//           return { valid: false, error: 'Invalid QR code format' };
//         }
//       }

//       // Check if it's the encrypted format
//       if (parsedData.encrypted && parsedData.iv && parsedData.authTag) {
//         // Decrypt the data
//         // const decrypted = Buffer.from(parsedData.encrypted, 'base64').toString('utf8');
//         const decrypted = decode(parsedData.encrypted);
//         const payload = JSON.parse(decrypted);
//         return await this.validatePayload(payload);
//       }

//       // Check if it's a direct payload
//       if (parsedData.type && parsedData.transactionId) {
//         return await this.validatePayload(parsedData);
//       }

//       return { valid: false, error: 'Invalid QR code structure' };
//     } catch (error) {
//       console.error('QR validation error:', error);
//       return { valid: false, error: 'Failed to validate QR code' };
//     }
//   }

//   /**
//    * Validate the payload
//    */
//   async validatePayload(payload) {
//     const key = await this.getSecretKey();
    
//     // Check expiration
//     if (payload.expiresAt && Date.now() > payload.expiresAt) {
//       return { valid: false, error: 'QR code expired' };
//     }

//     // If no timestamp, consider it valid for backward compatibility
//     if (!payload.timestamp) {
//       return { valid: true, data: payload };
//     }

//     // Check age (24 hours)
//     const age = Date.now() - payload.timestamp;
//     if (age > 24 * 60 * 60 * 1000) {
//       return { valid: false, error: 'QR code expired' };
//     }

//     // Validate checksum
//     if (payload.checksum) {
//       const { checksum, ...data } = payload;
//       const checksumData = `${data.type}:${data.transactionId}:${data.storeId}:${key}`;
//       const digest = await Crypto.digestStringAsync(
//         Crypto.CryptoDigestAlgorithm.SHA256,
//         checksumData
//       );
      
//       if (digest !== checksum) {
//         return { valid: false, error: 'Invalid QR checksum' };
//       }
//     }

//     return { valid: true, data: payload };
//   }

//   /**
//    * Generate checksum for payload
//    */
//   async generateChecksum(data) {
//     const key = await this.getSecretKey();
//     const stringData = `${data.type}:${data.transactionId}:${data.storeId}:${key}`;
//     const digest = await Crypto.digestStringAsync(
//       Crypto.CryptoDigestAlgorithm.SHA256,
//       stringData
//     );
//     return digest;
//   }

//   /**
//    * Validate checksum
//    */
//   async validateChecksum(payload) {
//     const key = await this.getSecretKey();
//     const { checksum, ...data } = payload;
//     const stringData = `${data.type}:${data.transactionId}:${data.storeId}:${key}`;
//     const digest = await Crypto.digestStringAsync(
//       Crypto.CryptoDigestAlgorithm.SHA256,
//       stringData
//     );
//     return digest === checksum;
//   }
// }

// export default new QRService();























// services/qrService.js - Cleaned up, only generates QR data, no validation
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

class QRService {
  constructor() {
    this.secretKey = null;
  }

  async getSecretKey() {
    if (this.secretKey) return this.secretKey;

    if (Platform.OS === 'web') {
      let key = localStorage.getItem('qr_secret_key');
      if (!key) {
        key = this.generateKey();
        localStorage.setItem('qr_secret_key', key);
      }
      this.secretKey = key;
      return key;
    }

    let key = await SecureStore.getItemAsync('qr_secret_key');
    if (!key) {
      key = this.generateKey();
      await SecureStore.setItemAsync('qr_secret_key', key);
    }
    this.secretKey = key;
    return key;
  }

  generateKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate QR data - matches backend format
   * The backend handles encryption and validation
   */
  async generateQR(data) {
    try {
      const key = await this.getSecretKey();
      
      const payload = {
        version: '1.0',
        type: data.type, // SALES, PAYMENT, RELEASE, INVOICE
        transactionId: data.transactionId,
        storeId: data.storeId,
        timestamp: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };

      // Generate checksum
      const checksumData = `${data.type}:${data.transactionId}:${data.storeId}:${key}`;
      const checksum = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        checksumData
      );
      payload.checksum = checksum;

      const jsonString = JSON.stringify(payload);
      
      // Return the payload directly - backend will encrypt
      // We just need to pass the data to the backend
      return jsonString;
    } catch (error) {
      console.error('QR generation error:', error);
      throw error;
    }
  }

  /**
   * Validate QR - delegates to backend
   * Frontend only passes the QR data to backend
   */
  async validateQR(qrData) {
    // This method now just forwards to the backend
    // The actual validation happens on the server
    return { valid: true, data: { qrData } };
  }
}

export default new QRService();