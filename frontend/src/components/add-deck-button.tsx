'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";

export function AddDeckButton({variant}: {variant: 'primary' | 'secondary'}){
    if (variant === 'primary') {
        return (
          <Card className="min-h-[306px] bg-muted border-2 border-primary/50 hover:border-primary hover:border-4 shadow transition-colors duration-200 relative">
            <Button 
              onClick={() => { console.log('hi'); }} 
              className="w-full h-full absolute top-0 left-0 opacity-0 pointer-events-auto bg-muted z-10"
            />
            <CardContent className="h-full w-full flex flex-col items-center justify-center gap-2 z-1">
              <CirclePlus className="h-16 w-16 text-primary/90" />
              <CardDescription className="text-muted-foreground items-center">
                create new deck 
              </CardDescription>
            </CardContent>
          </Card>
        );
      }
    
      // Return only the button if variant is 'secondary'
    return (
        <Button 
            onClick={() => { console.log('hi'); }} 
            className="w-full h-full bg-muted z-10"
        >
            create new deck
        </Button>
    );       
}