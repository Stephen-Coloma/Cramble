import { Card, CardHeader, CardFooter, CardContent } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

export default function DeckLoading(){
    return(
        <Card className="w-100 border-none">
            <CardHeader>
                <div className="flex justify-between">
                <Skeleton className="h-5 w-[65%]"></Skeleton>
                <Skeleton className="h-5 w-[20%]"></Skeleton>
                </div>
                <Skeleton className="h-3 w-[50%]"></Skeleton>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">
                <Skeleton className="h-5 w-[100%]"></Skeleton>
                <Skeleton className="h-5 w-[92%]"></Skeleton>
                <Skeleton className="h-5 w-[85%] mb-8"></Skeleton>
                <Skeleton className="h-6 w-[40%]"></Skeleton>
            </CardContent>


            <CardFooter className="flex justify-end">
                <Skeleton className="h-8 w-[40%]"></Skeleton>
            </CardFooter>
        </Card>
    )
}