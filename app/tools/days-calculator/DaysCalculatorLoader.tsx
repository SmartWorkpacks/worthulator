"use client";

import dynamic from "next/dynamic";

const DaysCalculator = dynamic(() => import("./DaysCalculator"), {
  ssr: false,
});

export default function DaysCalculatorLoader() {
  return <DaysCalculator />;
}
