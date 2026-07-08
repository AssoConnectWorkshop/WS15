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

/* ── DS tokens ────────────────────────────────────────────── */
const DS = {
  primary: "#3D5AF1",
  primaryHover: "#2d46d6",
  turquoise: "#87DFD5",
  textTitle: "#3C3C47",
  textBody: "#56565D",
  textMuted: "#73737C",
  bgBlue: "#E6EDFD",
  bgStrip: "#F9FBFF",
  border: "#D0D0D7",
  cardShadow: "0 10px 50px 0 rgba(61,90,241,0.18)",
  success: "#00C49A",
  successLight: "#e6faf6",
};

type Progress = {
  completedArticles: Set<string>;
  unlockedBadges: Set<string>;
  answeredQuiz: Map<string, number>;
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

function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  if (playing) return (
    <div className="relative mt-3 overflow-hidden" style={{ paddingBottom: "56.25%", borderRadius: "12px" }}>
      <iframe className="absolute inset-0 h-full w-full" allowFullScreen
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
    </div>
  );
  return (
    <button onClick={() => setPlaying(true)} className="group relative mt-3 block w-full overflow-hidden" style={{ borderRadius: "12px" }}>
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

function ArticleRow({ article, completed, onToggle }: {
  article: Article; completed: boolean; onToggle: () => void;
}) {
  const isVideo = article.type === "video" && article.youtubeId;
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ borderBottom: `1px solid ${DS.border}`, opacity: completed ? 0.6 : 1 }} className="last:border-0">
      <div className="flex items-center gap-4 py-4">
        <button
          onClick={onToggle}
          className="flex shrink-0 items-center justify-center rounded-full border-2 transition-all"
          style={{
            width: "28px", height: "28px",
            background: completed ? DS.primary : "transparent",
            borderColor: completed ? DS.primary : DS.border,
            color: "white",
          }}
        >
          {completed && <Check size={13} strokeWidth={3} />}
        </button>

        <span
          className="shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
          style={{
            background: article.type === "video" ? "#fee2e2" : DS.bgStrip,
            color: article.type === "video" ? "#dc2626" : DS.textMuted,
            borderRadius: "6px",
          }}
        >
          {article.type === "video" ? "Vidéo" : "Article"}
        </span>

        <div className="flex-1 min-w-0">
          {isVideo ? (
            <button onClick={() => setExpanded(e => !e)} className="text-left font-semibold hover:underline"
              style={{ color: DS.textTitle, fontFamily: "var(--font-heading, Poppins)", fontSize: "14px" }}>
              {article.title}
            </button>
          ) : (
            <a href={article.url} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-semibold hover:underline"
              style={{ color: DS.textTitle, fontFamily: "var(--font-heading, Poppins)", fontSize: "14px" }}>
              {article.title}
              <ExternalLink size={12} className="shrink-0 opacity-0 group-hover:opacity-40 transition-opacity" />
            </a>
          )}
          <p className="mt-0.5 truncate text-sm" style={{ color: DS.textMuted }}>{article.description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs" style={{ color: DS.textMuted }}>{article.duration}</span>
          {isVideo && (
            <button onClick={() => setExpanded(e => !e)} className="rounded-lg p-1 transition-colors hover:bg-gray-100">
              <ChevronDown size={16} style={{ color: DS.textMuted, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
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
    <div style={{ background: DS.bgStrip, border: `1px solid ${DS.border}`, borderRadius: "12px", padding: "20px" }}>
      <p className="mb-4 font-semibold text-sm" style={{ color: DS.textTitle, fontFamily: "var(--font-heading, Poppins)" }}>
        {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((opt, idx) => {
          let bg = "#fff", border = DS.border, color = DS.textBody, cursor = "pointer";
          if (isAnswered) {
            cursor = "default";
            if (idx === question.correctIndex) { bg = DS.successLight; border = DS.success; color = "#00a882"; }
            else if (idx === answered) { bg = "#fef2f2"; border = "#fca5a5"; color = "#dc2626"; }
            else { bg = "#fff"; border = DS.border; color = DS.textMuted; }
          }

          return (
            <button key={idx} disabled={isAnswered} onClick={() => onAnswer(idx)}
              className="w-full text-left transition-all"
              style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: "10px", padding: "12px 16px", color, cursor, fontSize: "14px" }}
              onMouseEnter={e => { if (!isAnswered) { (e.currentTarget as HTMLButtonElement).style.borderColor = DS.primary; (e.currentTarget as HTMLButtonElement).style.background = DS.bgBlue; } }}
              onMouseLeave={e => { if (!isAnswered) { (e.currentTarget as HTMLButtonElement).style.borderColor = DS.border; (e.currentTarget as HTMLButtonElement).style.background = "#fff"; } }}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                  style={isAnswered && idx === question.correctIndex
                    ? { background: DS.success, borderColor: DS.success, color: "white" }
                    : isAnswered && idx === answered
                      ? { background: "#fee2e2", borderColor: "#fca5a5", color: "#dc2626" }
                      : { borderColor: DS.border, color: DS.textMuted }
                  }
                >
                  {isAnswered && idx === question.correctIndex ? "✓"
                    : isAnswered && idx === answered && answered !== question.correctIndex ? "✗"
                    : String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div
          className="mt-4 rounded-xl px-4 py-3 text-sm"
          style={{ background: isCorrect ? DS.successLight : DS.bgBlue, borderRadius: "10px" }}
        >
          <p className="font-bold mb-1" style={{ color: isCorrect ? "#00a882" : DS.primary, fontFamily: "var(--font-heading, Poppins)" }}>
            {isCorrect ? "Bonne réponse !" : "Pas tout à fait..."}
          </p>
          <p style={{ color: DS.textBody, lineHeight: 1.6, fontWeight: 300 }}>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

function QuizSection({ mission, progress, onAnswer }: {
  mission: Mission; progress: Progress; onAnswer: (qId: string, idx: number) => void;
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
      <div className="rounded-2xl text-center" style={{ border: `2px dashed ${DS.border}`, padding: "24px", borderRadius: "12px" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={DS.border} strokeWidth="1.5" className="mx-auto mb-3">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p className="font-semibold text-sm" style={{ color: DS.textMuted }}>Quiz disponible après avoir lu toutes les ressources</p>
        <p className="mt-1 text-xs" style={{ color: DS.border }}>
          {mission.articles.length - mission.articles.filter(a => progress.completedArticles.has(a.id)).length} ressource(s) restante(s)
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h5 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading, Poppins)", color: DS.textTitle }}>Quiz de validation</h5>
          <p className="text-xs mt-0.5" style={{ color: DS.textMuted }}>{answeredCount}/{mission.quiz.length} question{mission.quiz.length > 1 ? "s" : ""} répondue{mission.quiz.length > 1 ? "s" : ""}</p>
        </div>
        {allAnswered && (
          <span className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: DS.successLight, color: "#00a882", borderRadius: "50px", fontFamily: "var(--font-heading, Poppins)" }}>
            {correctCount}/{mission.quiz.length} correcte{correctCount > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="space-y-4">
        {mission.quiz.map(q => (
          <QuizCard key={q.id} question={q}
            answered={progress.answeredQuiz.get(q.id)}
            onAnswer={(idx) => onAnswer(q.id, idx)}
          />
        ))}
      </div>
    </div>
  );
}

function MissionBlock({ mission, progress, onToggle, onQuizAnswer }: {
  mission: Mission; progress: Progress;
  onToggle: (id: string) => void;
  onQuizAnswer: (qId: string, idx: number) => void;
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
    <div style={{ borderBottom: `1px solid ${DS.border}` }} className="last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-5 py-5 text-left transition-opacity hover:opacity-75"
      >
        {/* Progress ring */}
        <div className="relative flex shrink-0 items-center justify-center" style={{ width: 48, height: 48 }}>
          <svg className="absolute inset-0" style={{ transform: "rotate(-90deg)" }} viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke={DS.bgBlue} strokeWidth="3" />
            <circle cx="24" cy="24" r="20" fill="none" strokeWidth="3"
              stroke={isDone ? DS.success : DS.primary}
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.7s ease-out" }}
            />
          </svg>
          {isDone
            ? <Check size={18} style={{ color: DS.success }} strokeWidth={2.5} />
            : <span className="text-sm font-bold" style={{ color: DS.primary, fontFamily: "var(--font-heading, Poppins)" }}>{pct}%</span>
          }
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold" style={{ fontFamily: "var(--font-heading, Poppins)", color: DS.textTitle, fontSize: "15px" }}>
            {mission.title}
          </h4>
          <p className="text-sm mt-0.5" style={{ color: DS.textMuted }}>{mission.description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {allArticlesDone && !allQuizDone && (
            <span className="rounded-full px-2.5 py-1 text-xs font-bold"
              style={{ background: DS.bgBlue, color: DS.primary, borderRadius: "50px", fontFamily: "var(--font-heading, Poppins)" }}>
              Quiz {quizAnswered}/{mission.quiz.length}
            </span>
          )}
          {isDone ? (
            <span className="rounded-full px-2.5 py-1 text-xs font-bold"
              style={{ background: DS.successLight, color: "#00a882", borderRadius: "50px", fontFamily: "var(--font-heading, Poppins)" }}>
              +{mission.points} pts
            </span>
          ) : (
            <span className="text-xs" style={{ color: DS.textMuted }}>{mission.points} pts</span>
          )}
          <ChevronDown size={16} style={{ color: DS.textMuted, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </div>
      </button>

      {open && (
        <div style={{ paddingLeft: "68px", paddingRight: "8px", paddingBottom: "24px" }}>
          {/* Tabs */}
          <div className="mb-4 flex gap-1 rounded-xl p-1" style={{ background: DS.bgStrip, borderRadius: "12px" }}>
            {(["articles", "quiz"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 rounded-lg py-2 text-xs font-semibold transition-all"
                style={{
                  background: tab === t ? "#fff" : "transparent",
                  color: tab === t ? DS.textTitle : DS.textMuted,
                  boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  borderRadius: "8px",
                  fontFamily: "var(--font-heading, Poppins)",
                }}
              >
                {t === "articles" ? `Ressources (${done}/${total})` : `Quiz (${quizAnswered}/${mission.quiz.length})`}
                {t === "quiz" && allArticlesDone && !allQuizDone && (
                  <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full" style={{ background: DS.primary }} />
                )}
              </button>
            ))}
          </div>

          {tab === "articles" && (
            <div style={{ border: `1px solid ${DS.border}`, borderRadius: "12px", background: "#fff", padding: "0 16px" }}>
              {mission.articles.map(a => (
                <ArticleRow key={a.id} article={a}
                  completed={progress.completedArticles.has(a.id)}
                  onToggle={() => onToggle(a.id)}
                />
              ))}
            </div>
          )}

          {tab === "quiz" && (
            <QuizSection mission={mission} progress={progress} onAnswer={onQuizAnswer} />
          )}
        </div>
      )}
    </div>
  );
}

function ParcoursBlock({ parcours, progress, onToggle, onQuizAnswer }: {
  parcours: Parcours; progress: Progress;
  onToggle: (id: string) => void;
  onQuizAnswer: (qId: string, idx: number) => void;
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
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold" style={{ fontFamily: "var(--font-heading, Poppins)", fontSize: "20px", color: DS.textTitle, letterSpacing: "0.3px" }}>
            {parcours.title}
          </h3>
          <p className="text-sm mt-0.5" style={{ color: DS.textMuted }}>{parcours.description}</p>
        </div>
        {/* Badge */}
        <div
          className="flex flex-col items-center gap-1 text-center transition-all"
          style={{
            padding: "12px",
            borderRadius: "16px",
            background: unlocked ? "#fff8e6" : DS.bgStrip,
            border: `2px solid ${unlocked ? "#f59e0b" : DS.border}`,
            minWidth: "80px",
            opacity: unlocked ? 1 : 0.5,
          }}
        >
          <Award size={22} style={{ color: unlocked ? "#f59e0b" : DS.border }} />
          <span className="text-xs font-semibold leading-tight mt-1" style={{ color: DS.textTitle, maxWidth: "72px" }}>
            {parcours.badge.name}
          </span>
        </div>
      </div>

      {/* Progress strip */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 overflow-hidden rounded-full" style={{ height: "4px", background: DS.bgBlue }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: DS.primary, transition: "width 0.7s ease-out" }} />
        </div>
        <span className="text-xs font-bold tabular-nums" style={{ color: DS.primary, fontFamily: "var(--font-heading, Poppins)" }}>{completedCount}/{allIds.length}</span>
        <span className="text-xs" style={{ color: DS.textMuted }}>{earnedPts}/{totalPts} pts</span>
      </div>

      {/* Missions */}
      <div style={{ border: `1px solid ${DS.border}`, borderRadius: "16px", background: "#fff", padding: "0 20px" }}>
        {parcours.missions.map(m => (
          <MissionBlock key={m.id} mission={m} progress={progress} onToggle={onToggle} onQuizAnswer={onQuizAnswer} />
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
        setTimeout(() => setToast(null), 4500);
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
      const next = { completedArticles: new Set(prev.completedArticles), unlockedBadges: new Set(prev.unlockedBadges), answeredQuiz: new Map(prev.answeredQuiz) };
      next.answeredQuiz.set(questionId, idx);
      saveProgress(next);
      return next;
    });
  }, []);

  if (!role) return (
    <div className="flex min-h-screen items-center justify-center">
      <Link href="/academie" style={{ color: DS.primary, textDecoration: "underline" }}>← Retour</Link>
    </div>
  );

  const headerBg = `linear-gradient(155deg, ${DS.primary} 0%, #1a2456 100%)`;
  const totalPts = getTotalPoints(role);
  const allIds = getAllArticleIds(role);
  const earnedPts = role.parcours.flatMap(p => p.missions)
    .filter(m => m.articles.every(a => progress.completedArticles.has(a.id)))
    .reduce((s, m) => s + m.points, 0);
  const completedCount = allIds.filter(id => progress.completedArticles.has(id)).length;
  const globalPct = allIds.length > 0 ? Math.round((completedCount / allIds.length) * 100) : 0;

  return (
    <div style={{ background: "#FAFAFA", minHeight: "100vh", fontFamily: "var(--font-body, Roboto, sans-serif)", color: DS.textBody }}>
      {showLead && <LeadModal defaultRole={roleId} onClose={() => { setShowLead(false); localStorage.setItem(LEAD_KEY, "1"); }} />}

      <SSOBar userEmail={userEmail} />

      {/* Badge toast */}
      {toast && (
        <div className="fixed right-5 top-5 z-50 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-2xl animate-pop-in"
          style={{ border: "1px solid #fde68a", borderRadius: "16px" }}>
          <Award size={22} style={{ color: "#f59e0b" }} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#f59e0b" }}>Badge débloqué</p>
            <p className="font-bold text-sm" style={{ fontFamily: "var(--font-heading, Poppins)", color: DS.textTitle }}>{toast}</p>
          </div>
        </div>
      )}

      {/* Hero header */}
      <div style={{ background: headerBg }}>
        <div className="mx-auto" style={{ maxWidth: "1280px", padding: "32px 4% 48px" }}>
          <div className="flex items-center justify-between mb-8">
            <Link href="/academie"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <ChevronLeft size={16} /> L&apos;Académie
            </Link>
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DS.turquoise} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 9L12 4 2 9l10 5 10-5z" />
                <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
                <path d="M22 9v5" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>
                AssoConnect Académie
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: DS.turquoise, letterSpacing: "0.08em" }}>
                Filière
              </p>
              <h1 style={{
                fontFamily: "var(--font-heading, Poppins)",
                fontWeight: 700,
                fontSize: "clamp(36px, 5vw, 60px)",
                color: "white",
                letterSpacing: "0.5px",
                lineHeight: 1.05,
              }}>
                {role.title.split(" ou ").map((part, i) => (
                  <span key={i}>
                    {i > 0 && <span style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: "0.5em", fontWeight: 300, margin: "4px 0" }}>ou</span>}
                    {part}
                  </span>
                ))}
              </h1>
              <p className="mt-4" style={{ color: "rgba(255,255,255,0.55)", maxWidth: "42ch", fontWeight: 300 }}>{role.subtitle}</p>
            </div>

            {mounted && (
              <div className="shrink-0 text-right">
                <div style={{
                  fontFamily: "var(--font-heading, Poppins)",
                  fontWeight: 700,
                  fontSize: "clamp(64px, 8vw, 96px)",
                  color: "white",
                  lineHeight: 1,
                }}>
                  {globalPct}<span style={{ fontSize: "0.45em", color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>%</span>
                </div>
                <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{completedCount}/{allIds.length} ressources</p>
                <p className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {earnedPts} <span style={{ fontWeight: 300, color: "rgba(255,255,255,0.3)" }}>/ {totalPts} pts</span>
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 overflow-hidden rounded-full" style={{ height: "3px", background: "rgba(255,255,255,0.12)" }}>
            <div className="h-full rounded-full bg-white" style={{ width: `${mounted ? globalPct : 0}%`, transition: "width 1s ease-out" }} />
          </div>
        </div>
      </div>

      {/* Parcours */}
      <div className="mx-auto space-y-12" style={{ maxWidth: "1280px", padding: "48px 4%" }}>
        {role.parcours.map(p => (
          <ParcoursBlock key={p.id} parcours={p} progress={progress} onToggle={handleToggle} onQuizAnswer={handleQuizAnswer} />
        ))}

        {globalPct === 100 && (
          <div className="rounded-3xl p-10 text-center text-white" style={{ background: headerBg, borderRadius: "20px" }}>
            <Award size={48} className="mx-auto mb-4" style={{ opacity: 0.8 }} />
            <h3 style={{ fontFamily: "var(--font-heading, Poppins)", fontWeight: 700, fontSize: "28px" }}>Parcours complété.</h3>
            <p className="mt-2" style={{ color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>
              {totalPts} points gagnés. Tu mérites un outil à la hauteur de ton engagement.
            </p>
            <a
              href="https://www.assoconnect.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-semibold transition-all"
              style={{ background: "#F6C131", color: DS.textTitle, borderRadius: "50px", padding: "13px 28px", fontSize: "15px" }}
            >
              Découvrir AssoConnect →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
