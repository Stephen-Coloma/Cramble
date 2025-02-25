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
import { useDelete } from "@/hooks/use-request"
import { Trash2, TriangleAlert, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, Toaster } from "sonner"

export type DeleteDeckDialogProps = {
    deckId: number, 
    onDeckDelete: (deckId: number) => void
}

export default function DeleteDeckDialog( { deckId, onDeckDelete }: DeleteDeckDialogProps ){
    const {status, statusText, error, loading, executeDeleteRequest, clearResponseState} = useDelete(`http://localhost:3001/api/decks/${deckId}`);

    const [isDialogOpen, setIsDialogOpen]= useState<boolean>(false);

    // updates the ui based on dependency change
    useEffect(()=>{
        if(status === 200){
            toast.success('Deck deleted successfully', {
                description: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
            })
            clearResponseState();
            setIsDialogOpen(false);
            onDeckDelete(deckId)
        }
    }, [loading])

    return(
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size={'default'} variant={'ghost'} className="justify-start px-2 text-muted-foreground">
                    <Trash2/>
                    Delete deck
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">

                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>

                <div className="grid mx-auto gap-2 py-4 items-center justify-items-center">
                    <TriangleAlert size={60} color="#7f1d1d"></TriangleAlert>
                    <DialogDescription>Are you sure you want to delete this item?</DialogDescription>
                    <DialogDescription>This action cannot be undone.</DialogDescription>

                    {error && 
                        <DialogDescription className="text-xs text-destructive">Something went wrong. Try agan later.</DialogDescription>
                    }

                </div>

                <DialogFooter className="gap-2">
                    <DialogTrigger asChild>
                        <Button variant={'secondary'} disabled={loading ? true : false} onClick={()=>{setIsDialogOpen(false)}}>
                            <X/>Cancel
                        </Button>
                    </DialogTrigger>

                    <Button variant={'destructive'} disabled={loading ? true : false} onClick={executeDeleteRequest}>
                        <Trash2/>Delete
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}