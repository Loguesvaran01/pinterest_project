"use client";

/**
 * Hero Section Component
 * Stunning animated hero for the homepage
 */

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";
import { useAuthStore } from "@/store";

// Sample hero images for the floating mosaic
const heroImages = [
  { src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=400&fit=crop", alt: "Nature", col: 1, delay: 0 },
  { src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=250&fit=crop", alt: "Food", col: 2, delay: 0.1 },
  { src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=300&h=350&fit=crop", alt: "Architecture", col: 2, delay: 0.2 },
  { src: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=300&h=300&fit=crop", alt: "Travel", col: 3, delay: 0.1 },
  { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=380&fit=crop", alt: "Fashion", col: 3, delay: 0.15 },
  { src: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=300&h=280&fit=crop", alt: "Art", col: 1, delay: 0.05 },
];

const stats = [
  { icon: Sparkles, label: "Daily pins", value: "10M+" },
  { icon: Users, label: "Creators", value: "50K+" },
  { icon: TrendingUp, label: "Trending", value: "500+" },
];

export default function HeroSection() {
  const { isAuthenticated } = useAuthStore();

  // Don't show hero for authenticated users
  if (isAuthenticated) return null;

  return (
    <section className="relative overflow-hidden gradient-hero min-h-[85vh] flex items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1800px] mx-auto px-4 w-full py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left - Text Content */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Discover · Create · Inspire
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6">
              Your visual{" "}
              <span className="gradient-text">inspiration</span>
              {" "}hub
            </h1>

            <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
              Discover millions of handpicked ideas. Save what inspires you, 
              share what you love, and build your unique aesthetic.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full bg-white text-gray-900 font-bold text-base shadow-2xl hover:shadow-white/20 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                >
                  Get started — it's free
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link href="/explore">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-all duration-200"
                >
                  Explore ideas
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="text-center lg:text-left"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <stat.icon size={14} className="text-white/50" />
                    <span className="text-xs text-white/50 font-medium">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right - Floating Image Mosaic */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:grid grid-cols-3 gap-3 relative"
        >
          {/* Floating images arranged in columns */}
          {[1, 2, 3].map((col) => (
            <div key={col} className={`flex flex-col gap-3 ${col === 2 ? "mt-8" : ""}`}>
              {heroImages
                .filter((img) => img.col === col)
                .map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + img.delay, duration: 0.6 }}
                    whileHover={{ scale: 1.02, rotate: 1 }}
                    className="relative overflow-hidden rounded-2xl shadow-2xl"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={300}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-white/80 text-xs font-medium backdrop-blur-sm bg-black/20 px-2 py-0.5 rounded-full">
                      {img.alt}
                    </span>
                  </motion.div>
                ))}
            </div>
          ))}

          {/* Floating decorative elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl gradient-brand opacity-80 flex items-center justify-center shadow-brand"
          >
            <Sparkles size={28} className="text-white" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
