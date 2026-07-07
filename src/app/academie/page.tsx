"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ACADEMY_CONTENT, getTotalPoints, type RoleConfig } from "@/lib/academy-content";

/* ── DS tokens (Poplico / AssoConnect) ─────────────────────────────
   Primary: #3D5AF1  |  Hover: #2d46d6
   Turquoise highlight: #87DFD5  (underline ONLY, never fills)
   Yellow: #F6C131  (CTAs on blue bg only)
   Text title: #3C3C47  |  Body: #56565D  |  Muted: #73737C
   bg-blue: #E6EDFD  |  bg-strip: #F9FBFF
   Border: #D0D0D7
   Card hover shadow: 0 10px 50px 0 rgba(61,90,241,0.18)
──────────────────────────────────────────────────────────────────── */

const DS = {
  primary: "#3D5AF1",
  primaryHover: "#2d46d6",
  turquoise: "#87DFD5",
  yellow: "#F6C131",
  textTitle: "#3C3C47",
  textBody: "#56565D",
  textMuted: "#73737C",
  bgBlue: "#E6EDFD",
  bgStrip: "#F9FBFF",
  border: "#D0D0D7",
  cardShadow: "0 10px 50px 0 rgba(61,90,241,0.18)",
};

const HERO_WORDS = ["compliquée", "chronophage", "intimidante", "solitaire"];

function useCountUp(target: number, duration = 1800) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);
  return { val, ref };
}

function StatCount({ value, label }: { value: number; label: string }) {
  const { val, ref } = useCountUp(value);
  return (
    <div className="text-center">
      <span ref={ref} className="block text-4xl font-bold" style={{ fontFamily: "var(--font-heading, Poppins)", color: DS.primary }}>
        {val.toLocaleString("fr-FR")}
      </span>
      <span className="mt-1 block text-sm" style={{ color: DS.textMuted }}>{label}</span>
    </div>
  );
}

export default function AcademiePage() {
  const roles = Object.values(ACADEMY_CONTENT);
  const [president, tresorier] = roles;
  const [wordIdx, setWordIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % HERO_WORDS.length), 2400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-body, Roboto, sans-serif)", color: DS.textBody }}>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-30 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
          borderBottom: scrolled ? `1px solid ${DS.border}` : "none",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          padding: "0 4%",
        }}
      >
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ background: DS.primary, fontFamily: "var(--font-heading, Poppins)" }}
            >
              AC
            </div>
            <span
              className="font-semibold text-sm"
              style={{ fontFamily: "var(--font-heading, Poppins)", color: scrolled ? DS.textTitle : "white", letterSpacing: "0.3px" }}
            >
              AssoConnect Académie
            </span>
          </div>
          <span
            className="rounded-full border px-4 py-1.5 text-xs font-semibold"
            style={{
              borderColor: scrolled ? DS.border : "rgba(255,255,255,0.35)",
              color: scrolled ? DS.textMuted : "rgba(255,255,255,0.85)",
            }}
          >
            100% gratuit
          </span>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(155deg, ${DS.primary} 0%, #1a2456 100%)`,
          padding: "128px 4% 100px",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Background radial glow */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 50% at 80% 40%, rgba(135,223,213,0.12) 0%, transparent 70%)",
        }} />

        <div className="relative mx-auto w-full max-w-[1280px]">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <p
              className="mb-5 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em" }}
            >
              Formation gratuite · Associations loi 1901
            </p>

            {/* Headline */}
            <h1
              className="mb-6 leading-tight text-white"
              style={{
                fontFamily: "var(--font-heading, Poppins)",
                fontSize: "clamp(36px, 5vw, 58px)",
                fontWeight: 700,
                letterSpacing: "0.5px",
                lineHeight: 1.1,
              }}
            >
              La gestion d&apos;asso,{" "}
              <br />
              <span className="relative inline-block" style={{ color: "rgba(255,255,255,0.45)" }}>
                <span
                  key={wordIdx}
                  style={{ display: "inline-block", animation: "fadeUp 0.35s ease-out" }}
                >
                  {HERO_WORDS[wordIdx]}
                </span>
                {/* Turquoise highlight bar — DS convention */}
                <span
                  className="absolute left-0 right-0"
                  style={{
                    bottom: "6px",
                    height: "4px",
                    background: DS.turquoise,
                    borderRadius: "2px",
                    transform: "rotate(-1.5deg)",
                  }}
                />
              </span>
              . ✨
            </h1>

            <p
              className="mb-8 text-lg leading-relaxed"
              style={{ color: "rgba(255,255,255,0.65)", maxWidth: "48ch", fontWeight: 300 }}
            >
              Des parcours guidés, des quiz pour valider tes acquis, et des badges pour marquer ta progression —
              spécialement conçus pour les présidents et trésoriers d&apos;associations.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/academie/${president.id}`}
                className="inline-flex items-center gap-2 font-semibold text-white transition-all"
                style={{
                  background: DS.yellow,
                  color: DS.textTitle,
                  borderRadius: "50px",
                  padding: "14px 28px",
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  boxShadow: "0 4px 20px rgba(246,193,49,0.35)",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#e5b128")}
                onMouseLeave={e => (e.currentTarget.style.background = DS.yellow)}
              >
                Je commence mon parcours →
              </Link>
              <a
                href="#parcours"
                className="inline-flex items-center gap-2 font-medium transition-all"
                style={{
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  color: "rgba(255,255,255,0.85)",
                  borderRadius: "50px",
                  padding: "13px 28px",
                  fontSize: "15px",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.background = "transparent"; }}
              >
                Voir les parcours
              </a>
            </div>
          </div>

          {/* Stats row */}
          <div
            className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "40px", maxWidth: "600px" }}
          >
            {[
              { value: "40000", label: "associations utilisent AssoConnect", raw: 40000 },
              { value: "4", label: "parcours de formation", raw: 4 },
              { value: "16", label: "questions de quiz", raw: 16 },
              { value: "8", label: "badges à débloquer", raw: 8 },
            ].map(s => (
              <div key={s.label}>
                <span
                  className="block text-3xl font-bold text-white"
                  style={{ fontFamily: "var(--font-heading, Poppins)" }}
                >
                  {s.raw > 100 ? "40.000+" : s.value}
                </span>
                <span className="mt-1 block text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value pillars ─────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "80px 4%" }}>
        <div className="mx-auto max-w-[1280px]">
          {/* Section header */}
          <div className="mb-12" style={{ maxWidth: "520px" }}>
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: DS.primary, letterSpacing: "0.08em" }}
            >
              Pourquoi l&apos;Académie
            </p>
            <h2
              className="mb-3 leading-tight"
              style={{
                fontFamily: "var(--font-heading, Poppins)",
                fontSize: "clamp(26px, 3vw, 38px)",
                fontWeight: 700,
                color: DS.textTitle,
                letterSpacing: "0.5px",
              }}
            >
              Tout ce qu&apos;il faut pour bien diriger ton asso
            </h2>
            <p style={{ color: DS.textBody, fontSize: "17px", fontWeight: 300, lineHeight: 1.6 }}>
              Des ressources concrètes, une progression visible, et la satisfaction de monter en compétence — sans y passer des heures.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="12" fill="#E6EDFD"/>
                    <path d="M12 20h16M12 14h16M12 26h10" stroke={DS.primary} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                eyebrow: "Parcours",
                title: "Des ressources choisies, pas une liste infinie",
                desc: "Articles et vidéos sélectionnés pour leur utilité concrète. Tu lis, tu regardes, tu coches — et tu passes à la suite.",
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="12" fill="#E6EDFD"/>
                    <circle cx="20" cy="20" r="8" stroke={DS.primary} strokeWidth="2"/>
                    <path d="M20 16v4l3 2" stroke={DS.primary} strokeWidth="2" strokeLinecap="round"/>
                    <path d="M28 12l2-2M30 20h2M28 28l2 2" stroke={DS.turquoise} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                eyebrow: "Quiz",
                title: "Valide tes acquis, pas juste lu",
                desc: "Chaque mission se termine par un quiz rapide. Tu réponds, tu obtiens un feedback immédiat — et tu sais vraiment si tu as compris.",
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="12" fill="#E6EDFD"/>
                    <path d="M20 10l2.4 7.4H30l-6.2 4.5 2.4 7.4L20 25l-6.2 4.3 2.4-7.4L10 17.4h7.6L20 10z" fill={DS.turquoise} stroke={DS.primary} strokeWidth="1.2" strokeLinejoin="round"/>
                  </svg>
                ),
                eyebrow: "Badges & points",
                title: "La progression que tu mérites, visible",
                desc: "Badges à débloquer, points accumulés, pourcentage d'avancement — parce que gérer une asso c'est du boulot, et ça mérite d'être reconnu.",
              },
            ].map(f => (
              <div
                key={f.title}
                className="group cursor-default rounded-2xl border p-7 transition-all duration-300"
                style={{
                  borderColor: DS.border,
                  borderRadius: "16px",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = DS.cardShadow;
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#C6D7FA";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                  (e.currentTarget as HTMLDivElement).style.borderColor = DS.border;
                }}
              >
                <div className="mb-5">{f.icon}</div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: DS.primary, letterSpacing: "0.08em" }}>{f.eyebrow}</p>
                <h3
                  className="mb-3 leading-snug"
                  style={{ fontFamily: "var(--font-heading, Poppins)", fontWeight: 600, fontSize: "18px", color: DS.textTitle, letterSpacing: "0.3px" }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: "15px", color: DS.textBody, lineHeight: 1.65, fontWeight: 300 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role cards ─────────────────────────────────────────── */}
      <section id="parcours" style={{ background: DS.bgBlue, padding: "80px 4%" }}>
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: DS.primary, letterSpacing: "0.08em" }}>
              Choisis ton rôle
            </p>
            <h2
              className="leading-tight"
              style={{
                fontFamily: "var(--font-heading, Poppins)",
                fontSize: "clamp(26px, 3vw, 38px)",
                fontWeight: 700,
                color: DS.textTitle,
                letterSpacing: "0.5px",
              }}
            >
              Quel est ton poste dans l&apos;association ?
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <RoleCard role={president} />
            <RoleCard role={tresorier} />
          </div>
        </div>
      </section>

      {/* ── Gamification banner ─────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "80px 4%", borderTop: `1px solid ${DS.border}` }}>
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: DS.primary, letterSpacing: "0.08em" }}>
                Gamification
              </p>
              <h2
                className="mb-4 leading-tight"
                style={{ fontFamily: "var(--font-heading, Poppins)", fontWeight: 700, fontSize: "clamp(24px, 2.5vw, 34px)", color: DS.textTitle, letterSpacing: "0.5px" }}
              >
                Gérer une asso c&apos;est du travail.
                <br />
                <span className="relative inline-block">
                  Ça mérite d&apos;être{" "}
                  <span className="relative inline-block">
                    reconnu
                    <span className="absolute bottom-0 left-0 right-0 h-1" style={{ background: DS.turquoise, borderRadius: "2px" }} />
                  </span>.
                </span>
              </h2>
              <p style={{ fontSize: "16px", color: DS.textBody, lineHeight: 1.7, fontWeight: 300, maxWidth: "46ch" }}>
                À chaque parcours complété tu décroches un badge. À chaque mission validée tu gagnes des points.
                Pas juste pour faire joli — pour que tu mesures concrètement le chemin parcouru.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                {[
                  "4 badges à débloquer, un par parcours",
                  "Points accumulés sur chaque mission",
                  "Quiz de validation à chaque étape",
                  "Progression sauvegardée dans ton navigateur",
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="9" fill={DS.bgBlue}/>
                      <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke={DS.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: "15px", color: DS.textBody }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badge display */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Stratège associatif", parcours: "Gouvernance & stratégie", pts: 350, color: DS.primary },
                { name: "Ambassadeur communauté", parcours: "Gestion des adhérents", pts: 325, color: DS.primary },
                { name: "As de la comptabilité", parcours: "Comptabilité associative", pts: 450, color: "#56565D" },
                { name: "Champion des finances", parcours: "Cotisations & financements", pts: 400, color: "#56565D" },
              ].map(b => (
                <div
                  key={b.name}
                  className="rounded-2xl border p-5 text-center transition-all duration-300"
                  style={{ borderColor: DS.border, borderRadius: "16px", background: "#fff" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = DS.cardShadow;
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                    (e.currentTarget as HTMLDivElement).style.transform = "";
                  }}
                >
                  <div
                    className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ background: DS.bgBlue }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z" fill={DS.turquoise} stroke={DS.primary} strokeWidth="1.2" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-xs font-semibold leading-snug" style={{ fontFamily: "var(--font-heading, Poppins)", color: DS.textTitle, fontSize: "13px" }}>{b.name}</p>
                  <p className="mt-1 text-xs" style={{ color: DS.textMuted }}>{b.parcours}</p>
                  <p className="mt-2 text-sm font-bold" style={{ color: DS.primary, fontFamily: "var(--font-heading, Poppins)" }}>{b.pts} pts</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section style={{ background: DS.primary, padding: "80px 4%" }}>
        <div className="mx-auto max-w-[1280px] text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>
            C&apos;est parti
          </p>
          <h2
            className="mb-4 text-white"
            style={{ fontFamily: "var(--font-heading, Poppins)", fontWeight: 700, fontSize: "clamp(26px, 3vw, 40px)", letterSpacing: "0.5px" }}
          >
            Prêt à faire briller ton association ?
          </h2>
          <p className="mx-auto mb-8" style={{ color: "rgba(255,255,255,0.65)", maxWidth: "44ch", fontSize: "17px", fontWeight: 300, lineHeight: 1.6 }}>
            Choisis ton rôle, commence le premier parcours, et décroche ton premier badge — en moins d&apos;une heure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/academie/${president.id}`}
              className="inline-flex items-center gap-2 font-semibold transition-all"
              style={{ background: DS.yellow, color: DS.textTitle, borderRadius: "50px", padding: "14px 28px", fontSize: "16px" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#e5b128")}
              onMouseLeave={e => (e.currentTarget.style.background = DS.yellow)}
            >
              Je commence gratuitement →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer strip ─────────────────────────────────────────── */}
      <div style={{ background: "#1a2456", padding: "20px 4%" }}>
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3">
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
            Fait avec 💙 par AssoConnect · Paris
          </span>
          <div className="flex gap-5">
            {["CGU", "Confidentialité", "Contact"].map(l => (
              <a key={l} href="#" style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function RoleCard({ role }: { role: RoleConfig }) {
  const totalPts = getTotalPoints(role);
  const totalMissions = role.parcours.flatMap(p => p.missions).length;
  const totalArticles = role.parcours.flatMap(p => p.missions).flatMap(m => m.articles).length;
  const quizCount = role.parcours.flatMap(p => p.missions).flatMap(m => m.quiz).length;

  return (
    <Link
      href={`/academie/${role.id}`}
      className="group block rounded-2xl bg-white transition-all duration-300"
      style={{ borderRadius: "16px", border: `1px solid ${DS.border}`, textDecoration: "none" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = DS.cardShadow;
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#C6D7FA";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
        (e.currentTarget as HTMLAnchorElement).style.borderColor = DS.border;
      }}
    >
      {/* Top accent */}
      <div style={{ height: "4px", background: DS.primary, borderRadius: "16px 16px 0 0" }} />

      <div className="p-8">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: DS.bgBlue, borderRadius: "16px" }}>
            {role.icon === "president" ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={DS.primary} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5a3 3 0 0 1 6 0v5M9 10h.01M15 10h.01M9 14h6" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={DS.primary} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20M7 15h2M12 15h5" />
              </svg>
            )}
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: DS.bgBlue, color: DS.primary, fontFamily: "var(--font-heading, Poppins)", borderRadius: "50px" }}
          >
            {totalPts} pts
          </span>
        </div>

        <h3
          className="mb-1.5 leading-tight"
          style={{ fontFamily: "var(--font-heading, Poppins)", fontWeight: 700, fontSize: "22px", color: DS.textTitle, letterSpacing: "0.3px" }}
        >
          {role.title}
        </h3>
        <p className="mb-6" style={{ fontSize: "15px", color: DS.textMuted, fontWeight: 300 }}>{role.subtitle}</p>

        {/* Parcours list */}
        <div className="mb-6 space-y-2">
          {role.parcours.map(p => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: DS.bgStrip, borderRadius: "12px" }}
            >
              <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: DS.primary }} />
              <span className="flex-1 text-sm font-semibold" style={{ color: DS.textTitle }}>{p.title}</span>
              <span className="text-xs" style={{ color: DS.textMuted }}>{p.missions.length} missions</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-7 flex gap-5 text-sm" style={{ borderTop: `1px solid ${DS.border}`, paddingTop: "16px" }}>
          {[
            { v: totalMissions, l: "missions" },
            { v: totalArticles, l: "ressources" },
            { v: quizCount, l: "quiz" },
          ].map(s => (
            <div key={s.l}>
              <span className="font-bold" style={{ fontFamily: "var(--font-heading, Poppins)", color: DS.textTitle }}>{s.v}</span>
              <span className="ml-1" style={{ color: DS.textMuted }}>{s.l}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="inline-flex items-center gap-2 font-semibold text-white transition-colors"
          style={{
            background: DS.primary,
            borderRadius: "50px",
            padding: "12px 24px",
            fontSize: "15px",
            fontFamily: "var(--font-body)",
          }}
        >
          Commencer ce parcours →
        </div>
      </div>
    </Link>
  );
}
