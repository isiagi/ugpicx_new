"use client";

import { MasonryGrid } from "./masonry-grid";
import { useQuery } from "@tanstack/react-query";

const mockPhotos = [
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
    tags: ["nature", "mountain", "landscape", "sunset"],
    isPremium: false,
    uploadDate: "2024-01-15",
    camera: "Canon EOS R5",
    location: "Swiss Alps",
  },
  {
    id: "2",
    src: "/placeholder.svg?height=300&width=300",
    alt: "Modern city architecture",
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
    tags: ["architecture", "city", "building", "modern"],
    price: 15,
    isPremium: true,
    uploadDate: "2024-01-12",
    camera: "Sony A7R IV",
    location: "New York City",
  },
  {
    id: "3",
    src: "/placeholder.svg?height=500&width=300",
    alt: "Professional portrait photography",
    width: 300,
    height: 500,
    photographer: {
      name: "Mike Rodriguez",
      username: "miker",
      avatar: "/placeholder.svg?height=32&width=32",
      bio: "Portrait and fashion photographer",
    },
    likes: 456,
    downloads: 123,
    views: 2340,
    tags: ["portrait", "people", "photography", "professional"],
    price: 25,
    isPremium: true,
    uploadDate: "2024-01-10",
    camera: "Nikon D850",
    location: "Los Angeles Studio",
  },
  {
    id: "4",
    src: "/placeholder.svg?height=350&width=300",
    alt: "Food styling masterpiece",
    width: 300,
    height: 350,
    photographer: {
      name: "Emma Wilson",
      username: "emmaw",
      avatar: "/placeholder.svg?height=32&width=32",
      bio: "Food and culinary photographer",
    },
    likes: 312,
    downloads: 89,
    views: 1120,
    tags: ["food", "styling", "culinary"],
    isPremium: false,
    uploadDate: "2024-01-08",
    camera: "Canon EOS R6",
    location: "New York Studio",
  },
  {
    id: "5",
    src: "/placeholder.svg?height=450&width=300",
    alt: "Wildlife in natural habitat",
    width: 300,
    height: 450,
    photographer: {
      name: "David Park",
      username: "davidp",
      avatar: "/placeholder.svg?height=32&width=32",
      bio: "Wildlife and nature photographer",
    },
    likes: 567,
    downloads: 234,
    views: 3450,
    tags: ["wildlife", "animals", "nature"],
    price: 20,
    isPremium: true,
    uploadDate: "2024-01-05",
    camera: "Nikon D780",
    location: "Yellowstone National Park",
  },
  {
    id: "6",
    src: "/placeholder.svg?height=320&width=300",
    alt: "Modern technology concept",
    width: 300,
    height: 320,
    photographer: {
      name: "Lisa Zhang",
      username: "lisaz",
      avatar: "/placeholder.svg?height=32&width=32",
      bio: "Technology and digital concept photographer",
    },
    likes: 198,
    downloads: 56,
    views: 780,
    tags: ["technology", "digital", "concept"],
    isPremium: false,
    uploadDate: "2024-01-03",
    camera: "Sony A7 III",
    location: "San Francisco",
  },
];

export function PhotoGrid({
  category,
  refreshCounter,
  searchQuery,
}: {
  category?: string;
  refreshCounter: number;
  searchQuery?: string;
}) {
  const { data: images = [], isLoading } = useQuery({
    queryKey: ["images", category, refreshCounter],
    queryFn: async () => {
      const url = new URL("/api/images", window.location.origin);
      if (category && category !== "All") {
        url.searchParams.append("category", category);
      }

      if (searchQuery) {
        url.searchParams.append("query", searchQuery);
      }
      try {
        const response = await fetch(url.toString());
        if (!response.ok) {
          console.error(
            `Error fetching images: ${response.status} ${response.statusText}`
          );
          throw new Error("Network response was not ok");
        }
        // console.log(await response.json(), "response");

        return response.json();
      } catch (error) {
        console.log(error, "erret");
        throw error;
      }
    },
  });

  // console.log(images, "images");

  return <MasonryGrid photos={images} isLoading={isLoading} />;
}
