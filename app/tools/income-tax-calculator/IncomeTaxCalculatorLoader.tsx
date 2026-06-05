"use client";

import dynamic from "next/dynamic";

const IncomeTaxCalculator = dynamic(() => import("./IncomeTaxCalculator"), {
  ssr: false,
});

export default function IncomeTaxCalculatorLoader({ taxYear }: { taxYear: string }) {
  return <IncomeTaxCalculator taxYear={taxYear} />;
}
