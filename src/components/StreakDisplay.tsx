import { Trophy, Flame, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StreakDisplayProps {
  streak: number;
  habitName: string;
}

export const StreakDisplay = ({ streak, habitName }: StreakDisplayProps) => {
  return (
    <Card className="bg-gradient-card shadow-xl border-0 p-8 text-center animate-fade-in-up relative overflow-hidden">
      {/* Glow effect for active streaks */}
      {streak > 0 && (
        <div className="absolute inset-0 bg-gradient-glow opacity-30 animate-glow"></div>
      )}
      
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-center space-x-3">
          {streak > 7 ? (
            <div className="relative">
              <Sparkles className="w-10 h-10 text-primary animate-bounce-gentle" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping"></div>
            </div>
          ) : streak > 0 ? (
            <Flame className="w-10 h-10 text-primary animate-glow" />
          ) : (
            <Trophy className="w-10 h-10 text-muted-foreground opacity-50" />
          )}
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{habitName}</h1>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <div className="text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-scale-in">
              {streak}
            </div>
            {streak > 0 && (
              <div className="absolute inset-0 text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent opacity-20 animate-shimmer bg-[length:200%_100%] bg-[linear-gradient(110deg,transparent_35%,hsl(var(--primary))_50%,transparent_65%)]"></div>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-xl text-muted-foreground font-medium">
              {streak === 0 && "Ready to start your journey"}
              {streak === 1 && "Great start! 🎉"}
              {streak > 1 && streak < 7 && `${streak} days strong! 💪`}
              {streak >= 7 && streak < 30 && `Amazing streak! 🔥`}
              {streak >= 30 && "Incredible dedication! ⭐"}
            </p>
            
            {streak > 0 && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-hero rounded-full border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-primary font-semibold">
                  Keep the momentum going!
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress indicators for milestones */}
        {streak > 0 && (
          <div className="flex justify-center space-x-2 pt-4">
            {[3, 7, 14, 30].map((milestone) => (
              <div
                key={milestone}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  streak >= milestone
                    ? "bg-primary shadow-glow animate-pulse"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};