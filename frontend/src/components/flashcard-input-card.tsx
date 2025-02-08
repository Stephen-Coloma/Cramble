import { Label } from "./ui/label";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import {Trash2} from 'lucide-react'
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { DeckFlashcardsFormData } from "./dialog/add-deck-dialog";
import { ChangeEvent } from "react";

export type FlashcardInputCardProps = {
    formUtilities: {
        register: UseFormRegister<DeckFlashcardsFormData>
        errors: FieldErrors<DeckFlashcardsFormData>
    },
    flashcardNo: number,
    onFlashcardRemove: (flashcardNo: number) => void
}

export function FlashcardInputCard({
    formUtilities: {
        register,
        errors,
    },
    flashcardNo,
    onFlashcardRemove
}: FlashcardInputCardProps){
    return(
        <Card className="w-full min-h-64 sm:min-h-40 px-4 bg-muted border-2 border-transparent hover:border-primary shadow transition-colors duration-200">
            <CardHeader className="flex-row justify-between items-baseline p-0">
                <Label className="h-9 w-9 text-xl font-bold  text-center">{flashcardNo}</Label>
                <Button type='button' variant={'ghost'} size={'icon'} onClick={()=> onFlashcardRemove(flashcardNo)}> 
                    <Trash2></Trash2>
                </Button>
            </CardHeader>
            <Separator orientation="horizontal" className="bg-primary"></Separator>

            <CardContent className="flex flex-col gap-4 sm:flex-row p-0 pt-4 mb-4">
                <div className="flex-grow">
                    <Label htmlFor={`flashcards.${flashcardNo-1}.front`} className="text-left sm:text-center block w-full mb-2">Question</Label>
                    <Textarea {...register(`flashcards.${flashcardNo-1}.front`)}
                        className={`max-h-64 min-h-1 overflow-hidden resize-none text-muted-foreground text-justify border-x-0 border-t-0 shadow-none border-b-ring rounded-none focus-visible:border-b-4 focus-visible:ring-0
                            ${errors?.flashcards?.[flashcardNo - 1]?.front ? 'border-b-destructive focus-visible:ring-0' : ''}`}
                        id={`flashcards.${flashcardNo-1}.front`}
                        placeholder="Enter question here..."
                        rows={1}
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                        }}
                        />
                    { errors?.flashcards?.[flashcardNo - 1]?.front && <Label className="text-xs text-destructive">{ errors?.flashcards?.[flashcardNo - 1]?.front?.message?.replaceAll('\"', "")}</Label>}
                </div>

                <div className="flex-grow">
                    <Label htmlFor={`flashcards.${flashcardNo-1}.back`} className="text-left sm:text-center block w-full mb-2">Answer</Label>
                    <Textarea {...register(`flashcards.${flashcardNo-1}.back`)}
                        className={`max-h-64 min-h-1 overflow-hidden resize-none text-muted-foreground text-justify border-x-0 border-t-0 shadow-none border-b-ring rounded-none focus-visible:border-b-4 focus-visible:ring-0
                            ${errors?.flashcards?.[flashcardNo - 1]?.back ? 'border-b-destructive focus-visible:ring-0' : ''}`}
                        id={`flashcards.${flashcardNo-1}.back`}
                        placeholder="Enter answer here..."
                        rows={1}
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                        }}
                    />
                    { errors?.flashcards?.[flashcardNo - 1]?.back && <Label className="text-xs text-destructive">{ errors?.flashcards?.[flashcardNo - 1]?.back?.message?.replaceAll('\"', "")}</Label>}
                </div>
            </CardContent>

        </Card>
    )
}
