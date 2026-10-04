import { Bike, DollarSign, Clock, ArrowRight, Star, CheckCircle, Zap } from "lucide-react";

export default function RidePage() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Great Earnings",
      value: "₹500–1200/day",
      desc: "Competitive pay per delivery, plus tips and bonuses.",
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      value: "Work anytime",
      desc: "Log in and out whenever you want. No fixed shifts.",
      gradient: "from-blue-400 to-indigo-500",
    },
    {
      icon: Zap,
      title: "Quick Start",
      value: "< 24 hrs",
      desc: "Sign up, verify your documents, and start earning.",
      gradient: "from-orange-400 to-red-500",
    },
  ];

  const steps = [
    { step: "01", title: "Sign up online", desc: "Fill in your basic details — takes about 3 minutes." },
    { step: "02", title: "Submit documents", desc: "Upload your driving license, ID, and vehicle RC." },
    { step: "03", title: "Get verified", desc: "Our team reviews your profile within 24 hours." },
    { step: "04", title: "Start delivering", desc: "Log into the app and accept your first order!" },
  ];

  const requirements = [
    "Valid driving license", "Own a bike or scooter", "Smartphone (Android/iOS)",
    "Age 18 or above", "Know your local area", "Bank account for payouts",
  ];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-zinc-900 py-28 px-6">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-3xl" />

        {/* Big scooter emoji as decoration */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[160px] opacity-5 hidden md:block select-none">🛵</div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold px-4 py-2 rounded-full">
            <Bike className="w-4 h-4" /> Delivery Partners
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
            Ride. Earn.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              Live your way.
            </span>
          </h1>
          <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
            Be your own boss, set your own hours, and get paid weekly. Join the LocalBites rider fleet today.
          </p>
          <button className="inline-flex items-center gap-2 px-10 py-4 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-colors shadow-2xl shadow-orange-500/30 text-lg">
            Apply to Ride <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ── Earnings cards ── */}
      <section className="relative -mt-8 z-10 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5">
          {benefits.map(({ icon: Icon, title, value, desc, gradient }) => (
            <div key={title} className="bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className={`bg-gradient-to-br ${gradient} p-6 flex items-center gap-4`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-wider">{title}</p>
                  <p className="text-white font-black text-xl">{value}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Requirements ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white text-center">What you'll need</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              {requirements.map((req) => (
                <div key={req} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white text-center">How to get started</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-5 items-start bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <span className="text-3xl font-black text-orange-500/30 shrink-0 leading-none">{s.step}</span>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-1">{s.title}</h3>
                  <p className="text-zinc-500 text-sm font-medium">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center bg-gradient-to-br from-orange-500 to-red-600 rounded-[2.5rem] p-10 shadow-2xl shadow-orange-500/20">
            <Star className="w-10 h-10 text-white/80 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">Top riders earn ₹30,000+/month</h3>
            <p className="text-orange-100 font-medium mb-8 max-w-md mx-auto">Join over 200 happy riders already earning with LocalBites across the city.</p>
            <button className="px-8 py-3.5 bg-white text-orange-600 font-black rounded-2xl hover:bg-orange-50 transition-colors shadow-lg">
              Apply Now — It's Free
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
