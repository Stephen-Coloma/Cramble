import {PageTitle, PageTitleProps} from "@/components/page-title"
import { MessageSquareText } from 'lucide-react'

export default function Feedback() {
  const pageDetails: PageTitleProps = {
    title: 'Your Feedbacks',
    desc: 'Report bugs or share your thoughts with us to help improve the experience',
    iconColor: 'darkviolet',
    iconBg: 'bg-violet-100',
    Icon: MessageSquareText
  }
  return (
    <div className=" w-full border-2 border-blue-900">
      <PageTitle {...pageDetails}/>
    </div>
  )
} 