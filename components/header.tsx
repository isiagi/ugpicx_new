import { Camera, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchBar } from "./search-bar"
import { CurrencySelector } from "./currency-selector"
import { MobileNav } from "./mobile-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Mobile Menu */}
        <div className="flex items-center gap-4">
          <MobileNav />

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ugpicx</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">🇺🇬</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="/" className="text-foreground hover:text-primary transition-colors">
            Explore
          </a>
          <div className="relative group">
            <button className="text-muted-foreground hover:text-primary transition-colors">Categories</button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                <a href="/category/nature" className="block px-3 py-2 text-sm hover:bg-muted rounded">
                  Nature
                </a>
                <a href="/category/architecture" className="block px-3 py-2 text-sm hover:bg-muted rounded">
                  Architecture
                </a>
                <a href="/category/people" className="block px-3 py-2 text-sm hover:bg-muted rounded">
                  People
                </a>
                <a href="/category/animals" className="block px-3 py-2 text-sm hover:bg-muted rounded">
                  Animals
                </a>
                <a href="/category/food" className="block px-3 py-2 text-sm hover:bg-muted rounded">
                  Food
                </a>
                <a href="/category/travel" className="block px-3 py-2 text-sm hover:bg-muted rounded">
                  Travel
                </a>
              </div>
            </div>
          </div>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            Community
          </a>
        </nav>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden sm:flex flex-1 max-w-md mx-6">
          <SearchBar />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <CurrencySelector />
          </div>
          <Button variant="ghost" size="sm" className="hidden lg:flex" asChild>
            <a href="/submit">Submit a photo</a>
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Heart className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8 cursor-pointer" asChild>
            <a href="/profile">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </a>
          </Avatar>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden border-t px-4 py-3">
        <SearchBar />
      </div>
    </header>
  )
}
