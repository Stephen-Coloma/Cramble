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
import { useRouter } from "next/navigation"
import { Flashcard } from "@/dtos/flashcard/Flashcard.dto"
import { MASTERY_LEVEL } from "@/dtos/flashcard/Flashcard.dto"
import { ModeToggle } from "@/components/mode-toggle"


export default function Review() {
  const router = useRouter()

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
    {
      flashcardId: 23,
      deckId: 3,
      front: "Until what year has Formula 1 agreed to race in Miami?",
      back: "2041",
      mastery: "unrated",
    },
    {
      flashcardId: 24,
      deckId: 3,
      front: "Who offered advice to Max Verstappen on fatherhood?",
      back: "Christian Horner",
      mastery: "unrated",
    },
    {
      flashcardId: 25,
      deckId: 3,
      front: "What was Lando Norris's position in the Driver Standings after the Miami GP?",
      back: "2nd",
      mastery: "unrated",
    },
    {
      flashcardId: 26,
      deckId: 3,
      front: "What was the main topic of the 'F1 Explains' podcast mentioned?",
      back: "The making of the Miami Grand Prix",
      mastery: "unrated",
    },
    {
      flashcardId: 27,
      deckId: 3,
      front: "What feature highlighted the tragic story of a racer with the nickname 'Captain Nice'?",
      back: "The story of Mark Donohue",
      mastery: "unrated",
    },
    {
      flashcardId: 28,
      deckId: 3,
      front: "What did the Miami Sprint Qualifying highlights video show?",
      back: "Antonelli's historic maiden pole",
      mastery: "unrated",
    },
    {
      flashcardId: 29,
      deckId: 3,
      front: "What was the topic of the 'Tech Talk' segment?",
      back: "Miami car updates",
      mastery: "unrated",
    },
    {
      flashcardId: 30,
      deckId: 3,
      front: "What did Oscar Piastri say about his pole position attempt in Miami?",
      back: "He revealed where it 'went away' from him.",
      mastery: "unrated",
    },
    {
      flashcardId: 31,
      deckId: 3,
      front: "What was the topic of the 'Tech Talk' segment?",
      back: "Miami car updates",
      mastery: "unrated",
    },
    {
      flashcardId: 32,
      deckId: 3,
      front: "What did Oscar Piastri say about his pole position attempt in Miami?",
      back: "He revealed where it 'went away' from him.",
      mastery: "unrated",
    },
    {
      flashcardId: 33,
      deckId: 3,
      front: "What was the topic of the 'Tech Talk' segment?",
      back: "Miami car updates",
      mastery: "unrated",
    },
    {
      flashcardId: 34,
      deckId: 3,
      front: "What did Oscar Piastri say about his pole position attempt in Miami?",
      back: "He revealed where it 'went away' from him.",
      mastery: "unrated",
    },
  ]
  const deckTitle = "Formula 1 Miami GP 2025 Quiz"
  const masteryLevels: MASTERY_LEVEL[] = ["unsure", "familiar", "mastered"]

  const [flashcards, setFlashcards] = useState<Flashcard[]>(originalFlashcards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteryRatings, setMasteryRatings] = useState<Record<number, MASTERY_LEVEL>>({}) // flasdhcardId to mastery level mapping for every session
  const [isShuffled, setIsShuffled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  const currentCard = flashcards[currentIndex]
  const currentMastery = masteryRatings[currentCard?.flashcardId] || "unrated"

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

  const handleMasterySelect = async(userMastertyRate: MASTERY_LEVEL) => {
    setMasteryRatings((prev) => ({
      ...prev,
      [currentCard.flashcardId]: userMastertyRate,
    }))
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate async operation
    // Move to next card after rating
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      handleDoneReviewing()
    }
  }

  const handleDoneReviewing = () => {
    setShowCompletionModal(true)
  }

  const getStatistics = () => {
    const stats = {
      mastered: 0,
      familiar: 0,
      unsure: 0,
      total: flashcards.length,
    }

    Object.values(masteryRatings).forEach((rating) => {
      if (rating === "mastered") stats.mastered++
      else if (rating === "familiar") stats.familiar++
      else if (rating === "unsure") stats.unsure++
    })

    return stats
  }

  const stats = getStatistics()
  const progressPercentage = ((currentIndex + 1) / flashcards.length) * 100

  const getMasteryConfig = (level: MASTERY_LEVEL) => {
    const isSelected = currentMastery === level
    switch (level) {
      case "mastered":
        return {
          icon: CheckCircle2,
          label: "Mastered",
          color: isSelected
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
          gradient: "from-emerald-400 to-green-500",
        }
      case "familiar":
        return {
          icon: Target,
          label: "Familiar",
          color: isSelected
            ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
            : "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200",
          gradient: "from-amber-400 to-orange-500",
        }
      case "unsure":
        return {
          icon: AlertCircle,
          label: "Unsure",
          color: isSelected
            ? "bg-rose-500 text-white shadow-lg shadow-rose-200"
            : "bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200",
          gradient: "from-rose-400 to-red-500",
        }
      default:
        return {
          icon: Clock,
          label: "Unrated",
          color: "bg-gray-50 text-gray-600 border-gray-200",
          gradient: "from-gray-400 to-gray-500",
        }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex flex-col">
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
                {(masteryLevels).map((level) => {
                  const config = getMasteryConfig(level)
                  const Icon = config.icon
                  const isSelected = currentMastery === level

                  return (
                    <Button
                      key={level}
                      onClick={() => handleMasterySelect(level)}
                      className={`h-16 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? `bg-gradient-to-br ${config.gradient} text-secondary-foreground scale-105`
                          : "bg-muted text-secondary-foreground hover:bg-primary/50 hover:scale-105"
                      }`}
                      variant="outline"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium capitalize text-secondary-foreground">{level}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Completion Modal */}
        <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
          <DialogContent className="sm:max-w-lg border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🎉 Amazing Work!
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                You've completed your study session
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-emerald-600">{stats.mastered}</div>
                  <div className="text-sm text-emerald-700 font-medium">Mastered</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-6 rounded-2xl border border-amber-200">
                  <Target className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-600">{stats.familiar}</div>
                  <div className="text-sm text-amber-700 font-medium">Familiar</div>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-red-100 p-6 rounded-2xl border border-rose-200">
                  <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-rose-600">{stats.unsure}</div>
                  <div className="text-sm text-rose-700 font-medium">Need Review</div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block bg-gray-50 border border-gray-200 rounded-xl px-6 py-3">
                  <span className="text-sm text-gray-600">Total cards reviewed: </span>
                  <span className="font-bold text-gray-800">{stats.total}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Home className="w-5 h-5 mr-2" />
                Return to Homepage
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
