"use client";

/**
 * Dark Mode Provider
 * Applies dark class to <html> based on Zustand store
 */

import { useEffect, ReactNode } from "react";
import { useUIStore } from "@/store";

export default function DarkModeProvider({ children }: { children: ReactNode }) {
  const isDarkMode = useUIStore((state) => state.isDarkMode);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDarkMode]);

  return <>{children}</>;
}
