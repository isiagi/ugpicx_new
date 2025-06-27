"use client";

import { useEffect, useState } from "react";
import {
  Camera,
  Download,
  Edit,
  Trash2,
  Share2,
  Eye,
  DollarSign,
  TrendingUp,
  Settings,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PhotoCard } from "./photo-card";
import { ShareModal } from "./share-modal";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const mockUserData = {
  id: "user1",
  name: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  bio: "Professional photographer based in Kampala, Uganda. Specializing in landscape and wildlife photography.",
  location: "Kampala, Uganda",
  website: "https://johndoe.photography",
  instagram: "@johndoe_photo",
  twitter: "@johndoe",
  avatar: "/placeholder.svg?height=120&width=120",
  coverImage: "/placeholder.svg?height=300&width=800",
  joinDate: "2023-01-15",
  stats: {
    totalPhotos: 24,
    totalViews: 15420,
    totalDownloads: 1250,
    totalLikes: 890,
    totalEarnings: 2340,
    followers: 156,
    following: 89,
  },
};

const mockUserPhotos = [
  {
    id: "1",
    src: "/placeholder.svg?height=400&width=300",
    alt: "Mountain landscape at sunset",
    width: 300,
    height: 400,
    photographer: {
      name: "John Doe",
      username: "johndoe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 234,
    downloads: 45,
    views: 1250,
    tags: ["nature", "mountain", "landscape", "sunset"],
    isPremium: false,
    uploadDate: "2024-01-15",
    status: "published",
  },
  {
    id: "2",
    src: "/placeholder.svg?height=300&width=300",
    alt: "Kampala city architecture",
    width: 300,
    height: 300,
    photographer: {
      name: "John Doe",
      username: "johndoe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 189,
    downloads: 67,
    views: 890,
    tags: ["architecture", "city", "building", "modern"],
    price: 15,
    isPremium: true,
    uploadDate: "2024-01-12",
    status: "published",
  },
  {
    id: "3",
    src: "/placeholder.svg?height=500&width=300",
    alt: "Uganda wildlife portrait",
    width: 300,
    height: 500,
    photographer: {
      name: "John Doe",
      username: "johndoe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 456,
    downloads: 123,
    views: 2340,
    tags: ["wildlife", "animals", "uganda", "safari"],
    price: 25,
    isPremium: true,
    uploadDate: "2024-01-10",
    status: "published",
  },
];

const mockDownloadHistory = [
  {
    id: "d1",
    photoId: "p1",
    photoTitle: "City skyline at night",
    photographer: "Sarah Chen",
    downloadDate: "2024-01-20",
    type: "free",
    size: "Large (3840x2160)",
  },
  {
    id: "d2",
    photoId: "p2",
    photoTitle: "Mountain landscape",
    photographer: "Alex Johnson",
    downloadDate: "2024-01-18",
    type: "paid",
    price: 15,
    size: "Extra Large (5120x2880)",
  },
];

export function UserProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sharingPhoto, setSharingPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState(null);

  const { user, isSignedIn, isLoaded } = useUser();

  console.log(user?.firstName, "user");

  // Extract userId with proper null checking
  const userId = user?.id;

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return;
    fetchProfile();
  }, [isLoaded, isSignedIn, userId]);

  const fetchProfile = async () => {
    try {
      if (!userId) {
        console.warn("fetchProfile called without userId");
        return;
      }

      setLoading(true);
      const response = await fetch(`/api/profile/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      console.log("Fetched profile data:", data);

      setProfile(data.profile); // Or data directly if no `profile` wrapper
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Improved useEffect with better error handling and conditions
  useEffect(() => {
    const fetchImages = async () => {
      // Only fetch if user is loaded, signed in, and we have a userId
      if (!isLoaded || !isSignedIn || !userId) {
        console.log("User not ready:", { isLoaded, isSignedIn, userId });
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/images/${userId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched images:", data);

        setImages(data);
      } catch (error) {
        console.error("Failed to fetch images:", error);
        // Optionally set an error state here
        // setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [userId, isSignedIn, isLoaded]); // Include isLoaded and isSignedIn in dependencies

  // Alternative: If you want to show different states
  if (!isLoaded) {
    return <div>Loading user...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to view your profile.</div>;
  }

  if (!userId) {
    return <div>Unable to load user information.</div>;
  }

  const handleEditPhoto = (photoId: string) => {
    alert(`Edit photo ${photoId}`);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        const response = await fetch(`/api/images/${photoId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setImages(images?.filter((image: any) => image.id !== photoId));
          toast("Image deleted", {
            description: "The image has been successfully deleted.",
          });
        } else {
          throw new Error("Failed to delete image");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        toast("Error", {
          description: "Failed to delete the image. Please try again.",
        });
      }
    }
  };

  const handleSharePhoto = (photoId: string) => {
    setSharingPhoto(photoId);
  };

  const sharingPhotoData = sharingPhoto
    ? mockUserPhotos.find((p) => p.id === sharingPhoto)
    : null;

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Cover Image */}
      {mockUserData.coverImage && (
        <div className="relative h-48 md:h-64 mb-8 rounded-lg overflow-hidden">
          <img
            src={user?.imageUrl || "/placeholder.svg"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4"
          >
            <Settings className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        </div>
      )}

      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.imageUrl || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">
                {user?.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold">{user?.fullName}</h1>
                <p className="text-muted-foreground">@{user?.username}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button size="sm" asChild>
                  <a href="/submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Photo
                  </a>
                </Button>
              </div>
            </div>

            {mockUserData.bio && (
              <p className="text-muted-foreground mb-4">{mockUserData.bio}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {mockUserData.location && <span>📍 {mockUserData.location}</span>}
              <span>📅 Joined {mockUserData.joinDate}</span>
              {mockUserData.website && (
                <span>
                  🌐{" "}
                  <a
                    href={mockUserData.website}
                    className="hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website
                  </a>
                </span>
              )}
            </div>

            {/* Social Links */}
            {(mockUserData.instagram || mockUserData.twitter) && (
              <div className="flex gap-3 mt-4">
                {mockUserData.instagram && (
                  <a
                    href={`https://instagram.com/${mockUserData.instagram.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Instagram
                  </a>
                )}
                {mockUserData.twitter && (
                  <a
                    href={`https://twitter.com/${mockUserData.twitter.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Twitter
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{images.length}</div>
              <div className="text-xs text-muted-foreground">Photos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {mockUserData.stats.totalViews.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Views</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{images.downloads}</div>
              <div className="text-xs text-muted-foreground">Downloads</div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {mockUserData.stats.totalLikes.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Likes</div>
            </CardContent>
          </Card> */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                UGX {mockUserData.stats.totalEarnings.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Earnings</div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {mockUserData.stats.followers}
              </div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </CardContent>
          </Card> */}
          {/* <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {mockUserData.stats.following}
              </div>
              <div className="text-xs text-muted-foreground">Following</div>
            </CardContent>
          </Card> */}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        defaultValue="photos"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-4">
          {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
          <TabsTrigger value="photos" defaultChecked>
            My Photos
          </TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
        </TabsList>

        {/* <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      Photo "Mountain landscape" received 15 new likes
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      2 hours ago
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">
                      Photo "Uganda wildlife" was downloaded 3 times
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      5 hours ago
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">
                      Earned UGX 45,000 from premium downloads
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      1 day ago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">This Month</span>
                  <Badge variant="secondary">+12%</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Views</span>
                    <span>2,340</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Downloads</span>
                    <span>156</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Earnings</span>
                    <span>UGX 234,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}

        <TabsContent value="photos" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              My Photos ({mockUserPhotos.length})
            </h2>
            <Button asChild>
              <a href="/submit">
                <Plus className="h-4 w-4 mr-2" />
                Upload New Photo
              </a>
            </Button>
          </div>

          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
          >
            <Masonry gutter="16px">
              {images.length > 0 &&
                images.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <PhotoCard {...photo} />

                    {/* Photo Management Overlay */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 bg-white/90 hover:bg-white"
                          onClick={() => handleEditPhoto(photo.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 bg-white/90 hover:bg-white"
                          onClick={() => handleSharePhoto(photo.id)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Photo Status Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant={
                          photo.status === "published" ? "default" : "secondary"
                        }
                      >
                        {photo.status}
                      </Badge>
                    </div>
                  </div>
                ))}
            </Masonry>
          </ResponsiveMasonry>
        </TabsContent>

        <TabsContent value="downloads" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Download History</h2>
              <div className="flex gap-2">
                <Badge variant="outline">
                  Total: {mockDownloadHistory.length}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {mockDownloadHistory.map((download) => (
                <Card key={download.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                          <Camera className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {download.photoTitle}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            by {download.photographer}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {download.size}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            download.type === "free" ? "secondary" : "default"
                          }
                        >
                          {download.type === "free"
                            ? "Free"
                            : `UGX ${(download as any).price * 3750}`}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {download.downloadDate}
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <Download className="h-4 w-4 mr-2" />
                          Re-download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  UGX {mockUserData.stats.totalEarnings.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockUserData.stats.totalViews.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +15.3% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.1%</div>
                <p className="text-xs text-muted-foreground">
                  +2.4% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Top Performing Photos</CardTitle>
              <CardDescription>
                Your most popular photos this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUserPhotos.slice(0, 3).map((photo, index) => (
                  <div key={photo.id} className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-muted-foreground">
                      #{index + 1}
                    </div>
                    <img
                      src={photo.src || "/placeholder.svg"}
                      alt={photo.alt}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{photo.alt}</h4>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{photo.views} views</span>
                        <span>{photo.downloads} downloads</span>
                        <span>{photo.likes} likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>

      {/* Share Modal */}
      <ShareModal
        isOpen={!!sharingPhoto}
        onClose={() => setSharingPhoto(null)}
        photo={sharingPhotoData}
      />
    </div>
  );
}
