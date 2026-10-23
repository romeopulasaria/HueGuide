import { UserProfile } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'hueguide_user_profile',
  FAVOURITES: 'hueguide_favourites',
  CONSENT_GIVEN: 'hueguide_photo_consent',
};

/**
 * Save user profile to local storage.
 * Note: Never includes image binary data or image data URLs.
 */
// In-memory fallback if localStorage is unavailable (e.g. node test environment or private browsing)
const memoryStore: Record<string, string> = {};

function getStorage(): {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
} {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return {
    getItem: (key: string) => (key in memoryStore ? memoryStore[key] : null),
    setItem: (key: string, value: string) => {
      memoryStore[key] = value;
    },
    removeItem: (key: string) => {
      delete memoryStore[key];
    },
    clear: () => {
      for (const k of Object.keys(memoryStore)) {
        delete memoryStore[k];
      }
    },
  };
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    getStorage().setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadStoredProfile(): UserProfile | null {
  try {
    const raw = getStorage().getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load profile', e);
    return null;
  }
}

export function deleteStoredProfile(): void {
  try {
    getStorage().removeItem(STORAGE_KEYS.PROFILE);
  } catch (e) {
    console.error('Failed to delete profile', e);
  }
}

export function getStoredFavourites(): string[] {
  try {
    const raw = getStorage().getItem(STORAGE_KEYS.FAVOURITES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function toggleStoredFavourite(productId: string): string[] {
  const current = getStoredFavourites();
  const exists = current.includes(productId);
  const updated = exists ? current.filter(id => id !== productId) : [...current, productId];
  try {
    getStorage().setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save favourites', e);
  }
  return updated;
}

export function clearStoredFavourites(): void {
  try {
    getStorage().removeItem(STORAGE_KEYS.FAVOURITES);
  } catch (e) {
    console.error('Failed to clear favourites', e);
  }
}

export function resetAllStoredData(): void {
  try {
    const store = getStorage();
    store.removeItem(STORAGE_KEYS.PROFILE);
    store.removeItem(STORAGE_KEYS.FAVOURITES);
    store.removeItem(STORAGE_KEYS.CONSENT_GIVEN);
  } catch (e) {
    console.error('Failed to reset all data', e);
  }
}
