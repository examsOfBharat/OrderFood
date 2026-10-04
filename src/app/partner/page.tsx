import { Store, TrendingUp, ShieldCheck, ArrowRight, CheckCircle, ChefHat } from "lucide-react";
import Link from "next/link";

export default function PartnerPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "More Revenue",
      desc: "Tap into a massive network of hungry customers and boost your daily orders instantly.",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      icon: Store,
      title: "Your Store, Your Rules",
      desc: "Manage your menu, set your delivery radius, and control preparation times yourself.",
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      icon: ShieldCheck,
      title: "Reliable Payments",
      desc: "Get settled on time, every time, with full transparency into every transaction.",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
  ];

  const steps = [
    { step: "01", title: "Register your restaurant", desc: "Sign up and fill in your restaurant details — takes under 5 minutes." },
    { step: "02", title: "Set up your menu", desc: "Add categories, items, prices, and availability from your dashboard." },
    { step: "03", title: "Start receiving orders", desc: "Go live and start getting orders directly from customers in your area." },
  ];

  const checklist = [
    "Zero setup fee", "No hidden charges", "Dedicated support",
    "Real-time analytics", "Custom delivery radius", "24/7 dashboard access",
  ];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-zinc-900 py-28 px-6">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold px-4 py-2 rounded-full">
            <ChefHat className="w-4 h-4" /> Restaurant Partners
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
            Grow your restaurant<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              with LocalBites.
            </span>
          </h1>
          <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
            Join hundreds of restaurants scaling their delivery business with zero hidden fees and ultimate control.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-colors shadow-2xl shadow-orange-500/30 text-lg"
          >
            Partner with us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Checklist ── */}
      <section className="relative -mt-8 z-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {checklist.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white text-center">Why partner with us?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm text-center">
                <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white text-center">How it works</h2>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-6 items-start bg-white dark:bg-zinc-900 p-7 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <span className="text-3xl font-black text-orange-500/30 shrink-0 leading-none">{s.step}</span>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{s.title}</h3>
                  <p className="text-zinc-500 font-medium">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
