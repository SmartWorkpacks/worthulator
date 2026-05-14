"use client";
import dynamic from "next/dynamic";
export default dynamic(() => import("./EmergencyFundCalculator"), { ssr: false });
