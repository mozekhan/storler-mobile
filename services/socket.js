// import io from 'socket.io-client';
// import { Platform } from 'react-native';
// import { MMKV } from 'react-native-mmkv';
// import useAuthStore from '../stores/authStore';

// const storage = new MMKV();

// class SocketService {
//   constructor() {
//     this.socket = null;
//     this.listeners = new Map();
//     this.isConnected = false;
//     this.reconnectAttempts = 0;
//     this.maxReconnectAttempts = 5;
//   }

//   connect() {
//     if (this.socket?.connected) return;

//     const token = storage.getString('auth_token');
//     if (!token) {
//       console.warn('No token found, cannot connect socket');
//       return;
//     }

//     const baseURL = __DEV__
//       ? (Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000')
//       : 'https://api.store.com';

//     this.socket = io(baseURL, {
//       path: '/socket.io',
//       transports: ['websocket', 'polling'],
//       auth: { token },
//       reconnection: true,
//       reconnectionAttempts: this.maxReconnectAttempts,
//       reconnectionDelay: 1000,
//       timeout: 10000
//     });

//     this.socket.on('connect', () => {
//       this.isConnected = true;
//       this.reconnectAttempts = 0;
//       console.log('Socket connected');

//       const user = useAuthStore.getState().user;
//       if (user) {
//         this.socket.emit('join-user', user._id);
//         this.socket.emit('join-store', user.storeId);
//         this.socket.emit('authenticate', {
//           userId: user._id,
//           storeId: user.storeId,
//           role: user.role
//         });
//       }
//     });

//     this.socket.on('disconnect', (reason) => {
//       this.isConnected = false;
//       console.log('Socket disconnected:', reason);
//     });

//     this.socket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//       this.reconnectAttempts++;
//     });

//     this.socket.on('error', (error) => {
//       console.error('Socket error:', error);
//     });

//     // Replay registered listeners
//     this.listeners.forEach((callbacks, event) => {
//       callbacks.forEach(callback => {
//         this.socket.on(event, callback);
//       });
//     });
//   }

//   disconnect() {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//       this.isConnected = false;
//     }
//   }

//   on(event, callback) {
//     if (!this.listeners.has(event)) {
//       this.listeners.set(event, []);
//     }
//     this.listeners.get(event).push(callback);

//     if (this.socket) {
//       this.socket.on(event, callback);
//     }
//   }

//   off(event, callback) {
//     if (this.listeners.has(event)) {
//       const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
//       this.listeners.set(event, callbacks);
//     }

//     if (this.socket) {
//       this.socket.off(event, callback);
//     }
//   }

//   emit(event, data) {
//     if (this.socket && this.isConnected) {
//       this.socket.emit(event, data);
//     } else {
//       console.warn('Socket not connected, event not sent:', event);
//       // Store for retry
//       this.emitWhenReady(event, data);
//     }
//   }

//   emitWhenReady(event, data) {
//     const checkConnection = setInterval(() => {
//       if (this.isConnected) {
//         this.socket.emit(event, data);
//         clearInterval(checkConnection);
//       }
//     }, 1000);

//     // Timeout after 10 seconds
//     setTimeout(() => {
//       clearInterval(checkConnection);
//     }, 10000);
//   }

//   isConnected() {
//     return this.isConnected && this.socket?.connected;
//   }

//   getSocket() {
//     return this.socket;
//   }
// }

// export default new SocketService();























import io from 'socket.io-client';
import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import useAuthStore from '../stores/authStore';

const storage = new MMKV();

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (this.socket?.connected) return;

    const token = storage.getString('auth_token');
    if (!token) {
      console.warn('No token found, cannot connect socket');
      return;
    }

    const baseURL = __DEV__
      ? (Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000')
      : 'https://api.store.com';

    this.socket = io(baseURL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('Socket connected');

      const user = useAuthStore.getState().user;
      if (user) {
        this.socket.emit('join-user', user._id);
        this.socket.emit('join-store', user.storeId);
        this.socket.emit('authenticate', {
          userId: user._id,
          storeId: user.storeId,
          role: user.role
        });
      }
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Replay registered listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket.on(event, callback);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
      this.listeners.set(event, callbacks);
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, event not sent:', event);
      this.emitWhenReady(event, data);
    }
  }

  emitWhenReady(event, data) {
    const checkConnection = setInterval(() => {
      if (this.isConnected) {
        this.socket.emit(event, data);
        clearInterval(checkConnection);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(checkConnection);
    }, 10000);
  }

  isConnected() {
    return this.isConnected && this.socket?.connected;
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();