export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`Error reading from localStorage key "${key}":`, e);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`Storage quota exceeded for key "${key}". Attempting cleanup...`, e);
      try {
        // 1. Remove non-essential large items (caches)
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith('audio-cache-') || k.includes('verse') || k.startsWith('biblia-viva-notes')) {
             // Keep user session and settings if possible, drop heavy content
             localStorage.removeItem(k);
          }
        });
        
        // 2. Retry
        localStorage.setItem(key, value);
      } catch (retryError) {
        console.error(`Failed to save "${key}" even after cleanup.`, retryError);
        // If still failing, maybe try to clear everything except this key? 
        // Or just fail silently to avoid crashing app logic that depends on it not throwing.
      }
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing key "${key}" from localStorage:`, e);
    }
  }
};
