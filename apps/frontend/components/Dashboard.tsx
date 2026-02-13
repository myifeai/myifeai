import { Crown, Zap, TrendingUp, CheckCircle2 } from "lucide-react";

const objectives = [
  {
    category: "Health",
    xp: 10,
    text: "Drink one full glass of water as soon as you wake up",
  },
  {
    category: "Wealth",
    xp: 20,
    text: "Spend 10 minutes reviewing and categorizing your current expenses",
  },
  {
    category: "Career",
    xp: 30,
    text: "Update your professional LinkedIn profile with a clear, concise headline",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0612] via-[#120a1f] to-[#050308] text-white px-6 py-10">
      
      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl">
            <Crown className="text-purple-400" size={26} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Life CEO</h1>
        </div>
        <p className="text-white/60 text-sm">
          High Performance Mode · Neural Interface Secured
        </p>
      </header>

      {/* PERFORMANCE PANEL */}
      <section className="max-w-6xl mx-auto mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <GlassStat
            icon={<Zap />}
            label="Focus"
            value="92%"
          />

          <GlassStat
            icon={<TrendingUp />}
            label="Rank"
            value="CEO"
          />
        </div>
      </section>

      {/* STRATEGIC OBJECTIVES */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 tracking-tight">
          Strategic Objectives
        </h2>

        <div className="space-y-5">
          {objectives.map((item, index) => (
            <ObjectiveCard key={index} {...item} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto mt-20 text-center text-white/30 text-xs tracking-wide">
        Neural Interface Secured · 2026 Edition
      </footer>
    </div>
  );
}

/* -------------------------------- COMPONENTS -------------------------------- */

function GlassStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(140,80,255,0.12)]">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-white/10">
          {icon}
        </div>
        <div>
          <p className="text-sm text-white/50">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ObjectiveCard({
  category,
  xp,
  text,
}: {
  category: string;
  xp: number;
  text: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_60px_rgba(140,80,255,0.18)]">
      
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-300 tracking-wide">
              {category}
            </span>
            <span className="text-xs text-green-400 font-medium">
              +{xp} XP
            </span>
          </div>

          <p className="text-base leading-relaxed text-white/90">
            {text}
          </p>
        </div>

        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-xl bg-white/10 hover:bg-white/20">
          <CheckCircle2 className="text-green-400" />
        </button>
      </div>
    </div>
  );
}
