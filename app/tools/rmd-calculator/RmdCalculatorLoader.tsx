"use client";

import dynamic from "next/dynamic";

const RmdCalculator = dynamic(() => import("./RmdCalculator"), {
  ssr: false,
});

export default function RmdCalculatorLoader() {
  return <RmdCalculator />;
}
