import DeckBoard from "@/components/deck-board"
import {PageTitle, PageTitleProps} from "@/components/page-title"
import { LibraryBig } from 'lucide-react'


export default function MyDecks() {
  const pageDetails: PageTitleProps = {
    title: 'My Decks',
    desc: 'Manage your decks and flashcards easily here',
    iconColor: '#303030',
    iconBg: 'bg-gray-200',
    Icon: LibraryBig
  }

  return (
    <div className=" w-full">
      <PageTitle {...pageDetails}/>
      <DeckBoard></DeckBoard>
    </div>
  )
} 

