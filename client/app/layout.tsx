import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import DarkModeProvider from "@/components/layout/DarkModeProvider";

// Google Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "PinVault - Discover & Save Inspiring Content",
    template: "%s | PinVault",
  },
  description:
    "PinVault is your premium visual discovery platform. Find inspiration, save your favorite content, and share your creativity with the world.",
  keywords: ["pinterest", "inspiration", "visual", "photos", "design", "art", "photography"],
  authors: [{ name: "PinVault Team" }],
  creator: "PinVault",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "PinVault",
    title: "PinVault - Discover & Save Inspiring Content",
    description:
      "Your premium visual discovery platform for inspiration and creativity.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PinVault",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PinVault",
    description: "Discover & Save Inspiring Content",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <DarkModeProvider>
          {/* Navbar */}
          <Navbar />

          {/* Main content with top padding for fixed navbar */}
          <main className="pt-[70px] min-h-screen">
            {children}
          </main>

          {/* Toast notifications */}
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "12px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: {
                iconTheme: {
                  primary: "#e60023",
                  secondary: "#fff",
                },
              },
            }}
          />
        </DarkModeProvider>
      </body>
    </html>
  );
}
