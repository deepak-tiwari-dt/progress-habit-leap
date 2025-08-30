import { useState, useEffect } from "react";
import { storageService } from "@/lib/storage";
import { StreakDisplay } from "./StreakDisplay";
import { WeekView } from "./WeekView";
import { HabitActions } from "./HabitActions";
import { useToast } from "@/hooks/use-toast";
import type { HabitData, HabitEntry } from "@/types/habit";

export const HabitTracker = () => {
  const [habitData, setHabitData] = useState<HabitData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      await storageService.init();
      const data = await storageService.getHabitData();
      
      // Recalculate streak in case data is stale
      const updatedStreak = storageService.calculateStreak(data.entries);
      const updatedData = { ...data, currentStreak: updatedStreak };
      
      setHabitData(updatedData);
      
      if (updatedStreak !== data.currentStreak) {
        await storageService.saveHabitData(updatedData);
      }
    } catch (error) {
      console.error("Failed to initialize data:", error);
      toast({
        title: "Storage Error",
        description: "Failed to load your habit data. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isTodayCompleted = () => {
    if (!habitData) return false;
    const today = storageService.getTodayString();
    return habitData.entries.some(entry => entry.date === today && entry.completed);
  };

  const markDoneToday = async () => {
    if (!habitData || isTodayCompleted()) return;

    const today = storageService.getTodayString();
    const newEntry: HabitEntry = {
      id: `${today}-${Date.now()}`,
      date: today,
      completed: true,
      timestamp: Date.now(),
    };

    const updatedEntries = [...habitData.entries, newEntry];
    const newStreak = storageService.calculateStreak(updatedEntries);
    
    const updatedData: HabitData = {
      ...habitData,
      entries: updatedEntries,
      currentStreak: newStreak,
      lastUpdated: Date.now(),
    };

    try {
      await storageService.saveHabitData(updatedData);
      setHabitData(updatedData);
      
      toast({
        title: "Great job! 🎉",
        description: `You've completed your habit today! ${newStreak > 1 ? `${newStreak} day streak!` : "Keep it up!"}`,
      });
    } catch (error) {
      console.error("Failed to save habit completion:", error);
      toast({
        title: "Save Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetHabit = async () => {
    if (!habitData) return;

    const resetData: HabitData = {
      ...habitData,
      entries: [],
      currentStreak: 0,
      lastUpdated: Date.now(),
    };

    try {
      await storageService.saveHabitData(resetData);
      setHabitData(resetData);
      
      toast({
        title: "Habit Reset",
        description: "Your habit tracker has been reset. Ready for a fresh start!",
      });
    } catch (error) {
      console.error("Failed to reset habit:", error);
      toast({
        title: "Reset Error",
        description: "Failed to reset your habit data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto animate-bounce"></div>
          <p className="text-muted-foreground">Loading your habit tracker...</p>
        </div>
      </div>
    );
  }

  if (!habitData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Failed to load habit data</p>
          <button 
            onClick={initializeData}
            className="text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const last7Days = storageService.getLast7Days();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <StreakDisplay 
          streak={habitData.currentStreak} 
          habitName={habitData.habitName}
        />
        
        <WeekView 
          entries={habitData.entries}
          last7Days={last7Days}
        />
        
        <HabitActions
          isTodayCompleted={isTodayCompleted()}
          onMarkDone={markDoneToday}
          onReset={resetHabit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};