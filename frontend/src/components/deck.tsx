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

import {Swords, Pencil } from 'lucide-react'

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

  return (
    <Card className="w-100">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{'Cards: ' + totalCards}</CardDescription>
        </div>
        <CardDescription className="text-xs text-muted-foreground/50">{`${(editedAt === null) ? 'Created at ' + formattedCreationDate : 'Edited at ' + formattedEditionDate }`}</CardDescription>
      </CardHeader>

      <CardContent className="">
        <CardDescription className="mb-8">
          {description}
        </CardDescription>
        
        <Popover>
          <PopoverTrigger className="h-8 rounded-md px-3 text-xs bg-primary text-primary-foreground shadow hover:bg-primary/90">See your performance</PopoverTrigger>
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
    <div className="flex flex-col gap-4  sm:grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3">
      {deckArray.map((deck, index) => (
          <Deck key={index} {...deck}></Deck>
      ))}
    </div>
  )
}


// FIX THE CONTENT OF THE CARD!!!