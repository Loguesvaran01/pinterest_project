"use client";

/**
 * Login Page
 * Glassmorphism-styled login form
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { authService } from "@/services";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await authService.login(formData);
      login(res.user, res.token);
      toast.success(res.message || "Welcome back! 👋");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await authService.login({
        email: "alex@pinvault.com",
        password: "password123",
      });
      login(res.user, res.token);
      toast.success("Logged in with demo account! 🎉");
      router.push("/");
    } catch (err: any) {
      toast.error("Demo login failed. Make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-hero">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">P</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">PinVault</span>
          </div>

          {/* Floating image collage */}
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              {[
                "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=250&h=200&fit=crop",
                "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=250&h=280&fit=crop",
                "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=250&h=260&fit=crop",
                "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=250&h=220&fit=crop",
              ].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`rounded-2xl overflow-hidden shadow-2xl ${i % 2 === 1 ? "mt-6" : ""}`}
                >
                  <Image
                    src={src}
                    alt="Inspiration"
                    width={250}
                    height={250}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="text-white/80 max-w-xs">
            <p className="text-lg font-display font-medium leading-relaxed">
              "Creativity is intelligence having fun."
            </p>
            <p className="text-sm mt-2 text-white/50">— Albert Einstein</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-dark-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-display font-bold text-2xl text-gray-900 dark:text-white">
              PinVault
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Welcome back 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sign in to continue your creative journey
            </p>
          </div>

          {/* Demo Login Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-amber-800 dark:text-amber-300 text-sm font-medium mb-2">
              🎯 Try the demo account
            </p>
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="text-sm text-amber-600 dark:text-amber-400 underline underline-offset-2 hover:no-underline font-medium"
            >
              Click here to login with demo credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="input-label">Email address</label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  className={`input-field pl-11 ${
                    errors.email ? "border-red-500 dark:border-red-500" : ""
                  }`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="input-label mb-0">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand-500 hover:text-brand-600 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className={`input-field pl-11 pr-12 ${
                    errors.password ? "border-red-500 dark:border-red-500" : ""
                  }`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-dark-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gray-50 dark:bg-dark-950 text-sm text-gray-500">
                or
              </span>
            </div>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-brand-500 hover:text-brand-600 font-semibold"
            >
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
