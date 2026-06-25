import Link from "next/link";
import { ACADEMY_CONTENT, getTotalXP, type RoleConfig } from "@/lib/academy-content";

function RoleCard({ role }: { role: RoleConfig }) {
  const totalXP = getTotalXP(role);
  const totalMissions = role.parcours.flatMap((p) => p.missions).length;
  const totalBadges = role.parcours.length;

  const colorMap = {
    violet: {
      border: "border-violet-200 hover:border-violet-400",
      bg: "bg-violet-50 hover:bg-violet-100",
      badge: "bg-violet-100 text-violet-700",
      cta: "bg-violet-600 hover:bg-violet-700 text-white",
      glow: "hover:shadow-violet-200",
    },
    emerald: {
      border: "border-emerald-200 hover:border-emerald-400",
      bg: "bg-emerald-50 hover:bg-emerald-100",
      badge: "bg-emerald-100 text-emerald-700",
      cta: "bg-emerald-600 hover:bg-emerald-700 text-white",
      glow: "hover:shadow-emerald-200",
    },
  } as const;

  const colors = colorMap[role.color as keyof typeof colorMap];

  return (
    <Link
      href={`/academie/${role.id}`}
      className={`group relative flex flex-col rounded-3xl border-2 p-8 transition-all duration-300 ${colors.border} ${colors.bg} ${colors.glow} hover:shadow-2xl hover:-translate-y-1`}
    >
      <div className="mb-6 text-6xl">{role.emoji}</div>

      <h2 className="mb-2 text-2xl font-bold text-gray-900">{role.title}</h2>
      <p className="mb-8 text-gray-600">{role.subtitle}</p>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalMissions}</div>
          <div className="text-xs text-gray-500">missions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalBadges}</div>
          <div className="text-xs text-gray-500">badges</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalXP}</div>
          <div className="text-xs text-gray-500">XP max</div>
        </div>
      </div>

      <div className="mb-8 space-y-2">
        {role.parcours.map((parcours) => (
          <div key={parcours.id} className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${colors.badge}`}>
              {parcours.badge.emoji} {parcours.title}
            </span>
          </div>
        ))}
      </div>

      <div
        className={`mt-auto flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all ${colors.cta}`}
      >
        Démarrer mon parcours
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}

export default function AcademiePage() {
  const roles = Object.values(ACADEMY_CONTENT);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-96 w-96 translate-x-1/2 rounded-full bg-emerald-500 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
            <span>🎓</span>
            <span>AssoConnect Académie</span>
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white">
            Gérer une asso est un noble casse-tête.{" "}
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              On vous aide.
            </span>
          </h1>
          <p className="text-xl text-slate-300">
            Des parcours de formation gamifiés, adaptés à votre rôle. Apprenez à votre rythme,
            débloquez des badges et montez en compétences — gratuitement.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-slate-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-12 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span><strong className="text-slate-900">2 rôles</strong> disponibles</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏅</span>
            <span><strong className="text-slate-900">4 badges</strong> à débloquer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span><strong className="text-slate-900">Articles & vidéos</strong> sélectionnés</span>
          </div>
        </div>
      </div>

      {/* Role selection */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-slate-900">Quel est votre rôle ?</h2>
          <p className="text-slate-500">
            Choisissez votre profil pour accéder à un parcours personnalisé
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      </div>
    </div>
  );
}
