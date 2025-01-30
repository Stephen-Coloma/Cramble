'use client'

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

import { CirclePlus } from "lucide-react";

export function AddDeckDialog({variant} : {variant: 'simple-button' | 'deck-button'}){
    return (
        <Dialog>
            <DialogTrigger asChild>
                {variant === 'deck-button' ? 
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
                    <Button>Hehe</Button>
                 }
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">

                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Name
                        </Label>
                        <Input id="name" value="Pedro Duarte" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                        Username
                        </Label>
                        <Input id="username" value="@peduarte" className="col-span-3" />
                    </div>
                    </div>

                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


