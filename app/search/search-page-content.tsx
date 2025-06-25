// app/search/search-page-content.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/components/search-provider";
import { PhotoGrid } from "@/components/photo-grid";

export function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useSearch();

  const query = searchParams.get("q") || "";

  // Keep local/global search query in sync
  useEffect(() => {
    if (query && query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [query, searchQuery, setSearchQuery]);

  const handleNewSearch = (newQuery: string) => {
    const encoded = encodeURIComponent(newQuery);
    router.push(`/search?q=${encoded}`);
  };

  const suggestedSearches = [
    "uganda wildlife",
    "kampala city",
    "lake victoria",
    "mountain rwenzori",
    "cultural heritage",
    "landscapes",
    "traditional dance",
    "african sunset",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar
              placeholder="Search for images..."
              onSearch={handleNewSearch}
              className="h-12"
            />
          </div>

          {query && (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">
                Search results for "{query}"
              </h1>
            </div>
          )}

          {/* Suggested Searches */}
          {!query && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                Popular searches in Uganda
              </h2>
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

        {/* Search Results */}
        {query && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Filter by:</span>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                All
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Free
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Premium
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Uganda
              </Badge>
            </div>

            <PhotoGrid category={null} searchQuery={query} refreshCounter={0} />

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Results
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
