"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Check, Lock, Zap, BookOpen, Play, Mic,
  FileText, Award, TrendingUp, Target, Users, Wallet, Building2,
} from "lucide-react";
import {
  ACADEMY_CONTENT,
  getTotalXP,
  getParcoursXP,
  getAllArticleIds,
  type RoleConfig,
  type Parcours,
  type Mission,
  type Article,
} from "@/lib/academy-content";

type Progress = {
  completedArticles: Set<string>;
  unlockedBadges: Set<string>;
};

const STORAGE_KEY = "academy-progress-v1";

function loadProgress(): Progress {
  if (typeof window === "undefined") return { completedArticles: new Set(), unlockedBadges: new Set() };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedArticles: new Set(), unlockedBadges: new Set() };
    const data = JSON.parse(raw);
    return {
      completedArticles: new Set(data.completedArticles ?? []),
      unlockedBadges: new Set(data.unlockedBadges ?? []),
    };
  } catch {
    return { completedArticles: new Set(), unlockedBadges: new Set() };
  }
}

function saveProgress(progress: Progress) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      completedArticles: [...progress.completedArticles],
      unlockedBadges: [...progress.unlockedBadges],
    })
  );
}

const ARTICLE_TYPE_CONFIG = {
  article: { Icon: FileText, label: "Article", bg: "#eef1fe", color: "#3D5AF1" },
  video:   { Icon: Play,     label: "Vidéo",   bg: "#fef2f2", color: "#ef4444" },
  webinar: { Icon: Mic,      label: "Webinar", bg: "#f3e8ff", color: "#9333ea" },
} as const;

const PARCOURS_ICONS: Record<string, React.ReactNode> = {
  gouvernance:  <Target className="h-5 w-5" />,
  adhesion:     <Users className="h-5 w-5" />,
  comptabilite: <TrendingUp className="h-5 w-5" />,
  cotisations:  <Wallet className="h-5 w-5" />,
};

function RoleIcon({ icon, className }: { icon: RoleConfig["icon"]; className?: string }) {
  if (icon === "president") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5a3 3 0 0 1 6 0v5" />
        <path d="M9 10h.01M15 10h.01M9 14h6" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M7 15h2M12 15h5" />
    </svg>
  );
}

function ArticleCard({ article, completed, onToggle }: { article: Article; completed: boolean; onToggle: () => void }) {
  const tc = ARTICLE_TYPE_CONFIG[article.type];

  return (
    <div className={`rounded-xl border p-4 transition-all ${completed ? "border-[#00C49A]/30 bg-[#e6faf6]" : "border-gray-200 bg-white hover:border-gray-300"}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            completed ? "border-[#00C49A] bg-[#00C49A] text-white" : "border-gray-300 hover:border-[#3D5AF1]"
          }`}
        >
          {completed && <Check className="h-3 w-3" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="mb-1.5 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ background: tc.bg, color: tc.color }}
            >
              <tc.Icon className="h-3 w-3" />
              {tc.label}
            </span>
            <span className="text-xs text-gray-400">{article.duration}</span>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block font-medium leading-snug transition-colors hover:text-[#3D5AF1] ${
              completed ? "text-gray-400 line-through" : "text-gray-900"
            }`}
          >
            {article.title}
          </a>
          <p className="mt-1 text-sm text-gray-500">{article.description}</p>
        </div>
      </div>
    </div>
  );
}

function MissionCard({
  mission, progress, onToggleArticle, accentColor,
}: {
  mission: Mission; progress: Progress; onToggleArticle: (id: string) => void; accentColor: string;
}) {
  const completedCount = mission.articles.filter((a) => progress.completedArticles.has(a.id)).length;
  const total = mission.articles.length;
  const isDone = completedCount === total;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const [open, setOpen] = useState(false);

  return (
    <div className={`overflow-hidden rounded-2xl border-2 transition-all ${isDone ? "border-[#00C49A]/40 bg-[#e6faf6]/40" : "border-gray-100 bg-white"}`}>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-4 p-5 text-left">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white text-sm font-bold"
          style={{ background: isDone ? "#00C49A" : accentColor }}
        >
          {isDone ? <Check className="h-5 w-5" strokeWidth={2.5} /> : `${completedCount}/${total}`}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-gray-900">{mission.title}</h4>
            {isDone && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e6faf6] px-2 py-0.5 text-xs font-medium text-[#00a882]">
                <Zap className="h-3 w-3" /> +{mission.xp} XP
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{mission.description}</p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: isDone ? "#00C49A" : accentColor }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-medium text-gray-400">{mission.xp} XP</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="space-y-3 border-t border-gray-100 p-5">
          {mission.articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              completed={progress.completedArticles.has(article.id)}
              onToggle={() => onToggleArticle(article.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BadgeCard({ badge, unlocked }: { badge: Parcours["badge"]; unlocked: boolean }) {
  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all ${
        unlocked ? "border-amber-300 bg-amber-50" : "border-gray-100 bg-gray-50 opacity-50 grayscale"
      }`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${unlocked ? "bg-amber-100" : "bg-gray-200"}`}>
        <Award className={`h-5 w-5 ${unlocked ? "text-amber-600" : "text-gray-400"}`} />
      </div>
      <div className="text-xs font-semibold text-gray-800 leading-tight">{badge.name}</div>
      {unlocked && (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Obtenu</span>
      )}
      {!unlocked && (
        <Lock className="h-3 w-3 text-gray-400" />
      )}
    </div>
  );
}

function ParcoursSection({
  parcours, progress, onToggleArticle, accentColor,
}: {
  parcours: Parcours; progress: Progress; onToggleArticle: (id: string) => void; accentColor: string;
}) {
  const allArticleIds = parcours.missions.flatMap((m) => m.articles.map((a) => a.id));
  const completedCount = allArticleIds.filter((id) => progress.completedArticles.has(id)).length;
  const totalXP = getParcoursXP(parcours);
  const earnedXP = parcours.missions
    .filter((m) => m.articles.every((a) => progress.completedArticles.has(a.id)))
    .reduce((sum, m) => sum + m.xp, 0);
  const badgeUnlocked = progress.unlockedBadges.has(parcours.badge.id);
  const pct = allArticleIds.length > 0 ? Math.round((completedCount / allArticleIds.length) * 100) : 0;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "#eef1fe", color: accentColor }}>
            {PARCOURS_ICONS[parcours.id] ?? <BookOpen className="h-4 w-4" />}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{parcours.title}</h3>
            <p className="text-sm text-gray-500">{parcours.description}</p>
          </div>
        </div>
        <BadgeCard badge={parcours.badge} unlocked={badgeUnlocked} />
      </div>

      {/* XP progress */}
      <div className="mb-5 rounded-xl bg-gray-50 p-3">
        <div className="mb-1.5 flex justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" style={{ color: accentColor }} />
            {earnedXP} / {totalXP} XP
          </span>
          <span>{completedCount}/{allArticleIds.length} articles</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: accentColor }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {parcours.missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            progress={progress}
            onToggleArticle={onToggleArticle}
            accentColor={accentColor}
          />
        ))}
      </div>
    </section>
  );
}

export default function AcademieRoleClient({ roleId }: { roleId: string }) {
  const role = ACADEMY_CONTENT[roleId as keyof typeof ACADEMY_CONTENT] as RoleConfig | undefined;
  const [progress, setProgress] = useState<Progress>({ completedArticles: new Set(), unlockedBadges: new Set() });
  const [mounted, setMounted] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    setMounted(true);
  }, []);

  const checkAndUnlockBadges = useCallback(
    (newProgress: Progress) => {
      if (!role) return newProgress;
      const updated = { ...newProgress, unlockedBadges: new Set(newProgress.unlockedBadges) };
      for (const parcours of role.parcours) {
        const allDone = parcours.missions.flatMap((m) => m.articles).every((a) => updated.completedArticles.has(a.id));
        if (allDone && !updated.unlockedBadges.has(parcours.badge.id)) {
          updated.unlockedBadges.add(parcours.badge.id);
          setJustUnlocked(parcours.badge.name);
          setTimeout(() => setJustUnlocked(null), 4000);
        }
      }
      return updated;
    },
    [role]
  );

  const handleToggleArticle = useCallback(
    (articleId: string) => {
      setProgress((prev) => {
        const next = { completedArticles: new Set(prev.completedArticles), unlockedBadges: new Set(prev.unlockedBadges) };
        if (next.completedArticles.has(articleId)) next.completedArticles.delete(articleId);
        else next.completedArticles.add(articleId);
        const checked = checkAndUnlockBadges(next);
        saveProgress(checked);
        return checked;
      });
    },
    [checkAndUnlockBadges]
  );

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Rôle introuvable.</p>
          <Link href="/academie" className="mt-4 inline-block underline" style={{ color: "#3D5AF1" }}>
            Retour à l&apos;académie
          </Link>
        </div>
      </div>
    );
  }

  const accentColor = role.color === "blue" ? "#3D5AF1" : "#00C49A";
  const accentLight = role.color === "blue" ? "#eef1fe" : "#e6faf6";

  const totalXP = getTotalXP(role);
  const allIds = getAllArticleIds(role);
  const earnedXP = role.parcours
    .flatMap((p) => p.missions)
    .filter((m) => m.articles.every((a) => progress.completedArticles.has(a.id)))
    .reduce((sum, m) => sum + m.xp, 0);
  const completedCount = allIds.filter((id) => progress.completedArticles.has(id)).length;
  const globalPct = allIds.length > 0 ? Math.round((completedCount / allIds.length) * 100) : 0;
  const unlockedCount = progress.unlockedBadges.size;
  const totalBadges = role.parcours.length;

  const levelThresholds = [0, 200, 500, 900, totalXP];
  const currentLevel = levelThresholds.findLastIndex((t) => earnedXP >= t) + 1;
  const levelNames = ["Débutant", "Initié", "Praticien", "Expert", "Maître"];

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Badge unlock toast */}
      {justUnlocked && (
        <div className="fixed right-6 top-6 z-50 animate-pop-in rounded-2xl bg-white px-5 py-4 shadow-2xl border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">Badge débloqué !</div>
              <div className="text-xs text-gray-500">{justUnlocked}</div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-white" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${role.color === "blue" ? "#1a2456" : "#006b55"} 100%)` }}>
        <div className="mx-auto max-w-3xl px-6 py-8">
          <Link
            href="/academie"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour à l&apos;académie
          </Link>

          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" style={{ background: "rgba(255,255,255,0.15)" }}>
                <RoleIcon icon={role.icon} className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold">{role.title}</h1>
                <p className="text-sm text-white/70 mt-0.5">{role.subtitle}</p>
              </div>
            </div>

            {/* Level */}
            <div className="shrink-0 rounded-2xl px-5 py-3 text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <div className="text-2xl font-black">Niv. {currentLevel}</div>
              <div className="text-xs text-white/70 mt-0.5">{levelNames[currentLevel - 1]}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: <Zap className="h-4 w-4" />, label: "XP gagnés", value: `${earnedXP}/${totalXP}` },
              { icon: <BookOpen className="h-4 w-4" />, label: "Articles", value: `${completedCount}/${allIds.length}` },
              { icon: <Award className="h-4 w-4" />, label: "Badges", value: `${unlockedCount}/${totalBadges}` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                <div className="flex justify-center mb-1 opacity-70">{s.icon}</div>
                <div className="text-lg font-bold">{s.value}</div>
                <div className="text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Global progress */}
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs text-white/70">
              <span>Progression globale</span>
              <span>{globalPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${mounted ? globalPct : 0}%`, background: "rgba(255,255,255,0.9)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl space-y-5 px-6 py-8">
        {role.parcours.map((parcours) => (
          <ParcoursSection
            key={parcours.id}
            parcours={parcours}
            progress={progress}
            onToggleArticle={handleToggleArticle}
            accentColor={accentColor}
          />
        ))}

        {/* Completion */}
        {globalPct === 100 && (
          <div
            className="rounded-2xl p-8 text-center text-white"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #00C49A)` }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-extrabold">Parcours complété !</h3>
            <p className="text-white/80 text-sm">
              Vous avez terminé tous les modules et gagné {totalXP} XP.<br />
              Vous méritez un outil à la hauteur de votre impact.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
