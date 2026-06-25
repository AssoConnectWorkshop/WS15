"use client";

import { useState, useTransition } from "react";
import { saveLead, type LeadData } from "../actions";

type Props = {
  role: string;
  onClose: (captured: boolean) => void;
};

export default function LeadModal({ role, onClose }: Props) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<LeadData>({
    email: "",
    firstName: "",
    associationName: "",
    role,
  });
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.firstName) return;
    setError("");
    startTransition(async () => {
      const res = await saveLead(form);
      if (res.ok) {
        setStep("success");
        setTimeout(() => onClose(true), 1800);
      } else {
        setError("Une erreur est survenue. Réessayez !");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={() => onClose(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-[#3D5AF1]/20">
        {/* Top gradient band */}
        <div className="asso-gradient px-8 pb-6 pt-8 text-white">
          <div className="mb-3 text-4xl">🎓</div>
          <h2 className="text-2xl font-extrabold">Continuez votre formation !</h2>
          <p className="mt-1 text-sm text-white/85">
            Enregistrez vos progrès et recevez nos ressources exclusives pour les responsables associatifs.
          </p>
        </div>

        <div className="p-8">
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Prénom *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Marie"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    className="w-full rounded-xl border-2 border-[#E8EEFF] px-4 py-2.5 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#3D5AF1] focus:ring-2 focus:ring-[#3D5AF1]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="marie@monasso.fr"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-xl border-2 border-[#E8EEFF] px-4 py-2.5 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#3D5AF1] focus:ring-2 focus:ring-[#3D5AF1]/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Nom de votre association
                </label>
                <input
                  type="text"
                  placeholder="Association Les Sportifs de Lyon"
                  value={form.associationName}
                  onChange={(e) => setForm((f) => ({ ...f, associationName: e.target.value }))}
                  className="w-full rounded-xl border-2 border-[#E8EEFF] px-4 py-2.5 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#3D5AF1] focus:ring-2 focus:ring-[#3D5AF1]/10"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={pending || !form.email || !form.firstName}
                className="w-full rounded-xl py-3.5 font-bold text-white transition-all asso-gradient shadow-lg shadow-[#3D5AF1]/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? "Enregistrement…" : "Sauvegarder ma progression →"}
              </button>

              <button
                type="button"
                onClick={() => onClose(false)}
                className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Continuer sans enregistrer
              </button>

              <p className="text-center text-xs text-gray-400">
                Pas de spam. Vos données sont protégées conformément au RGPD.
              </p>
            </form>
          ) : (
            <div className="py-6 text-center">
              <div className="mb-3 text-5xl">🎉</div>
              <h3 className="text-xl font-extrabold text-gray-900">C&apos;est parti !</h3>
              <p className="mt-2 text-gray-500">
                Bienvenue {form.firstName} ! Votre progression est sauvegardée.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
