import AsyncStorage from '@react-native-async-storage/async-storage';

class CacheService {
  constructor() {
    this.prefix = '@cache:';
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  getKey(key) {
    return `${this.prefix}${key}`;
  }

  async set(key, value, ttl = this.defaultTTL) {
    try {
      const item = {
        value,
        expires: Date.now() + ttl,
      };
      await AsyncStorage.setItem(this.getKey(key), JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async get(key) {
    try {
      const data = await AsyncStorage.getItem(this.getKey(key));
      if (!data) return null;

      const item = JSON.parse(data);
      if (Date.now() > item.expires) {
        await this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async remove(key) {
    try {
      await AsyncStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Cache remove error:', error);
      return false;
    }
  }

  async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(cacheKeys);
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  async getOrSet(key, fetchFn, ttl = this.defaultTTL) {
    const cached = await this.get(key);
    if (cached !== null) return cached;

    const fresh = await fetchFn();
    await this.set(key, fresh, ttl);
    return fresh;
  }

  async invalidatePattern(pattern) {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.startsWith(this.prefix) && key.includes(pattern)
      );
      await AsyncStorage.multiRemove(cacheKeys);
      return true;
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
      return false;
    }
  }
}

export default new CacheService();