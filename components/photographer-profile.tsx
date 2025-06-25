"use client"

import { useState } from "react"
import { MapPin, Calendar, Globe, Instagram, Twitter, Mail, Phone, Star, Award, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MasonryGrid } from "./masonry-grid"
import { ContactModal } from "./contact-modal"

interface PhotographerProfileProps {
  username: string
}

const mockPhotographerData = {
  miker: {
    id: "miker",
    name: "Mike Rodriguez",
    username: "miker",
    avatar: "/placeholder.svg?height=120&width=120",
    coverImage: "/placeholder.svg?height=300&width=800",
    bio: "Professional portrait and fashion photographer with over 10 years of experience. Specializing in editorial, commercial, and fine art photography.",
    location: "Los Angeles, CA",
    joinDate: "2020-03-15",
    website: "https://mikerodriguez.photography",
    email: "mike@mikerodriguez.photography",
    phone: "+1 (555) 123-4567",
    instagram: "@mikerodriguezphoto",
    twitter: "@miker_photo",
    specialties: ["Portrait", "Fashion", "Editorial", "Commercial", "Fine Art"],
    equipment: ["Nikon D850", "Canon EOS R5", "Sony A7R IV", "Profoto Lighting"],
    languages: ["English", "Spanish"],
    stats: {
      totalPhotos: 156,
      totalViews: 450000,
      totalDownloads: 12500,
      totalLikes: 8900,
      followers: 2340,
      rating: 4.9,
      reviews: 127,
    },
    pricing: {
      hourlyRate: 150,
      dayRate: 1200,
      eventRate: 2500,
    },
    availability: "Available for hire",
    awards: [
      "International Photography Awards 2023 - Portrait Category Winner",
      "Sony World Photography Awards 2022 - Finalist",
      "PDN 30 New and Emerging Photographers 2021",
    ],
  },
  // Add more photographers...
}

const mockPhotographerPhotos = [
  {
    id: "p1",
    src: "/placeholder.svg?height=500&width=300",
    alt: "Professional portrait session",
    width: 300,
    height: 500,
    photographer: {
      name: "Mike Rodriguez",
      username: "miker",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 456,
    downloads: 123,
    views: 2340,
    tags: ["portrait", "professional", "studio"],
    price: 25,
    isPremium: true,
    uploadDate: "2024-01-10",
  },
  {
    id: "p2",
    src: "/placeholder.svg?height=400&width=300",
    alt: "Fashion editorial shoot",
    width: 300,
    height: 400,
    photographer: {
      name: "Mike Rodriguez",
      username: "miker",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 789,
    downloads: 234,
    views: 3450,
    tags: ["fashion", "editorial", "model"],
    price: 30,
    isPremium: true,
    uploadDate: "2024-01-08",
  },
  // Add more photos...
]

export function PhotographerProfile({ username }: PhotographerProfileProps) {
  const [showContactModal, setShowContactModal] = useState(false)
  const photographer = mockPhotographerData[username as keyof typeof mockPhotographerData]

  if (!photographer) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Photographer Not Found</h1>
        <p className="text-muted-foreground">The photographer you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-primary/20 to-secondary/20">
        <img src={photographer.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container max-w-6xl mx-auto px-4 -mt-16 relative z-10">
        {/* Profile Header */}
        <div className="bg-background rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={photographer.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-4xl">{photographer.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{photographer.name}</h1>
                  <p className="text-muted-foreground mb-2">@{photographer.username}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{photographer.stats.rating}</span>
                      <span className="text-sm text-muted-foreground">({photographer.stats.reviews} reviews)</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {photographer.availability}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setShowContactModal(true)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Hire Me
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{photographer.bio}</p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {photographer.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {photographer.joinDate}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <a
                    href={photographer.website}
                    className="hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Portfolio Website
                  </a>
                </span>
              </div>

              <div className="flex gap-3">
                <a
                  href={`https://instagram.com/${photographer.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Button>
                </a>
                <a
                  href={`https://twitter.com/${photographer.twitter.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">{photographer.stats.totalPhotos}</div>
              <div className="text-xs text-muted-foreground">Photos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{photographer.stats.totalViews.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{photographer.stats.totalDownloads.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{photographer.stats.totalLikes.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{photographer.stats.followers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{photographer.stats.rating}</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Portfolio ({photographer.stats.totalPhotos} photos)</h2>
                <div className="flex gap-2">
                  {photographer.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              <MasonryGrid photos={mockPhotographerPhotos} columns={3} />
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Specialties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {photographer.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {photographer.equipment.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Awards & Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {photographer.awards.map((award, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Award className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{award}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {photographer.languages.map((language) => (
                      <Badge key={language} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>Professional photography services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Hourly Rate</h3>
                      <div className="text-3xl font-bold text-primary">${photographer.pricing.hourlyRate}</div>
                      <p className="text-sm text-muted-foreground">per hour</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Day Rate</h3>
                      <div className="text-3xl font-bold text-primary">${photographer.pricing.dayRate}</div>
                      <p className="text-sm text-muted-foreground">per day (8 hours)</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Event Rate</h3>
                      <div className="text-3xl font-bold text-primary">${photographer.pricing.eventRate}</div>
                      <p className="text-sm text-muted-foreground">per event</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Portrait Photography</h4>
                      <p className="text-sm text-muted-foreground">
                        Professional headshots, family portraits, and personal branding sessions.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Fashion Photography</h4>
                      <p className="text-sm text-muted-foreground">
                        Editorial shoots, lookbooks, and commercial fashion photography.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Commercial Photography</h4>
                      <p className="text-sm text-muted-foreground">
                        Product photography, corporate events, and brand campaigns.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Fine Art Photography</h4>
                      <p className="text-sm text-muted-foreground">
                        Artistic portraits and conceptual photography for galleries and collectors.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold">{photographer.stats.rating}</div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= photographer.stats.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{photographer.stats.reviews} reviews</p>
                </div>
              </div>

              {/* Mock reviews */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">John Doe</h4>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">2 weeks ago</span>
                      </div>
                      <p className="text-sm">
                        Exceptional work! Mike captured exactly what we were looking for in our corporate headshots.
                        Professional, creative, and delivered on time. Highly recommended!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">Sarah Miller</h4>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">1 month ago</span>
                      </div>
                      <p className="text-sm">
                        Amazing fashion shoot! Mike's attention to detail and creative vision made our campaign a huge
                        success. The photos exceeded our expectations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} photographer={photographer} />
    </div>
  )
}
