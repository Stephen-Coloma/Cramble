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
import { ChangeEvent, useEffect, useState } from "react"
import { usePost } from "@/hooks/use-request"
import { toast } from "sonner"
import { stat } from "fs"

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
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    
    // array of flashcard numbers only. cannot pass multiple instances of form utilities
    const [flashcardArray, setFlashcardArray] = useState<number[]>([1,2,3]);

    const {status, statusText, data, error, loading, callback, resetStates } = usePost('http://localhost:3001/api/decks');
    
    const {register, unregister, setValue, getValues, handleSubmit, formState: {errors, isSubmitting}, reset, setError, clearErrors } = useForm<DeckFlashcardsFormData>({
        resolver: joiResolver(DeckFlashcardsSchema)
    });
    
    const onSubmit: SubmitHandler<DeckFlashcardsFormData> = async (formData: DeckFlashcardsFormData) => {
        await new Promise((resolve) => {setTimeout(resolve, 2000)}); 
        await callback(formData)
    };

    // toaster pops when deck is added, closes the dialog
    useEffect(()=>{        
        if(status === 200){
            toast.success('Deck created', {
                description: new Date(getValues('createdAt')).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
            })

            // Close the dialog
            setIsDialogOpen(false);

            // reset state so that next request is not tied with past requests
            resetStates()

            // add the on deck added
            const newlyAddedDeck: DeckProps = {
                deckId: data.deckId,
                title: getValues('title'),
                description: getValues('description'),
                createdAt: getValues('createdAt'),
                editedAt: 'null',
                totalCards: flashcardArray.length,
                unsureTotal: 0,
                familiarTotal: 0,
                masteredTotal: 0,
                unratedTotal: flashcardArray.length,
            }

            // render the newly added deck on the list using the callback function
            onDeckAdded(newlyAddedDeck)

            // reset all form states
            reset()
            
            // unregister all flashcard input forms
            unregister('flashcards')

            // set new flashcard arra
            setFlashcardArray([1,2,3])
        }
    }, [loading])
    
    const removeFlashcard = (flashcardNo: number) => {
        // do not remove card if less than 3
        if(flashcardArray.length < 4){
            setError('root', {message: 'need atleast 3 cards'})
        }else{
            const index = flashcardArray.indexOf(flashcardNo);
    
            //get the trailing elements
            const trailing = flashcardArray.slice(index)
            
            // adjust values to left
            trailing.forEach((flashcard)=> {
                setValue( `flashcards.${flashcard - 1}`, getValues(`flashcards.${flashcard}`));
            })      
            
            // unregister the last flashcard because it doesnt have data anymore
            unregister(`flashcards.${flashcardArray.length-1}`)
    
            // remove now the last flashcard 
            flashcardArray.splice(flashcardArray.length-1)
    
            setFlashcardArray([...flashcardArray])    
        }

    };

    const addFlashcard = () => {
        // last element + 1 becomes the new last element
        setFlashcardArray([...flashcardArray, flashcardArray[flashcardArray.length-1]+1])
    }
    
    return (
        // deck button and mobile view = deck button hidden
        // deck button !mobile view = deck button
        // !deck-button = simple button
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {variant === 'deck-button' && !isMobile ? 
                    <Card className="min-h-[306px] bg-muted border-2 border-primary/50 hover:border-primary hover:border-4 shadow transition-colors duration-200 relative">
                        <Button 
                            className="w-full h-full absolute top-0 left-0 opacity-0 pointer-events-auto bg-muted z-10"
                            onClick={() => setIsDialogOpen(true)} // Opens the dialog
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
                    <Button variant={'default'} size={'icon'} 
                        className={`${variant === 'deck-button' && isMobile ? 'hidden' : ''} min-h-9 min-w-9`}
                        onClick={() => setIsDialogOpen(true)}>
                        <Plus></Plus>
                    </Button>
                }
            </DialogTrigger>
            <DialogContent className="h-full sm:h-fit sm:max-w-[1025px] pt-12">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full sm:max-h-[600px] overflow-y-auto px-4">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="flex items-center gap-2 text-left">
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

                    <Button type='button' disabled={isSubmitting ? true : false} className="text-white sm:min-h-24 sm:text-base bg-primary/85 hover:bg-primary mb-4" onClick={addFlashcard}>
                        Add Flashcard
                    </Button>

                    {/* error message for less than three cards */}
                    {errors.root?.message && <Label className="text-sm text-destructive">{errors.root.message}</Label>}

                    <DialogFooter className="flex-row gap-2 justify-end">
                        <DialogTrigger asChild>
                            <Button type='button' disabled={isSubmitting ? true : false} variant={'destructive'} onClick={() => reset()}>
                                Cancel
                            </Button>
                        </DialogTrigger>
                        <Button type="submit" disabled={isSubmitting ? true : false}>{isSubmitting ? 'Creating' : 'Create'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}