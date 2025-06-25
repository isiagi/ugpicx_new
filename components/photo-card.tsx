"use client";

import { Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { handlePhotoDownload } from "./download-handler";
import { useSearch } from "./search-provider";
import { convertPrice, formatPrice } from "@/lib/currency";

interface PhotoCardProps {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  photographer: {
    name: string;
    username: string;
    avatar: string;
  };
  likes: number;
  downloads: number;
  tags: string[];
  price?: number; // Price in USD
  isPremium?: boolean;
}

const buildOptimizedUrl = (src: string, width = 800, quality = 75) => {
  // 1. Your custom Cloudflare domain (must be proxied via Cloudflare DNS)
  const CLOUDFLARE_DOMAIN = "https://www.ugpicxdb.work";

  // 2. Extract the relative path after domain (e.g. /user_xyz/image.jpg)
  const relativePath = src.replace(CLOUDFLARE_DOMAIN, "");

  // 3. Construct the optimized URL with Cloudflare transform params
  return `${CLOUDFLARE_DOMAIN}/cdn-cgi/image/width=${width},quality=${quality},format=auto${relativePath}`;
};

export function PhotoCard({
  id,
  src,
  alt,
  photographer,
  likes,
  downloads,
  tags,
  price,
  isPremium,
  onPhotoClick,
}: PhotoCardProps & { onPhotoClick?: (id: string) => void }) {
  const { currency } = useSearch();

  console.log(price, "price");

  // Convert price to selected currency
  const displayPrice = price ? convertPrice(price, "USD", currency) : undefined;

  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-muted cursor-pointer"
      onClick={() => onPhotoClick?.(id)}
    >
      <img
        src={buildOptimizedUrl(src) || "/placeholder.svg"}
        alt={alt}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

      {/* Top overlay with actions */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 bg-white/90 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
        {price ? (
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              handlePhotoDownload({ id, src, alt, isPremium, price });
            }}
          >
            <span className="text-xs font-bold">
              {currency === "UGX" ? "UGX" : "$"}
            </span>
          </Button>
        ) : (
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              handlePhotoDownload({ id, src, alt, isPremium, price });
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Bottom overlay with photographer info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={photographer.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">
                {photographer}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{photographer}</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {isPremium && displayPrice && (
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                {formatPrice(displayPrice, currency)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {likes}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {downloads}
            </span>
          </div>
        </div>

        {/* {tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-white/20 text-white border-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
}
