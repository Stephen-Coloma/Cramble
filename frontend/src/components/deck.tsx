'use client'

import * as React from "react"
import { useEffect, useState } from "react"
import { AxiosError, AxiosResponse } from "axios"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

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

import {Swords, TrendingUp} from 'lucide-react'

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

  const chartData = [{ month: "january", desktop: 1260, mobile: 570 }]
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  const totalVisitors = chartData[0].desktop + chartData[0].mobile

  return (
    <Card className="w-100">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{'Cards: ' + totalCards}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="">
        <CardDescription className="mb-8">
          {description}
        </CardDescription>
        
        <Popover>
          <PopoverTrigger className="h-8 rounded-md px-3 text-xs bg-primary text-primary-foreground shadow hover:bg-primary/90">See your performance</PopoverTrigger>
          <PopoverContent>
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-full max-w-[250px]"
              >
                <RadialBarChart
                  data={chartData}
                  endAngle={180}
                  innerRadius={80}
                  outerRadius={130}
                >
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 16}
                                className="fill-foreground text-2xl font-bold"
                              >
                                {totalVisitors.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 4}
                                className="fill-muted-foreground"
                              >
                                Visitors
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                  <RadialBar
                    dataKey="desktop"
                    stackId="a"
                    cornerRadius={5}
                    fill="var(--color-desktop)"
                    className="stroke-transparent stroke-2"
                  />
                  <RadialBar
                    dataKey="mobile"
                    fill="var(--color-mobile)"
                    stackId="a"
                    cornerRadius={5}
                    className="stroke-transparent stroke-2"
                  />
              </RadialBarChart>
            </ChartContainer>
          </PopoverContent>
        </Popover>
      </CardContent>

      <CardFooter className="flex justify-between">
      <CardDescription className="text-xs text-muted-foreground/50">{`${(editedAt === null) ? 'Created at ' + formattedCreationDate : 'Edited at ' + formattedEditionDate }`}</CardDescription>
        <Button size={'sm'}>
        <Swords/>
          Play
        </Button>
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
    <div className="flex flex-col gap-4">
      {deckArray.map((deck, index) => (
          <Deck key={index} {...deck}></Deck>
      ))}
    </div>
  )
}


// FIX THE CONTENT OF THE CARD!!!