"use client"

import {
  UserCog,
  LogOut,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/userStore"
import LogoutDialog from "./dialog/logout-dialog"

export function NavUser() {
  const user = useUserStore((state) => state.user)!
  const router = useRouter();
  const handleSettings = () => router.push('/dashboard/settings')

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default hover:bg-transparent pointer-events-none"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            {/* //todo: impelement src of the avatar image */}
            <AvatarImage alt={user?.firstName ?? "User"}/>
            <AvatarFallback className="rounded-lg border-2"> {user ? (user.firstName[0]?.toUpperCase() + user.lastName[0]?.toUpperCase()) : "?"}</AvatarFallback>
          </Avatar>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold"> {user ? (user.firstName + " " + user.lastName) :  '?'}</span>
              <span className="truncate text-xs">{user ? user.email : '?'}</span>
            </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <Separator orientation="horizontal"></Separator>
      <SidebarMenuItem>
        <div className="flex w-full px-2">
          <Button 
            variant={"secondary"} 
            className="px-2 py-1 flex-grow bg-transparent hover:bg-secondary"
            onClick={handleSettings}
          >
            <UserCog></UserCog>
            <h1 className="text-xs">Settings</h1>
          </Button>
          <LogoutDialog></LogoutDialog>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
