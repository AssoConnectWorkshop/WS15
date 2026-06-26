"use server";

import { createClient } from "@/lib/supabase/server";

export type LeadData = {
  firstName: string;
  email: string;
  associationName: string;
  role: string;
};

export async function saveLead(data: LeadData) {
  const supabase = await createClient();
  const { error } = await supabase.from("academy_leads").upsert(
    {
      email: data.email,
      first_name: data.firstName,
      association_name: data.associationName,
      role: data.role,
    },
    { onConflict: "email" }
  );
  if (error) throw new Error(error.message);
}

export async function sendMagicLink(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/academie/auth/callback` },
  });
  if (error) throw new Error(error.message);
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
