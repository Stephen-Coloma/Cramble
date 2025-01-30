"use client"

import {
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "./ui/separator"
import { usePathname } from "next/navigation"

export function NavMenu({
  navItems,
}: {
  navItems: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const path = usePathname()
  
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <Separator className="mb-4"></Separator>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.name}>
            <a href={item.url}>
              <SidebarMenuButton className="flex h-12 px-4" variant={`${path.includes(item.url) ? 'selected' : 'default'}`}>
                <item.icon className="w-5 h-5" />
                <span className="font-light text-base">{item.name}</span>
              </SidebarMenuButton>
            </a>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
