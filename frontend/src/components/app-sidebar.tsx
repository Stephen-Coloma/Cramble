"use client"

import * as React from "react"
import {
  LibraryBig,
  Sparkles,
  CircleHelp,
  MessageSquareText,
  Compass,
} from "lucide-react"

import { NavMenu } from "@/components/nav-menu"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react"
import { permanentRedirect, useRouter } from "next/navigation"


const dataRender = {
  navItems: [
    {
      name: "My Decks",
      url: "/dashboard/mydecks",
      icon: LibraryBig,
    },
    {
      name: "Explore Decks (Soon)",
      url: "/dashboard/explore",
      icon: Compass,
    },
    {
      name: "Generate with AI",
      url: "/dashboard/generate",
      icon: Sparkles,
    },
    {
      name: "FAQs",
      url: "/dashboard/faqs",
      icon: CircleHelp,
    },
    {
      name: "Feedback",
      url: "/dashboard/feedback",
      icon: MessageSquareText,
    }
  ]
}

//initialize user detials from the backend
const isLoggedIn = await useUserStore.getState().getUserDetailsAsync();

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const user = useUserStore((state)=> state.user)
  
  useEffect(()=>{
    if(isLoggedIn === false){
      router.replace('/') // redirect to dashboard page when user is logged out already
    }
  }, [])
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-seconary text-sidebar-primary-foreground">
            <img src="/assets/Black-Cramble-Logo.svg" className="h-6 w-6" />
          </div>
          <div className="grid flex-1 text-left text-base leading-tight">
            <span className="truncate font-semibold">
              Cramble
            </span>
            <span className="truncate text-xs text-muted-foreground">v1.0.0-beta</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        {/* <NavMain items={data.navMain} /> has dropdown*/} 
        <NavMenu navItems={dataRender.navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!}/>
      </SidebarFooter>
    </Sidebar>
  )
}
