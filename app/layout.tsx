import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SearchProvider } from "@/components/search-provider";
import "./globals.css";
import { Suspense } from "react";
import { Providers } from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ugpicx | Beautiful Free Photos & Images from Uganda",
  description:
    "ugpicx offers beautiful free photos, stock images, and vectors showcasing the beauty of Uganda and beyond, shared by our talented local and international community.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ugpicx",
              url: "https://www.ugpicx.com",
              logo: "https://www.ugpicx.com/ug.png",
              description:
                "ugpicx offers beautiful free photos and images showcasing the beauty of Uganda and beyond.",
            }),
          }}
        />
      </Head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <SearchProvider>
              <Suspense>
                <Providers>{children}</Providers>
                <Toaster />
              </Suspense>
            </SearchProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
