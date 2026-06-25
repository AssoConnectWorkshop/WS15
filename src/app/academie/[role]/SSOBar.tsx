"use client";

import { useState, useTransition } from "react";
import { sendMagicLink, signOut } from "../actions";

type Props = {
  userEmail: string | null;
  onAuthChange: () => void;
};

export default function SSOBar({ userEmail, onAuthChange }: Props) {
  const [mode, setMode] = useState<"idle" | "form" | "sent">("idle");
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError("");
    startTransition(async () => {
      const res = await sendMagicLink(email);
      if (res.ok) setMode("sent");
      else setError(res.error ?? "Erreur, réessayez.");
    });
  }

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
      onAuthChange();
    });
  }

  // Authenticated client
  if (userEmail) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-[#00C49A]/30 bg-[#E6FBF6] px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00C49A] text-sm font-bold text-white">
            {userEmail[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{userEmail}</span>
              <span className="rounded-full bg-[#00C49A] px-2 py-0.5 text-xs font-bold text-white">
                ✓ Client AssoConnect
              </span>
            </div>
            <p className="text-xs text-gray-500">Progression synchronisée sur votre compte</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          disabled={pending}
          className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  // Not authenticated
  return (
    <div className="rounded-2xl border-2 border-[#E8EEFF] bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8EEFF]">
            <svg className="h-5 w-5 text-[#3D5AF1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Déjà client AssoConnect ?</p>
            <p className="text-xs text-gray-500">Connectez-vous pour synchroniser votre progression</p>
          </div>
        </div>

        {mode === "idle" && (
          <button
            onClick={() => setMode("form")}
            className="shrink-0 rounded-xl border-2 border-[#3D5AF1] px-4 py-2 text-sm font-bold text-[#3D5AF1] transition-all hover:bg-[#E8EEFF]"
          >
            Se connecter
          </button>
        )}
      </div>

      {mode === "form" && (
        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            type="email"
            required
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-xl border-2 border-[#E8EEFF] px-4 py-2.5 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#3D5AF1] focus:ring-2 focus:ring-[#3D5AF1]/10"
          />
          <button
            type="submit"
            disabled={pending || !email}
            className="rounded-xl asso-gradient px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#3D5AF1]/20 disabled:opacity-50"
          >
            {pending ? "…" : "Envoyer le lien"}
          </button>
          <button type="button" onClick={() => setMode("idle")} className="px-2 text-gray-400 hover:text-gray-600">✕</button>
        </form>
      )}

      {mode === "sent" && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#E8EEFF] px-4 py-2.5 text-sm font-semibold text-[#3D5AF1]">
          <span>📧</span>
          <span>Lien magique envoyé à <strong>{email}</strong> — vérifiez vos mails !</span>
        </div>
      )}

      {error && (
        <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
