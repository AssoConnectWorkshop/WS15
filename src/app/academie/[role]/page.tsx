import { notFound } from "next/navigation";
import { ACADEMY_CONTENT } from "@/lib/academy-content";
import { createClient } from "@/lib/supabase/server";
import AcademieRoleClient from "./AcademieRoleClient";

type Props = { params: Promise<{ role: string }> };

export async function generateStaticParams() {
  return Object.keys(ACADEMY_CONTENT).map((role) => ({ role }));
}

export const dynamic = "force-dynamic";

export default async function AcademieRolePage({ params }: Props) {
  const { role } = await params;
  if (!ACADEMY_CONTENT[role as keyof typeof ACADEMY_CONTENT]) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <AcademieRoleClient roleId={role} userEmail={user?.email ?? null} />;
}
