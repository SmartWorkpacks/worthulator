"use client";

import dynamic from "next/dynamic";

const TimecardCalculator = dynamic(() => import("./TimecardCalculator"), {
  ssr: false,
});

export default function TimecardCalculatorLoader() {
  return <TimecardCalculator />;
}
