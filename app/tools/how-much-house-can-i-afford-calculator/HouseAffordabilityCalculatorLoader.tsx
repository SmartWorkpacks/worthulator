"use client";

import dynamic from "next/dynamic";

const HouseAffordabilityCalculator = dynamic(() => import("./HouseAffordabilityCalculator"), {
  ssr: false,
});

export default function HouseAffordabilityCalculatorLoader({
  defaultRatePct,
  rateAsOf,
}: {
  defaultRatePct: number;
  rateAsOf: string;
}) {
  return <HouseAffordabilityCalculator defaultRatePct={defaultRatePct} rateAsOf={rateAsOf} />;
}
