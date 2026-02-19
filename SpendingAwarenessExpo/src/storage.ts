import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserData } from './types';

const STORAGE_KEY = 'grove_user_data';

export async function loadUserData(): Promise<UserData | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UserData;
    }
  } catch (e) {
    console.error('Failed to load stored data', e);
  }
  return null;
}

export async function saveUserData(data: UserData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data', e);
  }
}

export async function clearUserData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear data', e);
  }
}
