import { PageHeader } from "@/components/page-header"
import ProfileSettings from "@/components/profile-settings"


export default function Settings() {
  return (
    <div className=" w-full">
      <PageHeader route='/dashboard/settings'/>
      <ProfileSettings></ProfileSettings>
      <></>
    </div>
  )
} 

