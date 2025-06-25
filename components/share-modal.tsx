"use client"

import { useState } from "react"
import { Copy, Facebook, Twitter, Linkedin, Mail, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  photo: {
    id: string
    alt: string
    src: string
  } | null
}

export function ShareModal({ isOpen, onClose, photo }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  if (!photo) return null

  const photoUrl = `${window.location.origin}/photo/${photo.id}`
  const shareText = `Check out this amazing photo: ${photo.alt}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(photoUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(photoUrl)}`,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(photoUrl)}`,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(photoUrl)}`,
      color: "bg-blue-700 hover:bg-blue-800",
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${photoUrl}`)}`,
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ]

  const handleShare = (url: string) => {
    window.open(url, "_blank", "width=600,height=400")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Photo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo Preview */}
          <div className="text-center">
            <img
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
            <p className="text-sm text-muted-foreground">{photo.alt}</p>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Photo Link</label>
            <div className="flex gap-2">
              <Input value={photoUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="outline" size="icon">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            {copied && <p className="text-xs text-green-600">Link copied to clipboard!</p>}
          </div>

          {/* Social Share Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Share on social media</label>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  onClick={() => handleShare(option.url)}
                  className={`${option.color} text-white`}
                  variant="default"
                >
                  <option.icon className="h-4 w-4 mr-2" />
                  {option.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Embed Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Embed Code</label>
            <Input value={`<img src="${photo.src}" alt="${photo.alt}" />`} readOnly className="text-xs" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
