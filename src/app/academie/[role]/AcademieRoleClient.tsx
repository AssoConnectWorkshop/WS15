"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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

function XPBar({ current, max, color }: { current: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((current / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{current} XP</span>
        <span>{max} XP</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function BadgeCard({
  badge,
  unlocked,
}: {
  badge: Parcours["badge"];
  unlocked: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all ${
        unlocked
          ? "border-amber-300 bg-amber-50 shadow-md shadow-amber-100"
          : "border-gray-100 bg-gray-50 opacity-50 grayscale"
      }`}
    >
      <div className={`text-4xl ${unlocked ? "" : "opacity-40"}`}>
        {unlocked ? badge.emoji : "🔒"}
      </div>
      <div className="text-sm font-semibold text-gray-900">{badge.name}</div>
      {unlocked && (
        <div className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
          Débloqué ✓
        </div>
      )}
    </div>
  );
}

function ArticleCard({
  article,
  completed,
  onToggle,
}: {
  article: Article;
  completed: boolean;
  onToggle: () => void;
}) {
  const typeConfig = {
    article: { icon: "📄", label: "Article", bg: "bg-blue-50 text-blue-700" },
    video: { icon: "🎬", label: "Vidéo", bg: "bg-red-50 text-red-700" },
    webinar: { icon: "🎙️", label: "Webinar", bg: "bg-purple-50 text-purple-700" },
  };
  const tc = typeConfig[article.type];

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        completed ? "border-green-200 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            completed
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300 hover:border-green-400"
          }`}
        >
          {completed && (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tc.bg}`}>
              {tc.icon} {tc.label}
            </span>
            <span className="text-xs text-gray-400">{article.duration}</span>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block font-medium leading-snug transition-colors hover:text-violet-700 ${
              completed ? "text-gray-500 line-through" : "text-gray-900"
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
  mission,
  progress,
  onToggleArticle,
  colorAccent,
}: {
  mission: Mission;
  progress: Progress;
  onToggleArticle: (id: string) => void;
  colorAccent: string;
}) {
  const completed = mission.articles.filter((a) => progress.completedArticles.has(a.id)).length;
  const total = mission.articles.length;
  const isDone = completed === total;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-2xl border-2 transition-all ${
        isDone ? "border-green-300 bg-green-50/50" : "border-gray-200 bg-white"
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white ${
            isDone ? "bg-green-500" : colorAccent
          }`}
        >
          {isDone ? "✓" : `${completed}/${total}`}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">{mission.title}</h4>
            {isDone && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 font-medium">
                +{mission.xp} XP ✓
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{mission.description}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isDone ? "bg-green-500" : colorAccent}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-medium text-gray-400">{mission.xp} XP</span>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
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

function ParcoursSection({
  parcours,
  progress,
  onToggleArticle,
  colorAccent,
  barColor,
}: {
  parcours: Parcours;
  progress: Progress;
  onToggleArticle: (id: string) => void;
  colorAccent: string;
  barColor: string;
}) {
  const allArticleIds = parcours.missions.flatMap((m) => m.articles.map((a) => a.id));
  const completedCount = allArticleIds.filter((id) => progress.completedArticles.has(id)).length;
  const totalXP = getParcoursXP(parcours);
  const earnedXP = parcours.missions
    .filter((m) => m.articles.every((a) => progress.completedArticles.has(a.id)))
    .reduce((sum, m) => sum + m.xp, 0);
  const badgeUnlocked = progress.unlockedBadges.has(parcours.badge.id);

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{parcours.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{parcours.description}</p>
        </div>
        <BadgeCard badge={parcours.badge} unlocked={badgeUnlocked} />
      </div>

      <div className="mb-6">
        <XPBar current={earnedXP} max={totalXP} color={barColor} />
        <div className="mt-1 text-right text-xs text-gray-400">
          {completedCount}/{allArticleIds.length} articles lus
        </div>
      </div>

      <div className="space-y-3">
        {parcours.missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            progress={progress}
            onToggleArticle={onToggleArticle}
            colorAccent={colorAccent}
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
        const allDone = parcours.missions
          .flatMap((m) => m.articles)
          .every((a) => updated.completedArticles.has(a.id));
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
        const next = {
          completedArticles: new Set(prev.completedArticles),
          unlockedBadges: new Set(prev.unlockedBadges),
        };
        if (next.completedArticles.has(articleId)) {
          next.completedArticles.delete(articleId);
        } else {
          next.completedArticles.add(articleId);
        }
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
          <Link href="/academie" className="mt-4 inline-block text-violet-600 underline">
            Retour à l&apos;académie
          </Link>
        </div>
      </div>
    );
  }

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

  const colorAccent = role.color === "violet" ? "bg-violet-600" : "bg-emerald-600";
  const barColor = role.color === "violet" ? "bg-violet-500" : "bg-emerald-500";
  const textAccent = role.color === "violet" ? "text-violet-600" : "text-emerald-600";

  const levelThresholds = [0, 200, 500, 900, totalXP];
  const currentLevel = levelThresholds.findLastIndex((t) => earnedXP >= t) + 1;
  const levelNames = ["Débutante ou débutant", "Initié", "Praticien", "Expert", "Maître"];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Badge unlock toast */}
      {justUnlocked && (
        <div className="fixed right-6 top-6 z-50 animate-bounce rounded-2xl bg-amber-400 px-6 py-4 shadow-2xl shadow-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏅</span>
            <div>
              <div className="font-bold text-amber-900">Badge débloqué !</div>
              <div className="text-sm text-amber-800">{justUnlocked}</div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`bg-gradient-to-r ${role.gradient} px-6 py-10 text-white`}>
        <div className="mx-auto max-w-3xl">
          <Link
            href="/academie"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            ← Retour à l&apos;académie
          </Link>

          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="text-5xl">{role.emoji}</span>
                <div>
                  <h1 className="text-3xl font-extrabold">{role.title}</h1>
                  <p className="text-white/80">{role.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Level badge */}
            <div className="shrink-0 rounded-2xl bg-white/20 px-5 py-3 text-center backdrop-blur-sm">
              <div className="text-3xl font-black">Niv.{currentLevel}</div>
              <div className="text-sm text-white/80">{levelNames[currentLevel - 1]}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { label: "XP gagnés", value: `${earnedXP}/${totalXP}` },
              { label: "Articles lus", value: `${completedCount}/${allIds.length}` },
              { label: "Badges", value: `${unlockedCount}/${totalBadges}` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/20 p-3 text-center backdrop-blur-sm">
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-xs text-white/70">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Global progress */}
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-sm text-white/80">
              <span>Progression globale</span>
              <span>{globalPct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{ width: `${mounted ? globalPct : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        {role.parcours.map((parcours) => (
          <ParcoursSection
            key={parcours.id}
            parcours={parcours}
            progress={progress}
            onToggleArticle={handleToggleArticle}
            colorAccent={colorAccent}
            barColor={barColor}
          />
        ))}

        {/* Completion message */}
        {globalPct === 100 && (
          <div className="rounded-3xl bg-gradient-to-r from-amber-400 to-yellow-400 p-8 text-center shadow-xl shadow-amber-200">
            <div className="mb-3 text-6xl">🏆</div>
            <h3 className="mb-2 text-2xl font-extrabold text-amber-900">
              Parcours complété !
            </h3>
            <p className="text-amber-800">
              Félicitations ! Vous avez terminé tous les parcours et gagné {totalXP} XP.
              Vous méritez un outil à la hauteur de votre impact.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
