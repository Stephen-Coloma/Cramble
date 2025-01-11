import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"

export function Header() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <Link href="#" className="mr-6 lg:flex items-center" prefetch={false}>
          <img src="/assets/Black-Cramble-Logo.svg" className="h-8 w-8" />
        </Link>
        <div className="ml-auto flex gap-2 px-4 py-2 rounded-md bg-secondary border">
          <Button variant="default" className="justify-self-end">
            <a href="/login" className="text-white">Login</a>
          </Button>
          <ModeToggle></ModeToggle>
        </div>
      </header>
    </div>
  )
}
