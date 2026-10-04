import { Users, Twitter, Linkedin, Code, Palette, BarChart, Headphones } from "lucide-react";

export default function TeamPage() {
  const team = [
    {
      name: "Sikku",
      role: "Founder & CEO",
      initials: "S",
      dept: "Leadership",
      bio: "Passionate about food tech and local communities.",
      gradient: "from-orange-500 to-red-500",
      icon: BarChart,
    },
    {
      name: "Sarah Jenkins",
      role: "Head of Product",
      initials: "SJ",
      dept: "Product",
      bio: "Turning user insights into delightful experiences.",
      gradient: "from-purple-500 to-pink-500",
      icon: Palette,
    },
    {
      name: "David Chen",
      role: "CTO",
      initials: "DC",
      dept: "Engineering",
      bio: "Architecting systems that scale to millions of orders.",
      gradient: "from-blue-500 to-cyan-500",
      icon: Code,
    },
    {
      name: "Maya Patel",
      role: "Head of Operations",
      initials: "MP",
      dept: "Operations",
      bio: "Ensuring every delivery reaches you, on time.",
      gradient: "from-emerald-500 to-teal-500",
      icon: Headphones,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-zinc-900 py-24 px-6">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold px-4 py-2 rounded-full">
            <Users className="w-4 h-4" /> The Team
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
            Built by people<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              who love food.
            </span>
          </h1>
          <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
            A tight-knit team of engineers, designers and operators united by a shared obsession with great food and great experiences.
          </p>
        </div>
      </section>

      {/* ── Team Grid ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map(({ name, role, initials, dept, bio, gradient, icon: Icon }) => (
            <div key={name}
              className="group bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              {/* Colour header with initials */}
              <div className={`bg-gradient-to-br ${gradient} h-32 flex items-center justify-center relative`}>
                {/* subtle pattern */}
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)", backgroundSize: "20px 20px" }}
                />
                <span className="relative text-5xl font-black text-white/90 tracking-tighter">{initials}</span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="mb-1">
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{dept}</span>
                </div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">{name}</h3>
                <p className="text-sm font-semibold text-zinc-400 mb-3">{role}</p>
                <p className="text-sm text-zinc-500 leading-relaxed flex-1">{bio}</p>

                <div className="flex gap-2 mt-5">
                  <button className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center bg-white dark:bg-zinc-900 rounded-[2.5rem] p-12 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-3">Want to join this team?</h3>
          <p className="text-zinc-500 font-medium mb-8">We're always looking for talented people who share our passion.</p>
          <a href="/careers" className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-2xl hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-colors">
            See Open Roles →
          </a>
        </div>
      </section>

    </main>
  );
}
