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

import { DeckWithStatsDTO } from "@/dtos/deck/DeckWithStats.dto"

// Deck prop is baed on DeckDTO wherein it is a shared type for backend and frontend
export type DeckProps = Pick<DeckWithStatsDTO, 
  'deckId' | 
  'title' | 
  'description' |
  'createdAt' |
  'editedAt' |
  'totalCards' |
  'unsureTotal' | 
  'familiarTotal' |
  'masteredTotal' |
  'unratedTotal'
>

export function Deck({
  deckId,
  title,
  description,
  createdAt,
  editedAt,
  totalCards,
  unsureTotal,
  familiarTotal,
  masteredTotal,
  unratedTotal
}: DeckProps) {
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
