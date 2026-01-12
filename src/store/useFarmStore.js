import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@agriexpert_farm_data';

const useFarmStore = create((set, get) => ({
  // State
  plantings: [],
  harvests: [],
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Load data from AsyncStorage
  loadFarmData: async () => {
    try {
      set({ loading: true });
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({
          plantings: data.plantings || [],
          harvests: data.harvests || [],
          loading: false
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Failed to load farm data:', error);
      set({ error: 'Failed to load data', loading: false });
    }
  },

  // Save data to AsyncStorage
  saveFarmData: async () => {
    try {
      const { plantings, harvests } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        plantings,
        harvests,
      }));
    } catch (error) {
      console.error('Failed to save farm data:', error);
      set({ error: 'Failed to save data' });
    }
  },

  // Planting operations
  addPlanting: async (planting) => {
    const newPlanting = {
      id: Date.now().toString(),
      ...planting,
      status: 'planned',
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      plantings: [...state.plantings, newPlanting],
    }));

    await get().saveFarmData();
  },

  updatePlanting: async (id, updates) => {
    set((state) => ({
      plantings: state.plantings.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));

    await get().saveFarmData();
  },

  deletePlanting: async (id) => {
    set((state) => ({
      plantings: state.plantings.filter((p) => p.id !== id),
    }));

    await get().saveFarmData();
  },

  // Harvest operations
  addHarvest: async (harvest) => {
    const newHarvest = {
      id: Date.now().toString(),
      ...harvest,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      harvests: [...state.harvests, newHarvest],
    }));

    // Update related planting status if linked
    if (harvest.plantingId) {
      await get().updatePlanting(harvest.plantingId, { status: 'harvested' });
    }

    await get().saveFarmData();
  },

  updateHarvest: async (id, updates) => {
    set((state) => ({
      harvests: state.harvests.map((h) =>
        h.id === id ? { ...h, ...updates } : h
      ),
    }));

    await get().saveFarmData();
  },

  deleteHarvest: async (id) => {
    set((state) => ({
      harvests: state.harvests.filter((h) => h.id !== id),
    }));

    await get().saveFarmData();
  },

  // Helper methods
  getActivePlantings: () => {
    const { plantings } = get();
    return plantings.filter(p => p.status !== 'harvested');
  },

  getUpcomingHarvests: () => {
    const { plantings } = get();
    const now = new Date();
    const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    return plantings.filter(p => {
      if (!p.expectedHarvestDate || p.status === 'harvested') return false;
      const harvestDate = new Date(p.expectedHarvestDate);
      return harvestDate >= now && harvestDate <= twoWeeks;
    });
  },
}));

export default useFarmStore;
