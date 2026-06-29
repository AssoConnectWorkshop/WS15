import Link from "next/link";
import { ACADEMY_CONTENT, getTotalPoints, type RoleConfig } from "@/lib/academy-content";

function RoleIcon({ icon }: { icon: RoleConfig["icon"] }) {
  if (icon === "president") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5a3 3 0 0 1 6 0v5M9 10h.01M15 10h.01M9 14h6" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M7 15h2M12 15h5" />
    </svg>
  );
}

export default function AcademiePage() {
  const roles = Object.values(ACADEMY_CONTENT);
  const [president, tresorier] = roles;

  return (
    <div className="min-h-screen bg-white">
      {/* Header bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: "#3D5AF1" }} />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-900">AssoConnect Académie</span>
        </div>
        <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500">
          Accès 100% gratuit
        </span>
      </div>

      {/* Split-screen hero */}
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* President side */}
        <Link
          href={`/academie/${president.id}`}
          className="group relative flex flex-1 flex-col items-start justify-end overflow-hidden p-10 md:p-16"
          style={{ background: "#3D5AF1", minHeight: "50vh" }}
        >
          {/* Big background number */}
          <div className="pointer-events-none absolute right-0 top-0 select-none text-[28vw] font-black leading-none text-white/5 md:text-[14vw]">
            01
          </div>

          {/* Icon */}
          <div className="mb-8 h-16 w-16 text-white/60 transition-all duration-500 group-hover:text-white group-hover:scale-110">
            <RoleIcon icon="president" />
          </div>

          <div className="relative z-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/50">
              Parcours {getTotalPoints(president)} pts · {president.parcours.flatMap(p => p.missions).length} missions
            </p>
            <h2 className="mb-4 text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
              Présidente<br />ou président
            </h2>
            <p className="mb-8 max-w-xs text-white/70">
              {president.subtitle}
            </p>

            <div className="inline-flex items-center gap-3 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-bold text-white transition-all duration-300 group-hover:bg-white group-hover:text-[#3D5AF1]">
              Commencer
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
          </div>

          {/* Parcours pills */}
          <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {president.parcours.map((p) => (
              <span key={p.id} className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {p.title}
              </span>
            ))}
          </div>
        </Link>

        {/* Divider on mobile */}
        <div className="h-px bg-white md:hidden" />

        {/* Tresorier side */}
        <Link
          href={`/academie/${tresorier.id}`}
          className="group relative flex flex-1 flex-col items-start justify-end overflow-hidden p-10 md:p-16"
          style={{ background: "#f0fdf9", minHeight: "50vh" }}
        >
          {/* Big background number */}
          <div className="pointer-events-none absolute right-0 top-0 select-none text-[28vw] font-black leading-none text-[#00C49A]/10 md:text-[14vw]">
            02
          </div>

          {/* Vertical line accent */}
          <div className="absolute left-0 top-0 h-full w-1" style={{ background: "#00C49A" }} />

          {/* Icon */}
          <div className="mb-8 h-16 w-16 transition-all duration-500 group-hover:scale-110" style={{ color: "#00C49A" }}>
            <RoleIcon icon="tresorier" />
          </div>

          <div className="relative z-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "#00C49A" }}>
              Parcours {getTotalPoints(tresorier)} pts · {tresorier.parcours.flatMap(p => p.missions).length} missions
            </p>
            <h2 className="mb-4 text-4xl font-black leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Trésorière<br />ou trésorier
            </h2>
            <p className="mb-8 max-w-xs text-gray-500">
              {tresorier.subtitle}
            </p>

            <div
              className="inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-bold text-white transition-all duration-300 group-hover:opacity-90"
              style={{ background: "#00C49A" }}
            >
              Commencer
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
          </div>

          {/* Parcours pills */}
          <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {tresorier.parcours.map((p) => (
              <span key={p.id} className="rounded-full px-3 py-1 text-xs font-medium text-white backdrop-blur-sm" style={{ background: "#00C49A" }}>
                {p.title}
              </span>
            ))}
          </div>
        </Link>
      </div>

      {/* Bottom strip */}
      <div className="flex items-center justify-center gap-8 border-t border-gray-100 py-5 text-xs text-gray-400">
        <span>4 badges</span>
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span>Articles & vidéos sélectionnés</span>
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span>Progression sauvegardée</span>
      </div>
    </div>
  );
}
