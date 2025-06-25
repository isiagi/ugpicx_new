"use client";

export const downloadImage = async (
  src: string,
  filename: string,
  imageId: string
) => {
  try {
    // Method 1: Fetch with proper headers and create blob
    const response = await fetch(src, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    // Create object URL from blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element with download attribute
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    // Force download by setting content-disposition
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    window.URL.revokeObjectURL(url);

    console.log(`Downloaded: ${filename}`);

    const trackResponse = await fetch("/api/images/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId }),
    });

    if (!trackResponse.ok) {
      throw new Error("Failed to track download");
    }

    return true;
  } catch (error) {
    console.error("Fetch download failed:", error);

    // Method 2: Fallback - try to force download with iframe
    try {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = src;
      document.body.appendChild(iframe);

      // Remove iframe after a short delay
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);

      return true;
    } catch (iframeError) {
      console.error("Iframe download failed:", iframeError);

      // Method 3: Last resort - open in new tab with download hint
      try {
        const link = document.createElement("a");
        link.href = src;
        link.download = filename;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return true;
      } catch (linkError) {
        console.error("All download methods failed:", linkError);
        return false;
      }
    }
  }
};

export const handlePhotoDownload = async (photo: {
  id: string;
  src: string;
  alt: string;
  isPremium?: boolean;
  price?: number;
}) => {
  if (photo.isPremium && photo.price && photo.price > 0) {
    alert(`This is a premium photo. Purchase required: $${photo.price}`);
    return false;
  }

  // Generate filename with proper extension
  const filename = `ugpicx-${photo.id}-${photo.alt
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase()}.jpg`;

  // Download the image
  const success = await downloadImage(photo.src, filename, photo.id);

  if (success) {
    alert("Download started! Check your downloads folder.");
  } else {
    alert("Download failed. The image will open in a new tab instead.");
    // As final fallback, open in new tab
    window.open(photo.src, "_blank");
  }

  return success;
};
