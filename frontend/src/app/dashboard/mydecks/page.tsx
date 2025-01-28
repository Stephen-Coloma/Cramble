import {PageTitle, PageTitleProps} from "@/components/page-title"
import { LibraryBig } from 'lucide-react'
import { Decks} from "@/components/deck"


export default function MyDecks() {
  const pageDetails: PageTitleProps = {
    title: 'My Decks',
    desc: 'Manage your decks and flashcards easily here',
    iconColor: '#303030',
    iconBg: 'bg-gray-200',
    Icon: LibraryBig
  }

  return (
    <div className=" w-full border-red-900 border-4">
      <PageTitle {...pageDetails}/>
      <Decks/>
    </div>
  )
} 

// UPDATE THE SWAGGER DOCUMENTATION  FOR THE get /api/decks api