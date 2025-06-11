"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";
import { useRouter } from "next/navigation";

type ErrorProps = {
  errorMessage?: string;
  fallbackRoute: string;
}

export default function ErrorLoadingCards({
  errorMessage = "Something went wrong while loading your flashcards",
  fallbackRoute,
}: ErrorProps) {
  const router = useRouter();

  const handleGoHome = () => {
    router.push(fallbackRoute);
  };

  return (
    <div className="bg-[url('/assets/cramble-background-25.svg')] bg-cover bg-center min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
            >
              <div className="relative">
                <AlertTriangle className="w-10 h-10 text-destructive" />
                <motion.div
                  className="absolute -inset-2 rounded-full border-2 border-red-200"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0.2, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
            </motion.div>

            {/* Error Message */}
            <div className="text-center space-y-3">
              <motion.h3
                className="text-xl font-semibold text-destructive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Oops!
              </motion.h3>

              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {errorMessage}
              </motion.p>
            </div>

            {/* Home Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full"
            >
              <Button
                onClick={handleGoHome}
                className="w-full group relative"
                variant="default"
              >
                <span className="flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  Return to Homepage
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-white/50 w-0"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
