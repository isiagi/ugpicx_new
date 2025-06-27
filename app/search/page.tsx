// app/search/search-page-wrapper.tsx
"use client";

import { Suspense } from "react";
import { SearchPageContent } from "./search-page-content";

// Loading component
function SearchPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Search content skeleton */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Suggested searches skeleton */}
          <div className="text-center">
            <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPageContent />
    </Suspense>
  );
}
