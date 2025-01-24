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

export function NavUser({
  user,
}: {
  user: {
    firstname: string,
    lastname: string,
    email: string
    avatar: string
  }
}) {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default hover:bg-transparent pointer-events-none"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.firstname} />
            <AvatarFallback className="rounded-lg border-2">{user.firstname[0].toUpperCase() + user.lastname[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate text-sm font-semibold">{user.firstname + " " + user.lastname}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <Separator orientation="horizontal"></Separator>
      <SidebarMenuItem>
        <div className="flex w-full px-2">
          <Button variant={"secondary"} className="px-2 py-1 flex-grow bg-transparent hover:bg-secondary">
            <UserCog></UserCog>
            <h1 className="text-xs">Settings</h1>
          </Button>
          <Button variant={"secondary"} className="px-2 py-1 flex-grow bg-transparent hover:bg-secondary">
            <LogOut></LogOut>
            <h1 className="text-xs">Log out</h1>
          </Button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}      
