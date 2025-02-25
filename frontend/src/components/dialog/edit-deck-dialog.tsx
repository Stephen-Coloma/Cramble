import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePost, usePut } from "@/hooks/use-request"
import { Pencil, X, Trash2, FolderCheck, FileCheck, Check } from "lucide-react"
import { useState, useEffect, ChangeEvent } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import Joi from "joi"
import { joiResolver } from "@hookform/resolvers/joi"
import { Textarea } from "../ui/textarea"

export const DeckSchema = Joi.object({
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
    editedAt: Joi.string().isoDate().required().messages({
        "string.isoDate": "invalid date format",
    })
})

export type DeckFormData = {
    title: string,
    description: string,
    editedAt: string
}

export type EditDeckDialogProps = {
    deckId: number,
    title: string,
    description: string,
    onDeckEdit: (deckId: number,  newTitle: string, newDescription: string, editedAt: string) => void,
    onPopOverClose: () => void
}

export default function EditDeckDialog({
    deckId,
    title,
    description,
    onDeckEdit,
    onPopOverClose
}: EditDeckDialogProps){
    const [isDialogOpen, setIsDialogOpen]= useState<boolean>(false);

    const {status, statusText, error, loading, executePutRequest, clearResponseState} = usePut(`http://localhost:3001/api/decks/${deckId}`);

    const {register, unregister, handleSubmit, getValues, formState: {errors, isSubmitting}, setError, clearErrors} = useForm<DeckFormData>({
        resolver: joiResolver(DeckSchema),
        defaultValues: {
            title: title,
            description
        }
    })

    const onSubmit: SubmitHandler<DeckFormData> = async(formData: DeckFormData) => {
        // todo: delay to be removed
        await new Promise((resolve) => {setTimeout(resolve, 1000)})
        await executePutRequest(formData);
    }

    // updates the ui based on dependency change
    useEffect(()=>{
        if(status === 200){
            toast.success('Deck edited successfully', {
                description: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
            })
            // callback to edit in the UI
            onDeckEdit(deckId, getValues('title'), getValues('description'), getValues('editedAt'))
            clearResponseState();
            setIsDialogOpen(false);
            onPopOverClose();
        }
    }, [loading])

    return(
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size={'default'} variant={'ghost'} className="justify-start px-2 text-muted-foreground">
                    <Pencil/>
                    Edit title and description
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">

                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit Deck</DialogTitle>
                        <DialogDescription>
                            Edit your deck here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2 my-8">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            {...register('title')}
                            className={errors.title ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}
                            id="title"
                            type="text"
                            placeholder="Enter a title (e.g., Math Quiz 101)"
                            defaultValue={title}
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
                            className={`max-h-40 h-40 overflow-hidden resize-none ${errors.description ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}`}
                            placeholder="Add a description"
                            defaultValue={description}
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


                    {/* input for createdAt */}
                    <Input
                        {...register('editedAt')}
                        id="editedAt"
                        type="hidden"
                        value={new Date().toISOString()}
                    />

                    <DialogFooter className="gap-2">
                        <DialogTrigger asChild>
                            <Button type='button' variant={'secondary'} disabled={isSubmitting ? true : false} onClick={()=>{setIsDialogOpen(false)}}>
                                <X/>Cancel
                            </Button>
                        </DialogTrigger>

                        <Button type='submit' disabled={isSubmitting ? true : false}>
                            <Check/>Save Changes
                        </Button>
                    </DialogFooter>
                </form>
                
            </DialogContent>
        </Dialog>
    )
}