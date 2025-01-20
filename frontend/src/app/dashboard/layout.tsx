import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"

export default function SidebarLayout({
    children
}: Readonly<
    {children: React.ReactNode;
}>){
    return(
        <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-[url('/assets/cramble-background-15.svg')] bg-cover bg-center">
          <header className="flex h-16 shrink-0 items-center justify-between  md:justify-end px-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <SidebarTrigger className="block -ml-1 md:hidden" />
            <ModeToggle></ModeToggle>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    )
}