'use client'

import * as React from "react"
import { useEffect, useState } from "react"
import { AxiosError, AxiosResponse } from "axios"

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

// Container for the decks in the My Decks page
export function Decks(){
  const [deckArray, setDeckArray] = useState<DeckProps[]>([]); // Initialize as an empty array

  useEffect(() => {
    // Fetch or load data here
    const fetchDecks = async () => {
      const axios = require('axios');
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3001/api/decks',
        withCredentials: true
      };

      axios.request(config)
      .then((response: AxiosResponse) => {
        setDeckArray(response.data);    
        console.log(deckArray);
        
      })
      .catch((error: AxiosError) => {
        console.log(error.response?.data);
      });
    }
    fetchDecks();
  }, []); // Run only once when the component mounts

  return(
    <div className="border-green-500 border-4">
      {deckArray.map((deck, index) => (
          <Deck key={index} {...deck}></Deck>
      ))}
    </div>
  )
}