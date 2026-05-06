"use client";
import dynamic from "next/dynamic";

const ConcretePatioCostCalculator = dynamic(
  () => import("./ConcretePatioCostCalculator"),
  { ssr: false }
);

export default function ConcretePatioCostLoader() {
  return <ConcretePatioCostCalculator />;
}
