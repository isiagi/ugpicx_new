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
  title: "UgPicx | Discover Stunning Ugandan Photography",
  description:
    "Explore Uganda’s beauty with UgPicx – your ultimate destination for stunning free and premium photos showcasing landscapes, culture, wildlife, and people. Discover, share, and license breathtaking Ugandan photography.",
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
              name: "UgPicx",
              url: "https://www.ugpicx.com",
              logo: "https://www.ugpicx.com/ug.png",
              description:
                "Explore Uganda’s beauty with UgPicx – your ultimate destination for stunning free and premium photos showcasing landscapes, culture, wildlife, and people. Discover, share, and license breathtaking Ugandan photography.",
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
