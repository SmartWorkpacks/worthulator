"use client";

import dynamic from "next/dynamic";

const OneRepMaxCalculator = dynamic(() => import("./OneRepMaxCalculator"), {
  ssr: false,
});

export default function OneRepMaxCalculatorLoader() {
  return <OneRepMaxCalculator />;
}
