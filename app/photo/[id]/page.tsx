"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Download,
  Share2,
  MapPin,
  Calendar,
  Camera,
  Eye,
  CreditCard,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { ShareModal } from "@/components/share-modal";
import { useSearch } from "@/components/search-provider";
import { convertPrice, formatPrice } from "@/lib/currency";

// Type definitions based on your Prisma schema
type Photo = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  likes: number;
  downloads: number;
  views: number;
  tags: string[];
  isPremium: boolean;
  price?: number;
  uploadDate: string;
  camera?: string;
  location?: string;
  photographer: {
    name: string;
    username: string;
    avatar?: string;
    bio?: string;
  };
};

const buildOptimizedUrl = (src: string, width = 800, quality = 75) => {
  // 1. Your custom Cloudflare domain (must be proxied via Cloudflare DNS)
  const CLOUDFLARE_DOMAIN = "https://www.ugpicxdb.work";

  // 2. Extract the relative path after domain (e.g. /user_xyz/image.jpg)
  const relativePath = src.replace(CLOUDFLARE_DOMAIN, "");

  // 3. Construct the optimized URL with Cloudflare transform params
  return `${CLOUDFLARE_DOMAIN}/cdn-cgi/image/width=${width},quality=${quality},format=auto${relativePath}`;
};

export default function PhotoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currency } = useSearch();
  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        setLoading(true);
        setError(null);

        const photoId = params.id as string;
        const response = await fetch(`/api/photos/${photoId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Photo not found");
          } else {
            setError("Failed to fetch photo");
          }
          return;
        }

        const photoData: Photo = await response.json();
        setPhoto(photoData);
      } catch (err) {
        console.error("Error fetching photo:", err);
        setError("Failed to load photo");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPhoto();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-[4/3] bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {error === "Photo not found"
              ? "Photo Not Found"
              : "Error Loading Photo"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {error === "Photo not found"
              ? "The photo you're looking for doesn't exist or has been removed."
              : "There was an error loading the photo. Please try again."}
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const photoPrice = photo.price
    ? convertPrice(photo.price, "USD", currency)
    : undefined;

  const handleDownload = () => {
    if (photo.price > 0) {
      alert(`Purchase required: ${formatPrice(photoPrice, currency)}`);
    } else {
      alert("Download started!");
    }
  };

  const handlePurchase = () => {
    alert(`Purchasing photo for ${formatPrice(photoPrice!, currency)}`);
  };

  const handlePhotographerClick = () => {
    router.push(`/photographer/${photo.photographer.username}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden">
              <img
                src={buildOptimizedUrl(photo.src) || "/placeholder.svg"}
                alt={photo.alt}
                className="w-full h-auto object-contain max-h-[70vh]"
              />
            </div>

            {/* Image Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className={isLiked ? "text-red-500" : ""}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                  />
                  {photo.likes + (isLiked ? 1 : 0)}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShareModal(true)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {/* <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {photo.views.toLocaleString()}
                </span> */}
                <span className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {photo.downloads.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold mb-3">{photo.alt}</h1>
              {photo.price && (
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1"
                  >
                    {formatPrice(photo.price, currency)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Premium Photo
                  </span>
                </div>
              )}
            </div>

            {/* Photographer Info */}
            <div
              className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={handlePhotographerClick}
            >
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={photo.photographer.avatar || "/placeholder.svg"}
                />
                <AvatarFallback className="text-xl">
                  {photo.photographer}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                  {photo.photographer}
                </h3>
                <p className="text-muted-foreground">
                  @{photo.photographer.username}
                </p>
                {photo.photographer.bio && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {photo.photographer.bio}
                  </p>
                )}
              </div>
              <Button variant="outline">View Profile</Button>
            </div>

            <Separator />

            {/* Download/Purchase Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Download Options</h3>
                <Badge variant="outline">
                  {currency === "UGX" ? "🇺🇬 UGX" : "🇺🇸 USD"}
                </Badge>
              </div>

              {photo.price ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        High Resolution Download
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(photo.price, currency)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Full resolution image for commercial and personal use
                    </p>
                    <ul className="text-sm space-y-1 mb-4">
                      <li>✓ Commercial and personal use</li>
                      <li>
                        ✓ High resolution ({photo.width} × {photo.height})
                      </li>
                      <li>✓ No attribution required</li>
                      <li>✓ Lifetime download access</li>
                    </ul>
                    <Button className="w-full" onClick={handlePurchase}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Purchase & Download
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Secure payment via Flutterwave • UGX 1,000 transfer fee
                    applies
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Free Download</span>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        FREE
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      High quality image for personal and commercial use
                    </p>
                    <Button className="w-full" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Free Download
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <h4 className="font-semibold mb-3">Related Tags</h4>
              {/* <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() =>
                      router.push(`/search?q=${encodeURIComponent(tag)}`)
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div> */}
            </div>

            {/* Photo Info */}
            <div className="space-y-3 text-sm">
              <h4 className="font-semibold">Photo Information</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Uploaded {photo.createdAt}</span>
                </div>
                {photo.camera && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Camera className="h-4 w-4" />
                    <span>{photo.camera}</span>
                  </div>
                )}
                {photo.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{photo.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>
                    {photo.width} × {photo.height} pixels
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        photo={photo}
      />
    </div>
  );
}
