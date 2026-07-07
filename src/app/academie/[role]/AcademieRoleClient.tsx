"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Check, Play, ExternalLink, Award, ChevronLeft, ChevronDown } from "lucide-react";
import {
  ACADEMY_CONTENT, getTotalPoints, getParcoursPoints, getAllArticleIds,
  type RoleConfig, type Parcours, type Mission, type Article, type QuizQuestion,
} from "@/lib/academy-content";
import LeadModal from "./LeadModal";
import SSOBar from "./SSOBar";

type Progress = {
  completedArticles: Set<string>;
  unlockedBadges: Set<string>;
  answeredQuiz: Map<string, number>; // questionId -> chosen index
};

const STORAGE_KEY = "academy-progress-v1";
const LEAD_TRIGGER = 2;
const LEAD_KEY = "academy-lead-captured";

function loadProgress(): Progress {
  if (typeof window === "undefined") return { completedArticles: new Set(), unlockedBadges: new Set(), answeredQuiz: new Map() };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedArticles: new Set(), unlockedBadges: new Set(), answeredQuiz: new Map() };
    const d = JSON.parse(raw);
    return {
      completedArticles: new Set(d.completedArticles ?? []),
      unlockedBadges: new Set(d.unlockedBadges ?? []),
      answeredQuiz: new Map(Object.entries(d.answeredQuiz ?? {})),
    };
  } catch { return { completedArticles: new Set(), unlockedBadges: new Set(), answeredQuiz: new Map() }; }
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    completedArticles: [...p.completedArticles],
    unlockedBadges: [...p.unlockedBadges],
    answeredQuiz: Object.fromEntries(p.answeredQuiz),
  }));
}

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
  if (playing) return (
    <div className="relative mt-3 overflow-hidden rounded-2xl" style={{ paddingBottom: "56.25%" }}>
      <iframe className="absolute inset-0 h-full w-full" allowFullScreen
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
    </div>
  );
  return (
    <button onClick={() => setPlaying(true)} className="group relative mt-3 block w-full overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={thumb} alt={title} className="w-full object-cover" style={{ aspectRatio: "16/9" }} />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-all group-hover:bg-black/25">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl transition-transform group-hover:scale-110">
          <Play className="h-6 w-6 translate-x-0.5 fill-red-600 text-red-600" />
        </div>
      </div>
    </button>
  );
}

function ArticleRow({ article, completed, onToggle, accent }: {
  article: Article; completed: boolean; onToggle: () => void; accent: string;
}) {
  const isVideo = article.type === "video" && article.youtubeId;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border-b border-gray-100 last:border-0 transition-colors ${completed ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-4 py-4">
        <button onClick={onToggle}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all"
          style={completed
            ? { background: accent, borderColor: accent, color: "white" }
            : { borderColor: "#e5e7eb" }
          }
        >
          {completed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </button>

        <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${
          article.type === "video" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
        }`}>
          {article.type === "video" ? "Vidéo" : "Article"}
        </span>

        <div className="flex-1 min-w-0">
          {isVideo ? (
            <button onClick={() => setExpanded(e => !e)} className="text-left font-semibold text-gray-900 hover:underline">
              {article.title}
            </button>
          ) : (
            <a href={article.url} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-semibold text-gray-900 hover:underline">
              {article.title}
              <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-40 transition-opacity" />
            </a>
          )}
          <p className="text-sm text-gray-400 mt-0.5 truncate">{article.description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-gray-400">{article.duration}</span>
          {isVideo && (
            <button onClick={() => setExpanded(e => !e)}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100">
              <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {isVideo && expanded && article.youtubeId && (
        <div className="pb-4">
          <YouTubeEmbed videoId={article.youtubeId} title={article.title} />
        </div>
      )}
    </div>
  );
}

function QuizCard({ question, answered, onAnswer }: {
  question: QuizQuestion;
  answered: number | undefined;
  onAnswer: (idx: number) => void;
}) {
  const isAnswered = answered !== undefined;
  const isCorrect = isAnswered && answered === question.correctIndex;

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
      <p className="mb-4 font-semibold text-gray-900 text-sm">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((opt, idx) => {
          const style: React.CSSProperties = {};
          let classes = "w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ";

          if (!isAnswered) {
            classes += "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-100 cursor-pointer";
          } else if (idx === question.correctIndex) {
            classes += "border-[#00C49A] bg-[#e6faf6] text-[#00a882] cursor-default";
          } else if (idx === answered && answered !== question.correctIndex) {
            classes += "border-red-300 bg-red-50 text-red-600 cursor-default";
          } else {
            classes += "border-gray-100 bg-white text-gray-400 cursor-default opacity-60";
          }

          return (
            <button
              key={idx}
              className={classes}
              style={style}
              disabled={isAnswered}
              onClick={() => onAnswer(idx)}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                  style={isAnswered && idx === question.correctIndex
                    ? { background: "#00C49A", borderColor: "#00C49A", color: "white" }
                    : isAnswered && idx === answered
                      ? { background: "#fee2e2", borderColor: "#fca5a5", color: "#dc2626" }
                      : { borderColor: "#e5e7eb", color: "#9ca3af" }
                  }
                >
                  {isAnswered && idx === question.correctIndex
                    ? "✓"
                    : isAnswered && idx === answered && answered !== question.correctIndex
                      ? "✗"
                      : String.fromCharCode(65 + idx)
                  }
                </span>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${isCorrect ? "bg-[#e6faf6] text-[#00a882]" : "bg-blue-50 text-blue-700"}`}>
          <p className="font-bold mb-1">{isCorrect ? "Bonne réponse !" : "Pas tout à fait..."}</p>
          <p className="text-xs leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

function QuizSection({ mission, progress, onAnswer, accent }: {
  mission: Mission;
  progress: Progress;
  onAnswer: (questionId: string, idx: number) => void;
  accent: string;
}) {
  const articlesComplete = mission.articles.every(a => progress.completedArticles.has(a.id));
  const answeredCount = mission.quiz.filter(q => progress.answeredQuiz.has(q.id)).length;
  const allAnswered = answeredCount === mission.quiz.length;
  const correctCount = mission.quiz.filter(q => {
    const ans = progress.answeredQuiz.get(q.id);
    return ans !== undefined && ans === q.correctIndex;
  }).length;

  if (!articlesComplete) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-100 p-5 text-center">
        <div className="mb-2 flex justify-center">
          <svg className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-400">Quiz disponible après avoir lu toutes les ressources</p>
        <p className="text-xs text-gray-300 mt-1">{mission.articles.length - mission.articles.filter(a => progress.completedArticles.has(a.id)).length} ressource(s) restante(s)</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h5 className="font-black text-gray-900 text-sm">Quiz de validation</h5>
          <p className="text-xs text-gray-400">{answeredCount}/{mission.quiz.length} question{mission.quiz.length > 1 ? "s" : ""} répondue{mission.quiz.length > 1 ? "s" : ""}</p>
        </div>
        {allAnswered && (
          <span className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: "#e6faf6", color: "#00a882" }}>
            {correctCount}/{mission.quiz.length} correcte{correctCount > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="space-y-4">
        {mission.quiz.map(q => (
          <QuizCard
            key={q.id}
            question={q}
            answered={progress.answeredQuiz.get(q.id)}
            onAnswer={(idx) => onAnswer(q.id, idx)}
          />
        ))}
      </div>
    </div>
  );
}

function MissionBlock({ mission, progress, onToggle, onQuizAnswer, accent }: {
  mission: Mission;
  progress: Progress;
  onToggle: (id: string) => void;
  onQuizAnswer: (questionId: string, idx: number) => void;
  accent: string;
}) {
  const done = mission.articles.filter(a => progress.completedArticles.has(a.id)).length;
  const total = mission.articles.length;
  const quizAnswered = mission.quiz.filter(q => progress.answeredQuiz.has(q.id)).length;
  const allArticlesDone = done === total;
  const allQuizDone = quizAnswered === mission.quiz.length;
  const isDone = allArticlesDone && allQuizDone;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"articles" | "quiz">("articles");

  return (
    <div className="overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="group flex w-full items-center gap-5 py-5 text-left transition-all hover:opacity-80"
      >
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#f0f0f0" strokeWidth="3" />
            <circle cx="24" cy="24" r="20" fill="none" strokeWidth="3"
              stroke={isDone ? "#00C49A" : accent}
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          {isDone
            ? <Check className="h-5 w-5" style={{ color: "#00C49A" }} strokeWidth={2.5} />
            : <span className="text-sm font-black" style={{ color: accent }}>{pct}%</span>
          }
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900">{mission.title}</h4>
          <p className="text-sm text-gray-400">{mission.description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {allArticlesDone && (
            <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: "#e6faf6", color: "#00a882" }}>
              Quiz {quizAnswered}/{mission.quiz.length}
            </span>
          )}
          {isDone && (
            <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: "#e6faf6", color: "#00a882" }}>
              +{mission.points} pts
            </span>
          )}
          {!isDone && (
            <span className="text-xs font-medium text-gray-400">{mission.points} pts</span>
          )}
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="pb-6 pl-[68px] pr-2">
          {/* Tabs */}
          <div className="mb-4 flex gap-1 rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setTab("articles")}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${tab === "articles" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              Ressources ({done}/{total})
            </button>
            <button
              onClick={() => setTab("quiz")}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${tab === "quiz" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              Quiz ({quizAnswered}/{mission.quiz.length})
              {allArticlesDone && !allQuizDone && (
                <span className="ml-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-[#3D5AF1]" />
              )}
            </button>
          </div>

          {tab === "articles" && (
            <div className="rounded-2xl border border-gray-100 bg-white px-4">
              {mission.articles.map(a => (
                <ArticleRow key={a.id} article={a}
                  completed={progress.completedArticles.has(a.id)}
                  onToggle={() => onToggle(a.id)}
                  accent={accent}
                />
              ))}
            </div>
          )}

          {tab === "quiz" && (
            <QuizSection
              mission={mission}
              progress={progress}
              onAnswer={onQuizAnswer}
              accent={accent}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ParcoursBlock({ parcours, progress, onToggle, onQuizAnswer, accent }: {
  parcours: Parcours; progress: Progress; onToggle: (id: string) => void; onQuizAnswer: (qId: string, idx: number) => void; accent: string;
}) {
  const allIds = parcours.missions.flatMap(m => m.articles.map(a => a.id));
  const completedCount = allIds.filter(id => progress.completedArticles.has(id)).length;
  const totalPts = getParcoursPoints(parcours);
  const earnedPts = parcours.missions
    .filter(m => m.articles.every(a => progress.completedArticles.has(a.id)))
    .reduce((s, m) => s + m.points, 0);
  const unlocked = progress.unlockedBadges.has(parcours.badge.id);
  const pct = allIds.length > 0 ? Math.round((completedCount / allIds.length) * 100) : 0;

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-gray-900">{parcours.title}</h3>
          <p className="text-sm text-gray-400">{parcours.description}</p>
        </div>
        <div className={`flex flex-col items-center gap-1 rounded-2xl p-3 text-center transition-all ${
          unlocked ? "bg-amber-50 ring-2 ring-amber-300" : "bg-gray-50 opacity-50"
        }`}>
          <Award className={`h-6 w-6 ${unlocked ? "text-amber-500" : "text-gray-300"}`} />
          <span className="max-w-[70px] text-xs font-semibold leading-tight text-gray-700">{parcours.badge.name}</span>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 h-1 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: accent }} />
        </div>
        <span className="text-xs font-bold tabular-nums" style={{ color: accent }}>{completedCount}/{allIds.length}</span>
        <span className="text-xs text-gray-400">{earnedPts}/{totalPts} pts</span>
      </div>

      <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white px-5">
        {parcours.missions.map(m => (
          <MissionBlock key={m.id} mission={m} progress={progress} onToggle={onToggle} onQuizAnswer={onQuizAnswer} accent={accent} />
        ))}
      </div>
    </section>
  );
}

export default function AcademieRoleClient({ roleId, userEmail }: { roleId: string; userEmail: string | null }) {
  const role = ACADEMY_CONTENT[roleId as keyof typeof ACADEMY_CONTENT] as RoleConfig | undefined;
  const [progress, setProgress] = useState<Progress>({ completedArticles: new Set(), unlockedBadges: new Set(), answeredQuiz: new Map() });
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showLead, setShowLead] = useState(false);

  useEffect(() => { setProgress(loadProgress()); setMounted(true); }, []);

  const checkBadges = useCallback((p: Progress) => {
    if (!role) return p;
    const u = { ...p, unlockedBadges: new Set(p.unlockedBadges) };
    for (const parcours of role.parcours) {
      const allDone = parcours.missions.flatMap(m => m.articles).every(a => u.completedArticles.has(a.id));
      if (allDone && !u.unlockedBadges.has(parcours.badge.id)) {
        u.unlockedBadges.add(parcours.badge.id);
        setToast(parcours.badge.name);
        setTimeout(() => setToast(null), 4000);
      }
    }
    return u;
  }, [role]);

  const handleToggle = useCallback((id: string) => {
    setProgress(prev => {
      const next = { completedArticles: new Set(prev.completedArticles), unlockedBadges: new Set(prev.unlockedBadges), answeredQuiz: new Map(prev.answeredQuiz) };
      if (next.completedArticles.has(id)) { next.completedArticles.delete(id); } else { next.completedArticles.add(id); }
      const checked = checkBadges(next);
      saveProgress(checked);
      if (!userEmail && !localStorage.getItem(LEAD_KEY) && checked.completedArticles.size >= LEAD_TRIGGER) {
        setTimeout(() => setShowLead(true), 600);
      }
      return checked;
    });
  }, [checkBadges, userEmail]);

  const handleQuizAnswer = useCallback((questionId: string, idx: number) => {
    setProgress(prev => {
      if (prev.answeredQuiz.has(questionId)) return prev;
      const next = {
        completedArticles: new Set(prev.completedArticles),
        unlockedBadges: new Set(prev.unlockedBadges),
        answeredQuiz: new Map(prev.answeredQuiz),
      };
      next.answeredQuiz.set(questionId, idx);
      saveProgress(next);
      return next;
    });
  }, []);

  if (!role) return (
    <div className="flex min-h-screen items-center justify-center">
      <Link href="/academie" className="underline" style={{ color: "#3D5AF1" }}>← Retour</Link>
    </div>
  );

  const accent = role.color === "blue" ? "#3D5AF1" : "#00C49A";
  const headerBg = role.color === "blue"
    ? "linear-gradient(160deg, #3D5AF1 0%, #1a2456 100%)"
    : "linear-gradient(160deg, #00C49A 0%, #005c48 100%)";

  const totalPts = getTotalPoints(role);
  const allIds = getAllArticleIds(role);
  const earnedPts = role.parcours.flatMap(p => p.missions)
    .filter(m => m.articles.every(a => progress.completedArticles.has(a.id)))
    .reduce((s, m) => s + m.points, 0);
  const completedCount = allIds.filter(id => progress.completedArticles.has(id)).length;
  const globalPct = allIds.length > 0 ? Math.round((completedCount / allIds.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {showLead && <LeadModal defaultRole={roleId} onClose={() => { setShowLead(false); localStorage.setItem(LEAD_KEY, "1"); }} />}

      <SSOBar userEmail={userEmail} />

      {toast && (
        <div className="fixed right-5 top-5 z-50 animate-pop-in flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-2xl ring-1 ring-amber-200">
          <Award className="h-6 w-6 text-amber-500" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Badge débloqué</p>
            <p className="font-bold text-gray-900">{toast}</p>
          </div>
        </div>
      )}

      {/* Hero header */}
      <div style={{ background: headerBg }}>
        <div className="mx-auto max-w-4xl px-8 pb-12 pt-8">
          <Link href="/academie" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" /> Retour
          </Link>

          <div className="flex items-end justify-between gap-8">
            <div>
              <RoleIcon icon={role.icon} className="mb-6 h-10 w-10 text-white/50" />
              <h1 className="text-5xl font-black leading-none text-white md:text-7xl">
                {role.title.split(" ou ").map((part, i) => (
                  <span key={i}>
                    {i > 0 && <span className="block text-white/40 text-3xl md:text-4xl font-light">ou</span>}
                    {part}
                  </span>
                ))}
              </h1>
              <p className="mt-4 text-white/60 max-w-md">{role.subtitle}</p>
            </div>

            {mounted && (
              <div className="shrink-0 text-right">
                <div className="text-8xl font-black leading-none text-white md:text-9xl">
                  {globalPct}<span className="text-4xl text-white/40">%</span>
                </div>
                <p className="text-sm text-white/40">{completedCount}/{allIds.length} ressources</p>
                <p className="text-sm font-bold text-white/60">{earnedPts} <span className="font-normal text-white/30">/ {totalPts} pts</span></p>
              </div>
            )}
          </div>

          <div className="mt-8 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div className="h-full rounded-full bg-white transition-all duration-1000"
              style={{ width: `${mounted ? globalPct : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Parcours */}
      <div className="mx-auto max-w-4xl space-y-12 px-8 py-12">
        {role.parcours.map(p => (
          <ParcoursBlock key={p.id} parcours={p} progress={progress} onToggle={handleToggle} onQuizAnswer={handleQuizAnswer} accent={accent} />
        ))}

        {globalPct === 100 && (
          <div className="rounded-3xl p-10 text-center text-white" style={{ background: headerBg }}>
            <Award className="mx-auto mb-4 h-12 w-12 text-white/80" />
            <h3 className="text-3xl font-black">Parcours complété.</h3>
            <p className="mt-2 text-white/60">
              {totalPts} points gagnés. Vous méritez un outil à la hauteur de votre impact.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
