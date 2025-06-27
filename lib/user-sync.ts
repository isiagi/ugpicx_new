// lib/user-sync.ts
import { prisma } from "@/lib/prisma";
import { User } from "@clerk/nextjs/server";

export async function syncUserWithDatabase(clerkUser: User) {
  try {
    const userData = {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      username: clerkUser.username,
      lastActiveAt: new Date(),
    };

    const user = await prisma.user.upsert({
      where: { id: clerkUser.id },
      update: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        imageUrl: userData.imageUrl,
        username: userData.username,
        lastActiveAt: userData.lastActiveAt,
      },
      create: userData,
    });

    return user;
  } catch (error) {
    console.error("Error syncing user with database:", error);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      //   include: {
      //     images: {
      //       orderBy: { createdAt: "desc" },
      //       take: 6, // Latest 6 images for profile preview
      //     },
      //     favorites: {
      //       include: {
      //         image: true,
      //       },
      //       orderBy: { createdAt: "desc" },
      //       take: 6,
      //     },
      //     _count: {
      //       select: {
      //         images: true,
      //         favorites: true,
      //         downloads: true,
      //       },
      //     },
      //   },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// export async function trackProfileView(
//   profileId: string,
//   viewerData: {
//     viewerId?: string;
//     ipAddress: string;
//     userAgent?: string;
//     referrer?: string;
//   }
// ) {
//   try {
//     // Don't track if user is viewing their own profile
//     if (viewerData.viewerId === profileId) {
//       return null;
//     }

//     const profileView = await prisma.profileView.create({
//       data: {
//         profileId,
//         viewerId: viewerData.viewerId,
//         ipAddress: viewerData.ipAddress,
//         userAgent: viewerData.userAgent,
//         referrer: viewerData.referrer,
//       },
//     });

//     return profileView;
//   } catch (error) {
//     console.error("Error tracking profile view:", error);
//     throw error;
//   }
// }

export async function updateUserProfile(
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    website?: string;
    instagram?: string;
    twitter?: string;
    location?: string;
    isPublic?: boolean;
    emailNotifications?: boolean;
  }
) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return user;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// export async function getUserStats(userId: string) {
//   try {
//     const stats = await prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         _count: {
//           select: {
//             images: true,
//             favorites: true,
//             downloads: true,
//             profileViews: true,
//           },
//         },
//         images: {
//           select: {
//             views: true,
//             downloads: true,
//           },
//         },
//       },
//     });

//     if (!stats) return null;

//     const totalViews = stats.images.reduce((sum, img) => sum + img.views, 0);
//     const totalDownloads = stats.images.reduce(
//       (sum, img) => sum + img.downloads,
//       0
//     );

//     return {
//       totalImages: stats._count.images,
//       totalFavorites: stats._count.favorites,
//       totalViews,
//       totalDownloads,
//       profileViews: stats._count.profileViews,
//     };
//   } catch (error) {
//     console.error("Error fetching user stats:", error);
//     throw error;
//   }
// }
