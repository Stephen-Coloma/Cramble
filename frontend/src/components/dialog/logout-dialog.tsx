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
import { useUserStore } from "@/store/userStore"
import { Handshake, LogOut, LogOutIcon, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export type DeleteDeckDialogProps = {
    deckId: number, 
    onDeckDelete: (deckId: number) => void
    onPopOverClose: () => void
}

export default function LogoutDialog(){
    const router = useRouter();
    const {status, statusText, error, loading, executePostRequest, clearResponseState} = usePost(`http://localhost:3001/auth/logout`);
    

    useEffect(()=>{
        if(status === 200){
            toast.success('Account logged out', {
                description: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
            })
            clearResponseState();
            setIsDialogOpen(false);
            router.push('/');
        }
    }, [loading])

    const [isDialogOpen, setIsDialogOpen]= useState<boolean>(false);

    return(
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant={"secondary"} 
                    className="px-2 py-1 flex-grow bg-transparent hover:bg-secondary"
                >
                    <LogOut></LogOut>
                    <h1 className="text-xs">Log out</h1>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">

                <DialogHeader>
                    <DialogTitle>Confirm Logout</DialogTitle>
                </DialogHeader>

                <div className="grid mx-auto gap-2 py-4 items-center justify-items-center">
                    <div className='bg-gray-200 p-2 rounded-md mb-2'><Handshake size={50} color="#303030"/></div>
                    <DialogDescription>Are you sure you want to logout your account?</DialogDescription>

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

                    <Button variant={'default'} disabled={loading ? true : false} onClick={()=> executePostRequest({})}>
                        <LogOutIcon/>Logout
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}