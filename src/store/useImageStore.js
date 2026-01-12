import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useImageStore = create((set, get) => ({
  // State
  selectedImage: null,
  analysisType: null, // 'crop' | 'soil' | 'pest'
  result: null,
  loading: false,
  error: null,
  pendingUploads: [],

  // Actions
  setImage: (uri) => set({ selectedImage: uri, error: null }),

  setAnalysisType: (type) => set({ analysisType: type }),

  setResult: (result) => set({ result, loading: false, error: null }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error, loading: false }),

  resetAnalysis: () => set({
    selectedImage: null,
    result: null,
    error: null,
    loading: false
  }),

  // Offline queue management
  addToQueue: async (image, type) => {
    const queue = get().pendingUploads;
    const newQueue = [...queue, { image, type, timestamp: Date.now() }];
    set({ pendingUploads: newQueue });

    try {
      await AsyncStorage.setItem('pendingUploads', JSON.stringify(newQueue));
    } catch (error) {
      console.error('Failed to save upload queue:', error);
    }
  },

  loadPendingUploads: async () => {
    try {
      const stored = await AsyncStorage.getItem('pendingUploads');
      if (stored) {
        set({ pendingUploads: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load upload queue:', error);
    }
  },

  removeFromQueue: async (timestamp) => {
    const queue = get().pendingUploads.filter(item => item.timestamp !== timestamp);
    set({ pendingUploads: queue });

    try {
      await AsyncStorage.setItem('pendingUploads', JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to update upload queue:', error);
    }
  },
}));

export default useImageStore;
