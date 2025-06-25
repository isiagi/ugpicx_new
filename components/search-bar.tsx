"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearch } from "./search-provider"

interface SearchBarProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
}

export function SearchBar({ placeholder = "Search high-resolution images", className, onSearch }: SearchBarProps) {
  const router = useRouter()
  const { searchQuery, setSearchQuery, setIsSearching } = useSearch()
  const [localQuery, setLocalQuery] = useState(searchQuery)

  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query.trim())
      setIsSearching(true)

      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(localQuery)
  }

  const handleClear = () => {
    setLocalQuery("")
    setSearchQuery("")
    setIsSearching(false)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-20 bg-muted/50 border-0 focus-visible:ring-1"
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
        {localQuery && (
          <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleClear}>
            <X className="h-3 w-3" />
          </Button>
        )}
        <Button type="submit" size="sm" className="h-6 px-2 text-xs">
          Search
        </Button>
      </div>
    </form>
  )
}
