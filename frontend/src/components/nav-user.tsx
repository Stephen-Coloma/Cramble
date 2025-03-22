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
import { User } from "@/dtos/user/User"
import { useFetch } from "@/hooks/use-request"
import { Skeleton } from "./ui/skeleton"
export type UserDetails = Pick<User, 'firstName' | 'lastName' | 'username' | 'email'>

export function NavUser() {
  const SERVER_HOST=process.env.NEXT_PUBLIC_SERVER_HOST
  const {status, statusText, data, error, loading} =  useFetch<UserDetails>(`http://${SERVER_HOST}/api/extras/user/details`);

  const user = {
    firstName: data?.firstName ?? "",
    lastName: data?.lastName ?? "",
    email: data?.email ?? "",
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default hover:bg-transparent pointer-events-none"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            {/* //todo: impelement src of the avatar image */}
            <AvatarImage alt={user.firstName} />
            <AvatarFallback className="rounded-lg border-2">{
              
              (loading ? 
                <Skeleton className="h-5 w-[100%]"></Skeleton>
                :
                user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()
              )
              
            }</AvatarFallback>
          </Avatar>

          {(loading ? 
            <div className="grid flex-1 text-left leading-tight gap-2">
              <Skeleton className="h-4 w-[70%]"></Skeleton>
              <Skeleton className="h-3 w-[100%]"></Skeleton>
            </div>
            :
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold">{user.firstName + " " + user.lastName}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          )}
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
