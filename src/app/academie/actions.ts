"use server";

import { createClient } from "@/lib/supabase/server";

export type LeadData = {
  email: string;
  firstName: string;
  associationName: string;
  role: string;
};

export async function saveLead(data: LeadData): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("academy_leads").upsert({
      email: data.email,
      first_name: data.firstName,
      association_name: data.associationName,
      role: data.role,
    }, { onConflict: "email" });
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function sendMagicLink(email: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://assoconnect-ws15.vercel.app"}/academie/auth/callback` },
    });
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function getSession() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export type RemoteProgress = {
  completed_articles: string[];
  unlocked_badges: string[];
  quiz_results: Record<string, { answers: Record<string, number>; submitted: boolean }>;
  earned_quiz_xp: Record<string, number>;
};

export async function loadRemoteProgress(): Promise<RemoteProgress | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("academy_progress")
      .select("*")
      .eq("user_id", user.id)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function saveRemoteProgress(progress: RemoteProgress): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("academy_progress").upsert({
      user_id: user.id,
      ...progress,
      updated_at: new Date().toISOString(),
    });
  } catch {
    // silent — localStorage is fallback
  }
}
