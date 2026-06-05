"use client";

import dynamic from "next/dynamic";

const SquareFootageCalculator = dynamic(() => import("./SquareFootageCalculator"), {
  ssr: false,
});

export default function SquareFootageCalculatorLoader() {
  return <SquareFootageCalculator />;
}
