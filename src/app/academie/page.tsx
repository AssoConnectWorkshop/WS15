"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ACADEMY_CONTENT, getTotalPoints, type RoleConfig } from "@/lib/academy-content";

const HERO_WORDS = ["compliquée", "chronophage", "intimidante", "solitaire"];

function RoleIcon({ icon, className }: { icon: RoleConfig["icon"]; className?: string }) {
  if (icon === "president") return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5a3 3 0 0 1 6 0v5M9 10h.01M15 10h.01M9 14h6" />
    </svg>
  );
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M7 15h2M12 15h5" />
    </svg>
  );
}

export default function AcademiePage() {
  const roles = Object.values(ACADEMY_CONTENT);
  const [president, tresorier] = roles;
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % HERO_WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header bar */}
      <div className="fixed top-0 left-0 right-0 z-20 border-b border-white/10 bg-[#3D5AF1]/95 backdrop-blur-sm px-8 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-[#3D5AF1]">AC</div>
            <span className="text-sm font-bold text-white">AssoConnect Académie</span>
          </div>
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/70">
            100% gratuit
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden pt-16" style={{ background: "linear-gradient(160deg, #3D5AF1 0%, #1a2456 100%)" }}>
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #00C49A 0%, transparent 70%)" }} />

        <div className="relative mx-auto max-w-6xl px-8 pb-20 pt-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00C49A]" />
            Formation gratuite pour les dirigeants d&apos;associations
          </div>

          <h1 className="mb-4 max-w-3xl text-5xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
            La gestion d&apos;asso,{" "}
            <br />
            enfin{" "}
            <span className="relative inline-block">
              <span
                key={wordIdx}
                className="inline-block relative"
                style={{ animation: "fadeSlideIn 0.4s ease-out", color: "rgba(255,255,255,0.5)" }}
              >
                {HERO_WORDS[wordIdx]}
                <span
                  className="absolute left-0 right-0"
                  style={{
                    top: "50%",
                    height: "3px",
                    background: "#00C49A",
                    transform: "rotate(-3deg)",
                    borderRadius: "2px",
                  }}
                />
              </span>
            </span>
            .
          </h1>

          <p className="mb-8 max-w-xl text-lg text-white/60">
            Des parcours guidés, des ressources sélectionnées et des quiz pour valider vos acquis — spécialement conçus pour les présidents et trésoriers d&apos;associations.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={`/academie/${president.id}`}
              className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-[#3D5AF1] shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              <RoleIcon icon="president" className="h-5 w-5" />
              Parcours Président
            </Link>
            <Link
              href={`/academie/${tresorier.id}`}
              className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-white/30 px-6 py-3.5 text-sm font-black text-white transition-all hover:border-white/60 hover:bg-white/10"
            >
              <RoleIcon icon="tresorier" className="h-5 w-5" />
              Parcours Trésorier
            </Link>
          </div>

          {/* Key stats */}
          <div className="mt-12 flex flex-wrap gap-6">
            {[
              { value: "2 rôles", label: "Président · Trésorier" },
              { value: "4 parcours", label: "Gouvernance, adhérents, compta, finances" },
              { value: "8 quiz", label: "Pour valider vos acquis" },
              { value: "100% gratuit", label: "Sans inscription obligatoire" },
            ].map(s => (
              <div key={s.value} className="flex flex-col">
                <span className="text-2xl font-black text-white">{s.value}</span>
                <span className="text-xs text-white/40">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Value pillars */}
      <div className="mx-auto max-w-6xl px-8 py-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#3D5AF1]">Pourquoi l&apos;Académie</p>
          <h2 className="text-3xl font-black text-gray-900">Tout ce qu&apos;il faut pour bien gérer votre asso</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              ),
              title: "Parcours structurés",
              desc: "Des missions progressives, du plus simple au plus avancé. Chaque ressource est sélectionnée pour son utilité concrète.",
              color: "#eef1fe",
              accent: "#3D5AF1",
            },
            {
              icon: (
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
              ),
              title: "Articles & vidéos",
              desc: "Du contenu pratique, des guides en 5 à 12 minutes et des vidéos pour apprendre à son rythme.",
              color: "#e6faf6",
              accent: "#00C49A",
            },
            {
              icon: (
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              ),
              title: "Quiz de validation",
              desc: "Chaque mission se termine par un quiz pour tester vos connaissances. Débloquez des badges en complétant les parcours.",
              color: "#fff8e6",
              accent: "#f59e0b",
            },
          ].map(f => (
            <div key={f.title} className="rounded-3xl border border-gray-100 p-7" style={{ background: f.color }}>
              <div className="mb-4" style={{ color: f.accent }}>{f.icon}</div>
              <h3 className="mb-2 text-lg font-black text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Role cards */}
      <div className="mx-auto max-w-6xl px-8 pb-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">Choisissez votre rôle</p>
          <h2 className="text-3xl font-black text-gray-900">Quel est votre poste dans l&apos;association ?</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <RoleCard role={president} />
          <RoleCard role={tresorier} />
        </div>
      </div>

      {/* Social proof strip */}
      <div className="border-t border-gray-100 bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            <span className="font-medium text-gray-600">Par AssoConnect</span>
            <span className="h-4 w-px bg-gray-200" />
            <span>Utilisé par +50 000 associations en France</span>
            <span className="h-4 w-px bg-gray-200" />
            <span>Ressources mises à jour régulièrement</span>
            <span className="h-4 w-px bg-gray-200" />
            <span>Progression sauvegardée dans votre navigateur</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function RoleCard({ role }: { role: RoleConfig }) {
  const isBlue = role.color === "blue";
  const accent = isBlue ? "#3D5AF1" : "#00C49A";
  const accentLight = isBlue ? "#eef1fe" : "#e6faf6";
  const totalPts = getTotalPoints(role);
  const totalMissions = role.parcours.flatMap(p => p.missions).length;
  const totalArticles = role.parcours.flatMap(p => p.missions).flatMap(m => m.articles).length;

  return (
    <Link
      href={`/academie/${role.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Top accent line */}
      <div className="absolute left-0 top-0 h-1 w-full transition-all" style={{ background: accent }} />

      <div className="mb-6 flex items-start justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all group-hover:scale-110"
          style={{ background: accentLight, color: accent }}
        >
          {role.icon === "president" ? (
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5a3 3 0 0 1 6 0v5M9 10h.01M15 10h.01M9 14h6" />
            </svg>
          ) : (
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20M7 15h2M12 15h5" />
            </svg>
          )}
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: accentLight, color: accent }}
        >
          {totalPts} pts
        </span>
      </div>

      <h3 className="mb-1 text-2xl font-black text-gray-900">{role.title}</h3>
      <p className="mb-6 text-sm text-gray-400">{role.subtitle}</p>

      {/* Parcours list */}
      <div className="mb-6 space-y-2">
        {role.parcours.map(p => (
          <div key={p.id} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
            <div className="h-2 w-2 rounded-full" style={{ background: accent }} />
            <span className="flex-1 text-sm font-semibold text-gray-700">{p.title}</span>
            <span className="text-xs text-gray-400">{p.missions.length} missions</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mb-6 flex gap-4 text-sm">
        <div>
          <span className="font-black text-gray-900">{totalMissions}</span>
          <span className="ml-1 text-gray-400">missions</span>
        </div>
        <div>
          <span className="font-black text-gray-900">{totalArticles}</span>
          <span className="ml-1 text-gray-400">ressources</span>
        </div>
        <div>
          <span className="font-black text-gray-900">{totalMissions * 2}</span>
          <span className="ml-1 text-gray-400">questions de quiz</span>
        </div>
      </div>

      <div
        className="mt-auto inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-white transition-all group-hover:gap-3"
        style={{ background: accent }}
      >
        Commencer ce parcours
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
