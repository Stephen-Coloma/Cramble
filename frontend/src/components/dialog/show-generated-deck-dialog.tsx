'use client'

import { DeckFlashcardsSchema } from "./add-deck-dialog";
import { DeckFlashcardsFormData } from "./add-deck-dialog";
import { FlashcardInputCard } from "../flashcard-input-card";
import { usePost } from "@/hooks/use-request";
import { useState, useEffect, ChangeEvent, useRef, useLayoutEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import {useFieldArray, useForm} from 'react-hook-form'
import { SubmitHandler } from "react-hook-form";
import {toast} from 'sonner'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "../ui/button"
import { Pickaxe } from "lucide-react";
import { Textarea } from "../ui/textarea";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export type ShowGeneratedDeckDialogProps = {
    generatedDeckFlashcardsData: DeckFlashcardsFormData,
    onDialogClose: ()=> void
}

// this dialog will handle generated flashcards data from the generate flashcards. basically it only holds the form and the dialog
export default function ShowGeneratedDeckDialog({
    generatedDeckFlashcardsData,
    onDialogClose
}: ShowGeneratedDeckDialogProps){   
    const {status, loading, executePostRequest , clearResponseState } = usePost('http://localhost:3001/api/decks');
    
    const {register, control, unregister, getValues, handleSubmit, formState: {errors, isSubmitting}, reset, setError, clearErrors } = useForm<DeckFlashcardsFormData>({
        resolver: joiResolver(DeckFlashcardsSchema),
        defaultValues: {
            title: generatedDeckFlashcardsData.title,
            description: generatedDeckFlashcardsData.description,
            flashcards: generatedDeckFlashcardsData.flashcards,
        }
    });

    const {fields, append, remove} = useFieldArray<DeckFlashcardsFormData>({
        control, 
        name: 'flashcards'
    })
    
    const onSubmit: SubmitHandler<DeckFlashcardsFormData> = async (formData: DeckFlashcardsFormData) => {
        await executePostRequest(formData)
    };

    // toaster pops when deck is ADDED, closes the dialog
    useEffect(()=>{
        if(status === 200){
            toast.success('Deck created', {
                description: new Date(getValues('createdAt')).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
            })

            // close the dialog on the parent
            onDialogClose()

            // reset state so that next request is not tied with past requests
            clearResponseState()

            // reset all form states
            reset()
            
            // unregister all flashcard input forms
            unregister('flashcards')
        }
    }, [loading])

    
    const removeFlashcard = (flashcardIndex: number) =>{
        if(fields.length < 4){
            setError("root", {message: "need at least 3 cards"})
            return;
        }
        remove(flashcardIndex)
    }

    const addFlashcard = () => {
        append({
            front: '',
            back: ''
        })
    }
    
    // when dialog changes, reset the form and close dialog from the parent component
    const onDialogOpenChange = ()=>{
        reset()
        unregister('flashcards')
        onDialogClose()
    }

    return (
        // a dialog that do not have trigger, dialog open = true important because we dont have triggers already
        <Dialog open={true} onOpenChange={onDialogOpenChange}>
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
                            defaultValue={generatedDeckFlashcardsData.title}
                            placeholder="Enter a title (e.g., Math Quiz 101)"
                            onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                const target = e.target as HTMLInputElement;

                                if(target.value.length > 30){
                                    setError('title', {type: 'max', message: 'title cannot exceed 30 characters'})
                                }else{
                                    clearErrors('title')
                                }
                            }}
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
                            className={`max-h-64 min-h-[90px] sm:min-h-[60px] lg:min-h-1 overflow-hidden resize-none ${errors.description ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}`}
                            defaultValue={generatedDeckFlashcardsData.description}
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

                    <Label className="mb-4">{`Total: ${fields.length}`}</Label>

                    <div className="flex flex-col flex-grow sm:flex-none gap-4 mb-4">
                        {fields.map((field, index) => (
                            <FlashcardInputCard key={field.id} flashcardIndex={index} formUtilities={{register, errors}} onFlashcardRemove={removeFlashcard} data={field}></FlashcardInputCard>
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
                            <Button type='button' disabled={isSubmitting ? true : false} variant={'destructive'} onClick={onDialogOpenChange}>
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