"use client";
import { useRouter } from "next/navigation";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { PhotoCard } from "./photo-card";

interface MasonryGridProps {
  photos: Array<{
    id: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    photographer: {
      name: string;
      username: string;
      avatar: string;
      bio?: string;
    };
    likes: number;
    downloads: number;
    views: number;
    tags: string[];
    price?: number;
    isPremium?: boolean;
    uploadDate: string;
    camera?: string;
    location?: string;
  }>;
}

export function MasonryGrid({ photos }: MasonryGridProps) {
  const router = useRouter();

  const handlePhotoClick = (photoId: string) => {
    router.push(`/photo/${photoId}`);
  };

  console.log(photos, "photos trty");

  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
      <Masonry gutter="16px">
        {photos.map((photo) => (
          <div key={photo.id}>
            <PhotoCard {...photo} onPhotoClick={handlePhotoClick} />
          </div>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}
