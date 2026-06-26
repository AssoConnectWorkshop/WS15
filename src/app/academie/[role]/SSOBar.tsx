"use client";

import { useState } from "react";
import { Loader2, Check, LogIn } from "lucide-react";
import { sendMagicLink, signOut } from "../actions";

type Props = {
  userEmail: string | null;
};

export default function SSOBar({ userEmail }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await sendMagicLink(email);
      setSent(true);
    } catch {
      // silent fail — user can retry
    } finally {
      setLoading(false);
    }
  }

  if (userEmail) {
    return (
      <div className="border-b border-gray-100 bg-white px-6 py-2.5">
        <div className="mx-auto flex max-w-3xl items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "#e6faf6" }}>
              <Check className="h-3 w-3" style={{ color: "#00C49A" }} />
            </div>
            <span>Connecté en tant que <strong className="text-gray-900">{userEmail}</strong></span>
            <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: "#eef1fe", color: "#3D5AF1" }}>
              Client AssoConnect
            </span>
          </div>
          <button onClick={() => signOut()} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Déconnexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-100 bg-white px-6 py-2.5">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 text-sm">
        <p className="text-gray-500 text-xs">
          Déjà client AssoConnect ?{" "}
          <button onClick={() => setOpen((o) => !o)} className="font-medium hover:underline transition-colors" style={{ color: "#3D5AF1" }}>
            Connectez-vous
          </button>{" "}
          pour synchroniser votre progression.
        </p>

        {open && (
          sent ? (
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#00C49A" }}>
              <Check className="h-3.5 w-3.5" /> Lien envoyé ! Vérifiez votre email.
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex shrink-0 items-center gap-2">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-[#3D5AF1] focus:ring-1 focus:ring-[#3D5AF1]/20 transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: "#3D5AF1" }}
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <><LogIn className="h-3 w-3" /> Se connecter</>}
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
}
