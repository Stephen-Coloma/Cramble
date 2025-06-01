"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Play,
  Pause,
  Home,
  Brain,
  Target,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Volume2,
  VolumeOff,
} from "lucide-react"
import { Flashcard } from "@/dtos/flashcard/Flashcard.dto"
import { MASTERY_LEVEL } from "@/dtos/flashcard/Flashcard.dto"
import { ModeToggle } from "@/components/mode-toggle"
import ReviewCompleteDialog, { getReviewTally } from "@/components/dialog/review-complete-dialog"


export default function Review() {

  // Sample data
  const originalFlashcards: Flashcard[] = [
    {
      flashcardId: 21,
      deckId: 3,
      front: "Who won the 2025 Miami Sprint Qualifying?",
      back: "Kimi Antonelli",
      mastery: "mastered",
    },
    {
      flashcardId: 22,
      deckId: 3,
      front: "What team does Kimi Antonelli drive for?",
      back: "Mercedes",
      mastery: "unrated",
    },
  ]
  const deckTitle = "Formula 1 Miami GP 2025 Quiz"
  const masteryLevels: MASTERY_LEVEL[] = ["unsure", "familiar", "mastered"]

  const [flashcards, setFlashcards] = useState<Flashcard[]>(originalFlashcards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, MASTERY_LEVEL>>({}) // flasdhcardId to mastery level mapping for every session
  const [isShuffled, setIsShuffled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedMasteryLevel, setSelectedMasteryLevel] = useState<MASTERY_LEVEL>('unrated')
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  const currentCard = flashcards[currentIndex]

  // resets the cards to first card
  const shuffleCards = () => {
    if (!isShuffled) {
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5)
      setFlashcards(shuffled)
      setIsShuffled(true)
    } else {
      setFlashcards(originalFlashcards)
      setIsShuffled(false)
    }
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const toggleMusic = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMasterySelect = async(userSelectedMasteryLevel: MASTERY_LEVEL) => {
    setSubmittedAnswers((prev) => ({
      ...prev,
      [currentCard.flashcardId]: userSelectedMasteryLevel,
    }))
    setSelectedMasteryLevel(userSelectedMasteryLevel);
    
    await new Promise((resolve) => setTimeout(resolve, 800)) // delay before moving to next card

    // Move to next card after rating
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedMasteryLevel('unrated'); // reset the selected mastery level for another card
      setIsFlipped(false)
    } else {
      setShowCompletionModal(true)
    }
  }

  
  const progressPercentage = ((currentIndex + 1) / flashcards.length) * 100

  return (
    <div className="min-h-screen">
      <div className="z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
              <Brain className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-foreground">{deckTitle}</h1>
          </div>

          {/* Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>
                {currentIndex + 1} of {flashcards.length}
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
                {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeOff className="w-5 h-5" />}
              </Button>

              <ModeToggle></ModeToggle>
            </div>

            {/* Flashcard */}
            <Card
              className="w-full h-96 sm:h-[28rem] cursor-pointer transition-all duration-500 hover:scale-[1.02] bg-muted border-0"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <CardContent className="h-full flex items-center justify-center p-8 relative overflow-hidden">
                {/* Card Glow Effect */}
                <div className="text-center relative z-10 w-full">

                  {/* Card Type Indicator */}
                  <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                    <div
                      className={`w-2 h-2 rounded-full ${isFlipped ? "bg-green-500" : "bg-blue-500"} animate-pulse`}
                    />
                    <span className="text-sm font-medium text-muted-foreground dark:text-muted">{isFlipped ? "Answer" : "Question"}</span>
                    <RotateCcw className="w-4 h-4 text-muted-foreground dark:text-muted" />
                  </div>

                  <p className="text-xl sm:text-2xl font-semibold leading-relaxed text-secondary-foreground max-w-3xl mx-auto">
                    {isFlipped ? currentCard?.back : currentCard?.front}
                  </p>

                  <div className="mt-8 text-sm text-muted-foreground">Tap anywhere to flip</div>
                </div>
              </CardContent>
            </Card>

            {/* Mastery Rating */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-muted">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-seconbdary-foreground mb-1">Rate Your Knowledge</h3>
                <p className="text-sm text-muted-foreground">How well do you know this question?</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* unsure */}
                <Button
                  onClick={() => handleMasterySelect('unsure')}
                  className={`h-16 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                    selectedMasteryLevel === 'unsure'
                      ? `bg-gradient-to-br from-rose-400 to-red-500 text-secondary-foreground scale-105`
                      : "bg-muted text-secondary-foreground hover:bg-primary/50 hover:scale-105"
                  }`}
                  variant="outline"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-xs font-medium capitalize text-secondary-foreground">Unsure</span>
                </Button>

                {/* familiar */}
                <Button
                  onClick={() => handleMasterySelect('familiar')}
                  className={`h-16 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                    selectedMasteryLevel === 'familiar'
                      ? `bg-gradient-to-br from-amber-400 to-orange-500 text-secondary-foreground scale-105`
                      : "bg-muted text-secondary-foreground hover:bg-primary/50 hover:scale-105"
                  }`}
                  variant="outline"
                >
                  <Target className="w-5 h-5" />
                  <span className="text-xs font-medium capitalize text-secondary-foreground">Familiar</span>
                </Button>

                {/* mastered */}
                <Button
                  onClick={() => handleMasterySelect('mastered')}
                  className={`h-16 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                    selectedMasteryLevel === 'mastered'
                      ? `bg-gradient-to-br from-emerald-400 to-green-500 text-secondary-foreground scale-105`
                      : "bg-muted text-secondary-foreground hover:bg-primary/50 hover:scale-105"
                  }`}
                  variant="outline"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-medium capitalize text-secondary-foreground">Mastered</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Modal */}
        <ReviewCompleteDialog showCompletionModal={showCompletionModal} setShowCompletionModal={setShowCompletionModal} submittedAnswers={submittedAnswers}></ReviewCompleteDialog>
      </div>
    </div>
  )
}
