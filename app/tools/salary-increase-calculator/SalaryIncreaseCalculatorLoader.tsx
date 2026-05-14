"use client";
import dynamic from "next/dynamic";
export default dynamic(() => import("./SalaryIncreaseCalculator"), { ssr: false });
