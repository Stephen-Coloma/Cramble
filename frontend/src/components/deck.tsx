'use client'

import * as React from "react"
import { useEffect, useState } from "react"
import { AxiosError, AxiosResponse } from "axios"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {Swords, Pencil, Info, CirclePlus } from 'lucide-react'

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

const chartConfig = {
  tally: {
    label: "Count",
  },
  mastered: {
    label: "Mastered",
    color: "hsl(220 70% 40%)",
  },
  familiar: {
    label: "Familiar",
    color: "hsl(220 70% 50%)",
  },
  unsure: {
    label: "Unsure",
    color: "hsl(220 70% 60%)",
  },
  unrated: {
    label: "Unrated",
    color: "hsl(220 70% 70%)",
  }
} satisfies ChartConfig

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

  const formattedCreationDate = new Date(createdAt)
  .toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedEditionDate = new Date(editedAt)
  .toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const chartData = [
    { mastery: "mastered", tally: masteredTotal, fill: "var(--color-mastered)" },
    { mastery: "familiar", tally: familiarTotal, fill: "var(--color-familiar)" },
    { mastery: "unsure", tally: unsureTotal, fill: "var(--color-unsure)" },
    { mastery: "unrated", tally: unratedTotal, fill: "var(--color-unrated)" },
  ]

  return (
    <Card className="w-100 border-4 border-transparent hover:border-primary shadow transition-colors duration-200">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <div className="text-xs bg-blue-100 dark:bg-blue-300 text-primary dark:text-primary-foreground px-2 py-1 rounded-lg">
              {'Cards: ' + totalCards}
            </div>
          </CardDescription>
        </div>
        <CardDescription className="text-xs text-muted-foreground/50">{`${(editedAt === null) ? 'Created at ' + formattedCreationDate : 'Edited at ' + formattedEditionDate }`}</CardDescription>
      </CardHeader>

      <CardContent>
        <CardDescription className="mb-8 min-h-16 max-h-16 line-clamp-3">
          {description}
        </CardDescription>
        
        <Popover>
          <PopoverTrigger className="flex gap-2 justify-center items-center h-8 rounded-md px-2 text-xs bg-primary text-primary-foreground shadow hover:bg-primary/90">
            <Info className="h-4 w-4"/>
            Performance
          </PopoverTrigger>
          <PopoverContent className="w-[200px]">
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  left: 10,
                }}
              >
                <YAxis
                  dataKey="mastery"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    chartConfig[value as keyof typeof chartConfig]?.label
                  }
                />
                <XAxis dataKey="tally" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="tally" layout="vertical" radius={5} />
              </BarChart>
            </ChartContainer>

          </PopoverContent>
        </Popover>
      </CardContent>

      <CardFooter className="flex justify-end">
      <div className="">
        <Button size={'xs'} variant={'secondary'} className="rounded-r-none">
          <Pencil/>
          Edit
        </Button>
        <Button size={'xs'} className="rounded-l-none">
          <Swords/>
          Play
        </Button>
      </div>
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3">
      {deckArray.map((deck, index) => (
          <Deck key={index} {...deck}></Deck>
      ))}
      {/* 306 px is fixed on all cards */}
      <Card className="min-h-[306px] bg-muted border-2 border-primary/50 hover:border-primary hover:border-4 shadow transition-colors duration-200 relative">
        <Button 
          // immplement the modal that adds the decks of cards
          onClick={() => { console.log('hi'); }} 
          className="w-full h-full absolute top-0 left-0 opacity-0 pointer-events-auto bg-muted z-10"
        />
        <CardContent className="h-full w-full flex flex-col items-center justify-center gap-4 z-1">
          <CirclePlus className="h-16 w-16 text-primary/90" />
          <CardDescription className="text-muted-foreground items-center">
            create new deck 
          </CardDescription>
        </CardContent>
      </Card>

    </div>
  )
}


// CREATE AN ADD BUTTON FOR THE DECK AND AN ADD CARD
// CREATE A SEARCH FIELD
// CREATE  AN EDIT MODAL!!!!!! -> EDITS DECK CONTENT 
// IMPLEMENT THE PLAY DECK
// CREATE DECK UI
// IMPLEMENT SKELETONS ON ALL CARDS

// GENERATE WITH AI
// 