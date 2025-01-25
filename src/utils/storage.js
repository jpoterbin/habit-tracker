const STORAGE_KEY = 'habit-tracker-data';

export const storage = {
  save: (data) => {
    try {
      if (!Array.isArray(data)) {
        console.error('Invalid data format - expected array:', data);
        return;
      }
      const serialized = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serialized);
      console.log('Successfully saved to localStorage:', serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  load: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      console.log('Raw data from localStorage:', data);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        console.error('Invalid data format loaded:', parsed);
        return [];
      }
      
      return parsed;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  },
  
  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Storage cleared');
  }
}; 