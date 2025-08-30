export interface HabitEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  timestamp: number;
}

export interface HabitData {
  habitName: string;
  entries: HabitEntry[];
  currentStreak: number;
  lastUpdated: number;
}