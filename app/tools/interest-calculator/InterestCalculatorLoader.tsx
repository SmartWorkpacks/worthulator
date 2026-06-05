"use client";

import dynamic from "next/dynamic";

const InterestCalculator = dynamic(() => import("./InterestCalculator"), {
  ssr: false,
});

export default function InterestCalculatorLoader() {
  return <InterestCalculator />;
}
