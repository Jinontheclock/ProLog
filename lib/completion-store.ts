import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Persistent global completion store using AsyncStorage
class CompletionStore {
  private completedCompetencies: Set<string> = new Set();
  private listeners: Array<(completedIds: string[]) => void> = [];
  private isInitialized: boolean = false;
  private readonly STORAGE_KEY = 'competency_completions';

  // Initialize the store by loading data from AsyncStorage
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      const storedData = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        const completedIds: string[] = JSON.parse(storedData);
        this.completedCompetencies = new Set(completedIds);
      }
      this.isInitialized = true;
      this.notifyListeners();
    } catch (error) {
      console.error('Error loading completion data from AsyncStorage:', error);
      this.isInitialized = true;
    }
  }

  // Save current state to AsyncStorage
  private async saveToStorage(): Promise<void> {
    try {
      const completedIds = Array.from(this.completedCompetencies);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(completedIds));
    } catch (error) {
      console.error('Error saving completion data to AsyncStorage:', error);
    }
  }

  // Get all completed competency IDs
  getCompleted(): string[] {
    return Array.from(this.completedCompetencies);
  }

  // Check if a specific competency is completed
  isCompleted(id: string): boolean {
    return this.completedCompetencies.has(id);
  }

  // Mark a competency as completed or not completed
  async setCompleted(id: string, completed: boolean): Promise<void> {
    if (completed) {
      this.completedCompetencies.add(id);
    } else {
      this.completedCompetencies.delete(id);
    }
    
    await this.saveToStorage();
    this.notifyListeners();
  }

  // Wait for initialization to complete
  async waitForInitialization(): Promise<void> {
    if (this.isInitialized) return;
    
    // Wait for initialization if it's in progress
    while (!this.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  // Subscribe to completion changes
  subscribe(listener: (completedIds: string[]) => void): () => void {
    this.listeners.push(listener);
    
    // Call listener immediately with current state if initialized
    if (this.isInitialized) {
      listener(this.getCompleted());
    }
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of changes
  private notifyListeners(): void {
    const completedIds = this.getCompleted();
    this.listeners.forEach(listener => listener(completedIds));
  }

  // Clear all completion data (for testing/reset purposes)
  async clearAll(): Promise<void> {
    this.completedCompetencies.clear();
    await this.saveToStorage();
    this.notifyListeners();
  }
}

// Export a singleton instance
export const completionStore = new CompletionStore();

// Portfolio demo build: each visit starts clean, so wipe any completions a
// previous visitor left in this browser before loading the store.
async function bootstrap() {
  if (Platform.OS === 'web') {
    try {
      await AsyncStorage.removeItem('competency_completions');
    } catch {
      // ignore — falls back to whatever is stored
    }
  }
  completionStore.initialize();
}
bootstrap();