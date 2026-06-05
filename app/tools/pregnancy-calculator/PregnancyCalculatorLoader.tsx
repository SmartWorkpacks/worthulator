"use client";

import dynamic from "next/dynamic";

const PregnancyCalculator = dynamic(() => import("./PregnancyCalculator"), {
  ssr: false,
});

export default function PregnancyCalculatorLoader() {
  return <PregnancyCalculator />;
}
