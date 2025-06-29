"use client";

import { Camera, Heart, User, LogOut, Settings } from "lucide-react";
import { useUser, SignInButton, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchBar } from "./search-bar";
import { CurrencySelector } from "./currency-selector";
import { MobileNav } from "./mobile-nav";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const { isSignedIn, user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Mobile Menu */}
        <div className="flex items-center gap-4">
          <MobileNav />

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image src={"/ug.png"} alt="logo" width={120} height={150} />
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a
            href="/"
            className="text-foreground hover:text-primary transition-colors"
          >
            Home
          </a>
          <div className="relative group">
            <button className="text-muted-foreground hover:text-primary transition-colors">
              Categories
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                <a
                  href="/category/nature"
                  className="block px-3 py-2 text-sm hover:bg-muted rounded"
                >
                  Nature
                </a>
                <a
                  href="/category/architecture"
                  className="block px-3 py-2 text-sm hover:bg-muted rounded"
                >
                  Architecture
                </a>
                <a
                  href="/category/people"
                  className="block px-3 py-2 text-sm hover:bg-muted rounded"
                >
                  People
                </a>
                <a
                  href="/category/animals"
                  className="block px-3 py-2 text-sm hover:bg-muted rounded"
                >
                  Animals
                </a>
                <a
                  href="/category/food"
                  className="block px-3 py-2 text-sm hover:bg-muted rounded"
                >
                  Food
                </a>
                <a
                  href="/category/travel"
                  className="block px-3 py-2 text-sm hover:bg-muted rounded"
                >
                  Travel
                </a>
              </div>
            </div>
          </div>
          {/* <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Community
          </a> */}
        </nav>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden sm:flex max-w-md mx-6">
          <SearchBar />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <CurrencySelector />
          </div>

          {/* Submit Photo Button - Now visible on all screen sizes */}
          <Button variant="ghost" size="sm" className="flex" asChild>
            <a href="/submit" className="lg:flex">
              <span className="hidden sm:inline">Submit a photo</span>
              <Camera className="h-4 w-4 sm:hidden" />
            </a>
          </Button>

          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Heart className="h-5 w-5" />
          </Button>

          {/* User Avatar with Dropdown */}
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage
                    src={user?.imageUrl || "/placeholder.svg"}
                    alt={user?.fullName || "User"}
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.fullName && (
                      <p className="font-medium">{user.fullName}</p>
                    )}
                    {user?.primaryEmailAddress && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.primaryEmailAddress.emailAddress}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openUserProfile()}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignInButton mode="modal">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </SignInButton>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden border-t px-4 py-3">
        <SearchBar />
      </div>
    </header>
  );
}
