'use client'

import { Card, CardContent, CardDescription, CardTitle, CardHeader, CardFooter } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Bot, Sparkles } from "lucide-react"
import { ChangeEvent, useState} from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

export default function GenerateBoard(){
    const [count, setCount] = useState<number>(10);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); 
        console.log(count);
    };

    return(
        <div className="flex flex-col justify-start md:justify-center  md:h-1/2 lg:h-3/4">
            <Card className=" p-4 bg-muted">
                <CardTitle className="flex items-center gap-2 mb-4">
                    <Bot></Bot>    
                    AI Creates, You Learn!
                </CardTitle>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Textarea
                    // phones must have longer heights than desktop 
                        className="min-h-64 max-h-96 sm:min-h-32 sm:max-h-80 text-sm md:text-base overflow-auto resize-none bg-primary-foreground"
                        id="text"
                        placeholder="Start typing or paste your notes here..."
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            const target = e.target as HTMLTextAreaElement
                            target.style.height = 'auto'
                            target.style.height = `${target.scrollHeight}px`
                        }}
                    >
                    </Textarea>

                    <div className="w-full flex justify-between items-center">

                        <div className="flex items-center gap-2">
                            <Label className="text-xs sm:text-sm text-muted-foreground">Set Count</Label>
                            <Select onValueChange={(value: string) => setCount(Number(value))} defaultValue={"10"}>
                                <SelectTrigger className="w-auto">
                                    <SelectValue placeholder="10" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="30">30</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="75">75</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Input type="hidden" value={count}></Input>

                        <Button type="submit">
                            Generate
                            <Sparkles></Sparkles>
                        </Button>  

                    </div>

                </form>
            </Card>
        </div>
    )
}