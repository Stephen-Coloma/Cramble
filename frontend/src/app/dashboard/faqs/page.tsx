import {PageTitle, PageTitleProps} from "@/components/page-title"
import { CircleHelp } from 'lucide-react'

export default function FAQs() {
  const pageDetails: PageTitleProps = {
    title: 'FAQs',
    desc: ' Find answers to common questions and get helpful information here',
    iconColor: 'darkorange',
    iconBg: 'bg-orange-100',
    Icon: CircleHelp
  }
  return (
    <div className=" w-full border-2 border-blue-900">
      <PageTitle {...pageDetails}/>
    </div>
  )
} 