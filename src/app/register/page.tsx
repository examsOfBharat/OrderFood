"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser, sendOTP } from "./actions";
import { Loader2, Phone, Lock, ChevronLeft, User, Mail, ArrowRight, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await sendOTP(email);
      if (res.error) setError(res.error);
      else setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await registerUser({ name, email, phone, password, role, otp });
      if (res.error) setError(res.error);
      else router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const perks = [
    { icon: "🍕", text: "Order from 500+ local restaurants" },
    { icon: "📍", text: "Real-time live order tracking" },
    { icon: "🎁", text: "Exclusive member-only deals" },
    { icon: "🚀", text: "Fast & free delivery options" },
  ];

  const inputClass = "w-full h-14 lg:h-[3.75rem] pl-12 pr-4 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl text-base font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-200 shadow-sm";

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-white dark:bg-zinc-950 overflow-hidden">

      {/* ─── Left Branding Panel ─── */}
      <div className="relative w-full lg:w-1/2 h-[38vh] sm:h-[44vh] lg:h-auto lg:min-h-screen flex flex-col justify-end lg:justify-center overflow-hidden bg-zinc-950">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 via-transparent to-transparent" />
        <div className="hidden lg:block absolute top-16 -left-28 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden lg:block absolute bottom-20 right-0 w-80 h-80 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Back button */}
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
            Join the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              food revolution.
            </span>
          </h1>

          <p className="hidden lg:block text-zinc-300 text-base lg:text-lg xl:text-xl font-medium leading-relaxed max-w-md mb-10 lg:mb-12">
            Create your free account and start ordering your favourite meals in minutes.
          </p>

          {/* Perks */}
          <ul className="hidden lg:flex flex-col gap-4">
            {perks.map((perk, i) => (
              <li key={i} className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center text-lg shrink-0">
                  {perk.icon}
                </div>
                <span className="text-zinc-300 font-medium text-base">{perk.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── Right Form Panel ─── */}
      <div className="relative w-full lg:w-1/2 flex flex-col bg-white dark:bg-zinc-950 -mt-8 lg:mt-0 rounded-t-[2.5rem] lg:rounded-none z-20 shadow-[0_-16px_48px_rgba(0,0,0,0.18)] lg:shadow-none overflow-y-auto">
        <div className="w-10 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mt-4 mb-2 lg:hidden" />

        <div className="flex-1 flex flex-col justify-center px-6 py-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-32 w-full max-w-2xl mx-auto">

          {step === 1 ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
                  Create your account ✨
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-3 font-medium text-base lg:text-lg">
                  Free forever. No credit card required.
                </p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-5">
                {error && (
                  <div className="p-4 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <span className="text-xl shrink-0">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Name + Phone in a row on large screens */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm lg:text-base font-bold text-zinc-700 dark:text-zinc-300">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                      <input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm lg:text-base font-bold text-zinc-700 dark:text-zinc-300">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                      <input id="phone" type="tel" placeholder="1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm lg:text-base font-bold text-zinc-700 dark:text-zinc-300">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                    <input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm lg:text-base font-bold text-zinc-700 dark:text-zinc-300">Password</label>
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
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Account type */}
                <div className="space-y-2">
                  <label className="block text-sm lg:text-base font-bold text-zinc-700 dark:text-zinc-300">I am a...</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "customer", label: "Customer", icon: "🛍️", desc: "Order food & track deliveries" },
                      { value: "store_owner", label: "Store Owner", icon: "🏪", desc: "List & manage your restaurant" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRole(opt.value)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                          role === opt.value
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-2xl shrink-0">{opt.icon}</span>
                        <div className="min-w-0">
                          <p className={`text-sm font-black truncate ${role === opt.value ? "text-orange-600" : "text-zinc-800 dark:text-zinc-200"}`}>{opt.label}</p>
                          <p className="text-[11px] text-zinc-400 font-medium leading-snug hidden lg:block">{opt.desc}</p>
                        </div>
                        {role === opt.value && <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 lg:h-[3.75rem] rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-70 text-white font-black text-base lg:text-lg shadow-lg shadow-orange-500/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 mt-2"
                >
                  {loading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" />Sending verification code...</>
                  ) : (
                    <><span>Send Verification Code</span><ArrowRight className="h-5 w-5" /></>
                  )}
                </button>
              </form>

              <p className="text-center text-base font-medium text-zinc-500 dark:text-zinc-400 mt-8">
                Already have an account?{" "}
                <Link href="/login" className="text-orange-600 hover:text-orange-700 font-black hover:underline transition-colors">
                  Sign in →
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* ── STEP 2: OTP ── */}
              <div className="mb-8">
                <button
                  onClick={() => { setStep(1); setOtp(""); setError(""); }}
                  className="mb-5 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Change email address
                </button>
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-orange-50 dark:bg-orange-950/30 border-2 border-orange-100 dark:border-orange-900/50 rounded-3xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-8 h-8 lg:w-10 lg:h-10 text-orange-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
                  Check your inbox ✉️
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-3 font-medium text-base lg:text-lg leading-relaxed">
                  We sent a 6-digit verification code to{" "}
                  <span className="text-orange-600 font-black">{email}</span>.
                  <br />
                  Enter it below to complete your registration.
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                {error && (
                  <div className="p-4 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <span className="text-xl shrink-0">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="otp" className="block text-sm lg:text-base font-bold text-zinc-700 dark:text-zinc-300">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                    className="w-full text-center h-20 lg:h-24 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl text-4xl lg:text-5xl font-black tracking-[0.6em] text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-200 shadow-sm"
                  />
                  <p className="text-xs text-zinc-400 font-medium text-center">Code expires in 10 minutes</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full h-14 lg:h-[3.75rem] rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-70 text-white font-black text-base lg:text-lg shadow-lg shadow-orange-500/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5"
                >
                  {loading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" />Verifying...</>
                  ) : (
                    <><CheckCircle2 className="h-5 w-5" />Complete Registration</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
