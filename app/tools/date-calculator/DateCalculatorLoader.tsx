"use client";

import dynamic from "next/dynamic";

const DateCalculator = dynamic(() => import("./DateCalculator"), {
  ssr: false,
});

export default function DateCalculatorLoader() {
  return <DateCalculator />;
}
