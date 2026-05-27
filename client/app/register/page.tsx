"use client";

/**
 * Register Page
 * Multi-step registration with glassmorphism UI
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2,
} from "lucide-react";
import { authService } from "@/services";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";

const passwordStrengthConfig = [
  { label: "Very Weak", color: "bg-red-500", minScore: 0 },
  { label: "Weak", color: "bg-orange-500", minScore: 1 },
  { label: "Fair", color: "bg-yellow-500", minScore: 2 },
  { label: "Good", color: "bg-blue-500", minScore: 3 },
  { label: "Strong", color: "bg-green-500", minScore: 4 },
];

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthInfo = passwordStrengthConfig[Math.min(passwordStrength, 4)];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3) newErrors.username = "Minimum 3 characters";
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username))
      newErrors.username = "Only letters, numbers, and underscores";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Minimum 6 characters";
    else if (!/\d/.test(formData.password)) newErrors.password = "Must contain a number";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";
    if (!agreeToTerms) newErrors.terms = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName || formData.username,
      });
      login(res.user, res.token);
      toast.success(res.message || "Welcome to PinVault! 🎉");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Save pins to personal boards",
    "Upload and share your creations",
    "Follow creators you love",
    "Get personalized recommendations",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Benefits */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden gradient-hero">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 w-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">P</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">PinVault</span>
          </div>

          <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
            Join the creative community
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Millions of ideas, one platform. Start your visual journey today.
          </p>

          <ul className="space-y-4">
            {benefits.map((benefit, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 text-white/80"
              >
                <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} className="text-green-400" />
                </div>
                {benefit}
              </motion.li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="mt-12 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white/20 bg-gradient-to-br from-purple-400 to-pink-400"
                  />
                ))}
              </div>
              <span className="text-white/80 text-sm font-medium">50K+ creators</span>
            </div>
            <p className="text-white/60 text-xs">
              Join thousands of creators sharing their inspiration daily
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-dark-950 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Create your account ✨
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              It's free and takes less than a minute
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <div>
              <label className="input-label">Display Name (optional)</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Your full name"
                  className="input-field pl-11"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="input-label">Username *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">@</span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value.toLowerCase() })
                  }
                  placeholder="your_username"
                  className={`input-field pl-8 ${errors.username ? "border-red-500" : ""}`}
                />
              </div>
              {errors.username && <p className="text-red-500 text-xs mt-1.5">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="input-label">Email address *</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className={`input-field pl-11 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password *</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min. 6 characters with a number"
                  className={`input-field pl-11 pr-12 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          i <= passwordStrength
                            ? strengthInfo.color
                            : "bg-gray-200 dark:bg-dark-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Strength:{" "}
                    <span className={`font-medium ${strengthInfo.color.replace("bg-", "text-")}`}>
                      {strengthInfo.label}
                    </span>
                  </p>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="input-label">Confirm Password *</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  placeholder="Repeat your password"
                  className={`input-field pl-11 ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <CheckCircle2
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
                  />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-brand-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" className="text-brand-500 hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-brand-500 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}

            {/* Submit */}
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
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-500 hover:text-brand-600 font-semibold">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
