import {Header} from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {ArrowUpRight} from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full bg-[url('/assets/cramble-background.svg')] bg-cover bg-center">
      <Header></Header>
      <div className="container mx-auto flex flex-col flex-grow items-center gap-10 pt-20 xl:px-96">
          <Button size={"sm"} className="text-white hover:none cursor-default rounded-full">Online Flashcards Reviewer</Button>
          <h1 className="text-center text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">Redefining how you learn, practice and grow.</h1>
          <p className="text-center text-sm text-muted-foreground sm:text-base md:text-lg">Master your quizzes with personalized <br></br>flashcards — organized, trackable and <br></br>seamless.</p>
          <Button variant={"default"} size={"lg"} className="w-fit">
            <a href="/signup" className="text-white">Get Started</a>
            <ArrowUpRight color="white"></ArrowUpRight>
          </Button>
      </div> 
      <Footer></Footer>
    </div>
  );
}
