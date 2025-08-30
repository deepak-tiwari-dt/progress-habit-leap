import { Trophy, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StreakDisplayProps {
  streak: number;
  habitName: string;
}

export const StreakDisplay = ({ streak, habitName }: StreakDisplayProps) => {
  return (
    <Card className="bg-gradient-card shadow-card border-0 p-6 text-center animate-scale-in">
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          {streak > 0 ? (
            <Flame className="w-8 h-8 text-primary animate-pulse" />
          ) : (
            <Trophy className="w-8 h-8 text-muted-foreground" />
          )}
          <h1 className="text-2xl font-bold text-foreground">{habitName}</h1>
        </div>
        
        <div className="space-y-2">
          <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {streak}
          </div>
          <p className="text-lg text-muted-foreground">
            {streak === 0 && "No streak yet"}
            {streak === 1 && "day streak!"}
            {streak > 1 && "days streak!"}
          </p>
        </div>
        
        {streak > 0 && (
          <div className="text-sm text-success font-medium">
            Keep it up! You're doing great! 🎉
          </div>
        )}
      </div>
    </Card>
  );
};