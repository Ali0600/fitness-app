import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'fitnessAppState';

export default class StorageService {
  static async getState() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error('StorageService.getState error:', err);
      return null;
    }
  }

  static async saveState(state) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.error('StorageService.saveState error:', err);
      return false;
    }
  }

  static async clearState() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (err) {
      console.error('StorageService.clearState error:', err);
      return false;
    }
  }
}
