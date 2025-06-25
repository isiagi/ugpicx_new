// app/api/photos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = params.id;

    if (!photoId) {
      return NextResponse.json(
        { error: "Photo ID is required" },
        { status: 400 }
      );
    }

    // Fetch photo with photographer details
    const photo = await prisma.image.findUnique({
      where: {
        id: photoId,
      },
      //   include: {
      //     photographer: {
      //       select: {
      //         name: true,
      //         username: true,
      //         avatar: true,
      //         bio: true,
      //       },
      //     },
      //   },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Optional: Increment view count
    // await prisma.image.update({
    //   where: { id: photoId },
    //   data: {
    //     views: {
    //       increment: 1,
    //     },
    //   },
    // });

    // Format the response to match your component's expected structure
    // const formattedPhoto = {
    //   id: photo.id,
    //   src: photo.src,
    //   alt: photo.alt,
    //   width: photo.width,
    //   height: photo.height,
    //   likes: photo.likes,
    //   downloads: photo.downloads,
    //   views: photo.views + 1, // Include the incremented view
    //   tags: photo.tags,
    //   isPremium: photo.isPremium,
    //   price: photo.price,
    //   uploadDate: photo.uploadDate,
    //   camera: photo.camera,
    //   location: photo.location,
    //   photographer: {
    //     name: photo.photographer.name,
    //     username: photo.photographer.username,
    //     avatar: photo.photographer.avatar,
    //     bio: photo.photographer.bio,
    //   },
    // };

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Error fetching photo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Handle other HTTP methods
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = params.id;
    const body = await request.json();

    if (!photoId) {
      return NextResponse.json(
        { error: "Photo ID is required" },
        { status: 400 }
      );
    }

    // Example: Update likes count
    // if (body.action === "like") {
    //   const updatedPhoto = await prisma.image.update({
    //     where: { id: photoId },
    //     data: {
    //       likes: {
    //         increment: body.increment ? 1 : -1,
    //       },
    //     },
    //   });

    //   return NextResponse.json({ likes: updatedPhoto.likes });
    // }

    // return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
