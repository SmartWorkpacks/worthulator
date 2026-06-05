"use client";

import dynamic from "next/dynamic";

const TaxCalculator = dynamic(() => import("./TaxCalculator"), {
  ssr: false,
});

export default function TaxCalculatorLoader({ taxYear }: { taxYear: string }) {
  return <TaxCalculator taxYear={taxYear} />;
}
