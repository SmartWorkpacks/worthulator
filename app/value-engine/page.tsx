import type { Metadata } from "next";
import ValueEngineLanding from "./ValueEngineLanding";

export const metadata: Metadata = {
  title: "Worthulator Value Engine | Intelligent Estimation Platform",
  description:
    "Get intelligent cost estimates for home services, consumer electronics, luxury watches, and sneakers. Powered by formula models and live market data.",
  alternates: { canonical: "https://worthulator.com/value-engine" },
  robots: { index: true, follow: true },
};

export default function ValueEnginePage() {
  return <ValueEngineLanding />;
}
