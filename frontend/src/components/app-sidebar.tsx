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
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarMenuButton } from "@/components/ui/sidebar"

// Data for the side bar
const data = {
  user: {
    firstname: "Stephen",
    lastname: "Coloma",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navItems: [
    {
      name: "My Decks",
      url: "#",
      icon: LibraryBig,
    },
    {
      name: "Explore Decks (Soon)",
      url: "#",
      icon: Compass,
    },
    {
      name: "Generate with AI",
      url: "#",
      icon: Sparkles,
    },
    {
      name: "FAQs",
      url: "#",
      icon: CircleHelp,
    },
    {
      name: "Feedback",
      url: "#",
      icon: MessageSquareText,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMenu navItems={data.navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
