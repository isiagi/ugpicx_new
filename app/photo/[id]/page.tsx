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
  Instagram,
  Twitter,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { ShareModal } from "@/components/share-modal";
import { useSearch } from "@/components/search-provider";
import { convertPrice, formatPrice } from "@/lib/currency";
import { handlePhotoDownload } from "@/components/download-handler";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import Link from "next/link";

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

// View tracking function
const trackView = async (imageId) => {
  try {
    await fetch(`/api/images/${imageId}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      }),
    });
  } catch (error) {
    console.warn("View tracking failed:", error);
  }
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
  const [viewTracked, setViewTracked] = useState(false);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

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
        console.log(photoData, "photoData");

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

  // Track view when photo is loaded and visible
  useEffect(() => {
    if (photo && !viewTracked && !loading) {
      // Optional: Add intersection observer to track only when image is actually viewed
      const trackViewWithDelay = () => {
        setTimeout(() => {
          trackView(photo.id);
          setViewTracked(true);
        }, 2000); // Track after 2 seconds to ensure genuine view
      };

      trackViewWithDelay();
    }
  }, [photo, viewTracked, loading]);

  // Alternative: Track view with Intersection Observer (more accurate)
  useEffect(() => {
    if (!photo || viewTracked) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Track view when image is at least 50% visible
            trackView(photo.id);
            setViewTracked(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    const imageElement = document.querySelector("[data-photo-image]");
    if (imageElement) {
      observer.observe(imageElement);
    }

    return () => observer.disconnect();
  }, [photo, viewTracked]);

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

  const handleDownload = (
    id: string,
    src: string,
    alt: string,
    isPremium: boolean,
    price: number
  ) => {
    if (photo.price > 0) {
      // alert(`Purchase required: ${formatPrice(photo.price, currency)}`);
      toast(`Purchase required: ${formatPrice(photo.price, currency)}`, {
        icon: "💰",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      // alert("Download started!");
      toast("Download started!", {
        icon: "📥",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      handlePhotoDownload({ id, src: src, alt, isPremium, price });
    }
  };

  // Flutterwave configuration
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: `ugpicx_${photo?.id}_${Date.now()}`,
    amount: photo.price || 0,
    currency: currency,
    payment_options:
      currency === "UGX"
        ? "card,mobilemoneyuganda,ussd,banktransfer"
        : "card,banktransfer",
    customer: {
      email: "customer@ugpicxdb.work", // Get from user session/auth
      phone_number: "070********", // Get from user profile
      name: "Customer", // Get from user session/auth
    },
    customizations: {
      title: "UgPicXDB Photo Purchase",
      description: `Purchase: ${photo?.alt || "Premium Photo"}`,
      logo: "https://www.ugpicxdb.work/logo.png",
    },
    meta: {
      photo_id: photo?.id,
      photo_title: photo?.alt,
      photographer: photo?.photographer?.username,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  // Replace your handlePurchase function with this implementation
  const handlePurchase = () => {
    if (!photo || !photoPrice) {
      // alert("Cannot process payment: Missing photo or price information");
      toast("Cannot process payment: Missing photo or price information", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    setIsProcessingPayment(true);

    handleFlutterPayment({
      callback: async (response) => {
        console.log("Payment response:", response);
        closePaymentModal();

        if (response.status === "successful") {
          try {
            // Set as purchased first
            setIsPurchased(true);

            // Show success message
            // alert("Payment successful! Your download will start shortly.");
            // alert(
            //   "Payment verification underway., Download will start after verification."
            // );

            toast("Payment Successful!", {
              icon: "🚀",
              description: "Download will start after verification.",
            });

            // // Verify payment and download
            await verifyPaymentAndDownload(response.transaction_id, photo.id);
            // Download photo
            // await handlePhotoDownload({
            //   id: photo.id,
            //   src: photo.src,
            //   alt: photo.alt,
            //   isPremium: photo.isPremium,
            //   price: photo.price,
            // });
          } catch (error) {
            // console.error("Post-payment processing error:", error);
            // alert(
            //   "Payment successful but download failed. Please contact support."
            // );
            toast("Download failed. Please contact support.", {
              icon: "⚠️",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          }
        } else {
          // alert("Payment was not successful. Please try again.");
          toast("Payment failed. Please try again.", {
            icon: "⚠️",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
        setIsProcessingPayment(false);
      },
      onClose: () => {
        setIsProcessingPayment(false);
        console.log("Payment modal closed");
      },
    });
  };

  const verifyPaymentAndDownload = async (transactionId, photoId) => {
    try {
      // Call your backend API to verify payment with Flutterwave
      const verificationResponse = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_id: transactionId,
          photo_id: photoId,
        }),
      });

      if (!verificationResponse.ok) {
        throw new Error("Payment verification failed");
      }

      const verificationResult = await verificationResponse.json();

      if (verificationResult.status === "success") {
        // Payment verified successfully

        toast("Download started!", {
          icon: "🚀",
          duration: 4000,
          description: "Your download will start soon.",
        });

        // Trigger the download
        handlePhotoDownload({
          id: photo.id,
          src: photo.src,
          alt: photo.alt,
          isPremium: photo.isPremium,
          price: photo.price,
          // paid: true, // Add this flag to indicate it's a paid download
        });

        // Optional: Update the UI to show purchase success
        // You might want to add a state to track if user has purchased this photo
      } else {
        toast("Payment verification failed. Please contact support.", {
          icon: "❌",
          duration: 4000,
          description: "Payment verification failed. Please contact support.",
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);

      toast("Payment verification failed. Please contact support.", {
        icon: "❌",
        duration: 4000,
        description: "Payment verification failed. Please contact support.",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePhotographerClick = () => {
    router.push(`/photographer/${photo.photographer.username}`);
  };

  const handleViewProfile = () => {
    toast("Coming Soon!", {
      icon: "🚧",
      duration: 4000,
      description:
        "Photographer profiles are currently in development. Stay tuned for updates!",
    });
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
                data-photo-image // Add data attribute for intersection observer
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
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {photo.views}
                </span>
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
              <h1 className="text-muted-foreground">{photo.description}</h1>
              {photo.price && (
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1"
                  >
                    {formatPrice(photo.price, currency)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Priced Photo
                  </span>
                </div>
              )}
            </div>

            {/* Photographer Info */}
            <div
              className="flex items-center gap-4 p-4 rounded-lg border  hover:bg-muted/50 transition-colors"
              // onClick={handlePhotographerClick}
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
                <p className="text-muted-foreground">@{photo.photographer}</p>

                <div className="flex gap-3 mt-2">
                  {/* Social media links */}
                  <Link
                    href={`${photo.instagram}` || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-500 cursor-pointer transition-colors"
                  >
                    <Instagram size={20} />
                  </Link>
                  <Link
                    href={`${photo.twitter}` || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    <Twitter size={20} />
                  </Link>
                  <Link
                    href={`${photo.website || "#"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-500 cursor-pointer transition-colors"
                  >
                    <Globe2 size={20} />
                  </Link>
                </div>
                {photo.photographer.bio && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {photo.photographer.bio}
                  </p>
                )}
              </div>
              <Button variant="outline" onClick={handleViewProfile}>
                View Profile
              </Button>
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
                    <Button
                      className="w-full"
                      onClick={() =>
                        handleDownload(
                          photo.id,
                          photo.src,
                          photo.alt,
                          photo.isPremium,
                          photo.price
                        )
                      }
                    >
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
