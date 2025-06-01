"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

interface FlashcardFlipProps {
  isFlipped: boolean;
  onFlip: () => void;
  frontContent: string;
  backContent: string;
  className?: string;
}

export default function FlashcardFlip({
  isFlipped,
  onFlip,
  frontContent,
  backContent,
  className = "",
}: FlashcardFlipProps) {
  return (
    <div
      className={`relative w-full h-96 sm:h-[28rem] perspective-1000 ${className}`}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        onClick={onFlip}
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.8,
          ease: [0.23, 1, 0.32, 1], // Custom easing for smooth flip
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Front Side */}
        <Card
          className="absolute inset-0 w-full h-full bg-muted border-0 shadow-lg backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardContent className="h-full flex items-center justify-center p-8 relative overflow-hidden">
            <div className="text-center relative z-10 w-full">
              {/* Card Type Indicator */}
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground dark:text-muted">
                  Question
                </span>
                <RotateCcw className="w-4 h-4 text-muted-foreground dark:text-muted" />
              </div>

              <p className="text-xl sm:text-2xl font-semibold leading-relaxed text-secondary-foreground max-w-3xl mx-auto">
                {frontContent}
              </p>

              <div className="mt-8 text-sm text-muted-foreground">
                Tap anywhere to flip
              </div>
            </div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-sm"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </CardContent>
        </Card>

        {/* Back Side */}
        <Card
          className="absolute inset-0 w-full h-full bg-muted border-0 shadow-lg backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
          }}
        >
          <CardContent className="h-full flex items-center justify-center p-8 relative overflow-hidden">
            <div className="text-center relative z-10 w-full">
              {/* Card Type Indicator */}
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground dark:text-muted">
                  Answer
                </span>
                <RotateCcw className="w-4 h-4 text-muted-foreground dark:text-muted" />
              </div>

              <p className="text-xl sm:text-2xl font-semibold leading-relaxed text-secondary-foreground max-w-3xl mx-auto">
                {backContent}
              </p>

              <div className="mt-8 text-sm text-muted-foreground"              >
                Tap to flip back
              </div>
            </div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-sm"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
