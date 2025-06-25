"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ImageIcon, DollarSign, AlertCircle, CheckCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSearch } from "./search-provider"
import { convertPrice, formatPrice } from "@/lib/currency"

const categories = [
  "Nature",
  "Architecture",
  "People",
  "Animals",
  "Food",
  "Travel",
  "Technology",
  "Art",
  "Sports",
  "Business",
  "Abstract",
  "Fashion",
]

const imageSizes = ["Small (1920x1080)", "Medium (2560x1440)", "Large (3840x2160)", "Extra Large (5120x2880)", "Custom"]

export function SubmitPhotoForm() {
  const { currency } = useSearch()
  const [formData, setFormData] = useState({
    title: "",
    alt: "",
    src: "",
    photographer: "",
    description: "",
    email: "",
    website: "",
    instagram: "",
    twitter: "",
    category: "",
    size: "",
    price: "",
    isPremium: false,
  })

  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log("File dropped:", e.dataTransfer.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission
    alert("Photo submitted successfully!")
  }

  // Convert minimum price to selected currency
  const minPriceUGX = 1000
  const minPriceUSD = convertPrice(minPriceUGX, "UGX", "USD")
  const minPrice = currency === "UGX" ? minPriceUGX : minPriceUSD
  const transferFee = currency === "UGX" ? 1000 : convertPrice(1000, "UGX", "USD")

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit Your Photo</h1>
        <p className="text-muted-foreground">Share your amazing photography with the ugpicx community</p>
      </div>

      {/* Upload Guidelines */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Upload Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <span>Images should be Ugandan or shot by Ugandan photographer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <span>Images should be original and owned by you</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <span>Minimum image size: 5 megapixels</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <span>Acceptable formats: JPG, PNG</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <span>Maximum file size: 10MB per image</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <span>Setting price is optional</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Image
            </CardTitle>
            <CardDescription>Upload your high-quality image (JPG, PNG)</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Drag and drop your image here</p>
              <p className="text-sm text-muted-foreground mb-4">or</p>
              <Button type="button" variant="outline">
                Choose File
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Maximum file size: 10MB. Supported formats: JPG, PNG. Minimum: 5MP
              </p>
            </div>

            <div className="mt-4">
              <Label htmlFor="src">Or paste image URL</Label>
              <Input
                id="src"
                placeholder="https://example.com/image.jpg"
                value={formData.src}
                onChange={(e) => handleInputChange("src", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Photo Information */}
        <Card>
          <CardHeader>
            <CardTitle>Photo Information</CardTitle>
            <CardDescription>Provide details about your photo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Beautiful sunset over Lake Victoria"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="alt">Alt Text *</Label>
                <Input
                  id="alt"
                  placeholder="Descriptive text for accessibility"
                  value={formData.alt}
                  onChange={(e) => handleInputChange("alt", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your photo, the story behind it, or technical details..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="size">Image Size *</Label>
                <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select image size" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photographer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Photographer Information</CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="photographer">Photographer Name *</Label>
                <Input
                  id="photographer"
                  placeholder="Your full name"
                  value={formData.photographer}
                  onChange={(e) => handleInputChange("photographer", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="@yourusername"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  placeholder="@yourusername"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing & Revenue
            </CardTitle>
            <CardDescription>Set your photo as free or premium content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="premium"
                checked={formData.isPremium}
                onCheckedChange={(checked) => handleInputChange("isPremium", checked)}
              />
              <Label htmlFor="premium">Make this a premium photo</Label>
            </div>

            {formData.isPremium && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price">Price ({currency})</Label>
                  <Input
                    id="price"
                    type="number"
                    step={currency === "UGX" ? "100" : "0.01"}
                    min={minPrice}
                    placeholder={minPrice.toString()}
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum price is {formatPrice(minPrice, currency)}. Set prices above{" "}
                    {formatPrice(transferFee, currency)} (Flutterwave transfer fee).
                  </p>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Revenue Sharing:</strong>
                    <br />• Flutterwave transfer fee: {formatPrice(transferFee, currency)} per transaction
                    <br />• Platform fee: 30% of your price
                    <br />• You receive: 70% of your price (paid monthly)
                    <br />
                    <br />
                    Example: If you set {formatPrice(currency === "UGX" ? 5000 : 5, currency)}, you'll receive{" "}
                    {formatPrice(currency === "UGX" ? 3500 : 3.5, currency)} per sale.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit" className="px-8">
            Submit Photo
          </Button>
        </div>
      </form>
    </div>
  )
}
