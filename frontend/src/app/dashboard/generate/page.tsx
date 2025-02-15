import GenerateBoard from "@/components/generate-board"
import {PageTitle, PageTitleProps} from "@/components/page-title"
import { Sparkles } from 'lucide-react'

export default function Generate() {
  const pageDetails: PageTitleProps = {
    title: 'Generate Flashcards',
    desc: 'Create flashcards effortlessly with the power of AI, using the Gemini model',
    iconColor: 'darkgreen',
    iconBg: 'bg-green-100',
    Icon: Sparkles
  }
  return (
    <div className="w-full h-full">
      <PageTitle {...pageDetails}/>
      <GenerateBoard></GenerateBoard>
    </div>
  )
} 