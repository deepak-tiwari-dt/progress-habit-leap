import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
      <Button
        onClick={onMarkDone}
        disabled={isTodayCompleted || isLoading}
        size="lg"
        className="flex-1 bg-gradient-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
      >
        <Check className="w-5 h-5 mr-2" />
        {isTodayCompleted ? "Completed Today!" : "Mark Done"}
      </Button>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            disabled={isLoading}
            className="sm:w-auto hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </AlertDialogTrigger>
        
        <AlertDialogContent className="bg-gradient-card border-0 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Reset Habit Tracker</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete all your progress and reset your streak to 0. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};