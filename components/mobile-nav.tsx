"use client"

import { useState } from "react"
import { Menu, Camera, Heart, User, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CurrencySelector } from "./currency-selector"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const categories = [
    { name: "Nature", href: "/category/nature" },
    { name: "Architecture", href: "/category/architecture" },
    { name: "People", href: "/category/people" },
    { name: "Animals", href: "/category/animals" },
    { name: "Food", href: "/category/food" },
    { name: "Travel", href: "/category/travel" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-2 pb-6 border-b">
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ugpicx</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">🇺���</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Explore</h3>
                <div className="space-y-2">
                  <a
                    href="/"
                    className="block py-2 text-foreground hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Home
                  </a>
                  <a
                    href="/search"
                    className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Search
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <a
                      key={category.name}
                      href={category.href}
                      className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Community</h3>
                <div className="space-y-2">
                  <a
                    href="/submit"
                    className="flex items-center gap-2 py-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Upload className="h-4 w-4" />
                    Submit Photo
                  </a>
                  <a
                    href="/profile"
                    className="flex items-center gap-2 py-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 py-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Heart className="h-4 w-4" />
                    Favorites
                  </a>
                </div>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Currency</span>
              <CurrencySelector />
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Guest User</p>
                <p className="text-xs text-muted-foreground">Explore ugpicx</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
