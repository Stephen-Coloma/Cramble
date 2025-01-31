import {PageTitle, PageTitleProps} from "@/components/page-title"
import { LibraryBig } from 'lucide-react'
import { Decks} from "@/components/deck"
import { AddDeckDialog } from "@/components/dialog/add-deck-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"


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

      <Decks children={ <AddDeckDialog variant="deck-button"/> }/>
    </div>
  )
} 

