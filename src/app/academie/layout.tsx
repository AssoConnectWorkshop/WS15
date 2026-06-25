import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "AssoConnect Académie",
  description: "Parcours de formation gamifiés pour les responsables associatifs",
};

export default function AcademieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
