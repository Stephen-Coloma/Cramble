import { Label } from "./ui/label";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import {Trash2} from 'lucide-react'
import { Textarea } from "./ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { DeckFlashcardsFormData } from "./dialog/add-deck-dialog";
import { ChangeEvent, useState } from "react";

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
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const [questionTextLength, setQuestionTextLength] = useState<number>(400);
    const [answerTextLength, setAnswerTextLength] = useState<number>(400);

    const handleRemove = () => {      
        setIsRemoving(true)
        setTimeout(()=> {
            onFlashcardRemove(flashcardNo)
            setIsRemoving(false)
        }, 300)   
    }

    return(
        <Card className={`w-full min-h-64 sm:min-h-40 px-4 bg-muted border-2 border-transparent hover:border-primary shadow transition-colors transition-opacity duration-300 ease-in-out
                    ${isRemoving ? "opacity-0" : ""}`}>

            <CardHeader className="flex-row justify-between items-baseline p-0">
                <Label className="h-9 w-9 text-xl font-bold  text-center">{flashcardNo}</Label>
                <Button type='button' variant={'ghost'} size={'icon'} onClick={handleRemove}> 
                    <Trash2></Trash2>
                </Button>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 sm:flex-row p-0 mb-4">
                <div className="flex-grow">
                    <Label htmlFor={`flashcards.${flashcardNo-1}.front`} className="text-left sm:text-center block w-full mb-2">Question</Label>

                    <Textarea {...register(`flashcards.${flashcardNo-1}.front`)}
                        className={`max-h-64 min-h-1 overflow-hidden resize-none mb-4 text-muted-foreground text-justify border-x-0 border-t-0 shadow-none border-b-ring rounded-none focus-visible:border-b-4 focus-visible:ring-0
                            ${errors?.flashcards?.[flashcardNo - 1]?.front ? 'border-b-destructive focus-visible:ring-0' : ''}`}
                        id={`flashcards.${flashcardNo-1}.front`}
                        placeholder="Enter question here..."
                        rows={1}
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                            setQuestionTextLength(400 - e.target.value.length)
                        }}
                        />

                    <h1 className={`text-xs text-center sm:text-left font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${questionTextLength < 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {questionTextLength > 0 ? questionTextLength : 0}
                    </h1>
                    
                    { errors?.flashcards?.[flashcardNo - 1]?.front && 
                    <Label className="text-xs text-destructive">{ errors?.flashcards?.[flashcardNo - 1]?.front?.message?.replaceAll('\"', "")}</Label>}
                </div>

                <div className="flex-grow">
                    <Label htmlFor={`flashcards.${flashcardNo-1}.back`} className="text-left sm:text-center block w-full mb-2">Answer</Label>

                    <Textarea {...register(`flashcards.${flashcardNo-1}.back`)}
                        className={`max-h-64 min-h-1 overflow-hidden resize-none mb-4 text-muted-foreground text-justify border-x-0 border-t-0 shadow-none border-b-ring rounded-none focus-visible:border-b-4 focus-visible:ring-0
                            ${errors?.flashcards?.[flashcardNo - 1]?.back ? 'border-b-destructive focus-visible:ring-0' : ''}`}
                            id={`flashcards.${flashcardNo-1}.back`}
                            placeholder="Enter answer here..."
                            rows={1}
                            onInput={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                                setAnswerTextLength(400 - e.target.value.length)
                            }}
                            />

                    <h1 className={`text-xs text-center sm:text-left font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${answerTextLength < 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {answerTextLength > 0 ? answerTextLength : 0}
                    </h1>
                    
                    { errors?.flashcards?.[flashcardNo - 1]?.back && 
                    <Label className="text-xs text-destructive">{ errors?.flashcards?.[flashcardNo - 1]?.back?.message?.replaceAll('\"', "")}</Label>}
                </div>
            </CardContent>

        </Card>
    )
}
