import Link from "next/link";
import { ACADEMY_CONTENT, getTotalXP, type RoleConfig } from "@/lib/academy-content";

function RoleCard({ role }: { role: RoleConfig }) {
  const totalXP = getTotalXP(role);
  const totalMissions = role.parcours.flatMap((p) => p.missions).length;
  const totalBadges = role.parcours.length;
  const totalArticles = role.parcours
    .flatMap((p) => p.missions)
    .flatMap((m) => m.articles).length;

  const isPresident = role.id === "president";

  return (
    <Link
      href={`/academie/${role.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border-2 border-[#E8EEFF] bg-white p-8 transition-all duration-300 hover:border-[#3D5AF1] hover:shadow-2xl hover:shadow-[#3D5AF1]/10 hover:-translate-y-1"
    >
      {/* Blob décoratif */}
      <div
        className={`absolute -right-8 -top-8 h-32 w-32 opacity-10 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110 ${
          isPresident ? "bg-[#3D5AF1]" : "bg-[#00C49A]"
        } rounded-full blur-xl`}
      />
      <div
        className={`absolute -left-4 -bottom-4 h-20 w-20 opacity-8 ${
          isPresident ? "bg-[#00C49A]" : "bg-[#3D5AF1]"
        } rounded-full blur-lg`}
      />

      {/* Role emoji */}
      <div className="relative mb-5">
        <div
          className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg ${
            isPresident
              ? "bg-[#E8EEFF] shadow-[#3D5AF1]/20"
              : "bg-[#E6FBF6] shadow-[#00C49A]/20"
          }`}
        >
          {role.emoji}
        </div>
      </div>

      <h2 className="mb-1 text-2xl font-extrabold text-gray-900">{role.title}</h2>
      <p className="mb-6 text-gray-500 leading-relaxed">{role.subtitle}</p>

      {/* Stats pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#F5F7FF] px-3 py-1 text-xs font-semibold text-[#3D5AF1]">
          {totalMissions} missions
        </span>
        <span className="rounded-full bg-[#F5F7FF] px-3 py-1 text-xs font-semibold text-[#3D5AF1]">
          {totalArticles} contenus
        </span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
          {totalBadges} badges
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          {totalXP} XP
        </span>
      </div>

      {/* Parcours list */}
      <div className="mb-8 space-y-2">
        {role.parcours.map((p) => (
          <div key={p.id} className="flex items-center gap-2 text-sm text-gray-600">
            <span>{p.badge.emoji}</span>
            <span>{p.title}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className={`mt-auto flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-white transition-all duration-300 group-hover:gap-3 ${
          isPresident
            ? "bg-[#3D5AF1] group-hover:bg-[#2a3fd4] shadow-lg shadow-[#3D5AF1]/30"
            : "bg-[#00C49A] group-hover:bg-[#009e7c] shadow-lg shadow-[#00C49A]/30"
        }`}
      >
        Je commence mon parcours
        <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </Link>
  );
}

export default function AcademiePage() {
  const roles = Object.values(ACADEMY_CONTENT);
  const totalArticles = roles
    .flatMap((r) => r.parcours)
    .flatMap((p) => p.missions)
    .flatMap((m) => m.articles).length;

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-white px-6 pb-16 pt-20">
        {/* Blobs décoratifs fond */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#3D5AF1] opacity-5 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#00C49A] opacity-5 blur-3xl" />
          <div className="absolute right-1/3 top-1/2 h-48 w-48 rounded-full bg-[#3D5AF1] opacity-3 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          {/* Pill label */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-[#E8EEFF] bg-[#F5F7FF] px-5 py-2 text-sm font-semibold text-[#3D5AF1]">
            <span className="text-base">🎓</span>
            AssoConnect Académie · Bêta
          </div>

          <h1 className="mb-5 text-5xl font-extrabold leading-tight tracking-tight text-gray-900">
            Devenez un·e{" "}
            <span className="asso-gradient-text">super responsable</span>
            {" "}associatif·ve
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-lg text-gray-500 leading-relaxed">
            Des parcours courts, gamifiés et adaptés à votre rôle.
            Lisez, regardez, testez vos connaissances — et débloquez des badges. 🏅
          </p>

          {/* Stats bar */}
          <div className="mx-auto inline-flex items-center gap-6 rounded-2xl border border-[#E8EEFF] bg-white px-8 py-4 shadow-sm shadow-[#3D5AF1]/5">
            {[
              { emoji: "🎯", label: "2 rôles" },
              { emoji: "📚", label: `${totalArticles} contenus` },
              { emoji: "🏅", label: "8 badges" },
              { emoji: "🧠", label: "Quiz interactifs" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Séparateur avec message fun */}
      <div className="relative border-y border-[#E8EEFF] bg-[#F5F7FF] py-4 text-center">
        <p className="text-sm font-medium text-[#3D5AF1]">
          👇 Choisissez votre rôle et c&apos;est parti — promis, c&apos;est plus sympa qu&apos;un cours magistral
        </p>
      </div>

      {/* Role cards */}
      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Quel est votre rôle ?</h2>
          <p className="mt-2 text-gray-500">Votre parcours est personnalisé selon vos responsabilités</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      </div>

      {/* Bandeau fun bottom */}
      <div className="asso-gradient mx-6 mb-14 rounded-3xl p-8 text-center text-white">
        <p className="text-lg font-bold">
          💡 Le saviez-vous ? Les assos qui forment leurs responsables retiennent 2× plus leurs bénévoles.
        </p>
        <p className="mt-1 text-sm text-white/80">
          Source : Étude AssoConnect 2023 · Et c&apos;est aussi plus fun pour tout le monde 🎉
        </p>
      </div>
    </div>
  );
}
