"use client";

import dynamic from "next/dynamic";

const CdCalculator = dynamic(() => import("./CdCalculator"), {
  ssr: false,
});

export default function CdCalculatorLoader() {
  return <CdCalculator />;
}
