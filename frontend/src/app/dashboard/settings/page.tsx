import {PageTitle, PageTitleProps} from "@/components/page-title"
import ProfileSettings from "@/components/profile-settings"
import { UserCog } from 'lucide-react'


export default function MyDecks() {
  const pageDetails: PageTitleProps = {
    title: 'Profile Settings',
    desc: 'Update your account settings, change your password, and manage personal preferences here',
    iconColor: '#303030',
    iconBg: 'bg-gray-200',
    Icon: UserCog
  }

  return (
    <div className=" w-full">
      <PageTitle {...pageDetails}/>
      <ProfileSettings></ProfileSettings>
      <></>
    </div>
  )
} 

