import { notFound } from "next/navigation";
import { ACADEMY_CONTENT } from "@/lib/academy-content";
import AcademieRoleClient from "./AcademieRoleClient";

type Props = { params: Promise<{ role: string }> };

export async function generateStaticParams() {
  return Object.keys(ACADEMY_CONTENT).map((role) => ({ role }));
}

export default async function AcademieRolePage({ params }: Props) {
  const { role } = await params;
  if (!ACADEMY_CONTENT[role as keyof typeof ACADEMY_CONTENT]) notFound();
  return <AcademieRoleClient roleId={role} />;
}
