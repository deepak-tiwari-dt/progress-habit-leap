import { useState } from "react";
import { Check, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HabitActionsProps {
  isTodayCompleted: boolean;
  onMarkDone: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const HabitActions = ({ 
  isTodayCompleted, 
  onMarkDone, 
  onReset, 
  isLoading = false 
}: HabitActionsProps) => {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleReset = () => {
    onReset();
    setIsResetDialogOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
      <Button
        onClick={onMarkDone}
        disabled={isTodayCompleted || isLoading}
        size="lg"
        className={`
          flex-1 h-14 text-lg font-semibold transition-all duration-300 transform
          ${isTodayCompleted 
            ? "bg-gradient-secondary text-white shadow-lg cursor-default scale-105" 
            : "bg-gradient-primary hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
          }
        `}
      >
        {isTodayCompleted ? (
          <>
            <Sparkles className="w-6 h-6 mr-2 animate-bounce-gentle" />
            Completed Today!
          </>
        ) : (
          <>
            <Check className="w-6 h-6 mr-2" />
            Mark Done
          </>
        )}
      </Button>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            disabled={isLoading}
            className="
              sm:w-auto h-14 border-2 hover:bg-destructive/10 hover:text-destructive 
              hover:border-destructive/50 transition-all duration-300 hover:scale-105
              backdrop-blur-sm bg-background/80
            "
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </AlertDialogTrigger>
        
        <AlertDialogContent className="bg-gradient-card border-0 shadow-xl backdrop-blur max-w-md">
          <AlertDialogHeader className="space-y-4">
            <div className="w-16 h-16 bg-gradient-primary/10 rounded-full flex items-center justify-center mx-auto">
              <RotateCcw className="w-8 h-8 text-primary" />
            </div>
            <AlertDialogTitle className="text-foreground text-xl text-center">
              Reset Habit Tracker
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-center leading-relaxed">
              This will permanently delete all your progress and reset your streak to 0. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-3">
            <AlertDialogCancel className="border-border hover:bg-muted/50 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-destructive/20"
            >
              Reset Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};