"use client";

import dynamic from "next/dynamic";

const CarPaymentCalculator = dynamic(() => import("./CarPaymentCalculator"), {
  ssr: false,
});

export default function CarPaymentCalculatorLoader({
  newApr,
  usedApr,
  rateAsOf,
}: {
  newApr: number;
  usedApr: number;
  rateAsOf: string;
}) {
  return <CarPaymentCalculator newApr={newApr} usedApr={usedApr} rateAsOf={rateAsOf} />;
}
