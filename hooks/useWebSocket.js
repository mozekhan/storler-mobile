import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socket';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleMessage = (data) => {
      setLastMessage(data);
    };

    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    socketService.on('notification', handleMessage);

    // Connect if not already connected
    if (!socketService.isConnected()) {
      socketService.connect();
    }

    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
      socketService.off('notification', handleMessage);
    };
  }, []);

  const emit = useCallback((event, data) => {
    socketService.emit(event, data);
  }, []);

  const on = useCallback((event, callback) => {
    socketService.on(event, callback);
  }, []);

  const off = useCallback((event, callback) => {
    socketService.off(event, callback);
  }, []);

  return {
    isConnected,
    lastMessage,
    emit,
    on,
    off,
    connect: socketService.connect.bind(socketService),
    disconnect: socketService.disconnect.bind(socketService),
  };
}

export default useWebSocket;