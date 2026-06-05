"use client";

import dynamic from "next/dynamic";

const PersonalLoanCalculator = dynamic(() => import("./PersonalLoanCalculator"), {
  ssr: false,
});

export default function PersonalLoanCalculatorLoader({
  defaultAprPct,
  rateAsOf,
}: {
  defaultAprPct: number;
  rateAsOf: string;
}) {
  return <PersonalLoanCalculator defaultAprPct={defaultAprPct} rateAsOf={rateAsOf} />;
}
