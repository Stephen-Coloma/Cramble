'use client'

import { AxiosResponse, AxiosError } from "axios"
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

import { CirclePlus, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile"
import { DeckProps } from "../deck"
import { SubmitHandler, useForm } from "react-hook-form"
import { Textarea } from "../ui/textarea"
import { FlashcardInputCard } from "../flashcard-input-card"
import { ScrollArea } from "@radix-ui/react-scroll-area"

export type AddDeckDialogProps = {
    variant: 'simple-button' | 'deck-button',
    onDeckAdded: (newlyAddedDeck: DeckProps) => void;
}

// Define schemas
const FlashcardsSchema = Joi.object({
    front: Joi.string().min(1).max(400).required().messages({
      "string.empty": "Front text is required",
      "string.min": "Front must be at least 1 character",
      "string.max": "Front cannot exceed 400 characters",
    }),
    back: Joi.string().min(1).max(400).required().messages({
      "string.empty": "Back text is required",
      "string.min": "Back must be at least 1 character",
      "string.max": "Back cannot exceed 400 characters",
    }),
  });
  
const DeckFlashcardsSchema = Joi.object({
    title: Joi.string().min(3).max(30).required().messages({
        "string.empty": "Title is required",
        "string.min": "Title must be at least 3 characters",
        "string.max": "Title cannot exceed 30 characters",
    }),
    description: Joi.string().min(3).max(250).required().messages({
        "string.empty": "Description is required",
        "string.min": "Description must be at least 3 characters",
        "string.max": "Description cannot exceed 250 characters",
    }),
    createdAt: Joi.string().isoDate().required().messages({
        "string.isoDate": "Invalid date format",
    }),
    flashcards: Joi.array().items(FlashcardsSchema).min(1).required().messages({
        "array.min": "At least one flashcard is required",
    }),
  });

type DeckFlashcardsFormData = {
    title: string,
    description: string,
    createdAt: string,
    flashcards: {
        front: string,
        back: string
    }[]
}

export function AddDeckDialog({variant="deck-button", onDeckAdded} : AddDeckDialogProps){
    const isMobile = useIsMobile()

    const {register, setError, handleSubmit, formState: {errors, isLoading}, } = useForm<DeckFlashcardsFormData>({
        resolver: joiResolver(DeckFlashcardsSchema)
    });


    // const onSubmit = async () => {
    //     const axios = require('axios');
    //     let config = {
    //         method: 'post',
    //         maxBodyLength: Infinity,
    //         url: 'http://localhost:3001/api/decks',
    //         withCredentials: true
    //     };

    //     axios.request(config)
    //     .then((response: AxiosResponse) => {
    //         // create now the new deck if response is ok
    //         // onDeckAdded();    
    //     })
    //     .catch((error: AxiosError) => {
    //         console.log(error.response?.data);
    //     });
    // };

    const onSubmit: SubmitHandler<DeckFlashcardsFormData> = (data: DeckFlashcardsFormData) => {
        console.log(data);
    };

    console.log(errors);
       

    return (
        // deck button and mobile view = button(hidden)
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
                <DialogContent className="sm:max-w-[1025px] h-full sm:h-3/4 pt-12">
                    <form onSubmit={handleSubmit(onSubmit)} className="h-[92%] overflow-y-auto">
                        <DialogHeader className="mb-4">
                            <DialogTitle>Create Deck, Add Flashcards</DialogTitle>
                            <DialogDescription>
                                Add a title, a short description, and your first flashcard.        
                            </DialogDescription>
                        </DialogHeader>
                            
                        <div className="grid gap-2 mb-4">
                            <Label htmlFor="title">Title</Label>
                            <Input {...register('title')}
                                className={errors.title ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}
                                id="title"
                                type="text"
                                placeholder="Enter a title (e.e Math Quiz 101)"
                            />
                            {errors.title && <Label className="text-xs text-destructive">{errors.title.message?.replaceAll('\"', "")}</Label>}
                        </div>

                        <div className="grid gap-2 mb-8">
                            <Label htmlFor="description">Description</Label>
                            <Textarea {...register('description')}
                                className={errors.title ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}
                                id="description"
                                placeholder="Add a description"
                                
                            />
                            {errors.description && <Label className="text-xs text-destructive">{errors.description.message?.replaceAll('\"', "")}</Label>}
                        </div>

                        {/* flashcards container */}
                        <div>
                            <FlashcardInputCard></FlashcardInputCard>
                            <FlashcardInputCard></FlashcardInputCard>
                            <FlashcardInputCard></FlashcardInputCard>
                            <FlashcardInputCard></FlashcardInputCard>
                            <FlashcardInputCard></FlashcardInputCard>
                            <FlashcardInputCard></FlashcardInputCard>
                            <FlashcardInputCard></FlashcardInputCard>
                            <FlashcardInputCard></FlashcardInputCard>
                            {/* <div>
                                <label>Flashcard Front</label>
                                <input {...register("flashcards.0.front")} />
                                {errors.flashcards?.[0]?.front && <p>{errors.flashcards[0].front.message}</p>}
                            </div>

                            <div>
                                <label>Flashcard Back</label>
                                <input {...register("flashcards.0.back")} />
                                {errors.flashcards?.[0]?.back && <p>{errors.flashcards[0].back.message}</p>}
                            </div> */}
                        </div>

                        <DialogFooter className="absolute flex-row gap-2 bottom-4 right-4">
                            <Button type="submit" variant={'destructive'}>Cancel</Button> 
                            <Button type="submit">Create</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
        </Dialog>
    );
}


// WORK ON THE CARD THAT ALLOWS USERS TO ADD AS MANY FLASHCARDS THEY WANT!!!!!
// MAKE SURE THAT THE CONTENT IS SCROLLABLE. EITHER THE FLASHCARDS IS SCROLLABLE ONLY OR WITH THE WHOLE DIALOF