'use client'

import Joi from "joi"
import { joiResolver } from "@hookform/resolvers/joi"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "../ui/button"

import { CirclePlus, Plus, Pickaxe } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile"
import { DeckProps } from "../deck"
import { SubmitHandler, useForm } from "react-hook-form"
import { Textarea } from "../ui/textarea"
import { FlashcardInputCard } from "../flashcard-input-card"
import { ChangeEvent, EventHandler, FormEventHandler, useState } from "react"

export type AddDeckDialogProps = {
    variant: 'simple-button' | 'deck-button',
    onDeckAdded: (newlyAddedDeck: DeckProps) => void;
}

// Define schemas
const FlashcardsSchema = Joi.object({
    front: Joi.string().min(1).max(400).required().messages({
      "string.empty": "question is required",
      "string.min": "question must be at least 1 character",
      "string.max": "question cannot exceed 400 characters",
    }),
    back: Joi.string().min(1).max(400).required().messages({
      "string.empty": "answer is required",
      "string.min": "answer must be at least 1 character",
      "string.max": "answer cannot exceed 400 characters",
    }),
  });
  
const DeckFlashcardsSchema = Joi.object({
    title: Joi.string().min(3).max(30).required().messages({
        "string.empty": "title is required",
        "string.min": "title must be at least 3 characters",
        "string.max": "title cannot exceed 30 characters",
    }),
    description: Joi.string().min(3).max(250).required().messages({
        "string.empty": "description is required",
        "string.min": "description must be at least 3 characters",
        "string.max": "description cannot exceed 250 characters",
    }),
    createdAt: Joi.string().isoDate().required().messages({
        "string.isoDate": "invalid date format",
    }),
    flashcards: Joi.array().items(FlashcardsSchema).min(1).required().messages({
        "array.min": "at least one flashcard is required",
    }),
  });

export type DeckFlashcardsFormData = {
    title: string,
    description: string,
    createdAt: string,
    flashcards: {
        front: string,
        back: string
    }[]
}


export function AddDeckDialog({variant="deck-button", onDeckAdded} : AddDeckDialogProps){
    const isMobile = useIsMobile();
    
    // array of flashcard numbers only. cannot pass multiple instances of form utilities
    const [flashcardArray, setFlashcardArray] = useState<number[]>([1,2]);
    
    const {register, setError, setValue, handleSubmit, formState: {errors, isSubmitting}, reset, clearErrors } = useForm<DeckFlashcardsFormData>({
        resolver: joiResolver(DeckFlashcardsSchema)
    });
    
    const onSubmit: SubmitHandler<DeckFlashcardsFormData> = (data: DeckFlashcardsFormData) => {
        console.log('i am called');
        
        console.log(data);
    };
    
    const removeFlashcard = (flashcardNo: number) =>{
        console.log('removing card number: ' + flashcardNo);
    }
    
    return (
        // deck button and mobile view = deck button hidden
        // deck button !mobile view = deck button
        // !deck-button = simple button
        <Dialog>
            <DialogTrigger asChild>
                {variant === 'deck-button' && !isMobile ? 
                    <Card className="min-h-[306px] bg-muted border-2 border-primary/50 hover:border-primary hover:border-4 shadow transition-colors duration-200 relative">
                        <Button 
                        className="w-full h-full absolute top-0 left-0 opacity-0 pointer-events-auto bg-muted z-10"
                        />
                        <CardContent className="h-full w-full flex flex-col items-center justify-center gap-2 z-1">
                            <CirclePlus className="h-16 w-16 text-primary/90" />
                            <CardDescription className="text-muted-foreground items-center">
                                create new deck 
                            </CardDescription>
                        </CardContent>
                    </Card>
                    :
                    // change the layout
                    <Button variant={'default'} size={'icon'} className={`${variant === 'deck-button' && isMobile ? 'hidden' : ''} min-h-9 min-w-9`}>
                        <Plus></Plus>
                    </Button>
                }
            </DialogTrigger>
            <DialogContent className="h-full sm:h-fit sm:max-w-[1025px] pt-12">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full sm:max-h-[600px] overflow-y-auto px-4">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="flex items-center gap-2">
                            <div className='bg-gray-200 p-2 rounded-md'>
                                <Pickaxe color="#303030"/>
                            </div>
                            <div>
                                <h1>Create Deck, Add Flashcards</h1>
                                <h1 className="font-normal text-xs text-muted-foreground mt-1">Add a title, a short description, and your first flashcard.</h1>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-2 mb-4">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            {...register('title')}
                            className={errors.title ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}
                            id="title"
                            type="text"
                            placeholder="Enter a title (e.g., Math Quiz 101)"
                        />
                        {errors.title && (
                            <Label className="text-xs text-destructive">
                            {errors.title.message?.replaceAll('"', '')}
                            </Label>)}
                    </div>


                    <div className="grid gap-2 mb-8">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            {...register('description')}
                            className={`max-h-24 min-h-1 overflow-hidden resize-none ${errors.description ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}`}
                            placeholder="Add a description"
                            id="description"
                            rows={1}                  
                            onInput={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                                
                                if(target.value.length > 250){
                                    setError('description', {type: 'max', message: 'description cannot exceed 250 characters'})
                                }else{
                                    clearErrors('description')
                                }
                            }}
                            />
                        {errors.description && (
                            <Label className="text-xs text-destructive">
                            {errors.description.message?.replaceAll('\"', '')}
                            </Label>)}
                    </div>

                    <Label className="mb-4">{`Total: ${flashcardArray.length}`}</Label>

                    <div className="flex flex-col flex-grow sm:flex-none gap-4 mb-4">
                       {flashcardArray.map((flashcardNo, index) => (
                            <FlashcardInputCard key={index} flashcardNo={flashcardNo} formUtilities={{register, errors}} onFlashcardRemove={removeFlashcard}></FlashcardInputCard>
                       ))}
                    </div>

                    {/* input for createdAt */}
                    <Input
                        {...register('createdAt')}
                        id="createdAt"
                        type="hidden"
                        value={new Date().toISOString()}
                    />

                    <DialogFooter className="flex-row gap-2 justify-end">
                    <DialogTrigger asChild>
                        <Button variant={'destructive'} onClick={() => reset()}>
                        Cancel
                        </Button>
                    </DialogTrigger>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


// WORK ON THE CARD THAT ALLOWS USERS TO ADD AS MANY FLASHCARDS THEY WANT!!!!!
// MAKE SURE THAT THE CONTENT IS SCROLLABLE. EITHER THE FLASHCARDS IS SCROLLABLE ONLY OR WITH THE WHOLE DIALOF