"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Phone, Lock, ChevronLeft, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { phone, password, redirect: false });
    if (res?.error) {
      setError("Invalid phone number or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-white dark:bg-zinc-950 overflow-hidden">

      {/* ─── Left Branding Panel ─── */}
      <div className="relative w-full lg:w-1/2 h-[40vh] sm:h-[46vh] lg:h-auto lg:min-h-screen flex flex-col justify-end lg:justify-center overflow-hidden bg-zinc-950">
        {/* Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop')" }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/25 via-transparent to-transparent" />
        {/* Blobs */}
        <div className="hidden lg:block absolute top-20 -left-32 w-[480px] h-[480px] bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden lg:block absolute bottom-20 right-0 w-72 h-72 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Back button — inside left panel on desktop */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-50 flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back home</span>
        </Link>

        {/* Branding content */}
        <div className="relative z-10 px-8 pb-12 lg:pb-0 lg:px-14 xl:px-20 2xl:px-28 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 lg:mb-12">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-600/40 -rotate-6 hover:rotate-0 transition-transform duration-300 shrink-0">
              <span className="text-2xl">🍔</span>
            </div>
            <span className="text-2xl lg:text-3xl font-black tracking-tighter text-white">
              <span className="text-orange-400">Local</span>Bites
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white leading-[1.1] tracking-tight mb-5 lg:mb-6">
            Your cravings<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              are waiting.
            </span>
          </h1>

          <p className="text-zinc-300 text-base lg:text-lg xl:text-xl font-medium leading-relaxed max-w-md mb-10 lg:mb-12">
            Sign in to discover top restaurants, track your orders live, and enjoy exclusive member deals.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2.5">
              {["🧑‍🍳", "👩", "🧔", "👩‍💼"].map((em, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-base">
                  {em}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-bold text-sm">12,000+ happy foodies</p>
              <p className="text-zinc-400 text-xs font-medium">Join them today</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Form Panel ─── */}
      <div className="relative w-full lg:w-1/2 flex flex-col bg-white dark:bg-zinc-950 -mt-8 lg:mt-0 rounded-t-[2.5rem] lg:rounded-none z-20 shadow-[0_-16px_48px_rgba(0,0,0,0.18)] lg:shadow-none overflow-y-auto">
        {/* Mobile pull indicator */}
        <div className="w-10 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mt-4 mb-2 lg:hidden" />

        {/* Centered form wrapper — wide on desktop */}
        <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 xl:px-24 2xl:px-32 w-full max-w-2xl mx-auto">

          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
              Welcome back 👋
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 font-medium text-base lg:text-lg">
              Sign in to continue your food journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="text-xl shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm lg:text-base font-bold text-zinc-700 dark:text-zinc-300">
                Phone Number
              </label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full h-14 lg:h-[3.75rem] pl-12 pr-4 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl text-base font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm lg:text-base font-bold text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-14 lg:h-[3.75rem] pl-12 pr-14 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl text-base font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 lg:h-[3.75rem] rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-70 text-white font-black text-base lg:text-lg shadow-lg shadow-orange-500/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
          </div>

          <p className="text-center text-base font-medium text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-orange-600 hover:text-orange-700 font-black hover:underline transition-colors">
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
