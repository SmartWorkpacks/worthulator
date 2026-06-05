"use client";

import dynamic from "next/dynamic";

const PaycheckCalculator = dynamic(() => import("./PaycheckCalculator"), {
  ssr: false,
});

export default function PaycheckCalculatorLoader() {
  return <PaycheckCalculator />;
}
