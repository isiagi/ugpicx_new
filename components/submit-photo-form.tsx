"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  ImageIcon,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearch } from "./search-provider";
import { convertPrice, formatPrice } from "@/lib/currency";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

interface ImagePreview {
  file: File;
  preview: string;
  isValid: boolean;
}

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
];

export function SubmitPhotoForm({
  onImageUpload,
}: {
  onImageUpload?: () => void;
}) {
  const { currency } = useSearch();
  const { isSignedIn, user } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    alt: "",
    src: "",
    description: "",
    email: "",
    website: "",
    instagram: "",
    twitter: "",
    category: "",
    price: "",
    isPremium: false,
  });

  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [selectedImage, setSelectedImage] = useState<ImagePreview | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const file = files[0]; // Only handle first file for single image upload

    // Check file size (10MB limit)
    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxFileSize) {
      toast("File too large", {
        icon: <AlertCircle className="h-4 w-4" />,
        description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
        action: {
          label: "OK",
          onClick: () => console.log("File size error acknowledged"),
        },
        duration: 10000,
      });
      return;
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast("Invalid file type", {
        description: `${file.name} is not a supported format. Please upload JPG or PNG files only.`,
        action: {
          label: "OK",
          onClick: () => console.log("File type error acknowledged"),
        },
        duration: 10000,
      });
      return;
    }

    // Check image dimensions (5MP minimum)
    const img = new Image();
    const preview = URL.createObjectURL(file);
    img.src = preview;

    await new Promise((resolve) => {
      img.onload = () => {
        const megapixels = (img.width * img.height) / 1000000;
        const isValid = megapixels >= 5;

        if (isValid) {
          setSelectedImage({
            file,
            preview,
            isValid: true,
          });
          // Clear src field when file is selected
          handleInputChange("src", "");
        } else {
          toast("Image resolution too low", {
            description: `${file.name} is ${megapixels.toFixed(
              1
            )}MP. Please upload images with at least 5MP resolution.`,
            action: {
              label: "OK",
              onClick: () => console.log("Resolution error acknowledged"),
            },
            duration: 10000,
            icon: <AlertCircle className="h-4 w-4" />,
          });
          URL.revokeObjectURL(preview); // Clean up
        }
        resolve(null);
      };

      img.onerror = () => {
        toast("Invalid image file", {
          description: `${file.name} could not be processed. Please try a different image.`,
          action: {
            label: "OK",
            onClick: () => console.log("Image error acknowledged"),
          },
          duration: 10000,
        });
        URL.revokeObjectURL(preview); // Clean up
        resolve(null);
      };
    });
  };

  const handleRemoveImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.preview);
      setSelectedImage(null);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear selected image when URL is entered
    if (field === "src" && value && selectedImage) {
      handleRemoveImage();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Create a synthetic event to reuse handleImageChange
      const syntheticEvent = {
        target: { files: e.dataTransfer.files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleImageChange(syntheticEvent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn || !user) {
      toast("You must be signed in to upload images.", {
        duration: 10000,
        description: "Only signed in users can upload images.",
      });
      return;
    }

    // Validate that we have either a file or URL
    if (!selectedImage && !formData.src.trim()) {
      toast("Please select an image or provide an image URL.", {
        duration: 5000,
        description: "An image is required to submit a photo.",
      });
      return;
    }

    // Validate required fields
    // if (!formData.title.trim() || !formData.alt.trim() || !formData.category) {
    //   toast("Please fill in all required fields.", {
    //     duration: 5000,
    //     description: "Title, Alt Text, and Category are required.",
    //   });
    //   return;
    // }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      let imageKey = "";
      let finalImageUrl = formData.src;

      // Handle file upload if we have a selected image
      if (selectedImage?.file) {
        // Get presigned URL
        const presignedResponse = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: selectedImage.file.name,
            contentType: selectedImage.file.type,
          }),
        });

        if (!presignedResponse.ok) {
          const errorData = await presignedResponse.json();
          throw new Error(
            `Failed to get presigned URL: ${
              errorData.error || presignedResponse.statusText
            }`
          );
        }

        const { signedUrl, key } = await presignedResponse.json();
        imageKey = key;

        // Upload to R2
        const uploadResponse = await fetch(signedUrl, {
          method: "PUT",
          body: selectedImage.file,
          headers: { "Content-Type": selectedImage.file.type },
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `Failed to upload to R2: ${uploadResponse.statusText}`
          );
        }

        // Construct the final image URL (you may need to adjust this based on your R2 setup)
        finalImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
      }

      // Create database record
      const dbResponse = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          alt: formData.alt,
          category: formData.category,
          email: formData.email || null,
          website: formData.website || null,
          instagram: formData.instagram || null,
          twitter: formData.twitter || null,
          description: formData.description || null,
          userId: user.id,
          photographer: user.fullName || "Unknown",
          key: imageKey || null,
          src: finalImageUrl,
          price:
            formData.isPremium && formData.price
              ? parseFloat(formData.price)
              : null,
          isPremium: formData.isPremium,
          currency: currency,
        }),
      });

      if (!dbResponse.ok) {
        const errorData = await dbResponse.json();
        throw new Error(
          `Failed to create database record: ${
            errorData.error || dbResponse.statusText
          }`
        );
      }

      const result = await dbResponse.json();
      console.log("Photo submitted successfully:", result);

      setSubmitStatus("success");

      // Call callback if provided
      if (onImageUpload) {
        onImageUpload();
      }

      // Reset form after successful submission
      setFormData({
        title: "",
        alt: "",
        src: "",
        description: "",
        email: "",
        website: "",
        instagram: "",
        twitter: "",
        category: "",
        price: "",
        isPremium: false,
      });

      // Clean up image preview
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.preview);
        setSelectedImage(null);
      }

      toast("Image uploaded successfully!", {
        duration: 5000,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setSubmitStatus("error");
      toast("Failed to upload image. Please try again.", {
        duration: 5000,
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert minimum price to selected currency
  const minPriceUGX = 1000;
  const minPriceUSD = convertPrice(minPriceUGX, "UGX", "USD");
  const minPrice = currency === "UGX" ? minPriceUGX : minPriceUSD;
  const transferFee =
    currency === "UGX" ? 1000 : convertPrice(1000, "UGX", "USD");

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit Your Photo</h1>
        <p className="text-muted-foreground">
          Share your amazing photography with the ugpicx community
        </p>
      </div>

      {/* Authentication Check Alert */}
      {!isSignedIn && (
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You must be signed in to submit photos. Please sign in to continue.
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Status Alerts */}
      {submitStatus === "success" && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Photo submitted successfully! It will be reviewed and published
            soon.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === "error" && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            There was an error submitting your photo. Please try again.
          </AlertDescription>
        </Alert>
      )}

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
                <span>
                  Images should be Ugandan or shot by Ugandan photographer
                </span>
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
            <CardDescription>
              Upload your high-quality image (JPG, PNG)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={selectedImage.preview}
                      alt="Preview"
                      className="max-h-48 max-w-full rounded-lg shadow-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">{selectedImage.file.name}</p>
                    <p>
                      {(selectedImage.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    Drag and drop your image here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">or</p>
                  <Button type="button" variant="outline">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Choose File
                    </label>
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-4">
                    Maximum file size: 10MB. Supported formats: JPG, PNG.
                    Minimum: 5MP
                  </p>
                </>
              )}
            </div>

            {/* <div className="mt-4">
              <Label htmlFor="src">Or paste image URL</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Use either file upload or URL, not both
              </p>
              <Input
                id="src"
                placeholder="https://example.com/image.jpg"
                value={formData.src}
                onChange={(e) => handleInputChange("src", e.target.value)}
                disabled={!!selectedImage}
              />
            </div> */}
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
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
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
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your photo, the story behind it, or technical details..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
              />
            </div>

            {/* <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
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
            </div> */}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Optional contact details for attribution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  onChange={(e) =>
                    handleInputChange("instagram", e.target.value)
                  }
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
            <CardDescription>
              Set your photo as free or premium content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="premium"
                checked={formData.isPremium}
                onCheckedChange={(checked) =>
                  handleInputChange("isPremium", checked)
                }
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
                    Minimum price is {formatPrice(minPrice, currency)}. Set
                    prices above {formatPrice(transferFee, currency)}{" "}
                    (Flutterwave transfer fee).
                  </p>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Revenue Sharing:</strong>
                    <br />• Flutterwave transfer fee:{" "}
                    {formatPrice(transferFee, currency)} per transaction
                    <br />• Platform fee: 30% of your price
                    <br />• You receive: 70% of your price (paid monthly)
                    <br />
                    <br />
                    Example: If you set{" "}
                    {formatPrice(currency === "UGX" ? 5000 : 5, currency)},
                    you'll receive{" "}
                    {formatPrice(currency === "UGX" ? 3500 : 3.5, currency)} per
                    sale.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting || !isSignedIn}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            className="px-8"
            disabled={isSubmitting || !isSignedIn}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Submit Photo"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
