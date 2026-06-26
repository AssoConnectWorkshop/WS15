import Link from "next/link";
import { BookOpen, Award, Zap, ChevronRight, Building2, Wallet, Users, Target, TrendingUp, Play } from "lucide-react";
import { ACADEMY_CONTENT, getTotalXP, type RoleConfig } from "@/lib/academy-content";

const RoleIcon = ({ icon, className, style }: { icon: RoleConfig["icon"]; className?: string; style?: React.CSSProperties }) => {
  if (icon === "president") {
    return (
      <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5a3 3 0 0 1 6 0v5" />
        <path d="M9 10h.01M15 10h.01M9 14h6" />
      </svg>
    );
  }
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M7 15h2M12 15h5" />
    </svg>
  );
};

const parcourIcons: Record<string, React.ReactNode> = {
  gouvernance: <Target className="h-4 w-4" />,
  adhesion: <Users className="h-4 w-4" />,
  comptabilite: <TrendingUp className="h-4 w-4" />,
  cotisations: <Wallet className="h-4 w-4" />,
};

function RoleCard({ role }: { role: RoleConfig }) {
  const totalXP = getTotalXP(role);
  const totalMissions = role.parcours.flatMap((p) => p.missions).length;
  const isBlue = role.color === "blue";

  return (
    <Link
      href={`/academie/${role.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
    >
      {/* Color band top */}
      <div
        className="h-1.5 w-full"
        style={{ background: isBlue ? "#3D5AF1" : "#00C49A" }}
      />

      <div className="flex flex-1 flex-col p-8">
        {/* Icon */}
        <div
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: isBlue ? "#eef1fe" : "#e6faf6" }}
        >
          <RoleIcon
            icon={role.icon}
            className="h-7 w-7"
            style={{ color: isBlue ? "#3D5AF1" : "#00C49A" } as React.CSSProperties}
          />
        </div>

        <h2 className="mb-1 text-xl font-bold text-gray-900">{role.title}</h2>
        <p className="mb-6 text-sm text-gray-500">{role.subtitle}</p>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { value: totalMissions, label: "missions" },
            { value: role.parcours.length, label: "badges" },
            { value: totalXP, label: "XP max" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-gray-50 p-3 text-center">
              <div className="text-lg font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Parcours list */}
        <div className="mb-6 space-y-2">
          {role.parcours.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <div
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ background: isBlue ? "#eef1fe" : "#e6faf6", color: isBlue ? "#3D5AF1" : "#00C49A" } as React.CSSProperties}
              >
                <div style={{ color: isBlue ? "#3D5AF1" : "#00C49A" }}>
                  {parcourIcons[p.id] ?? <BookOpen className="h-3 w-3" />}
                </div>
              </div>
              <span className="text-sm text-gray-600">{p.title}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <div
            className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity group-hover:opacity-90"
            style={{ background: isBlue ? "#3D5AF1" : "#00C49A" }}
          >
            Démarrer mon parcours
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function AcademiePage() {
  const roles = Object.values(ACADEMY_CONTENT);

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "#3D5AF1" }}>
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">AssoConnect Académie</span>
          </div>
          <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ background: "#00C49A" }}>
            Accès gratuit
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="px-6 py-16 text-center" style={{ background: "linear-gradient(160deg, #3D5AF1 0%, #1a2456 100%)" }}>
        <div className="mx-auto max-w-3xl">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white/80"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <Zap className="h-4 w-4" style={{ color: "#00C49A" }} />
            Formation gratuite pour les associations
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Gérer une asso est un noble casse-tête.{" "}
            <span style={{ color: "#00C49A" }}>On vous aide.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-white/70">
            Parcours de formation gamifiés, adaptés à votre rôle. Lisez des articles, débloquez des badges, montez en compétences.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-gray-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-10 text-sm text-gray-500">
          {[
            { icon: <BookOpen className="h-4 w-4" style={{ color: "#3D5AF1" }} />, text: <><strong className="text-gray-900">2 rôles</strong> disponibles</> },
            { icon: <Award className="h-4 w-4" style={{ color: "#3D5AF1" }} />, text: <><strong className="text-gray-900">4 badges</strong> à débloquer</> },
            { icon: <Play className="h-4 w-4" style={{ color: "#3D5AF1" }} />, text: <><strong className="text-gray-900">Articles & vidéos</strong> sélectionnés</> },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              {s.icon}
              <span>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Role cards */}
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Quel est votre rôle ?</h2>
          <p className="text-gray-500">Choisissez votre profil pour accéder à un parcours personnalisé.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      </div>

      {/* Bottom banner */}
      <div className="mx-6 mb-16 overflow-hidden rounded-2xl" style={{ background: "linear-gradient(160deg, #3D5AF1 0%, #1a2456 100%)" }}>
        <div className="px-8 py-8 text-center text-white">
          <p className="text-lg font-semibold">Vous méritez un outil à la hauteur de votre impact.</p>
          <p className="mt-1 text-sm text-white/70">Déjà client AssoConnect ? Connectez-vous pour synchroniser votre progression.</p>
        </div>
      </div>
    </div>
  );
}
