import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const imageId = params.id;
    const body = await request.json().catch(() => ({}));

    // Get client IP
    const headersList = headers();
    const forwarded = headersList.get("x-forwarded-for");
    const clientIP = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    // Check for recent view from same IP (24 hours)
    const recentView = await prisma.imageView.findFirst({
      where: {
        imageId,
        ipAddress: clientIP,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    // Only track if no recent view
    if (!recentView) {
      await prisma.$transaction(async (tx) => {
        // Increment view count
        await tx.image.update({
          where: { id: imageId },
          data: {
            views: {
              increment: 1,
            },
          },
        });

        // Record detailed view
        await tx.imageView.create({
          data: {
            imageId,
            ipAddress: clientIP,
            userAgent: body.userAgent || "unknown",
            referrer: body.referrer || null,
            timestamp: new Date(body.timestamp || Date.now()),
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: "View tracked",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Already viewed recently",
    });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track view" },
      { status: 500 }
    );
  }
}
