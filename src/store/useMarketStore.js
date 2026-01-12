import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@agriexpert_market_cache';
const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds

const useMarketStore = create((set, get) => ({
  // State
  prices: [],
  news: [],
  loading: false,
  error: null,
  lastUpdated: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Check if cache is valid
  isCacheValid: () => {
    const { lastUpdated } = get();
    if (!lastUpdated) return false;
    const now = Date.now();
    return (now - lastUpdated) < CACHE_EXPIRY;
  },

  // Load cached data
  loadCachedData: async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        set({
          prices: data.prices || [],
          news: data.news || [],
          lastUpdated: data.lastUpdated,
        });
      }
    } catch (error) {
      console.error('Failed to load cached market data:', error);
    }
  },

  // Save data to cache
  saveCachedData: async () => {
    try {
      const { prices, news, lastUpdated } = get();
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
        prices,
        news,
        lastUpdated,
      }));
    } catch (error) {
      console.error('Failed to save market cache:', error);
    }
  },

  // Set prices with caching
  setPrices: async (prices) => {
    set({
      prices,
      lastUpdated: Date.now(),
      loading: false,
      error: null,
    });
    await get().saveCachedData();
  },

  // Set news with caching
  setNews: async (news) => {
    set({
      news,
      lastUpdated: Date.now(),
      loading: false,
      error: null,
    });
    await get().saveCachedData();
  },

  // Clear cache
  clearCache: async () => {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
      set({
        prices: [],
        news: [],
        lastUpdated: null,
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  },
}));

export default useMarketStore;
