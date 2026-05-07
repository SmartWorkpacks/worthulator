import type { Metadata } from "next";
import ToolsClient from "./ToolsClient";

export const metadata: Metadata = {
  title: "All Free Calculators & Tools | Worthulator",
  description:
    "Browse all free calculators on Worthulator — salary, tax, cost estimators, passive income, construction and more. Instant results, no sign-up required.",
  alternates: { canonical: "https://worthulator.com/tools" },
  robots: { index: true, follow: true },
};

export default function ToolsPage() {
  return <ToolsClient />;
}
