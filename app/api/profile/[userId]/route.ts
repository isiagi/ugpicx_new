// app/api/profile/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getUserProfile,
  //   trackProfileView,
  //   getUserStats,
} from "@/lib/user-sync";

interface Params {
  userId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { userId } = params; // ✅ use directly, no await
    const { userId: currentUserId } = await auth();

    const profile = await getUserProfile(userId);

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!profile.isPublic && currentUserId !== userId) {
      return NextResponse.json(
        { error: "Profile is private" },
        { status: 403 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// app/api/profile/route.ts - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate data
    const allowedFields = [
      "firstName",
      "lastName",
      "bio",
      "website",
      "instagram",
      "twitter",
      "linkedin",
      "github",
      "youtube",
      "tiktok",
      "location",
      "coverImageUrl",
      "isPublic",
      "emailNotifications",
    ];

    const updateData = Object.keys(data)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {} as any);

    const { updateUserProfile } = await import("@/lib/user-sync");
    const updatedUser = await updateUserProfile(userId, updateData);

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
