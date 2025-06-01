import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ReviewSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Loading Flashcards</h3>
            <p className="text-sm text-muted-foreground">
              Preparing your study session...
            </p>
          </div>
          <div className="w-full space-y-2">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary/30 rounded-full animate-pulse w-2/3"></div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              This may take a few moments
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
