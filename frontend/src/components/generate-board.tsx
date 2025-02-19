'use client'

import { Card, CardContent, CardDescription, CardTitle, CardHeader, CardFooter } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Bot, Sparkles } from "lucide-react"
import { ChangeEvent, useEffect, useState} from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { joiResolver } from "@hookform/resolvers/joi"
import Joi from "joi"
import { usePost } from "@/hooks/use-request"
import ShowGeneratedDeckDialog from "./dialog/show-generated-deck-dialog"

const generateSchema = Joi.object({
    text: Joi.string()
        .required()
        .min(1500),

    count: Joi.number()
        .required()
        .min(10)
})

type GenerateCardsFormData = {
    text: string
    count: number
}

export default function GenerateBoard(){
    const [remanining, setRemaining] = useState<number>(1500);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

    const {register, setValue, clearErrors, handleSubmit, formState: {errors, isSubmitting}} = useForm<GenerateCardsFormData>({resolver: joiResolver(generateSchema)})

    const {status, statusText, data, error, loading, executePostRequest, clearResponseState} = usePost('http://localhost:3001/api/gemini/generate')

    const onSubmit: SubmitHandler<GenerateCardsFormData> = async (formData: GenerateCardsFormData) => {                
        // todo: delay to be removed
        await new Promise((resolve) => {setTimeout(resolve, 1000)})
        await executePostRequest(formData)
    }
    
    // useEffect to handle loading changes
    useEffect(()=> {
        if(status === 200){
            data.createdAt = new Date().toISOString()
            setIsDialogOpen(true)
            clearResponseState()
        }
    }, [loading])

    // callback function that closes the dialog from the child
    const closeDialog = () =>{
        setIsDialogOpen(false)
    }
    
    return(
        <>
            <div className="flex flex-col justify-start md:justify-center  md:h-1/2 lg:h-3/4">
                <Card className=" p-4 bg-muted">
                    <CardTitle className="flex items-center gap-2 mb-4">
                        <Bot></Bot>    
                        AI Creates, You Learn!
                    </CardTitle>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Textarea {...register('text', {
                            
                        })}
                        // phones must have longer heights than desktop 
                            className="min-h-64 max-h-96 sm:min-h-32 sm:max-h-80 text-sm md:text-base overflow-auto resize-none bg-primary-foreground"
                            id="text"
                            placeholder="Start typing or paste your notes here..."
                            onInput={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                const target = e.target as HTMLTextAreaElement
                                target.style.height = 'auto'
                                target.style.height = `${target.scrollHeight}px`
                                setRemaining(1500 - e.target.value.length)
                            }}
                        >
                        </Textarea>

                        {/* form errors */}
                        {remanining > 1 && 
                            <Label className={`text-sm ${errors.text ? 'text-destructive' : 'text-muted-foreground'}`}>{`Need more ${remanining} more characters`}</Label>
                        }

                        {/* error from server */}
                        {error && !isSubmitting &&
                            <Label className='text-destructive text-sm'>Something went wrong. Please try again later.</Label>
                        }

                        <div className="w-full flex justify-between items-center">

                            <div className="flex items-center gap-2">
                                <Label className="text-xs sm:text-sm text-muted-foreground">Total Cards</Label>
                                <Select onValueChange={(value: string) => {setValue('count', Number(value))}}>
                                    <SelectTrigger className="w-auto">
                                        <SelectValue defaultValue={'10'} placeholder={10}/>
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

                            <Input {...register('count')} type="hidden" id='count' defaultValue={10}></Input>
                            <Button type='submit' disabled={isSubmitting ? true : false} >
                                Generate
                                <Sparkles className={`${isSubmitting ? 'animate-pulse' : ''}`}></Sparkles>
                            </Button>  
                        </div>
                    </form>
                </Card>
            </div>

            {/* show the dialog after generation*/}
            { isDialogOpen && data &&           
                <ShowGeneratedDeckDialog deckFlashcardsData={data} onDialogClose={closeDialog}/>
            }
        </>
    )
}