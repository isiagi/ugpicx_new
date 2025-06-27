"use client";

import { useState } from "react";
import {
  Menu,
  Camera,
  Heart,
  User,
  Upload,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CurrencySelector } from "./currency-selector";
import Image from "next/image";
import Link from "next/link";
import { useClerk, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  const categories = [
    { name: "Nature", href: "/category/nature" },
    { name: "Architecture", href: "/category/architecture" },
    { name: "People", href: "/category/people" },
    { name: "Animals", href: "/category/animals" },
    { name: "Food", href: "/category/food" },
    { name: "Travel", href: "/category/travel" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-6 flex flex-col max-h-screen">
        {/* Header */}
        <div className="flex items-center gap-2 border-b shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={"/ug.png"} alt="logo" width={120} height={150} />
          </Link>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="space-y-6">
            {/* Explore */}
            <div>
              <h3 className="font-semibold mb-3">Explore</h3>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/search"
                  className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Search
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full py-2 text-muted-foreground hover:text-primary transition-colors">
                    <span className="font-semibold">Categories</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 mt-2 space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Community (only if logged in) */}
            {isSignedIn && (
              <div>
                <h3 className="font-semibold mb-3">Community</h3>
                <div className="space-y-2">
                  <Link
                    href="/submit"
                    className="flex items-center gap-2 py-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Upload className="h-4 w-4" />
                    Submit Photo
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 py-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      openUserProfile();
                    }}
                    className="flex w-full items-center gap-2 py-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2 py-2 text-muted-foreground hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-red-600" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t pt-6 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Currency</span>
            <CurrencySelector />
          </div>

          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.imageUrl || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {user?.firstName || user?.username || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.emailAddresses?.[0]?.emailAddress || "Explore ugpicx"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Log In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
