import {PageTitle, PageTitleProps} from "@/components/page-title"
import { Compass } from 'lucide-react'

export default function Explore() {
  const pageDetails: PageTitleProps = {
    title: 'Explore Decks',
    desc: 'Discover new decks and flashcards and content coming soon to enhance your experience',
    iconColor: 'darkcyan',
    iconBg: 'bg-cyan-100',
    Icon: Compass
  }
  return (
    <div className=" w-full border-2 border-blue-900">
      <PageTitle {...pageDetails}/>
    </div>
  )
} 