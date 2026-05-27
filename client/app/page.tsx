import type { Metadata } from "next";
import HeroSection from "@/components/layout/HeroSection";
import HomeFeed from "@/components/posts/HomeFeed";

export const metadata: Metadata = {
  title: "PinVault - Discover Inspiring Content",
  description:
    "Discover millions of ideas and save your favorites. The premium visual discovery platform.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero section - only shows for unauthenticated users */}
      <HeroSection />

      {/* Main Feed */}
      <HomeFeed />
    </div>
  );
}
