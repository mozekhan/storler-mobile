import { useState, useEffect } from 'react';
import useOfflineStore from '../stores/offlineStore';
import useAuthStore from '../stores/authStore';
import api from '../services/api';
import NetInfo from '@react-native-community/netinfo';

export const useOfflineQueue = () => {
  const [isOnline, setIsOnline] = useState(true);
  const { 
    queue, 
    isProcessing,
    addToQueue,
    removeFromQueue,
    clearQueue,
    startProcessing,
    stopProcessing,
    updateStatus
  } = useOfflineStore();

  const { user } = useAuthStore();

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online);
      
      if (online && queue.length > 0 && !isProcessing) {
        processQueue();
      }
    });

    return () => unsubscribe();
  }, []);

  const processQueue = async () => {
    if (isProcessing || queue.length === 0 || !isOnline) return;

    startProcessing();

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      try {
        updateStatus(item.id, 'processing');
        
        // Retry the request
        const response = await api({
          method: item.method,
          url: item.url,
          data: item.data,
          headers: item.headers
        });

        updateStatus(item.id, 'completed');
        
        // Remove from queue after success
        removeFromQueue(item.id);
      } catch (error) {
        updateStatus(item.id, 'failed', error.message);
        
        // Stop processing on failure
        stopProcessing();
        return;
      }
    }

    stopProcessing();
  };

  const addToOfflineQueue = async (method, url, data, headers = {}) => {
    const id = Date.now().toString();
    const queueItem = {
      id,
      method,
      url,
      data,
      headers,
      timestamp: new Date().toISOString(),
      userId: user?._id,
      status: 'pending'
    };

    addToQueue(queueItem);

    // If online, process immediately
    if (isOnline && !isProcessing) {
      await processQueue();
    }

    return id;
  };

  const retryFailed = async () => {
    const failedItems = queue.filter(item => item.status === 'failed');
    if (failedItems.length === 0) return;

    // Reset failed items to pending
    failedItems.forEach(item => {
      updateStatus(item.id, 'pending');
    });

    // Process the queue
    await processQueue();
  };

  const getQueueStats = () => {
    const pending = queue.filter(item => item.status === 'pending').length;
    const processing = queue.filter(item => item.status === 'processing').length;
    const completed = queue.filter(item => item.status === 'completed').length;
    const failed = queue.filter(item => item.status === 'failed').length;

    return {
      total: queue.length,
      pending,
      processing,
      completed,
      failed
    };
  };

  return {
    queue,
    isProcessing,
    isOnline,
    addToOfflineQueue,
    processQueue,
    retryFailed,
    clearQueue,
    getQueueStats
  };
};