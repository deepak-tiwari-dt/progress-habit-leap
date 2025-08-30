import type { HabitData, HabitEntry } from "@/types/habit";

const DB_NAME = "HabitTrackerDB";
const DB_VERSION = 1;
const STORE_NAME = "habits";
const STORAGE_KEY = "habit-tracker-data";

class StorageService {
  private db: IDBDatabase | null = null;
  private useIndexedDB = true;

  async init(): Promise<void> {
    try {
      this.db = await this.openIndexedDB();
      this.useIndexedDB = true;
    } catch (error) {
      console.warn("IndexedDB not available, falling back to localStorage:", error);
      this.useIndexedDB = false;
    }
  }

  private openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
    });
  }

  async getHabitData(): Promise<HabitData> {
    if (this.useIndexedDB && this.db) {
      try {
        const data = await this.getFromIndexedDB();
        if (data) return data;
      } catch (error) {
        console.warn("IndexedDB read failed, falling back to localStorage:", error);
        this.useIndexedDB = false;
      }
    }
    
    return this.getFromLocalStorage();
  }

  async saveHabitData(data: HabitData): Promise<void> {
    if (this.useIndexedDB && this.db) {
      try {
        await this.saveToIndexedDB(data);
        return;
      } catch (error) {
        console.warn("IndexedDB write failed, falling back to localStorage:", error);
        this.useIndexedDB = false;
      }
    }
    
    this.saveToLocalStorage(data);
  }

  private getFromIndexedDB(): Promise<HabitData | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get("main");

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result?.data || null);
    });
  }

  private saveToIndexedDB(data: HabitData): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ id: "main", data });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private getFromLocalStorage(): HabitData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn("LocalStorage read failed:", error);
    }
    
    return this.getDefaultData();
  }

  private saveToLocalStorage(data: HabitData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("LocalStorage write failed:", error);
    }
  }

  private getDefaultData(): HabitData {
    return {
      habitName: "Daily Water Intake",
      entries: [],
      currentStreak: 0,
      lastUpdated: Date.now(),
    };
  }

  calculateStreak(entries: HabitEntry[]): number {
    if (entries.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedEntries = [...entries]
      .filter(entry => entry.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sortedEntries.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date(today);

    // Check if today is completed
    const todayString = this.formatDate(currentDate);
    const todayEntry = sortedEntries.find(entry => entry.date === todayString);
    
    if (!todayEntry) {
      // If today isn't completed, check yesterday to maintain streak
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Count consecutive days backwards from today/yesterday
    while (true) {
      const dateString = this.formatDate(currentDate);
      const entry = sortedEntries.find(entry => entry.date === dateString);
      
      if (entry && entry.completed) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getTodayString(): string {
    return this.formatDate(new Date());
  }

  getLast7Days(): string[] {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(this.formatDate(date));
    }
    
    return dates;
  }
}

export const storageService = new StorageService();