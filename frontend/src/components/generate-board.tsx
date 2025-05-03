"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bot, LoaderCircle, Sparkles } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { joiResolver } from "@hookform/resolvers/joi";
import { usePost } from "@/hooks/use-request";
import ShowGeneratedDeckDialog from "./dialog/show-generated-deck-dialog";
import { Progress } from "@/components/ui/progress";
import { generateFlashcardsSchema } from "@/schema/generate-flashcards-schema";

type GenerateFlashcardsFormData = {
  text: string;
  count: number;
};

export default function GenerateBoard() {
  const SERVER_HOST = process.env.NEXT_PUBLIC_SERVER_HOST;

  const [remaining, setRemaining] = useState<number>(1500);
  const [charCount, setCharCount] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const {
    register,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GenerateFlashcardsFormData>({ resolver: joiResolver(generateFlashcardsSchema) });

  const {
    status,
    statusText,
    data,
    error,
    loading,
    executePostRequest,
    clearResponseState,
  } = usePost(`http://${SERVER_HOST}/api/gemini/generate`);

  const onSubmit: SubmitHandler<GenerateFlashcardsFormData> = async (
    formData: GenerateFlashcardsFormData
  ) => {
    // todo: delay to be removed
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    await executePostRequest(formData);
  };

  // useEffect to handle loading changes
  useEffect(() => {
    if (status === 200) {
      data.createdAt = new Date().toISOString();
      setIsDialogOpen(true);
      clearResponseState();
    }
  }, [loading, status, data, clearResponseState]);

  // callback function that closes the dialog from the child
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Calculate progress percentage for the character count
  const progressPercentage = Math.min((charCount / 1500) * 100, 100);

  return (
    <>
      <div className="flex flex-col justify-start md:justify-center md:h-1/2 lg:h-3/4 max-w-3xl mx-auto w-full">
        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl font-bold">
              <Bot className="text-primary" />
              AI Creates, You Learn!
            </CardTitle>
            <CardDescription>
              Enter your notes below and our AI will generate flashcards to help
              you study
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="space-y-2">
                <div className="relative">
                  <Textarea
                    {...register("text", {})}
                    className="min-h-64 max-h-96 sm:min-h-32 sm:max-h-80 text-sm md:text-base overflow-auto resize-none bg-background border-muted focus-visible:ring-primary"
                    disabled={isSubmitting}
                    id="text"
                    placeholder="Start typing or paste your notes here..."
                    onInput={(e: ChangeEvent<HTMLTextAreaElement>) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                      const length = e.target.value.length;
                      setCharCount(length);
                      setRemaining(1500 - length);
                    }}
                  />
                  {isSubmitting && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-md">
                      <div className="flex flex-col items-center gap-2">
                        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium">
                          Generating your flashcards...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label
                      className={`text-xs ${errors.text ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {charCount >= 1500
                        ? "Minimum character requirement met"
                        : `${remaining} more characters needed`}
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {charCount}/1500
                    </span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    className="h-1"
                    color={charCount >= 1500 ? "bg-green-500" : "bg-primary"}
                  />
                </div>
              </div>

              {/* error from server */}
              {error && !isSubmitting && (
                <div className="bg-destructive/10 p-3 rounded-md border border-destructive">
                  <Label className="text-destructive text-sm">
                    Something went wrong. Please try again later.
                  </Label>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-foreground font-medium">
                    Number of flashcards:
                  </Label>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={(value: string) => {
                      setValue("count", Number(value));
                    }}
                    defaultValue="10"
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="75">75</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  {...register("count")}
                  type="hidden"
                  id="count"
                  defaultValue={10}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting || remaining > 0}
                  className="w-full sm:w-auto transition-all"
                >
                  <span className="flex items-center gap-2">
                    Generate <Sparkles className="h-4 w-4" />
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* show the dialog after generation*/}
      {isDialogOpen && data && (
        <ShowGeneratedDeckDialog
          generatedDeckFlashcardsData={data}
          onDialogClose={closeDialog}
        />
      )}
    </>
  );
}
