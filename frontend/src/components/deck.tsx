import { DeckWithStatsDTO } from "@/dtos/deck/DeckWithStats.dto"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {Swords, Info, Wrench} from 'lucide-react'
import { useState } from "react"
import { Button } from "./ui/button"
import DeleteDeckDialog from "./dialog/delete-deck-dialog"
import EditDeckDialog from "./dialog/edit-deck-dialog"
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


const chartConfig = {
    tally: {
        label: "Total Cards",
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
> & {
    onDeckDelete: (deckId: number) => void
    onDeckEdit: (deckId: number,  newTitle: string, newDescription: string, newEditDate: string) => void
}

// drilled 3 generation for onEvents, DeckBoard --> Deck --> Edit/DeleteDecks Dialog
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
    unratedTotal,
    onDeckDelete,
    onDeckEdit
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

    const [isPopOverOpen, setIsPopOverOpen] = useState<boolean>(false);

    return (
        <Card className="w-100 border-2 hover:border-primary shadow transition-colors duration-200">
            <CardHeader>
            <div className="flex justify-between">
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                <div className="text-xs font-semibold bg-blue-100 dark:bg-blue-300 text-primary dark:text-primary-foreground px-2 py-1 rounded-lg">
                    {'Cards: ' + totalCards}
                </div>
                </CardDescription>
            </div>
            <CardDescription className="text-xs text-muted-foreground/50">{`${(!editedAt || editedAt === 'null') ? 'Created at ' + formattedCreationDate : 'Edited at ' + formattedEditionDate }`}</CardDescription>
            </CardHeader>

            <CardContent>
            <CardDescription className="mb-8 min-h-16 max-h-16 line-clamp-3">
                {description}
            </CardDescription>
            
            <Popover>
                <PopoverTrigger className="flex gap-2 justify-center items-center h-6 rounded-sm px-2 text-xs bg-primary text-primary-foreground shadow hover:bg-primary/90">
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

            {/* edit and play buttons */}
            <div>
            <Popover open={isPopOverOpen} onOpenChange={setIsPopOverOpen}>

                <PopoverTrigger className="h-9 px-4 py-2 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 rounded-r-none inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                <Wrench/>
                </PopoverTrigger>

                <PopoverContent className="w-fit flex flex-col p-2">
                <EditDeckDialog deckId={deckId} title={title} description={description} onDeckEdit={onDeckEdit} onPopOverClose={()=> setIsPopOverOpen(false)}/>
                <DeleteDeckDialog deckId={deckId} onDeckDelete={onDeckDelete} onPopOverClose={()=> setIsPopOverOpen(false)}/>
                </PopoverContent>

            </Popover>

            <Button className="rounded-l-none">
                <Swords/>
                Play
            </Button>
            </div>

            </CardFooter>
        </Card>
    )
}