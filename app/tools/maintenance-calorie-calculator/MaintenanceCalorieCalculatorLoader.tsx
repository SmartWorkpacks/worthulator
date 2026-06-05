"use client";

import dynamic from "next/dynamic";

const MaintenanceCalorieCalculator = dynamic(() => import("./MaintenanceCalorieCalculator"), {
  ssr: false,
});

export default function MaintenanceCalorieCalculatorLoader() {
  return <MaintenanceCalorieCalculator />;
}
