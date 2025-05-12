import DeckBoard from "@/components/deck-board"
import { PageHeader } from "@/components/page-header"

export default function MyDecks() {

  return (
    <div className=" w-full">
      <PageHeader route="/dashboard/mydecks"/>
      <DeckBoard></DeckBoard>
    </div>
  )
} 

