import { Label } from "./ui/label";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import {Trash2} from 'lucide-react'
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { DeckFlashcardsFormData } from "./dialog/add-deck-dialog";


// card number
// question
// answer
// delete button

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
        <Card className="w-full min-h-48 p-2 bg-muted border-2 border-transparent hover:border-primary shadow transition-colors duration-200">
            <CardHeader className="flex-row justify-between items-baseline p-0">
                <Label className="h-9 w-9 text-xl font-bold  text-center">1</Label>
                <Button variant={'ghost'} size={'icon'}>
                    <Trash2></Trash2>
                </Button>
            </CardHeader>
            <Separator orientation="horizontal" className="bg-primary"></Separator>

            <CardContent className="p-0">
                <Label htmlFor={`flashcards.${flashcardNo-1}.front`}>Flashcard Front</Label>
                <Textarea {...register(`flashcards.${flashcardNo-1}.front`)}
                    className={ errors?.flashcards?.[flashcardNo - 1]?.front  ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}
                    id={`flashcards.${flashcardNo-1}.front`}
                    placeholder="Add a description"
                />
                { errors?.flashcards?.[flashcardNo - 1]?.front && <Label className="text-xs text-destructive">{ errors?.flashcards?.[flashcardNo - 1]?.front?.message?.replaceAll('\"', "")}</Label>}
                
                <Label htmlFor={`flashcards.${flashcardNo-1}.back`}>Flashcard Back</Label>
                <Textarea {...register(`flashcards.${flashcardNo-1}.back`)}
                    className={ errors?.flashcards?.[flashcardNo - 1]?.back ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}
                    id={`flashcards.${flashcardNo-1}.back`}
                    placeholder="Add a description"
                />
                { errors?.flashcards?.[flashcardNo - 1]?.back && <Label className="text-xs text-destructive">{ errors?.flashcards?.[flashcardNo - 1]?.back?.message?.replaceAll('\"', "")}</Label>}
            </CardContent>

        </Card>
    )
}
