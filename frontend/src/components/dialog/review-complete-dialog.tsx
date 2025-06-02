import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, Target, AlertCircle, Home } from "lucide-react";
import {useRouter} from "next/navigation";
import { Button } from "../ui/button";
import { MASTERY_LEVEL } from "@/dtos/flashcard/Flashcard.dto";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export type ReviewCompleteDialogProps = {
  showCompletionModal: boolean;
  setShowCompletionModal: (open: boolean) => void;
  submittedAnswers: Record<number, MASTERY_LEVEL>; // record of flashcardId to mastery level
}

export default function ReviewCompleteDialog({
  showCompletionModal,
  setShowCompletionModal,
  submittedAnswers,
}: ReviewCompleteDialogProps) {

  const stats = getReviewTally(submittedAnswers)
  const router = useRouter();

  useEffect(() => {
    if (showCompletionModal) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      console.log(submittedAnswers);
      
    }
  }, [showCompletionModal]);

  return (
    <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
      <DialogContent className="sm:max-w-lg border-0 shadow-2xl bg-muted backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            🎉 Amazing Work!
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            You've completed your study session
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gradient-to-br from-rose-50 to-red-100 p-6 rounded-2xl border border-rose-200">
              <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-rose-600">{stats.unsure}</div>
              <div className="text-sm text-rose-700 font-medium">Unsure</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-6 rounded-2xl border border-amber-200">
              <Target className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-600">{stats.familiar}</div>
              <div className="text-sm text-amber-700 font-medium">Familiar</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-600">{stats.mastered}</div>
              <div className="text-sm text-emerald-700 font-medium">Mastered</div>
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm text-muted-foreground">Total cards reviewed: </span>
            <span className="font-bold text-secondary-foreground">{stats.total}</span>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => router.push("/dashboard/mydecks")}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Homepage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const getReviewTally = (submittedAnswers: Record<number, MASTERY_LEVEL>) => {
  const tally = {
    mastered: 0,
    familiar: 0,
    unsure: 0,
    total: Object.keys(submittedAnswers).length,
  }

  Object.values(submittedAnswers).forEach((rating) => {
    if (rating === "mastered") tally.mastered++
    else if (rating === "familiar") tally.familiar++
    else if (rating === "unsure") tally.unsure++
  })

  return tally
}