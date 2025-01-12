import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"

export function Header() {
  return (
    <div className="container mx-auto px-4 py-4 md:p-0">
      <header className="flex flex-col h-20 w-full shrink-0 gap-4 items-center justify-items-center md:px-6 sm:flex-row">
        <Link href="#" prefetch={false}>
          <img src="/assets/Black-Cramble-Logo.svg" className="h-8 w-8" />
        </Link>
        <div className="flex gap-2 px-2 py-1 rounded-md bg-secondary sm:ml-auto border">
          <Button variant="default">
            <a href="/login" className="text-white">Login</a>
          </Button>
          <ModeToggle></ModeToggle>
        </div>
      </header>
    </div>
  )
}
