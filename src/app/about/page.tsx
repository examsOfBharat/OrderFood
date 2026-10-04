import { Info, Target, Heart, Zap, Globe, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { value: "50+", label: "Restaurants" },
    { value: "10K+", label: "Orders Delivered" },
    { value: "4.8★", label: "Avg Rating" },
    { value: "30min", label: "Avg Delivery" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Food",
      desc: "We believe great food is the foundation of happiness. Built by foodies, for foodies — ensuring every meal meets the highest standards.",
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/20",
      ring: "ring-rose-100 dark:ring-rose-900/30",
    },
    {
      icon: Target,
      title: "Empowering Locals",
      desc: "Give independent restaurants the digital tools they need to thrive — keeping neighbourhood flavours alive against giant chains.",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
      ring: "ring-blue-100 dark:ring-blue-900/30",
    },
    {
      icon: Zap,
      title: "Speed & Reliability",
      desc: "Real-time order tracking, lightning-fast delivery, and instant notifications — because hunger doesn't wait.",
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/20",
      ring: "ring-amber-100 dark:ring-amber-900/30",
    },
    {
      icon: Globe,
      title: "Community First",
      desc: "Every order supports a local business and brings people closer through the universal language of food.",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      ring: "ring-emerald-100 dark:ring-emerald-900/30",
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-zinc-900 py-24 px-6">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold px-4 py-2 rounded-full">
            <Info className="w-4 h-4" /> Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
            Food delivery,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              done right.
            </span>
          </h1>
          <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            LocalBites connects food lovers with the best local culinary experiences — seamlessly, sustainably, and with a smile.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative -mt-8 z-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 text-center shadow-sm border border-zinc-100 dark:border-zinc-800">
                <p className="text-3xl font-black text-zinc-900 dark:text-white">{s.value}</p>
                <p className="text-sm font-medium text-zinc-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[2.5rem] p-10 md:p-16 text-white text-center shadow-2xl shadow-orange-500/20">
            <ShieldCheck className="w-14 h-14 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-black mb-4">Our Mission</h2>
            <p className="text-lg text-orange-100 leading-relaxed max-w-2xl mx-auto">
              To make quality food accessible to everyone by building a bridge between passionate local restaurants and hungry customers — powered by technology, driven by care.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white text-center">What we stand for</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc, color, bg, ring }) => (
              <div key={title} className={`bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-100 dark:border-zinc-800 flex gap-5 ring-1 ${ring}`}>
                <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
