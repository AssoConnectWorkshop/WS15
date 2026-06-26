"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Check, Lock, Star,
  BookOpen, Play, Award, TrendingUp, Target, Users, Wallet,
  FileText, Mic, ExternalLink,
} from "lucide-react";
import {
  ACADEMY_CONTENT,
  getTotalPoints,
  getParcoursPoints,
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

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    completedArticles: [...p.completedArticles],
    unlockedBadges: [...p.unlockedBadges],
  }));
}

const ARTICLE_TYPE_CONFIG = {
  article: { Icon: FileText, label: "Article",  bg: "#eef1fe", color: "#3D5AF1" },
  video:   { Icon: Play,     label: "Vidéo",    bg: "#fef2f2", color: "#ef4444" },
  webinar: { Icon: Mic,      label: "Webinar",  bg: "#f3e8ff", color: "#9333ea" },
} as const;

const PARCOURS_ICONS: Record<string, React.ReactNode> = {
  gouvernance:  <Target className="h-4 w-4" />,
  adhesion:     <Users className="h-4 w-4" />,
  comptabilite: <TrendingUp className="h-4 w-4" />,
  cotisations:  <Wallet className="h-4 w-4" />,
};

const LEVELS = [
  { min: 0,    name: "Débutant",   color: "#94a3b8" },
  { min: 200,  name: "Initié",     color: "#3D5AF1" },
  { min: 500,  name: "Praticien",  color: "#8b5cf6" },
  { min: 900,  name: "Expert",     color: "#f59e0b" },
  { min: 9999, name: "Maître",     color: "#ef4444" },
];

function RoleIcon({ icon, className }: { icon: RoleConfig["icon"]; className?: string }) {
  if (icon === "president") return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5a3 3 0 0 1 6 0v5M9 10h.01M15 10h.01M9 14h6" />
    </svg>
  );
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M7 15h2M12 15h5" />
    </svg>
  );
}

function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (playing) {
    return (
      <div className="relative mt-3 overflow-hidden rounded-xl" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="group relative mt-3 block w-full overflow-hidden rounded-xl"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={thumb} alt={title} className="w-full object-cover" style={{ aspectRatio: "16/9" }} />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all group-hover:bg-black/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
          <Play className="h-6 w-6 translate-x-0.5 text-red-600" fill="currentColor" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
        <p className="text-left text-sm font-medium text-white">{title}</p>
      </div>
    </button>
  );
}

function ArticleCard({ article, completed, onToggle }: { article: Article; completed: boolean; onToggle: () => void }) {
  const tc = ARTICLE_TYPE_CONFIG[article.type] ?? ARTICLE_TYPE_CONFIG.article;
  const isVideo = article.type === "video" && article.youtubeId;

  return (
    <div className={`overflow-hidden rounded-2xl border transition-all ${completed ? "border-[#00C49A]/40 bg-[#e6faf6]/60" : "border-gray-100 bg-white shadow-sm hover:shadow-md"}`}>
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={onToggle}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            completed ? "border-[#00C49A] bg-[#00C49A] text-white" : "border-gray-200 hover:border-[#3D5AF1]"
          }`}
        >
          {completed && <Check className="h-3 w-3" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="mb-1.5 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: tc.bg, color: tc.color }}>
              <tc.Icon className="h-3 w-3" />
              {tc.label}
            </span>
            <span className="text-xs text-gray-400">{article.duration}</span>
          </div>

          {isVideo ? (
            <p className={`font-medium leading-snug ${completed ? "text-gray-400 line-through" : "text-gray-900"}`}>
              {article.title}
            </p>
          ) : (
            <a href={article.url} target="_blank" rel="noopener noreferrer"
              className={`group inline-flex items-start gap-1 font-medium leading-snug transition-colors hover:text-[#3D5AF1] ${completed ? "text-gray-400 line-through" : "text-gray-900"}`}>
              {article.title}
              <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          )}
          <p className="mt-1 text-sm text-gray-500">{article.description}</p>
        </div>
      </div>

      {isVideo && article.youtubeId && (
        <div className="px-4 pb-4">
          <YouTubeEmbed videoId={article.youtubeId} title={article.title} />
        </div>
      )}
    </div>
  );
}

function MissionCard({ mission, progress, onToggleArticle, accentColor }: {
  mission: Mission; progress: Progress; onToggleArticle: (id: string) => void; accentColor: string;
}) {
  const completedCount = mission.articles.filter((a) => progress.completedArticles.has(a.id)).length;
  const total = mission.articles.length;
  const isDone = completedCount === total;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const [open, setOpen] = useState(false);

  return (
    <div className={`overflow-hidden rounded-2xl border-2 transition-all duration-200 ${isDone ? "border-[#00C49A]/50 bg-[#e6faf6]/30" : "border-gray-100 bg-white"}`}>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-4 p-5 text-left">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white font-bold text-sm"
          style={{ background: isDone ? "#00C49A" : accentColor }}>
          {isDone ? <Check className="h-5 w-5" strokeWidth={2.5} /> : `${completedCount}/${total}`}
          {isDone && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400">
              <Star className="h-3 w-3 fill-white text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-gray-900">{mission.title}</h4>
            {isDone && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> +{mission.points} pts
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">{mission.description}</p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: isDone ? "#00C49A" : accentColor }} />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="rounded-full px-2 py-1 text-xs font-semibold" style={{ background: `${accentColor}15`, color: accentColor }}>
            {mission.points} pts
          </span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="space-y-3 border-t border-gray-100 p-4">
          {mission.articles.map((article) => (
            <ArticleCard key={article.id} article={article}
              completed={progress.completedArticles.has(article.id)}
              onToggle={() => onToggleArticle(article.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function BadgeCard({ badge, unlocked, accentColor }: { badge: Parcours["badge"]; unlocked: boolean; accentColor: string }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-all min-w-[80px] ${
      unlocked ? "border-amber-300 bg-amber-50 shadow-md shadow-amber-100/50" : "border-gray-100 bg-gray-50 opacity-60"
    }`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${unlocked ? "bg-amber-100" : "bg-gray-200"}`}>
        {unlocked
          ? <Award className="h-5 w-5 text-amber-600" />
          : <Lock className="h-4 w-4 text-gray-400" />
        }
      </div>
      <p className="text-xs font-semibold text-gray-700 leading-tight">{badge.name}</p>
      {unlocked && <span className="rounded-full bg-amber-200 px-1.5 py-0.5 text-xs font-bold text-amber-800">Obtenu !</span>}
    </div>
  );
}

function ParcoursSection({ parcours, progress, onToggleArticle, accentColor }: {
  parcours: Parcours; progress: Progress; onToggleArticle: (id: string) => void; accentColor: string;
}) {
  const allIds = parcours.missions.flatMap((m) => m.articles.map((a) => a.id));
  const completedCount = allIds.filter((id) => progress.completedArticles.has(id)).length;
  const totalPts = getParcoursPoints(parcours);
  const earnedPts = parcours.missions
    .filter((m) => m.articles.every((a) => progress.completedArticles.has(a.id)))
    .reduce((sum, m) => sum + m.points, 0);
  const badgeUnlocked = progress.unlockedBadges.has(parcours.badge.id);
  const pct = allIds.length > 0 ? Math.round((completedCount / allIds.length) * 100) : 0;

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${accentColor}15`, color: accentColor }}>
            {PARCOURS_ICONS[parcours.id] ?? <BookOpen className="h-4 w-4" />}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{parcours.title}</h3>
            <p className="text-sm text-gray-400">{parcours.description}</p>
          </div>
        </div>
        <BadgeCard badge={parcours.badge} unlocked={badgeUnlocked} accentColor={accentColor} />
      </div>

      <div className="mb-5 flex items-center gap-3 rounded-2xl p-3" style={{ background: `${accentColor}08` }}>
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>{completedCount}/{allIds.length} ressources</span>
            <span className="font-semibold" style={{ color: accentColor }}>{earnedPts}/{totalPts} pts</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: accentColor }} />
          </div>
        </div>
        <div className="text-2xl font-black tabular-nums" style={{ color: accentColor }}>{pct}%</div>
      </div>

      <div className="space-y-3">
        {parcours.missions.map((m) => (
          <MissionCard key={m.id} mission={m} progress={progress} onToggleArticle={onToggleArticle} accentColor={accentColor} />
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

  useEffect(() => { setProgress(loadProgress()); setMounted(true); }, []);

  const checkBadges = useCallback((p: Progress) => {
    if (!role) return p;
    const updated = { ...p, unlockedBadges: new Set(p.unlockedBadges) };
    for (const parcours of role.parcours) {
      const allDone = parcours.missions.flatMap((m) => m.articles).every((a) => updated.completedArticles.has(a.id));
      if (allDone && !updated.unlockedBadges.has(parcours.badge.id)) {
        updated.unlockedBadges.add(parcours.badge.id);
        setJustUnlocked(parcours.badge.name);
        setTimeout(() => setJustUnlocked(null), 4000);
      }
    }
    return updated;
  }, [role]);

  const handleToggle = useCallback((id: string) => {
    setProgress((prev) => {
      const next = { completedArticles: new Set(prev.completedArticles), unlockedBadges: new Set(prev.unlockedBadges) };
      next.completedArticles.has(id) ? next.completedArticles.delete(id) : next.completedArticles.add(id);
      const checked = checkBadges(next);
      saveProgress(checked);
      return checked;
    });
  }, [checkBadges]);

  if (!role) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500">Rôle introuvable.</p>
        <Link href="/academie" className="mt-4 inline-block underline" style={{ color: "#3D5AF1" }}>Retour</Link>
      </div>
    </div>
  );

  const accentColor = role.color === "blue" ? "#3D5AF1" : "#00C49A";
  const totalPts = getTotalPoints(role);
  const allIds = getAllArticleIds(role);
  const earnedPts = role.parcours.flatMap((p) => p.missions)
    .filter((m) => m.articles.every((a) => progress.completedArticles.has(a.id)))
    .reduce((sum, m) => sum + m.points, 0);
  const completedCount = allIds.filter((id) => progress.completedArticles.has(id)).length;
  const globalPct = allIds.length > 0 ? Math.round((completedCount / allIds.length) * 100) : 0;
  const unlockedCount = progress.unlockedBadges.size;
  const totalBadges = role.parcours.length;

  const level = [...LEVELS].reverse().find((l) => earnedPts >= l.min) ?? LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const levelPct = nextLevel ? Math.round(((earnedPts - level.min) / (nextLevel.min - level.min)) * 100) : 100;

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Badge toast */}
      {justUnlocked && (
        <div className="fixed right-4 top-4 z-50 animate-pop-in rounded-2xl border border-amber-200 bg-white px-5 py-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Badge débloqué !</p>
              <p className="font-bold text-gray-900">{justUnlocked}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${role.color === "blue" ? "#1a2456" : "#006b55"} 100%)` }}>
        <div className="mx-auto max-w-3xl px-6 py-8">
          <Link href="/academie" className="mb-5 inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" /> Retour
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(255,255,255,0.15)" }}>
                <RoleIcon icon={role.icon} className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">{role.title}</h1>
                <p className="text-sm text-white/60">{role.subtitle}</p>
              </div>
            </div>

            {/* Level pill */}
            <div className="shrink-0 rounded-2xl px-4 py-3 text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <div className="text-xs text-white/60 mb-0.5">Niveau</div>
              <div className="text-xl font-black text-white">{level.name}</div>
              {nextLevel && (
                <div className="mt-1 h-1 w-16 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
                  <div className="h-full rounded-full bg-white" style={{ width: `${levelPct}%` }} />
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { icon: <Star className="h-4 w-4" />, label: "Points", value: `${earnedPts}/${totalPts}` },
              { icon: <BookOpen className="h-4 w-4" />, label: "Ressources", value: `${completedCount}/${allIds.length}` },
              { icon: <Award className="h-4 w-4" />, label: "Badges", value: `${unlockedCount}/${totalBadges}` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="flex justify-center mb-1 text-white/60">{s.icon}</div>
                <div className="text-lg font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/50">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Global progress */}
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs text-white/60">
              <span>Progression globale</span>
              <span className="font-semibold text-white">{globalPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
              <div className="h-full rounded-full bg-white transition-all duration-700"
                style={{ width: `${mounted ? globalPct : 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl space-y-5 px-6 py-8">
        {role.parcours.map((p) => (
          <ParcoursSection key={p.id} parcours={p} progress={progress}
            onToggleArticle={handleToggle} accentColor={accentColor} />
        ))}

        {globalPct === 100 && (
          <div className="rounded-3xl p-8 text-center text-white" style={{ background: `linear-gradient(135deg, ${accentColor}, #00C49A)` }}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-extrabold">Parcours complété !</h3>
            <p className="text-white/80 text-sm">
              Vous avez terminé tous les modules et gagné {totalPts} points.<br />
              Vous méritez un outil à la hauteur de votre impact.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
