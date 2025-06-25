"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: any[]
  setSearchResults: (results: any[]) => void
  isSearching: boolean
  setIsSearching: (searching: boolean) => void
  currency: "UGX" | "USD"
  setCurrency: (currency: "UGX" | "USD") => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [currency, setCurrency] = useState<"UGX" | "USD">("UGX")

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        isSearching,
        setIsSearching,
        currency,
        setCurrency,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
