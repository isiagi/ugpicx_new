"use client"

export const downloadImage = async (src: string, filename: string) => {
  try {
    // Create a temporary anchor element
    const link = document.createElement("a")
    link.href = src
    link.download = filename
    link.crossOrigin = "anonymous"

    // Append to body, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Track download
    console.log(`Downloaded: ${filename}`)

    return true
  } catch (error) {
    console.error("Download failed:", error)
    return false
  }
}

export const handlePhotoDownload = async (photo: {
  id: string
  src: string
  alt: string
  isPremium?: boolean
  price?: number
}) => {
  if (photo.isPremium && photo.price && photo.price > 0) {
    // Handle premium download - show purchase modal
    alert(`This is a premium photo. Purchase required: $${photo.price}`)
    return false
  }

  // Generate filename
  const filename = `ugpicx-${photo.id}-${photo.alt.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.jpg`

  // Download the image
  const success = await downloadImage(photo.src, filename)

  if (success) {
    alert("Download started! Check your downloads folder.")
    // Here you would typically update download count in your database
  } else {
    alert("Download failed. Please try again.")
  }

  return success
}
