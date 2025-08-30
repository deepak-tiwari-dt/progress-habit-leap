import { useState, useEffect } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
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
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-bg"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl animate-pulse"></div>
        
        <div className="text-center space-y-6 animate-fade-in-up relative z-10">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto animate-bounce-gentle flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-primary rounded-2xl mx-auto opacity-50 animate-ping"></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-foreground">Loading your habit tracker</p>
            <p className="text-muted-foreground">Preparing your journey...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!habitData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-bg"></div>
        
        <div className="text-center space-y-6 animate-fade-in-up relative z-10">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl mx-auto flex items-center justify-center">
            <RotateCcw className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-4">
            <p className="text-xl font-semibold text-destructive">Failed to load habit data</p>
            <button 
              onClick={initializeData}
              className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const last7Days = storageService.getLast7Days();

  return (
    <div className="min-h-screen bg-background py-8 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-bg"></div>
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-md mx-auto space-y-8 relative z-10">
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