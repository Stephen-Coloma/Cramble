import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Deck as DeckDTO } from "@/dtos/Deck.dto"

// Deck prop is baed on DeckDTO wherein it is a shared type for backend and frontend
export type DeckProp = Pick<DeckDTO, 'deckId' | 'title' | 'description' | 'createdAt' | 'editedAt'>;

export function Deck({
  deckId,
  title,
  description,
  createdAt,
  editedAt
}: DeckProp) {
  return (
    <Card className="w-100">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* content for metrics */}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button size={'sm'}>Start Review</Button>
      </CardFooter>
    </Card>
  )
}
