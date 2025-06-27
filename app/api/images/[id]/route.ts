import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  console.log("Fetching images for userId:", id);

  try {
    const images = await prisma.image.findMany({
      where: { userId: id },
    });
    if (!images || images.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json(images);
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.image.delete({ where: { id } });
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Failed to delete image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
