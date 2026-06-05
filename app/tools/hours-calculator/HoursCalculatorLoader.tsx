"use client";

import dynamic from "next/dynamic";

const HoursCalculator = dynamic(() => import("./HoursCalculator"), {
  ssr: false,
});

export default function HoursCalculatorLoader() {
  return <HoursCalculator />;
}
