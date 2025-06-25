"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { MasonryGrid } from "@/components/masonry-grid"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSearch } from "@/components/search-provider"

// Mock search function - in real app, this would call your API
const searchPhotos = async (query: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock search results based on query
  const allPhotos = [
    {
      id: "1",
      src: "/placeholder.svg?height=400&width=300",
      alt: "Mountain landscape at sunset",
      width: 300,
      height: 400,
      photographer: {
        name: "Alex Johnson",
        username: "alexj",
        avatar: "/placeholder.svg?height=32&width=32",
        bio: "Professional landscape photographer",
      },
      likes: 234,
      downloads: 45,
      views: 1250,
      tags: ["nature", "mountain", "landscape", "sunset", "uganda"],
      isPremium: false,
      uploadDate: "2024-01-15",
      camera: "Canon EOS R5",
      location: "Mount Rwenzori, Uganda",
    },
    {
      id: "2",
      src: "/placeholder.svg?height=300&width=300",
      alt: "Kampala city architecture",
      width: 300,
      height: 300,
      photographer: {
        name: "Sarah Chen",
        username: "sarahc",
        avatar: "/placeholder.svg?height=32&width=32",
        bio: "Architecture and urban photography",
      },
      likes: 189,
      downloads: 67,
      views: 890,
      tags: ["architecture", "city", "building", "modern", "kampala", "uganda"],
      price: 15,
      isPremium: true,
      uploadDate: "2024-01-12",
      camera: "Sony A7R IV",
      location: "Kampala, Uganda",
    },
    {
      id: "3",
      src: "/placeholder.svg?height=500&width=300",
      alt: "Uganda wildlife portrait",
      width: 300,
      height: 500,
      photographer: {
        name: "Mike Rodriguez",
        username: "miker",
        avatar: "/placeholder.svg?height=32&width=32",
        bio: "Wildlife photographer",
      },
      likes: 456,
      downloads: 123,
      views: 2340,
      tags: ["wildlife", "animals", "uganda", "safari", "nature"],
      price: 25,
      isPremium: true,
      uploadDate: "2024-01-10",
      camera: "Nikon D850",
      location: "Queen Elizabeth National Park, Uganda",
    },
    {
      id: "4",
      src: "/placeholder.svg?height=350&width=300",
      alt: "Lake Victoria sunset",
      width: 300,
      height: 350,
      photographer: {
        name: "Emma Wilson",
        username: "emmaw",
        avatar: "/placeholder.svg?height=32&width=32",
        bio: "Nature and landscape photographer",
      },
      likes: 312,
      downloads: 89,
      views: 1120,
      tags: ["lake", "victoria", "sunset", "water", "uganda"],
      isPremium: false,
      uploadDate: "2024-01-08",
      camera: "Canon EOS R6",
      location: "Lake Victoria, Uganda",
    },
    {
      id: "5",
      src: "/placeholder.svg?height=450&width=300",
      alt: "Ugandan cultural dance",
      width: 300,
      height: 450,
      photographer: {
        name: "David Park",
        username: "davidp",
        avatar: "/placeholder.svg?height=32&width=32",
        bio: "Cultural and event photographer",
      },
      likes: 567,
      downloads: 234,
      views: 3450,
      tags: ["culture", "dance", "traditional", "uganda", "people"],
      price: 20,
      isPremium: true,
      uploadDate: "2024-01-05",
      camera: "Nikon D780",
      location: "Kampala, Uganda",
    },
  ]

  // Filter photos based on search query
  const filteredPhotos = allPhotos.filter(
    (photo) =>
      photo.alt.toLowerCase().includes(query.toLowerCase()) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
      photo.location.toLowerCase().includes(query.toLowerCase()),
  )

  return filteredPhotos
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const { searchQuery, setSearchQuery, isSearching, setIsSearching } = useSearch()
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const query = searchParams.get("q") || ""

  useEffect(() => {
    if (query && query !== searchQuery) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [query, searchQuery, setSearchQuery])

  const performSearch = async (searchTerm: string) => {
    setLoading(true)
    setIsSearching(true)

    try {
      const searchResults = await searchPhotos(searchTerm)
      setResults(searchResults)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleNewSearch = (newQuery: string) => {
    performSearch(newQuery)
  }

  const suggestedSearches = [
    "uganda wildlife",
    "kampala city",
    "lake victoria",
    "mountain rwenzori",
    "cultural heritage",
    "landscapes",
    "traditional dance",
    "african sunset",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar placeholder="Search for images..." onSearch={handleNewSearch} className="h-12" />
          </div>

          {query && (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Search results for "{query}"</h1>
              {!loading && (
                <p className="text-muted-foreground">
                  {results.length} {results.length === 1 ? "image" : "images"} found
                </p>
              )}
            </div>
          )}

          {/* Suggested Searches */}
          {!query && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Popular searches in Uganda</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestedSearches.map((search) => (
                  <Button
                    key={search}
                    variant="outline"
                    size="sm"
                    onClick={() => handleNewSearch(search)}
                    className="capitalize"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Searching for images...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && query && results.length > 0 && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Filter by:</span>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                All
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Free
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Premium
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Uganda
              </Badge>
            </div>

            <MasonryGrid photos={results} />

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Results
              </Button>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && query && results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">No images found</h2>
            <p className="text-muted-foreground mb-6">Try searching for something else or browse our categories</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Try these popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedSearches.slice(0, 4).map((search) => (
                    <Button key={search} variant="outline" size="sm" onClick={() => handleNewSearch(search)}>
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
              <Button asChild>
                <a href="/">Browse All Photos</a>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
