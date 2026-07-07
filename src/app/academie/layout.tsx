import type { Metadata } from "next";
import "../globals.css";
import { Poppins, Roboto } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AssoConnect Académie",
  description: "Parcours de formation gratuits pour les présidents et trésoriers d'associations",
};

export default function AcademieLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${poppins.variable} ${roboto.variable}`} style={{ fontFamily: "var(--font-body, 'Roboto', sans-serif)" }}>
      {children}
    </div>
  );
}
