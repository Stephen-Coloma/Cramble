import GenerateBoard from "@/components/generate-board"
import { PageHeader } from "@/components/page-header"

export default function Generate() {
  return (
    <div className="w-full h-full">
      <PageHeader route="/dashboard/generate"/>
      <GenerateBoard></GenerateBoard>
    </div>
  )
}