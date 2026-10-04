import { Rocket, Briefcase, Coffee, MapPin, Clock, Banknote } from "lucide-react";

export default function CareersPage() {
  const jobs = [
    { title: "Senior Frontend Engineer", dept: "Engineering", loc: "Remote / Bangalore", type: "Full-time", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { title: "Product Designer", dept: "Design", loc: "Remote", type: "Full-time", color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20" },
    { title: "Operations Manager", dept: "Operations", loc: "Mumbai", type: "Full-time", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
    { title: "Customer Success Lead", dept: "Support", loc: "Bangalore", type: "Full-time", color: "text-orange-500 bg-orange-50 dark:bg-orange-950/20" },
  ];

  const perks = [
    { icon: Banknote, label: "Competitive Salary" },
    { icon: Clock, label: "Flexible Hours" },
    { icon: MapPin, label: "Remote Friendly" },
    { icon: Coffee, label: "Unlimited Coffee" },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-zinc-900 py-24 px-6">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold px-4 py-2 rounded-full">
            <Rocket className="w-4 h-4" /> We're Hiring
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
            Build the future<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              of food delivery.
            </span>
          </h1>
          <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
            Join a passionate team working to reshape how people experience local food. We're small, fast, and growing.
          </p>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="relative -mt-8 z-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {perks.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 text-center shadow-sm border border-zinc-100 dark:border-zinc-800">
                <Icon className="w-7 h-7 mx-auto mb-3 text-orange-500" />
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Roles ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-orange-500" /> Open Positions
          </h2>

          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div key={i}
                className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-lg transition-all p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm font-medium">
                    <span className={`px-2.5 py-1 rounded-lg ${job.color}`}>{job.dept}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />{job.loc}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />{job.type}
                    </span>
                  </div>
                </div>
                <button className="shrink-0 px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-colors">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── No fit ── */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 rounded-[2.5rem] p-10 md:p-16 text-center">
          <Coffee className="w-12 h-12 text-orange-400 mx-auto mb-5" />
          <h3 className="text-2xl font-black text-white mb-3">Don't see a perfect fit?</h3>
          <p className="text-zinc-400 font-medium mb-8 max-w-md mx-auto">
            Send us your resume anyway. We're always open to talented and passionate people.
          </p>
          <button className="px-8 py-3.5 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-colors">
            Send Resume →
          </button>
        </div>
      </section>

    </main>
  );
}
