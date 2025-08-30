import { Check, X } from "lucide-react";
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

  return (
    <Card className="bg-gradient-card shadow-card border-0 p-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
        Last 7 Days
      </h2>
      
      <div className="grid grid-cols-7 gap-2">
        {last7Days.map((dateString, index) => {
          const entry = getEntryForDate(dateString);
          const isCompleted = entry?.completed || false;
          const isToday = dateString === new Date().toISOString().split('T')[0];
          
          return (
            <div key={dateString} className="text-center">
              <div className="text-xs text-muted-foreground mb-2 font-medium">
                {getDayName(dateString)}
              </div>
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                  ${isCompleted 
                    ? "bg-success text-success-foreground shadow-lg shadow-success/20" 
                    : "bg-muted border-2 border-dashed border-muted-foreground/30"
                  }
                  ${isToday ? "ring-2 ring-primary ring-offset-2" : ""}
                `}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <X className="w-5 h-5 text-muted-foreground/50" />
                )}
              </div>
              {isToday && (
                <div className="text-xs text-primary font-medium mt-1">Today</div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};