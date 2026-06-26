"use client";

import { useState } from "react";
import { X, ChevronRight, Loader2, Check } from "lucide-react";
import { saveLead, type LeadData } from "../actions";

type Props = {
  onClose: () => void;
  defaultRole: string;
};

export default function LeadModal({ onClose, defaultRole }: Props) {
  const [form, setForm] = useState<LeadData>({
    firstName: "",
    email: "",
    associationName: "",
    role: defaultRole,
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await saveLead(form);
      setDone(true);
      setTimeout(onClose, 2500);
    } catch {
      setError("Une erreur est survenue, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(26,36,86,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Top band */}
        <div className="h-1.5 w-full" style={{ background: "#3D5AF1" }} />

        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <X className="h-4 w-4" />
        </button>

        <div className="p-8">
          {done ? (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "#e6faf6" }}>
                <Check className="h-8 w-8" style={{ color: "#00C49A" }} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">C'est noté !</h3>
              <p className="text-gray-500 text-sm">Continuez votre parcours, vous avez du chemin à faire.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "#3D5AF1" }}>
                  Accès gratuit
                </p>
                <h3 className="text-xl font-bold text-gray-900">Vous avancez bien !</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Laissez-nous vos coordonnées pour recevoir nos ressources exclusives et continuer à progresser.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">Prénom</label>
                    <input
                      required
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#3D5AF1] focus:ring-2 focus:ring-[#3D5AF1]/20 transition"
                      placeholder="Marie"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#3D5AF1] focus:ring-2 focus:ring-[#3D5AF1]/20 transition"
                      placeholder="marie@monasso.fr"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Nom de l'association</label>
                  <input
                    required
                    value={form.associationName}
                    onChange={(e) => setForm((f) => ({ ...f, associationName: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#3D5AF1] focus:ring-2 focus:ring-[#3D5AF1]/20 transition"
                    placeholder="Les Jardins Partagés du 11e"
                  />
                </div>

                {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: "#3D5AF1" }}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continuer gratuitement <ChevronRight className="h-4 w-4" /></>}
                </button>

                <p className="text-center text-xs text-gray-400">
                  Pas de spam. Vos données ne sont jamais revendues.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
