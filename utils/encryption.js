// import * as Crypto from 'expo-crypto';
// import * as SecureStore from 'expo-secure-store';
// import { Platform } from 'react-native';

// class Encryption {
//   constructor() {
//     this.key = null;
//   }

//   async getKey() {
//     if (this.key) return this.key;

//     if (Platform.OS === 'web') {
//       let key = localStorage.getItem('encryption_key');
//       if (!key) {
//         key = this.generateKey();
//         localStorage.setItem('encryption_key', key);
//       }
//       this.key = key;
//       return key;
//     }

//     let key = await SecureStore.getItemAsync('encryption_key');
//     if (!key) {
//       key = this.generateKey();
//       await SecureStore.setItemAsync('encryption_key', key);
//     }
//     this.key = key;
//     return key;
//   }

//   generateKey() {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
//     let result = '';
//     for (let i = 0; i < 32; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return result;
//   }

//   async encrypt(text) {
//     try {
//       const key = await this.getKey();
//       // Simple XOR encryption for demo
//       // In production, use proper encryption
//       let result = '';
//       for (let i = 0; i < text.length; i++) {
//         result += String.fromCharCode(
//           text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
//         );
//       }
//       return btoa(result);
//     } catch (error) {
//       console.error('Encryption error:', error);
//       throw error;
//     }
//   }

//   async decrypt(encrypted) {
//     try {
//       const key = await this.getKey();
//       const text = atob(encrypted);
//       let result = '';
//       for (let i = 0; i < text.length; i++) {
//         result += String.fromCharCode(
//           text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
//         );
//       }
//       return result;
//     } catch (error) {
//       console.error('Decryption error:', error);
//       throw error;
//     }
//   }

//   async generateHash(data) {
//     const digest = await Crypto.digestStringAsync(
//       Crypto.CryptoDigestAlgorithm.SHA256,
//       data
//     );
//     return digest;
//   }

//   async generateHMAC(data, secret) {
//     const stringData = `${data}:${secret}`;
//     const digest = await Crypto.digestStringAsync(
//       Crypto.CryptoDigestAlgorithm.SHA256,
//       stringData
//     );
//     return digest;
//   }

//   generateRandomToken(length = 32) {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//     for (let i = 0; i < length; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return result;
//   }

//   generateOTP(length = 6) {
//     let result = '';
//     for (let i = 0; i < length; i++) {
//       result += Math.floor(Math.random() * 10);
//     }
//     return result;
//   }
// }

// export default new Encryption();























import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

class Encryption {
  constructor() {
    this.key = null;
  }

  async getKey() {
    if (this.key) return this.key;

    if (Platform.OS === 'web') {
      let key = localStorage.getItem('encryption_key');
      if (!key) {
        key = this.generateKey();
        localStorage.setItem('encryption_key', key);
      }
      this.key = key;
      return key;
    }

    let key = await SecureStore.getItemAsync('encryption_key');
    if (!key) {
      key = this.generateKey();
      await SecureStore.setItemAsync('encryption_key', key);
    }
    this.key = key;
    return key;
  }

  generateKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async encrypt(text) {
    try {
      const key = await this.getKey();
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(
          text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return btoa(result);
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }

  async decrypt(encrypted) {
    try {
      const key = await this.getKey();
      const text = atob(encrypted);
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(
          text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return result;
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  }

  async generateHash(data) {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      data
    );
    return digest;
  }

  async generateHMAC(data, secret) {
    const stringData = `${data}:${secret}`;
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      stringData
    );
    return digest;
  }

  generateRandomToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  generateOTP(length = 6) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }
}

export default new Encryption();