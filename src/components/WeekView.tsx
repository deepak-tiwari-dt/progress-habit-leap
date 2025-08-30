import { Check, X, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { HabitEntry } from "@/types/habit";

interface WeekViewProps {
  entries: HabitEntry[];
  last7Days: string[];
}

export const WeekView = ({ entries, last7Days }: WeekViewProps) => {
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getEntryForDate = (dateString: string) => {
    return entries.find(entry => entry.date === dateString);
  };

  const getCompletedCount = () => {
    return last7Days.filter(date => {
      const entry = getEntryForDate(date);
      return entry?.completed || false;
    }).length;
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0 p-6 animate-fade-in relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Last 7 Days</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            {getCompletedCount()}/7 completed
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-3">
          {last7Days.map((dateString, index) => {
            const entry = getEntryForDate(dateString);
            const isCompleted = entry?.completed || false;
            const isToday = dateString === new Date().toISOString().split('T')[0];
            
            return (
              <div key={dateString} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-xs text-muted-foreground mb-3 font-medium">
                  {getDayName(dateString)}
                </div>
                <div
                  className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative group
                    ${isCompleted 
                      ? "bg-gradient-primary text-white shadow-glow scale-105" 
                      : "bg-muted/50 border-2 border-dashed border-muted-foreground/30 hover:bg-muted/70 hover:border-muted-foreground/50"
                    }
                    ${isToday ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 animate-scale-in" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/50 group-hover:text-muted-foreground/70 transition-colors" />
                  )}
                  
                  {/* Completion celebration effect */}
                  {isCompleted && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-20 animate-pulse"></div>
                  )}
                </div>
                
                {isToday && (
                  <div className="text-xs text-primary font-semibold mt-2 animate-bounce-gentle">
                    Today
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Progress bar */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Weekly Progress</span>
            <span>{Math.round((getCompletedCount() / 7) * 100)}%</span>
          </div>
          <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-primary transition-all duration-500 ease-out"
              style={{ width: `${(getCompletedCount() / 7) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};