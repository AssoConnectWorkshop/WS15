import { notFound } from "next/navigation";
import { ACADEMY_CONTENT } from "@/lib/academy-content";
import { getSession } from "../actions";
import AcademieRoleClient from "./AcademieRoleClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ role: string }> };

export default async function AcademieRolePage({ params }: Props) {
  const { role } = await params;
  if (!ACADEMY_CONTENT[role as keyof typeof ACADEMY_CONTENT]) notFound();
  const session = await getSession();
  return <AcademieRoleClient roleId={role} userEmail={session?.user.email ?? null} />;
}
