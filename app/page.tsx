import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Worthulator | Free Financial Calculators",
  description:
    "Free financial calculators for salary, investments, budgeting and more. Get instant answers to your money questions — no sign-up required.",
  alternates: { canonical: "https://worthulator.com" },
  robots: { index: true, follow: true },
};

export default function Home() {
  return <HomeClient />;
}

