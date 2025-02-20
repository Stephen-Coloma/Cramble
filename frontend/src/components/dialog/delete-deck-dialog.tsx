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
import { usePost } from "@/hooks/use-request"
import { Trash2, TriangleAlert, X } from "lucide-react"

export default function DeleteDeckDialog( { deckId }: {deckId: number} ){
    // const {} = useDelete(`http://localhost:3001/api/decks/${deckId}`)

    return(
        <Dialog>
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

                </div>

                <DialogFooter className="gap-2">
                    <Button variant={'secondary'}><X/>Cancel</Button>
                    <Button variant={'destructive'}><Trash2/>Delete</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}