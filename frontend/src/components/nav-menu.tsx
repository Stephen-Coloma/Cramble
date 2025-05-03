"use client"

import {
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Separator } from "./ui/separator"
import { usePathname } from "next/navigation"
import Link from "next/link"

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
  const { toggleSidebar, isMobile } = useSidebar()
  
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <Separator className="mb-4"></Separator>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.name}>
            <Link href={item.url} onClick={ () =>{
                if(isMobile) {toggleSidebar()}
              }
            }>
              <SidebarMenuButton className="flex h-12 px-4" variant={`${path.includes(item.url) ? 'selected' : 'default'}`}>
                <item.icon className="w-5 h-5" />
                <span className="font-light text-base">{item.name}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
