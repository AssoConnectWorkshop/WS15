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
  type QuizQuestion,
} from "@/lib/academy-content";

// ─── Types ────────────────────────────────────────────────────────────────────

type QuizState = { answers: Record<string, number>; submitted: boolean };
type Progress = {
  completedArticles: Set<string>;
  unlockedBadges: Set<string>;
  quizResults: Record<string, QuizState>;
  earnedQuizXp: Record<string, number>;
};

const STORAGE_KEY = "academy-progress-v2";

function loadProgress(): Progress {
  if (typeof window === "undefined")
    return { completedArticles: new Set(), unlockedBadges: new Set(), quizResults: {}, earnedQuizXp: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return { completedArticles: new Set(), unlockedBadges: new Set(), quizResults: {}, earnedQuizXp: {} };
    const data = JSON.parse(raw);
    return {
      completedArticles: new Set(data.completedArticles ?? []),
      unlockedBadges: new Set(data.unlockedBadges ?? []),
      quizResults: data.quizResults ?? {},
      earnedQuizXp: data.earnedQuizXp ?? {},
    };
  } catch {
    return { completedArticles: new Set(), unlockedBadges: new Set(), quizResults: {}, earnedQuizXp: {} };
  }
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    completedArticles: [...p.completedArticles],
    unlockedBadges: [...p.unlockedBadges],
    quizResults: p.quizResults,
    earnedQuizXp: p.earnedQuizXp,
  }));
}

// ─── XP Bar ───────────────────────────────────────────────────────────────────

function XPBar({ current, max }: { current: number; max: number }) {
  const pct = max > 0 ? Math.round((current / max) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium text-gray-500">
        <span>{current} XP gagnés</span>
        <span>{max} XP max</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#E8EEFF]">
        <div
          className="h-full rounded-full asso-gradient transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Badge Card ───────────────────────────────────────────────────────────────

function BadgeCard({ badge, unlocked }: { badge: Parcours["badge"]; unlocked: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all duration-300 w-28 shrink-0 ${
      unlocked
        ? "border-amber-300 bg-gradient-to-b from-amber-50 to-yellow-50 shadow-lg shadow-amber-100"
        : "border-[#E8EEFF] bg-[#F8F9FF] grayscale opacity-50"
    }`}>
      <div className={`text-4xl transition-transform duration-300 ${unlocked ? "scale-110" : ""}`}>
        {unlocked ? badge.emoji : "🔒"}
      </div>
      <div className="text-xs font-bold leading-tight text-gray-800">{badge.name}</div>
      {unlocked && (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
          ✓ Débloqué
        </span>
      )}
    </div>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────

function ArticleCard({ article, completed, onToggle }: {
  article: Article; completed: boolean; onToggle: () => void;
}) {
  const typeConfig = {
    article: { icon: "📄", label: "Article", bg: "bg-[#E8EEFF] text-[#3D5AF1]" },
    video: { icon: "▶️", label: "Vidéo YouTube", bg: "bg-red-50 text-red-600" },
    webinar: { icon: "🎙️", label: "Webinar", bg: "bg-purple-50 text-purple-700" },
  };
  const tc = typeConfig[article.type];

  return (
    <div className={`group rounded-2xl border-2 p-4 transition-all duration-200 ${
      completed
        ? "border-[#00C49A]/40 bg-[#E6FBF6]"
        : "border-[#E8EEFF] bg-white hover:border-[#3D5AF1]/30 hover:shadow-md hover:shadow-[#3D5AF1]/5"
    }`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            completed
              ? "border-[#00C49A] bg-[#00C49A] text-white scale-110"
              : "border-gray-300 hover:border-[#3D5AF1]"
          }`}
        >
          {completed && (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tc.bg}`}>
              {tc.icon} {tc.label}
            </span>
            <span className="text-xs text-gray-400">⏱ {article.duration}</span>
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block font-semibold leading-snug transition-colors ${
              completed
                ? "text-gray-400 line-through"
                : "text-gray-900 hover:text-[#3D5AF1]"
            }`}
          >
            {article.title}
            {!completed && (
              <svg className="ml-1 inline h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            )}
          </a>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">{article.description}</p>
          {completed && (
            <p className="mt-1.5 text-xs font-semibold text-[#00C49A]">✓ Lu et validé — super boulot !</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Quiz Card ────────────────────────────────────────────────────────────────

function QuizCard({ mission, quizState, onSubmit, onReset }: {
  mission: Mission;
  quizState: QuizState | undefined;
  onSubmit: (answers: Record<string, number>) => void;
  onReset: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>(quizState?.answers ?? {});
  const submitted = quizState?.submitted ?? false;
  const savedAnswers = quizState?.answers ?? {};
  const score = submitted ? mission.quiz.filter((q) => savedAnswers[q.id] === q.correctIndex).length : 0;
  const total = mission.quiz.length;
  const passed = score === total;
  const allAnswered = mission.quiz.every((q) => answers[q.id] !== undefined);
  const pct = submitted ? Math.round((score / total) * 100) : 0;

  return (
    <div className="rounded-2xl border-2 border-[#3D5AF1]/20 bg-[#F5F7FF] p-6">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D5AF1] text-xl text-white">
          🧠
        </div>
        <div className="flex-1">
          <h5 className="font-bold text-gray-900">Quiz de validation</h5>
          <p className="text-sm text-gray-500">
            {submitted
              ? `${score}/${total} bonnes réponses · +${Math.round((score / total) * mission.quizXp)} XP gagnés`
              : `${total} questions · jusqu&apos;à +${mission.quizXp} XP bonus`}
          </p>
        </div>
        {submitted && (
          <div className={`rounded-full px-4 py-1.5 text-sm font-bold ${
            passed ? "bg-[#00C49A] text-white" : "bg-orange-100 text-orange-700"
          }`}>
            {passed ? "🎉 Parfait !" : `${pct}%`}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {mission.quiz.map((q: QuizQuestion, qi: number) => {
          const chosen = submitted ? savedAnswers[q.id] : answers[q.id];
          const isCorrect = chosen === q.correctIndex;

          return (
            <div key={q.id}>
              <p className="mb-3 font-semibold text-gray-900">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#3D5AF1] text-xs font-bold text-white">
                  {qi + 1}
                </span>
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  const isChosen = chosen === idx;
                  const isRight = idx === q.correctIndex;

                  let cls = "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all duration-150 ";
                  if (!submitted) {
                    cls += isChosen
                      ? "border-[#3D5AF1] bg-[#E8EEFF] text-[#3D5AF1]"
                      : "border-gray-200 bg-white hover:border-[#3D5AF1]/40 cursor-pointer";
                  } else {
                    if (isRight) cls += "border-[#00C49A] bg-[#E6FBF6] text-[#007a60]";
                    else if (isChosen && !isRight) cls += "border-red-300 bg-red-50 text-red-700";
                    else cls += "border-gray-200 bg-white text-gray-400";
                  }

                  return (
                    <button key={idx} className={cls} onClick={() => !submitted && setAnswers((p) => ({ ...p, [q.id]: idx }))} disabled={submitted}>
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                        !submitted && isChosen ? "border-[#3D5AF1] bg-[#3D5AF1] text-white"
                          : submitted && isRight ? "border-[#00C49A] bg-[#00C49A] text-white"
                          : submitted && isChosen && !isRight ? "border-red-400 bg-red-400 text-white"
                          : "border-gray-300 text-gray-400"
                      }`}>
                        {submitted && isRight ? "✓" : submitted && isChosen && !isRight ? "✗" : String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className={`mt-2 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm ${
                  isCorrect ? "bg-[#E6FBF6] text-[#007a60]" : "bg-blue-50 text-blue-800"
                }`}>
                  <span>{isCorrect ? "💡" : "📖"}</span>
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        {!submitted ? (
          <>
            <button
              disabled={!allAnswered}
              onClick={() => onSubmit(answers)}
              className={`rounded-xl px-6 py-3 font-bold text-white transition-all duration-200 ${
                allAnswered
                  ? "asso-gradient shadow-lg shadow-[#3D5AF1]/25 hover:opacity-90 hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Valider mes réponses ✓
            </button>
            <span className="text-sm text-gray-400">
              {Object.keys(answers).length}/{mission.quiz.length} répondu{Object.keys(answers).length > 1 ? "es" : "e"}
            </span>
          </>
        ) : (
          <button
            onClick={() => { setAnswers({}); onReset(); }}
            className="rounded-xl border-2 border-[#E8EEFF] bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 hover:border-[#3D5AF1]/30 transition-all"
          >
            Recommencer le quiz
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Mission Card ─────────────────────────────────────────────────────────────

function MissionCard({ mission, progress, onToggleArticle, onSubmitQuiz, onResetQuiz }: {
  mission: Mission;
  progress: Progress;
  onToggleArticle: (id: string) => void;
  onSubmitQuiz: (missionId: string, answers: Record<string, number>) => void;
  onResetQuiz: (missionId: string) => void;
}) {
  const completedArticles = mission.articles.filter((a) => progress.completedArticles.has(a.id)).length;
  const total = mission.articles.length;
  const allArticlesDone = completedArticles === total;
  const quizDone = progress.quizResults[mission.id]?.submitted;
  const isDone = allArticlesDone && quizDone;
  const pct = Math.round(((completedArticles / total) * 0.6 + (quizDone ? 0.4 : 0)) * 100);
  const [open, setOpen] = useState(false);

  return (
    <div className={`overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
      isDone ? "border-[#00C49A]/50 bg-[#F0FDF9]" : "border-[#E8EEFF] bg-white"
    }`}>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-4 p-5 text-left">
        {/* Counter/check */}
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all ${
          isDone
            ? "bg-[#00C49A] text-white shadow-lg shadow-[#00C49A]/30"
            : allArticlesDone
            ? "asso-gradient text-white"
            : "bg-[#E8EEFF] text-[#3D5AF1]"
        }`}>
          {isDone ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span>{completedArticles}/{total}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-gray-900">{mission.title}</h4>
            {isDone && (
              <span className="rounded-full bg-[#00C49A]/10 px-2.5 py-0.5 text-xs font-bold text-[#007a60]">
                +{mission.xp + (progress.earnedQuizXp[mission.id] ?? 0)} XP ✓
              </span>
            )}
            {allArticlesDone && !quizDone && (
              <span className="animate-pulse rounded-full bg-[#3D5AF1]/10 px-2.5 py-0.5 text-xs font-bold text-[#3D5AF1]">
                🧠 Quiz dispo !
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-gray-500">{mission.description}</p>

          {/* Progress bar */}
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E8EEFF]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isDone ? "bg-[#00C49A]" : "asso-gradient"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-semibold text-gray-400">{mission.xp + mission.quizXp} XP</span>
          <div className={`rounded-full p-1 transition-all ${open ? "bg-[#E8EEFF] rotate-180" : "bg-[#F8F9FF]"}`}>
            <svg className="h-4 w-4 text-[#3D5AF1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-[#E8EEFF] p-5 space-y-4">
          <div className="space-y-3">
            {mission.articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                completed={progress.completedArticles.has(article.id)}
                onToggle={() => onToggleArticle(article.id)}
              />
            ))}
          </div>

          {!allArticlesDone && (
            <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-[#E8EEFF] bg-[#F8F9FF] px-4 py-3 text-sm text-gray-500">
              <span>🔒</span>
              <span>Lisez tous les contenus pour débloquer le quiz de ce module !</span>
            </div>
          )}

          {allArticlesDone && (
            <QuizCard
              mission={mission}
              quizState={progress.quizResults[mission.id]}
              onSubmit={(answers) => onSubmitQuiz(mission.id, answers)}
              onReset={() => onResetQuiz(mission.id)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Parcours Section ─────────────────────────────────────────────────────────

function ParcoursSection({ parcours, progress, onToggleArticle, onSubmitQuiz, onResetQuiz }: {
  parcours: Parcours;
  progress: Progress;
  onToggleArticle: (id: string) => void;
  onSubmitQuiz: (missionId: string, answers: Record<string, number>) => void;
  onResetQuiz: (missionId: string) => void;
}) {
  const allArticleIds = parcours.missions.flatMap((m) => m.articles.map((a) => a.id));
  const completedCount = allArticleIds.filter((id) => progress.completedArticles.has(id)).length;
  const totalXP = getParcoursXP(parcours);
  const earnedXP = parcours.missions.reduce((sum, m) => {
    const done = m.articles.every((a) => progress.completedArticles.has(a.id));
    return sum + (done ? m.xp : 0) + (progress.earnedQuizXp[m.id] ?? 0);
  }, 0);
  const badgeUnlocked = progress.unlockedBadges.has(parcours.badge.id);

  return (
    <section className="rounded-3xl border-2 border-[#E8EEFF] bg-white p-6 shadow-sm shadow-[#3D5AF1]/5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900">{parcours.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{parcours.description}</p>
          <div className="mt-3 text-xs text-gray-400">
            {completedCount}/{allArticleIds.length} contenus lus
          </div>
        </div>
        <BadgeCard badge={parcours.badge} unlocked={badgeUnlocked} />
      </div>

      <div className="mb-5">
        <XPBar current={earnedXP} max={totalXP} />
      </div>

      <div className="space-y-3">
        {parcours.missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            progress={progress}
            onToggleArticle={onToggleArticle}
            onSubmitQuiz={onSubmitQuiz}
            onResetQuiz={onResetQuiz}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Level config ─────────────────────────────────────────────────────────────

const LEVELS = [
  { name: "Débutant·e", emoji: "🌱", min: 0 },
  { name: "Initié·e", emoji: "🌿", min: 200 },
  { name: "Praticien·ne", emoji: "⚡", min: 500 },
  { name: "Expert·e", emoji: "🔥", min: 900 },
  { name: "Maître·sse", emoji: "🏆", min: 9999 },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AcademieRoleClient({ roleId }: { roleId: string }) {
  const role = ACADEMY_CONTENT[roleId as keyof typeof ACADEMY_CONTENT] as RoleConfig | undefined;
  const [progress, setProgress] = useState<Progress>({
    completedArticles: new Set(), unlockedBadges: new Set(), quizResults: {}, earnedQuizXp: {},
  });
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<{ type: "badge" | "xp"; message: string } | null>(null);

  useEffect(() => { setProgress(loadProgress()); setMounted(true); }, []);

  const showToast = useCallback((type: "badge" | "xp", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const checkBadges = useCallback((p: Progress) => {
    if (!role) return p;
    const updated = { ...p, unlockedBadges: new Set(p.unlockedBadges) };
    for (const parcours of role.parcours) {
      const allDone = parcours.missions.every((m) =>
        m.articles.every((a) => updated.completedArticles.has(a.id)) &&
        updated.quizResults[m.id]?.submitted
      );
      if (allDone && !updated.unlockedBadges.has(parcours.badge.id)) {
        updated.unlockedBadges.add(parcours.badge.id);
        showToast("badge", `${parcours.badge.emoji} ${parcours.badge.name} débloqué !`);
      }
    }
    return updated;
  }, [role, showToast]);

  const handleToggleArticle = useCallback((articleId: string) => {
    setProgress((prev) => {
      const next = { ...prev, completedArticles: new Set(prev.completedArticles) };
      if (next.completedArticles.has(articleId)) next.completedArticles.delete(articleId);
      else { next.completedArticles.add(articleId); showToast("xp", "+XP · Contenu validé 🎉"); }
      const checked = checkBadges(next);
      saveProgress(checked);
      return checked;
    });
  }, [checkBadges, showToast]);

  const handleSubmitQuiz = useCallback((missionId: string, answers: Record<string, number>) => {
    setProgress((prev) => {
      const mission = role?.parcours.flatMap((p) => p.missions).find((m) => m.id === missionId);
      if (!mission) return prev;
      const score = mission.quiz.filter((q) => answers[q.id] === q.correctIndex).length;
      const xpEarned = Math.round((score / mission.quiz.length) * mission.quizXp);
      const next = {
        ...prev,
        quizResults: { ...prev.quizResults, [missionId]: { answers, submitted: true } },
        earnedQuizXp: { ...prev.earnedQuizXp, [missionId]: xpEarned },
      };
      const checked = checkBadges(next);
      showToast("xp", `+${xpEarned} XP quiz · ${score === mission.quiz.length ? "Score parfait ! 🏆" : `${score}/${mission.quiz.length} bonnes réponses`}`);
      saveProgress(checked);
      return checked;
    });
  }, [role, checkBadges, showToast]);

  const handleResetQuiz = useCallback((missionId: string) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        quizResults: { ...prev.quizResults, [missionId]: { answers: {}, submitted: false } },
        earnedQuizXp: { ...prev.earnedQuizXp, [missionId]: 0 },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Rôle introuvable.</p>
          <Link href="/academie" className="mt-4 inline-block text-[#3D5AF1] underline">Retour</Link>
        </div>
      </div>
    );
  }

  const totalXP = getTotalXP(role);
  const allIds = getAllArticleIds(role);
  const earnedXP = role.parcours.flatMap((p) => p.missions).reduce((sum, m) => {
    const done = m.articles.every((a) => progress.completedArticles.has(a.id));
    return sum + (done ? m.xp : 0) + (progress.earnedQuizXp[m.id] ?? 0);
  }, 0);
  const completedCount = allIds.filter((id) => progress.completedArticles.has(id)).length;
  const globalPct = allIds.length > 0 ? Math.round((completedCount / allIds.length) * 100) : 0;
  const unlockedCount = progress.unlockedBadges.size;
  const totalBadges = role.parcours.length;

  const levelIdx = [...LEVELS].reverse().findIndex((l) => earnedXP >= l.min);
  const currentLevel = LEVELS[LEVELS.length - 1 - (levelIdx >= 0 ? levelIdx : LEVELS.length - 1)];

  const allDone = globalPct === 100 &&
    role.parcours.flatMap((p) => p.missions).every((m) => progress.quizResults[m.id]?.submitted);

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed right-6 top-6 z-50 slide-in-right rounded-2xl px-5 py-4 shadow-2xl ${
          toast.type === "badge"
            ? "bg-gradient-to-r from-amber-400 to-yellow-400 shadow-amber-200"
            : "asso-gradient shadow-[#3D5AF1]/30"
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{toast.type === "badge" ? "🏅" : "⚡"}</span>
            <span className="font-bold text-white">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Hero header */}
      <div className="relative overflow-hidden bg-white border-b border-[#E8EEFF]">
        {/* Blobs déco */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#3D5AF1] opacity-5 blur-3xl" />
          <div className="absolute -left-8 bottom-0 h-48 w-48 rounded-full bg-[#00C49A] opacity-5 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 py-10">
          <Link href="/academie" className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8EEFF] bg-[#F5F7FF] px-4 py-1.5 text-sm font-semibold text-[#3D5AF1] hover:bg-[#E8EEFF] transition-colors">
            ← Changer de rôle
          </Link>

          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8EEFF] text-4xl shadow-lg shadow-[#3D5AF1]/10">
                {role.emoji}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">{role.title}</h1>
                <p className="text-gray-500">{role.subtitle}</p>
              </div>
            </div>

            {/* Level badge */}
            <div className="shrink-0 rounded-2xl border-2 border-[#E8EEFF] bg-white px-5 py-3 text-center shadow-sm">
              <div className="text-2xl">{currentLevel.emoji}</div>
              <div className="text-xs font-bold text-gray-900">{currentLevel.name}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "XP gagnés", value: `${earnedXP}/${totalXP}` },
              { label: "Contenus lus", value: `${completedCount}/${allIds.length}` },
              { label: "Badges", value: `${unlockedCount}/${totalBadges}` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[#E8EEFF] bg-[#F5F7FF] p-3 text-center">
                <div className="text-lg font-extrabold text-[#3D5AF1]">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Global progress */}
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-sm font-medium text-gray-500">
              <span>Progression globale</span>
              <span className="text-[#3D5AF1] font-bold">{globalPct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#E8EEFF]">
              <div
                className="h-full rounded-full asso-gradient transition-all duration-700"
                style={{ width: `${mounted ? globalPct : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Parcours */}
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        {role.parcours.map((parcours) => (
          <ParcoursSection
            key={parcours.id}
            parcours={parcours}
            progress={progress}
            onToggleArticle={handleToggleArticle}
            onSubmitQuiz={handleSubmitQuiz}
            onResetQuiz={handleResetQuiz}
          />
        ))}

        {/* Completion */}
        {allDone && (
          <div className="asso-gradient rounded-3xl p-8 text-center text-white shadow-xl shadow-[#3D5AF1]/20">
            <div className="mb-3 text-6xl">🏆</div>
            <h3 className="mb-2 text-2xl font-extrabold">Incroyable, vous avez tout complété !</h3>
            <p className="text-white/85">
              {earnedXP} XP gagnés, {unlockedCount} badge{unlockedCount > 1 ? "s" : ""} débloqué{unlockedCount > 1 ? "s" : ""}.
              Votre asso a vraiment de la chance de vous avoir ! 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
