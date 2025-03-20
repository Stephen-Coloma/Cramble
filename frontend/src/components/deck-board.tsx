'use client'

import * as React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { AddDeckDialog } from "./dialog/add-deck-dialog"
import { Card, CardContent } from "@/components/ui/card"
import {Filter, PackagePlus } from 'lucide-react'
import { useFetch } from "@/hooks/use-request"
import DeckLoading from "./deck-loading"
import { DeckProps } from "./deck"
import { Deck } from "./deck"

export default function DeckBoard(){
  const SERVER_HOST=process.env.NEXT_PUBLIC_SERVER_HOST
  const {status, statusText, data, error, loading}  = useFetch<DeckProps[]>(`https://${SERVER_HOST}/api/decks`)
  const [deckArray, setDeckArray] = useState<DeckProps[]>([]);

  // update the deckArray when data is fetched from useFetch & when it is an array only
  useEffect(()=>{
    if(Array.isArray(data)){
      setDeckArray(data)
    }
  }, [data, loading])
  
  // adds the created deck from add-deck dialog
  const addNewDeck = (newlyAddedDeck: DeckProps) => {
    setDeckArray([...deckArray, newlyAddedDeck])
  }

  // deletes/filters out the deck in the ui from delete deck popover
  const deleteDeck = (deckId: number) => {
    setDeckArray(deckArray.filter((deck)=>deck.deckId !== deckId))
  }

  // edits the deck title and description in the ui from edit deck popover
  const editDeck = (deckId: number, newTitle: string, newDescription: string, newEditDate: string) => {
    setDeckArray((prevDecks) => 
      prevDecks.map((deck)=>
        deck.deckId === deckId 
        ? {...deck, title: newTitle, description: newDescription, editedAt: newEditDate}
        : deck
      )
    )
  }
  
  // todo: implement search and filter (filder depends on what I can filter) 
  return(
    <>
      <Card className="mb-12">
        <CardContent className="flex gap-2 p-2">
          <Input placeholder="Search Deck" />
          <AddDeckDialog onDeckAdded={addNewDeck} variant="simple-button" />
          <Button size={'icon'} className="min-h-9 min-w-9">
            <Filter />
          </Button>
        </CardContent>
      </Card>

      {/* loading ui */}
      {loading && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3">
          {[1,2,3,4,5,6].map((_, index)=> (
            <DeckLoading key={index}></DeckLoading>
          ))}
        </div>
      )}

      {/* non empty decks*/}
      {!loading && (deckArray.length > 0) && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3">
          {deckArray.map((deck, index) => (
            <Deck key={index} {...deck} onDeckDelete={deleteDeck} onDeckEdit={editDeck}/>
          ))}
          <AddDeckDialog onDeckAdded={addNewDeck} variant="deck-button" />         
        </div>
      )}

      {/* empty decks*/}
      {!loading && deckArray.length === 0 && (
        <div className="flex flex-col text-center items-center justify-center h-64 w-full gap-2">
          <div className='dark:bg-gray-200 p-2 rounded-md'><PackagePlus size={50} color="#303030"/></div>
          <Label className="text-lg">No decks created yet</Label>
          <Label className="text-sm text-muted-foreground">Create your first deck to practice learning</Label>
        </div>
      )}

    </>
  );
}