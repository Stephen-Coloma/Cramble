"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  Shuffle,
  Brain,
  Target,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { Flashcard } from "@/dtos/flashcard/Flashcard.dto";
import { MASTERY_LEVEL } from "@/dtos/flashcard/Flashcard.dto";
import { ModeToggle } from "@/components/mode-toggle";
import ReviewCompleteDialog from "@/components/dialog/review-complete-dialog";
import { useFetch, usePut } from "@/hooks/use-request";
import { API_BASE_URL } from "@/constants";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ReviewSkeleton from "@/components/review-skeleton";
import FlashcardFlip from "@/components/flashcard-flip";
import ErrorLoadingCards from "@/components/error-loading-cards";
import { AxiosError } from "axios";

export type ReviewProps = {
  deckId: number;
  deckTitle: string;
};

export default function Review() {
  const params = useParams();
  const deckId = Number(params.deckId);
  const deckTitle = decodeURIComponent(params.title as string);
  const router = useRouter();
  const { status, statusText, data, error, loading } = useFetch<Flashcard[]>(
    `${API_BASE_URL}/api/flashcards/${deckId}`
  );
  const rateUpdateRequest = usePut(`${API_BASE_URL}/api/flashcards/${deckId}/rate`)

  useEffect(() => {
    if (status === 200 && Array.isArray(data)) {
      setFlashcards(data);
    }
  }, [loading]);

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]); // initially empty, will be populated after fetch
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, MASTERY_LEVEL>>({}); // flasdhcardId to mastery level mapping for every session
  const [isShuffled, setIsShuffled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMasteryLevel, setSelectedMasteryLevel] = useState<MASTERY_LEVEL>("unrated");
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const currentCard = flashcards[currentIndex];

  // resets the cards to first card
  const shuffleCards = () => {
    if (!isShuffled) {
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled);
      setIsShuffled(true);
    } else {
      setFlashcards(data as Flashcard[]); // reset to original order
      setIsShuffled(false);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMasterySelect = async (userSelectedMasteryLevel: MASTERY_LEVEL) => {
    setSelectedMasteryLevel(userSelectedMasteryLevel);
    await new Promise((resolve) => setTimeout(resolve, 500)); // delay before moving to next card    

    setUserAnswers((prev) => ({
      ...prev,
      [currentCard.flashcardId]: userSelectedMasteryLevel,
    }));

    // Move to next card after rating
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedMasteryLevel("unrated"); // reset the selected mastery level for another card
      setIsFlipped(false);
    } else {
      setShowCompletionModal(true);
    }
  };

  //useEffect too save the mastery ratings to the database
  useEffect(() => {
    if (showCompletionModal) { // the first if is to prevent the execution of this code when the component is first rendered
      const formattedAnswers = Object.entries(userAnswers)
      .map(([flashcardId, mastery])=> {
        return {
          flashcardId: Number(flashcardId),
          mastery: mastery as MASTERY_LEVEL,
        }
      })
      rateUpdateRequest.executePutRequest(formattedAnswers);
    }
  }, [showCompletionModal])

  const progressPercentage = ((Object.keys(userAnswers).length) / flashcards.length) * 100;

  if (error) {
    const errorStatus = (error as AxiosError).response?.status;
    let message;
    // the cards does not belong to the user
    if (errorStatus === 401) {
      message = "You do not have access to this deck.";
    } else if (errorStatus === 500) {
      message = "An error occurred. Please try again later.";
    }
    return (<ErrorLoadingCards errorMessage={message} fallbackRoute="/dashboard/mydecks"/>)
  }

  return flashcards.length > 0?  (
    <div className="bg-[url('/assets/cramble-background-25.svg')] bg-cover bg-center min-h-screen">
      <div className="z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4">
            <div className="p-2 bg-gray-200 dark:bg-white/10 backdrop-blur-sm rounded-xl">
              <Brain className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-foreground">
              {deckTitle}
            </h1>
          </div>

          {/* Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>
                {Object.keys(userAnswers).length} of {flashcards.length}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="mt-2">
              <Badge className="bg-muted text-secondary-foreground backdrop-blur-sm hover:text-primary-foreground">
                {Math.round(progressPercentage)}% Complete
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 mb-6">
          <div className="w-full max-w-4xl space-y-4">
            {/* shuffle and music */}
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={shuffleCards}
                className={`text-secondary-foreground ${
                  isShuffled
                    ? "bg-primary text-secondary dark:text-secondary-foreground hover:bg-primary/80 hover:text-secondary"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMusic}
                className={`text-secondary-foreground ${
                  isPlaying
                    ? "bg-primary text-secondary dark:text-secondary-foreground hover:bg-primary/80 hover:text-secondary"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {isPlaying ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeOff className="w-5 h-5" />
                )}
              </Button>

              <ModeToggle></ModeToggle>
            </div>

            {/* Flashcard */}
            <FlashcardFlip
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
              frontContent={currentCard.front}
              backContent={currentCard.back}
            />

            {/* Mastery Rating */}
            <div className="rounded-2xl p-6 border bg-card">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-seconbdary-foreground mb-1">
                  Rate Your Knowledge
                </h3>
                <p className="text-sm text-muted-foreground">
                  How well do you know this question?
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* unsure */}
                <Button
                  onClick={() => handleMasterySelect("unsure")}
                  className={`h-16 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                    selectedMasteryLevel === "unsure"
                      ? `bg-gradient-to-br from-rose-400 to-red-500 text-secondary-foreground scale-105`
                      : "bg-muted text-secondary-foreground hover:bg-muted/50 hover:scale-105"
                  }`}
                  variant="outline"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-xs font-medium capitalize text-secondary-foreground">
                    Unsure
                  </span>
                </Button>

                {/* familiar */}
                <Button
                  onClick={() => handleMasterySelect("familiar")}
                  className={`h-16 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                    selectedMasteryLevel === "familiar"
                      ? `bg-gradient-to-br from-amber-400 to-orange-500 text-secondary-foreground scale-105`
                      : "bg-muted text-secondary-foreground hover:bg-muted/50 hover:scale-105"
                  }`}
                  variant="outline"
                >
                  <Target className="w-5 h-5" />
                  <span className="text-xs font-medium capitalize text-secondary-foreground">
                    Familiar
                  </span>
                </Button>

                {/* mastered */}
                <Button
                  onClick={() => handleMasterySelect("mastered")}
                  className={`h-16 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                    selectedMasteryLevel === "mastered"
                      ? `bg-gradient-to-br from-emerald-400 to-green-500 text-secondary-foreground scale-105`
                      : "bg-muted text-secondary-foreground hover:bg-muted/50 hover:scale-105"
                  }`}
                  variant="outline"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-medium capitalize text-secondary-foreground">
                    Mastered
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Modal */}
        <ReviewCompleteDialog
          showCompletionModal={showCompletionModal}
          setShowCompletionModal={setShowCompletionModal}
          submittedAnswers={userAnswers}
        />
      </div>
    </div>
  ) : (
    <ReviewSkeleton></ReviewSkeleton>
  );
}
